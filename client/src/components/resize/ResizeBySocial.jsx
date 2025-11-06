import { useState, useEffect } from "react";

const PRESETS = {
  Instagram: [
    { name: "Post", w: 1080, h: 1080 },
    { name: "Story", w: 1080, h: 1920 },
    { name: "Reel", w: 1080, h: 1920 },
  ],
  Facebook: [
    { name: "Cover Photo", w: 820, h: 312 },
    { name: "Post Image", w: 1200, h: 630 },
    { name: "Ad", w: 1080, h: 1080 },
  ],
  Twitter: [
    { name: "Post", w: 1200, h: 675 },
    { name: "Header", w: 1500, h: 500 },
  ],
};

export default function ResizeBySocial({ selectedImage, updateImage, serverUrl }) {
  const [platform, setPlatform] = useState("Instagram");
  const [preset, setPreset] = useState(PRESETS[platform][0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPreset(PRESETS[platform][0] || null);
  }, [platform]);

  const handleResize = async () => {
    if (!selectedImage) return alert("Select an image first.");
    if (!preset) return alert("No preset selected.");
    setLoading(true);

    try {
      const res = await fetch(`${serverUrl}/resize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedImage.serverFilename,
          width: preset.w,
          height: preset.h,
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
          width: preset.w,
          height: preset.h,
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
      <label className="block text-sm font-medium">Platform</label>
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      >
        {Object.keys(PRESETS).map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium mt-2">Preset</label>
      <select
        value={preset?.name || ""}
        onChange={(e) =>
          setPreset(PRESETS[platform].find((p) => p.name === e.target.value))
        }
        className="w-full border px-2 py-1 rounded"
      >
        {PRESETS[platform].map((p) => (
          <option key={p.name} value={p.name}>
            {p.name} ({p.w}x{p.h})
          </option>
        ))}
      </select>

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
