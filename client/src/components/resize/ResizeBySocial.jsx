import { useState, useEffect } from "react";
import { resizeImage } from "../utils/imageUtils";

const PRESETS = {
  Instagram: [
    { name: "Post ", w: 1080, h: 1080 },
    { name: "Story ", w: 1080, h: 1920 },
    { name: "Reel ", w: 1080, h: 1920 },
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

export default function ResizeBySocial({ selectedImage, updateImage }) {
  const [platform, setPlatform] = useState("Instagram");
  const [preset, setPreset] = useState(PRESETS[platform][0]);

  useEffect(() => {
    setPreset(PRESETS[platform][0]);
  }, [platform]);

  const handleResize = async () => {
    if (!selectedImage) return alert("Select an image first.");
    const result = await resizeImage(selectedImage.file, preset.w, preset.h);

    updateImage({
      ...selectedImage,
      url: URL.createObjectURL(result),
      file: result,
      width: preset.w,
      height: preset.h,
    });
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
        value={preset.name}
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
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Apply Resize
      </button>
    </div>
  );
}
