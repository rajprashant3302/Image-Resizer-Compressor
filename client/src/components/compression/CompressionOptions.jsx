import { useState, useEffect } from "react";
import ProgressBar from "../common/ProgressBar";
import { motion } from "framer-motion";
import { FiPercent, FiBox, FiImage } from "react-icons/fi";

export default function CompressionOptions({ selectedImage, updateImage, serverUrl }) {
  const [mode, setMode] = useState("percentage");
  const [percentage, setPercentage] = useState(80);
  const [targetSizeKB, setTargetSizeKB] = useState(500);
  const [estimatedQuality, setEstimatedQuality] = useState(100);
  const [progress, setProgress] = useState(0);
  const [originalSizeKB, setOriginalSizeKB] = useState(0);
  const [currentSizeKB, setCurrentSizeKB] = useState(0);
  const [expectedOutputKB, setExpectedOutputKB] = useState(0);

 
  useEffect(() => {
    const file = selectedImage?.originalFile || selectedImage?.file;
    if (!file) return;
    const sizeKB = file.size ? file.size / 1024 : 0;
    setOriginalSizeKB(sizeKB);
    setCurrentSizeKB(sizeKB);
  }, [selectedImage]);

 
  useEffect(() => {
    if (!originalSizeKB || isNaN(originalSizeKB)) return;

    if (mode === "percentage") {
      setEstimatedQuality(percentage);
      const approx = (originalSizeKB * percentage) / 100;
      setExpectedOutputKB(Math.max(approx, 10));
    } else if (mode === "targetSize") {
      if (!originalSizeKB || targetSizeKB <= 0) return;
      const ratio = Math.min((targetSizeKB / originalSizeKB) * 100, 100);
      setEstimatedQuality(Math.max(Math.round(ratio), 5));
      setExpectedOutputKB(Math.min(targetSizeKB, originalSizeKB));
    }
  }, [mode, percentage, targetSizeKB, originalSizeKB]);

  
  const handleCompress = async () => {
    if (!selectedImage?.serverFilename) {
      alert("Please upload an image first!");
      return;
    }

    setProgress(0);

    const body =
      mode === "targetSize"
        ? {
          filename: selectedImage.serverFilename,
          targetKB: targetSizeKB,
        }
        : {
          filename: selectedImage.serverFilename,
          quality: estimatedQuality,
        };

    try {
      const res = await fetch(`${serverUrl}/compress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setProgress(50);
      const data = await res.json();

      if (!data.processed) throw new Error("Invalid server response");

      updateImage({
        ...selectedImage,
        url: data.processed,
      });

    
      setCurrentSizeKB(parseFloat(data.sizeKB) || expectedOutputKB);
      setEstimatedQuality(data.usedQuality || estimatedQuality);
      setProgress(100);
      setTimeout(() => setProgress(0), 800);
    } catch (err) {
      console.error("Compression failed:", err);
      alert("Server compression failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6 border border-gray-100"
    >

      <div className="flex-1 flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FiImage /> Image Compression
        </h2>

     
        <div className="flex gap-3">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all w-1/2 justify-center ${mode === "percentage"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setMode("percentage")}
          >
            <FiPercent /> By Percentage
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all w-1/2 justify-center ${mode === "targetSize"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setMode("targetSize")}
          >
            <FiBox /> By Target Size
          </button>
        </div>

        
        <motion.div layout className="flex flex-col gap-3">
          {mode === "percentage" ? (
            <>
              <label className="text-gray-700 font-medium">
                Compression Level: {percentage}%
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={percentage}
                onChange={(e) => setPercentage(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </>
          ) : (
            <>
              <label className="text-gray-700 font-medium">Target Size (KB)</label>
              <input
                type="number"
                min={10}
                step={10}
                value={targetSizeKB}
                onChange={(e) => setTargetSizeKB(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </>
          )}
        </motion.div>

        
        <div className="bg-gray-50 border rounded-xl p-3 text-gray-700 text-sm flex flex-col gap-1">
          <p>
            <b>Estimated Quality:</b> {estimatedQuality}%
          </p>
          <p>
            <b>Expected Output:</b> {expectedOutputKB.toFixed(2)} KB
          </p>
        </div>

        
        <button
          className="bg-green-600 hover:bg-green-700 transition-all text-white font-semibold py-2.5 rounded-lg shadow-sm"
          onClick={handleCompress}
        >
          {progress > 0 ? "Processing..." : "Compress Image"}
        </button>

        
        {progress > 0 && <ProgressBar progress={progress} label="Compressing" />}
      </div>






    </motion.div>
  );
}
