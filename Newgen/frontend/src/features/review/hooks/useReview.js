// import { useReviewContext } from '../context/ReviewContext'
// import { useInspectorContext } from '../../inspector/context/InspectorContext'
// import { useUploadContext } from '../../upload/context/UploadContext'

// export function useReview() {
//   const { viewMode, setViewMode, zoom, setZoom, sliderPos, setSliderPos, isAnalyzing, setIsAnalyzing, analysisComplete, setAnalysisComplete } = useReviewContext()
//   const { setIssues } = useInspectorContext()
//   const { figmaImage, liveImage, uploadId } = useUploadContext()

//   const runAnalysis = async () => {
//     if (!figmaImage || !liveImage) return
//     setIsAnalyzing(true)
//     setIssues([])

//     try {
//       // If we have a saved uploadId use the full review pipeline
//       // Otherwise fall back to the raw diff endpoint
//       let data
//       if (uploadId) {
//         const token = localStorage.getItem('token')
//         const res = await fetch(`/api/review/${uploadId}`, {
//           method: 'POST',
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         })
//         data = await res.json()
//         setIssues(data.data?.review?.issues || [])
//       } else {
//         // Guest mode — send images directly to raw diff + AI
//         const formData = new FormData()
//         formData.append('figma', figmaImage.file)
//         formData.append('live',  liveImage.file)
//         const res = await fetch('/api/diff/raw', { method: 'POST', body: formData })
//         data = await res.json()
//         setIssues(data.data?.regions || [])
//       }

//       setAnalysisComplete(true)
//       setAnalysisComplete(true)
//     } catch (err) {
//       console.error('Analysis failed:', err)
//     } finally {
//       setIsAnalyzing(false)
//     }
//   }

//   return {
//     viewMode, setViewMode,
//     zoom, setZoom,
//     sliderPos, setSliderPos,
//     isAnalyzing, analysisComplete,
//     runAnalysis
//   }
// }

import { useReviewContext } from "../context/ReviewContext";
import { useInspectorContext } from "../../inspector/context/InspectorContext";
import { useUploadContext } from "../../upload/context/UploadContext";

export function useReview() {
  const {
    viewMode,
    setViewMode,
    zoom,
    setZoom,
    sliderPos,
    setSliderPos,
    isAnalyzing,
    setIsAnalyzing,
    analysisComplete,
    setAnalysisComplete,
  } = useReviewContext();

  const { setIssues } = useInspectorContext();
  const { figmaImage, liveImage, uploadId } = useUploadContext();

  const runAnalysis = async () => {
    if (!figmaImage || !liveImage) {
      console.error("No images found");
      return;
    }

    // Check file objects exist
    if (!figmaImage.file || !liveImage.file) {
      console.error(
        "File objects missing — images may have been lost on navigation",
      );
      return;
    }

    setIsAnalyzing(true);
    setIssues([]);

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const formData = new FormData();
      formData.append("figma", figmaImage.file);
      formData.append("live", liveImage.file);

      // always use /api/diff/raw for now
      // this works without needing uploadId
      const res = await fetch("/api/diff/raw", {
        method: "POST",
        headers: headers, // no Content-Type — FormData sets it automatically
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Server error");
      }

      const data = await res.json();

      // map raw regions to issue format for inspector
      const issues = (data.data?.regions || []).map((region, i) => ({
        id: `issue_${i}`,
        category: region.issue_type || "Visual",
        label: `Region ${i + 1} — ${region.issue_type || "diff"}`,
        severity: region.severity,
        description: "Visual mismatch detected",
        expected: region.color?.figma_rgb || "—",
        actual: region.color?.live_rgb || "—",
        cssfix: "",
        bbox: region.bbox,
        source: "image",
      }));

      setIssues(issues);
      setAnalysisComplete(true);
    } catch (err) {
      console.error("Analysis failed:", err);
      alert(`Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    viewMode,
    setViewMode,
    zoom,
    setZoom,
    sliderPos,
    setSliderPos,
    isAnalyzing,
    analysisComplete,
    runAnalysis,
  };
}