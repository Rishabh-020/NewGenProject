import React, { useRef, useCallback } from "react";
import { useUploadContext } from "../../upload/context/UploadContext";
import { useReviewContext } from "../context/ReviewContext";

export default function SliderOverlay() {
  const { figmaImage, liveImage } = useUploadContext();
  const { sliderPos, setSliderPos } = useReviewContext();
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const updatePos = useCallback(
    (clientX) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      setSliderPos(Math.min(100, Math.max(0, x)));
    },
    [setSliderPos],
  );

  const onMouseDown = (e) => {
    isDragging.current = true;
    updatePos(e.clientX);
  };
  const onMouseMove = (e) => {
    if (isDragging.current) updatePos(e.clientX);
  };
  const onMouseUp = () => {
    isDragging.current = false;
  };
  const onTouchStart = (e) => {
    isDragging.current = true;
    updatePos(e.touches[0].clientX);
  };
  const onTouchMove = (e) => {
    if (isDragging.current) updatePos(e.touches[0].clientX);
  };
  const onTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-xs font-mono text-gray-500 border border-[#2a2a2a] px-2 py-0.5 rounded">
          Slider Overlay
        </span>
        <span className="text-xs text-gray-700">Click or drag to compare</span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 bg-[#141414] rounded-xl border border-[#1e1e1e] overflow-hidden relative select-none cursor-col-resize"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* LIVE image — full background */}
        {liveImage && (
          <img
            src={liveImage.url}
            alt="Live"
            draggable={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        )}

        {/* FIGMA image — clipped by slider */}
        {figmaImage && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            }}
          >
            <img
              src={figmaImage.url}
              alt="Figma"
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          </div>
        )}

        {/* Divider line + handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/80 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
            >
              <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 text-[10px] font-mono bg-black/60 text-gray-300 px-2 py-0.5 rounded pointer-events-none">
          FIGMA
        </div>
        <div className="absolute top-3 right-3 text-[10px] font-mono bg-black/60 text-gray-300 px-2 py-0.5 rounded pointer-events-none">
          LIVE
        </div>
      </div>
    </div>
  );
}
