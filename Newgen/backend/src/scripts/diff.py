# =============================================================================
# diff.py — OpenCV Image Diff Engine
# =============================================================================
# HOW IT WORKS (simple explanation):
#
#   Every image is just a grid of pixels.
#   Every pixel is 3 numbers: Red, Green, Blue (0-255).
#
#   We compare two images pixel by pixel:
#   - Figma reference design  (what it SHOULD look like)
#   - Live implementation     (what it ACTUALLY looks like)
#
#   Wherever pixels don't match → something changed → draw a box around it
#   Then we figure out: HOW different? → severity (high / medium / low)
#                       WHAT changed?  → color diff, size diff, position diff
#
#   Output is a JSON array of regions sent to Node.js → passed to Gemini AI
# =============================================================================

import sys
import json
import cv2
import numpy as np


# =============================================================================
# STEP 1 — Load and resize both images to the same dimensions
# =============================================================================
# Why resize? Because Figma exports at 2x and browser screenshots at 1x.
# If sizes don't match, every single pixel would look "different" — useless.
# We resize live image to match Figma's dimensions before comparing.

def load_and_resize(figma_path, live_path):
    figma = cv2.imread(figma_path)   # reads image as BGR numpy array
    live  = cv2.imread(live_path)

    if figma is None or live is None:
        return None, None, None, None

    h, w = figma.shape[:2]           # get height and width of figma image

    # resize live screenshot to exactly match figma dimensions
    live_resized = cv2.resize(live, (w, h), interpolation=cv2.INTER_AREA)

    return figma, live_resized, w, h


# =============================================================================
# STEP 2 — Compute pixel-level difference between the two images
# =============================================================================
# cv2.absdiff() subtracts pixel values:
#
#   Figma pixel:  [255, 0, 0]  (pure red)
#   Live pixel:   [200, 0, 0]  (slightly different red)
#   Difference:   [ 55, 0, 0]  → non-zero → something changed here
#
#   Result is a "diff image" where:
#   - Black pixels (value=0)   → same in both images
#   - White pixels (value=255) → different between images
#
# We convert to grayscale first because we only need brightness difference,
# not per-channel RGB difference (that comes later for color analysis).

def compute_pixel_diff(figma, live):
    # convert both images to grayscale (1 channel instead of 3)
    gray_figma = cv2.cvtColor(figma, cv2.COLOR_BGR2GRAY)
    gray_live  = cv2.cvtColor(live,  cv2.COLOR_BGR2GRAY)

    # subtract: result is white where images differ, black where same
    diff = cv2.absdiff(gray_figma, gray_live)

    return diff


# =============================================================================
# STEP 3 — Threshold: remove noise, keep only real differences
# =============================================================================
# Not every pixel difference is meaningful.
# Screen rendering, anti-aliasing, font smoothing cause tiny 1-2 pixel diffs.
# We ignore differences smaller than 30 (out of 255).
#
# cv2.threshold(image, threshold_value, max_value, type)
#   pixel < 30  → set to 0   (ignore — probably rendering noise)
#   pixel >= 30 → set to 255 (keep — real visual difference)
#
# Result is a clean black/white binary image:
#   Black = no difference
#   White = real difference

def apply_threshold(diff):
    THRESHOLD_VALUE = 30    # tune this: lower = more sensitive, higher = less
    _, thresh = cv2.threshold(diff, THRESHOLD_VALUE, 255, cv2.THRESH_BINARY)
    return thresh


# =============================================================================
# STEP 4 — Dilate: merge nearby diff pixels into solid regions
# =============================================================================
# After thresholding, diff pixels are scattered like dots.
# A button with wrong padding has many tiny separate diff pixels.
# We want ONE box around the whole button, not 50 tiny boxes.
#
# cv2.dilate() expands each white pixel outward using a kernel (brush size).
# Nearby white dots merge into one solid white region.
#
# Kernel size 15x15 means: expand each white pixel by 15px in all directions.
# iterations=2 means: do this expansion twice.
#
# Before dilate:   █ . . █ . . █    (scattered dots)
# After dilate:    █ █ █ █ █ █ █    (one solid region)

def dilate_diff(thresh):
    # rectangular kernel — expands in all directions equally
    kernel  = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
    dilated = cv2.dilate(thresh, kernel, iterations=2)
    return dilated


# =============================================================================
# STEP 5 — Find Contours: draw boxes around each changed region
# =============================================================================
# cv2.findContours() traces the outline of each white region.
# cv2.boundingRect() gives us the rectangle: x, y, width, height in pixels.
#
# We convert pixel coordinates to percentages so they work on any screen size.
#   x_percent = (x_pixels / image_width) * 100
#
# Why percentages? Because the frontend renders images at different sizes.
# A percentage position always maps to the right spot on the image.

