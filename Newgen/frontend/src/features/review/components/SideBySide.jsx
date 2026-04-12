import React, { useRef, useEffect, useState } from "react";
import { useUploadContext } from "../../upload/context/UploadContext";
import { useInspectorContext } from "../../inspector/context/InspectorContext";

export default function SideBySide() {
  const { figmaImage, liveImage } = useUploadContext();
  const { issues, selectedIssue, setSelectedIssue } = useInspectorContext();
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [imgRect, setImgRect] = useState(null);

  useEffect(() => {
    const updateRect = () => {
      if (!imgRef.current || !containerRef.current) return;
      const img = imgRef.current;
      const container = containerRef.current;

      const containerRect = container.getBoundingClientRect();
      const naturalRatio = img.naturalWidth / img.naturalHeight;
      const containerRatio = containerRect.width / containerRect.height;

      let renderedW, renderedH, offsetX, offsetY;

      if (naturalRatio > containerRatio) {
        renderedW = containerRect.width;
        renderedH = containerRect.width / naturalRatio;
        offsetX = 0;
        offsetY = (containerRect.height - renderedH) / 2;
      } else {
        renderedH = containerRect.height;
        renderedW = containerRect.height * naturalRatio;
        offsetX = (containerRect.width - renderedW) / 2;
        offsetY = 0;
      }

      setImgRect({ w: renderedW, h: renderedH, x: offsetX, y: offsetY });
    };

    const img = imgRef.current;
    if (img) {
      if (img.complete) updateRect();
      else img.addEventListener("load", updateRect);
    }

    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [liveImage]);

  const validIssues = issues.filter(
    (issue) =>
      issue.bbox &&
      typeof issue.bbox.x === "number" &&
      typeof issue.bbox.y === "number" &&
      issue.bbox.w > 0 &&
      issue.bbox.h > 0 &&
      issue.bbox.w <= 100 &&
      issue.bbox.h <= 100,
  );

  return (
    <div className="flex gap-4 h-full">
      {/* Figma Panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-gray-500 border border-[#2a2a2a] px-2 py-0.5 rounded">
            Figma Reference
          </span>
        </div>
        <div className="flex-1 bg-[#141414] rounded-xl border border-[#1e1e1e] overflow-hidden flex items-center justify-center p-4">
          {figmaImage ? (
            <img
              src={figmaImage.url}
              alt="Figma"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : (
            <span className="text-gray-700 text-sm">No image</span>
          )}
        </div>
      </div>

      {/* Live Panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-gray-500 border border-[#2a2a2a] px-2 py-0.5 rounded">
            Live Implementation
          </span>
          {issues.length > 0 && (
            <span className="text-[11px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
              {issues.length} Issues
            </span>
          )}
        </div>

        <div
          ref={containerRef}
          className="flex-1 bg-[#141414] rounded-xl border border-[#1e1e1e] overflow-hidden relative"
        >
          {liveImage ? (
            <>
              {/* Image */}
              <img
                ref={imgRef}
                src={liveImage.url}
                alt="Live"
                className="w-full h-full object-contain"
              />

              {/* Annotations — positioned over actual image area */}
              {imgRect &&
                validIssues.map((issue) => {
                  const left = imgRect.x + (issue.bbox.x / 100) * imgRect.w;
                  const top = imgRect.y + (issue.bbox.y / 100) * imgRect.h;
                  const width = (issue.bbox.w / 100) * imgRect.w;
                  const height = (issue.bbox.h / 100) * imgRect.h;

                  return (
                    <div
                      key={issue.id}
                      onClick={() =>
                        setSelectedIssue(
                          issue.id === selectedIssue ? null : issue.id,
                        )
                      }
                      className={`
                      absolute border-2 rounded cursor-pointer transition-all
                      ${issue.severity === "high" ? "border-red-500 bg-red-500/10" : ""}
                      ${issue.severity === "medium" ? "border-orange-400 bg-orange-400/10" : ""}
                      ${issue.severity === "low" ? "border-blue-400 bg-blue-400/10" : ""}
                      ${selectedIssue === issue.id ? "ring-2 ring-white/20" : ""}
                    `}
                      style={{ left, top, width, height }}
                    >
                      <span
                        className={`
                      absolute -top-5 left-0 text-[10px] px-1.5 py-0.5 rounded font-mono whitespace-nowrap
                      ${issue.severity === "high" ? "bg-red-500 text-white" : ""}
                      ${issue.severity === "medium" ? "bg-orange-400 text-black" : ""}
                      ${issue.severity === "low" ? "bg-blue-400 text-black" : ""}
                    `}
                      >
                        {issue.label}
                      </span>
                    </div>
                  );
                })}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-700 text-sm">No image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
