import { useState, useEffect } from "react";
import { resizeImage } from "../utils/imageUtils";

export default function ResizeBySize({ selectedImage, updateImage }) {
  const [width, setWidth] = useState(selectedImage?.width || 800);
  const [height, setHeight] = useState(selectedImage?.height || 800);
  const [keepAspect, setKeepAspect] = useState(true);

  useEffect(() => {
    setWidth(selectedImage.width || 800);
    setHeight(selectedImage.height || 800);
  }, [selectedImage]);

  const handleResize = async () => {
    if (!selectedImage) return alert("Select an image first.");
    const result = await resizeImage(selectedImage.file, width, height);

    updateImage({
      ...selectedImage,
      url: URL.createObjectURL(result),
      file: result,
      width,
      height,
    });
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
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Apply Resize
      </button>
    </div>
  );
}
