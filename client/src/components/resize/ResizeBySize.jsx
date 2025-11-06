import { useState, useEffect } from "react";

export default function ResizeBySize({ selectedImage, updateImage, serverUrl }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ Get actual original size once image is loaded
  useEffect(() => {
    if (!selectedImage) return;

    const img = new Image();
    img.onload = () => {
      const w = selectedImage.width || img.naturalWidth;
      const h = selectedImage.height || img.naturalHeight;
      setWidth(w);
      setHeight(h);
    };
    img.src = selectedImage.url || selectedImage.originalUrl;
  }, [selectedImage]);

  const handleResize = async () => {
    if (!selectedImage) return alert("Select an image first.");

    const w = Number(width);
    const h = Number(height);
    if (!w || !h) return alert("Width and height must be valid numbers.");

    setLoading(true);

    try {
      const res = await fetch(`${serverUrl}/resize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedImage.serverFilename,
          width: w,
          height: h,
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
          width: w,
          height: h,
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
    <div className="space-y-3">
      <label>Width (px)</label>
      <input
        type="number"
        value={width}
        onChange={(e) => {
          const newW = parseInt(e.target.value);
          if (keepAspect && selectedImage.width && selectedImage.height) {
            const ratio = selectedImage.height / selectedImage.width;
            setHeight(Math.round(newW * ratio));
          }
          setWidth(newW);
        }}
        className="w-full border px-2 py-1 rounded"
      />

      <label>Height (px)</label>
      <input
        type="number"
        value={height}
        onChange={(e) => {
          const newH = parseInt(e.target.value);
          if (keepAspect && selectedImage.width && selectedImage.height) {
            const ratio = selectedImage.width / selectedImage.height;
            setWidth(Math.round(newH * ratio));
          }
          setHeight(newH);
        }}
        className="w-full border px-2 py-1 rounded"
      />

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
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Resizing..." : "Apply Resize"}
      </button>
    </div>
  );
}