def find_diff_regions(dilated, diff, figma, live, w, h):
    contours, _ = cv2.findContours(
        dilated,
        cv2.RETR_EXTERNAL,      # only outer contours, not nested
        cv2.CHAIN_APPROX_SIMPLE # compress contour points (save memory)
    )

    regions  = []

    # ignore tiny regions — less than 0.2% of total image area
    # this filters out stray pixels that slipped through threshold
    min_area = (w * h) * 0.002

    for contour in contours:
        area = cv2.contourArea(contour)
        if area < min_area:
            continue   # skip noise

        # get bounding rectangle for this contour
        x, y, bw, bh = cv2.boundingRect(contour)

        # ── Severity: how different is this region? ──────────────────────
        # Extract the diff values just inside this bounding box (Region of Interest)
        roi_diff       = diff[y : y+bh, x : x+bw]
        mean_intensity = float(np.mean(roi_diff))
        # mean_intensity is average brightness of diff pixels in this region
        # higher = more different = more severe

        severity = classify_severity(mean_intensity)

        # ── Color analysis: what color is it in each image? ──────────────
        # Extract the actual pixel colors from figma and live in this region
        roi_figma = figma[y : y+bh, x : x+bw]
        roi_live  = live [y : y+bh, x : x+bw]

        # average color in this region (BGR format — OpenCV uses BGR not RGB)
        avg_color_figma = roi_figma.mean(axis=(0, 1)).tolist()
        avg_color_live  = roi_live.mean(axis=(0, 1)).tolist()

        # ── Guess issue type from region shape ───────────────────────────
        issue_type = guess_issue_type(bw, bh, w, h, mean_intensity,
                                      avg_color_figma, avg_color_live)

        # ── Convert pixel coords to percentages ──────────────────────────
        regions.append({
            "bbox": {
                "x":   round((x  / w) * 100, 2),   # left edge as % of width
                "y":   round((y  / h) * 100, 2),   # top edge as % of height
                "w":   round((bw / w) * 100, 2),   # width as % of image width
                "h":   round((bh / h) * 100, 2),   # height as % of image height
                "abs": { "x": x, "y": y, "w": bw, "h": bh }  # raw pixels too
            },
            "severity":       severity,
            "mean_intensity": round(mean_intensity, 2),
            "issue_type":     issue_type,
            "color": {
                # BGR → convert to RGB for readability
                "figma_rgb": bgr_to_hex(avg_color_figma),
                "live_rgb":  bgr_to_hex(avg_color_live),
                "figma_bgr": [round(v, 1) for v in avg_color_figma],
                "live_bgr":  [round(v, 1) for v in avg_color_live],
            },
            "image_size": { "w": w, "h": h }
        })

    return regions


# =============================================================================
# HELPER — Classify severity by how intense the pixel difference is
# =============================================================================
# mean_intensity is 0-255 (average brightness of diff pixels in region)
# Higher = more different = more severe

def classify_severity(mean_intensity):
    if mean_intensity > 80:
        return "high"     # very different — likely wrong color or missing element
    elif mean_intensity > 40:
        return "medium"   # moderately different — spacing or size issue
    else:
        return "low"      # slightly different — minor typography or shadow


# =============================================================================
# HELPER — Guess what TYPE of UI issue this region likely is
# =============================================================================
# We use the shape and color difference of the region to make an educated guess.
# This is passed to Gemini AI as a hint — Gemini makes the final decision.

def guess_issue_type(bw, bh, w, h, intensity, color_figma, color_live):
    region_width_pct  = (bw / w) * 100
    region_height_pct = (bh / h) * 100

    # compute how different the colors are between figma and live
    color_diff = sum(abs(a - b) for a, b in zip(color_figma, color_live))

    if color_diff > 100:
        return "color"          # big color difference → color mismatch

    if region_height_pct < 5:
        return "typography"     # thin horizontal region → likely text/font

    if region_width_pct > 70 and region_height_pct < 15:
        return "spacing"        # wide but short → padding or margin issue

    if region_width_pct < 20 and region_height_pct < 20:
        return "sizing"         # small square region → icon or component size

    if intensity < 50:
        return "alignment"      # subtle difference → element shifted slightly

    return "component"          # default — some component looks different


# =============================================================================
# HELPER — Convert BGR average color array to HEX string
# =============================================================================
# OpenCV stores colors as BGR (Blue, Green, Red) — opposite of RGB.
# We convert to hex like #FF5733 so Gemini and the frontend understand it.

def bgr_to_hex(bgr):
    b, g, r = [int(v) for v in bgr[:3]]
    return "#{:02X}{:02X}{:02X}".format(r, g, b)


# =============================================================================
# MAIN — Sort and output results as JSON
# =============================================================================
# Sort regions: High severity first, then by size (bigger issues first).
# Print as JSON so Node.js can parse it with JSON.parse().

def compute_diff(figma_path, live_path):

    # Step 1 — load and resize
    figma, live, w, h = load_and_resize(figma_path, live_path)
    if figma is None:
        print(json.dumps({"error": "Could not read one or both images"}))
        sys.exit(1)

    # Step 2 — pixel difference
    diff = compute_pixel_diff(figma, live)

    # Step 3 — remove noise
    thresh = apply_threshold(diff)

    # Step 4 — merge nearby regions
    dilated = dilate_diff(thresh)

    # Step 5 — find bounding boxes
    regions = find_diff_regions(dilated, diff, figma, live, w, h)

    # sort: high first, then by area (largest first)
    severity_order = {"high": 0, "medium": 1, "low": 2}
    regions.sort(key=lambda r: (
        severity_order[r["severity"]],
        -(r["bbox"]["w"] * r["bbox"]["h"])
    ))

    # output as JSON — Node.js reads this via child_process stdout
    print(json.dumps({
        "regions": regions,
        "total":   len(regions),
        "summary": {
            "high":   sum(1 for r in regions if r["severity"] == "high"),
            "medium": sum(1 for r in regions if r["severity"] == "medium"),
            "low":    sum(1 for r in regions if r["severity"] == "low"),
        }
    }))


# =============================================================================
# Entry point — called by Node.js via:
# python3 diff.py <figma_image_path> <live_image_path>
# =============================================================================

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({
            "error": "Usage: python3 diff.py <figma_path> <live_path>"
        }))
        sys.exit(1)

    compute_diff(sys.argv[1], sys.argv[2])
