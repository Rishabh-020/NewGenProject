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

    if (!figmaImage.file || !liveImage.file) {
      console.error("File objects missing");
      return;
    }

    setIsAnalyzing(true);
    setIssues([]);

    try {
      const formData = new FormData();
      formData.append("figma", figmaImage.file);
      formData.append("live", liveImage.file);

      const res = await fetch("/api/diff/raw", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Server error");
      }

      const data = await res.json();

      const issues = (data.data?.regions || []).map((region, i) => ({
        id: region.id || `issue_${i}`,
        category: region.category || region.issue_type || "Visual",
        label: region.label || `Region ${i + 1}`,
        severity: region.severity || "low",
        description: region.description || "Visual mismatch detected",
        expected: region.expected || region.color?.figma_rgb || "-",
        actual: region.actual || region.color?.live_rgb || "-",
        cssfix: region.cssfix || "",
        bbox: region.bbox || null,
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