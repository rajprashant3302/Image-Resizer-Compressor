import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import ProgressBar from "../common/ProgressBar";

export default function CompressionOptions({ selectedImage, updateImage }) {
  const [compressionMode, setCompressionMode] = useState("percentage");
  const [percentage, setPercentage] = useState(80);
  const [targetSizeKB, setTargetSizeKB] = useState(500);
  const [progress, setProgress] = useState(0);
  const [originalSizeKB, setOriginalSizeKB] = useState(0);
  const [currentSizeKB, setCurrentSizeKB] = useState(0);


  const originalFile = selectedImage?.originalFile || selectedImage?.file;

  useEffect(() => {
    if (originalFile) {
      setOriginalSizeKB(originalFile.size / 1024); 
      setCurrentSizeKB(selectedImage.file.size / 1024); 
      setProgress(0);
    }
  }, [selectedImage, originalFile]);

  const handleCompress = async () => {
    if (!selectedImage?.file) return;
    setProgress(0);

    try {
      const options = {
        maxSizeMB: compressionMode === "targetSize" ? targetSizeKB / 1024 : undefined,
        maxWidthOrHeight: Math.max(selectedImage.width || 800, selectedImage.height || 800),
        useWebWorker: true,
        onProgress: (p) => setProgress(Math.round(p)),
      };

      if (compressionMode === "percentage") {
        options.initialQuality = percentage / 100;
      }

      const compressedFile = await imageCompression(selectedImage.file, options);
      const compressedUrl = URL.createObjectURL(compressedFile);

      updateImage({
        ...selectedImage,
        file: compressedFile,
        url: compressedUrl,
        width: selectedImage.width,
        height: selectedImage.height,
        originalFile: originalFile, 
      });

      setCurrentSizeKB(compressedFile.size / 1024);
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    } catch (err) {
      console.error("Compression failed:", err);
    }
  };

  return (
    <div className="w-full p-4 bg-gray-50 rounded-xl shadow-inner flex flex-col gap-4">
      <div className="flex gap-2 mb-3">
        <button
          className={`px-3 py-1 rounded-md ${
            compressionMode === "percentage" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setCompressionMode("percentage")}
        >
          By Percentage
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            compressionMode === "targetSize" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setCompressionMode("targetSize")}
        >
          By Target Size (KB)
        </button>
      </div>

      {compressionMode === "percentage" && (
        <div className="flex flex-col gap-2">
          <label>Compression: {percentage}%</label>
          <input
            type="range"
            min={10}
            max={100}
            value={percentage}
            onChange={(e) => setPercentage(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      )}

      {compressionMode === "targetSize" && (
        <div className="flex flex-col gap-2">
          <label>Target Size (KB)</label>
          <input
            type="number"
            min={10}
            step={10}
            value={targetSizeKB}
            onChange={(e) => setTargetSizeKB(parseInt(e.target.value))}
            className="w-full p-2 border rounded-lg"
          />
        </div>
      )}

      <button
        className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        onClick={handleCompress}
      >
        Compress Image
      </button>

      {progress > 0 && <ProgressBar progress={progress} label="Compressing" />}

      <div className="text-sm text-gray-700">
        <p>
          Original Size: <b>{originalSizeKB.toFixed(2)} KB</b>
        </p>
        <p>
          Current Size: <b>{currentSizeKB.toFixed(2)} KB</b>
        </p>
        <p>
          Saved: <b>{(originalSizeKB - currentSizeKB).toFixed(2)} KB</b>
        </p>
      </div>
    </div>
  );
}
