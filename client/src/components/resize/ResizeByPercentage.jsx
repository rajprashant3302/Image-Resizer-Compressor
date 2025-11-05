import { useState, useEffect } from "react";
import { resizeImageByPercentage } from "../utils/imageUtils";

export default function ResizeByPercentage({ selectedImage, updateImage }) {
  const [percentage, setPercentage] = useState(80);
  const [width, setWidth] = useState(selectedImage?.width || 800);
  const [height, setHeight] = useState(selectedImage?.height || 800);
  const [keepAspect, setKeepAspect] = useState(true);

  const originalWidth = selectedImage?.width || 800;
  const originalHeight = selectedImage?.height || 800;
  const aspectRatio = originalWidth / originalHeight;

  useEffect(() => {
    const newWidth = Math.round(originalWidth * (percentage / 100));
    const newHeight = keepAspect
      ? Math.round(newWidth / aspectRatio)
      : Math.round(originalHeight * (percentage / 100));

    setWidth(newWidth);
    setHeight(newHeight);
  }, [percentage, keepAspect, originalWidth, originalHeight]);

  const handleWidthChange = (newWidth) => {
    const newHeight = keepAspect ? Math.round(newWidth / aspectRatio) : height;
    setWidth(newWidth);
    setHeight(newHeight);
    setPercentage(Math.round((newWidth / originalWidth) * 100));
  };

  const handleHeightChange = (newHeight) => {
    const newWidth = keepAspect ? Math.round(newHeight * aspectRatio) : width;
    setHeight(newHeight);
    setWidth(newWidth);
    setPercentage(Math.round((newWidth / originalWidth) * 100));
  };

  const handleResize = async () => {
    if (!selectedImage) return alert("Select an image first.");

    const result = await resizeImageByPercentage(selectedImage.file, percentage);

    updateImage({
      ...selectedImage,
      url: URL.createObjectURL(result),
      file: result,
      width,
      height,
    });
  };

  return (
    <div className="space-y-4">
      {/* Percentage */}
      <label className="block text-sm text-gray-600 font-medium">
        Resize by Percentage: {percentage}%
      </label>
      <input
        type="range"
        min="1"
        max="100"
        value={percentage}
        onChange={(e) => setPercentage(parseInt(e.target.value))}
        className="w-full"
      />

      
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm text-gray-600">Width (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => handleWidthChange(parseInt(e.target.value))}
            className="w-full border p-1 rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600">Height (px)</label>
          <input
            type="number"
            value={height}
            disabled={keepAspect}
            onChange={(e) => handleHeightChange(parseInt(e.target.value))}
            className={`w-full border p-1 rounded ${
              keepAspect ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>

      {/* Aspect Ratio */}
      <div>
        <input
          type="checkbox"
          checked={keepAspect}
          onChange={() => setKeepAspect(!keepAspect)}
          className="mr-2"
        />
        Maintain Aspect Ratio
      </div>

      <button
        onClick={handleResize}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Apply Resize
      </button>
    </div>
  );
}
