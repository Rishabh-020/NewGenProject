// import { useCallback } from 'react'
// import { useUploadContext } from '../context/UploadContext'

// export function useUpload() {
//   const { figmaImage, setFigmaImage, liveImage, setLiveImage, reset } = useUploadContext()

//   const readFile = (file) =>
//     new Promise((resolve) => {
//       const reader = new FileReader()
//       reader.onload = (e) => resolve({ file, url: e.target.result, name: file.name })
//       reader.readAsDataURL(file)
//     })

//   const handleFigmaUpload = useCallback(async (file) => {
//     if (!file) return
//     const data = await readFile(file)
//     setFigmaImage(data)
//   }, [setFigmaImage])

//   const handleLiveUpload = useCallback(async (file) => {
//     if (!file) return
//     const data = await readFile(file)
//     setLiveImage(data)
//   }, [setLiveImage])

//   const isReady = !!(figmaImage && liveImage)

//   return { figmaImage, liveImage, handleFigmaUpload, handleLiveUpload, isReady, reset }
// }


import { useCallback } from "react";
import { useUploadContext } from "../context/UploadContext";

export function useUpload() {
  const {
    figmaImage,
    setFigmaImage,
    liveImage,
    setLiveImage,
    uploadId,
    setUploadId,
    reset,
  } = useUploadContext();

  const readFile = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        resolve({
          file, // ← keep the original File object
          url: e.target.result, // ← base64 for preview
          name: file.name,
        });
      reader.readAsDataURL(file);
    });

  const handleFigmaUpload = useCallback(
    async (file) => {
      if (!file) return;
      const data = await readFile(file);
      setFigmaImage(data);
    },
    [setFigmaImage],
  );

  const handleLiveUpload = useCallback(
    async (file) => {
      if (!file) return;
      const data = await readFile(file);
      setLiveImage(data);
    },
    [setLiveImage],
  );

  const isReady = !!(figmaImage && liveImage);

  return {
    figmaImage,
    liveImage,
    handleFigmaUpload,
    handleLiveUpload,
    isReady,
    uploadId,
    setUploadId,
    reset,
  };
}
