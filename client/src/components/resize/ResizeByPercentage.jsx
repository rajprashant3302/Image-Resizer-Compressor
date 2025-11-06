import { useState, useEffect } from "react";

export default function ResizeByPercentage({ selectedImage, updateImage, serverUrl }) {
  const [percentage, setPercentage] = useState(80);
  const [width, setWidth] = useState(selectedImage?.width || 800);
  const [height, setHeight] = useState(selectedImage?.height || 800);
  const [keepAspect, setKeepAspect] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const handleResize = async () => {
    if (!selectedImage) return alert("Select an image first.");
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/resize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedImage.serverFilename,
          width: Number(width),
          height: Number(height),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Server error:", data);
        alert(data.error || "Server resize failed");
      } else {
        updateImage({
          ...selectedImage,
          url: data.processed,
          width: Number(width),
          height: Number(height),
        });
      }
    } catch (err) {
      console.error(err);
      alert("Server resize failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
            onChange={(e) => setWidth(parseInt(e.target.value))}
            className="w-full border p-1 rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600">Height (px)</label>
          <input
            type="number"
            value={height}
            disabled={keepAspect}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            className={`w-full border p-1 rounded ${keepAspect ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        </div>
      </div>

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
        disabled={loading}
        className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Resizing..." : "Apply Resize"}
      </button>
    </div>
  );
}
