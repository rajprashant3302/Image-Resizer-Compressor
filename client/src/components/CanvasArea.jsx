import React, { useState, useEffect } from "react";
import CropTool from "./crop/CropTool";
import { FiCrop, FiEye } from "react-icons/fi";

export default function CanvasArea({ selectedImage, setSelectedImage, updateImage }) {
  const [showCrop, setShowCrop] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (selectedImage?.url) {
      const img = new Image();
      img.src = selectedImage.url;
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });

        // ✅ Save these in the selected image for later reuse
        if (!selectedImage.originalWidth || !selectedImage.originalHeight) {
          const updated = {
            ...selectedImage,
            originalWidth: img.width,
            originalHeight: img.height,
          };
          setSelectedImage(updated);
          updateImage?.(updated);
        }
      };
    }
  }, [selectedImage?.url]);

  if (!selectedImage) return null;

  // ✅ Prefer dynamically measured dimensions
  const width =
    selectedImage.width ||
    selectedImage.originalWidth ||
    dimensions.width ||
    0;
  const height =
    selectedImage.height ||
    selectedImage.originalHeight ||
    dimensions.height ||
    0;

  const displayUrl = showOriginal
    ? selectedImage.originalUrl || selectedImage.url
    : selectedImage.url;

  return (
    <div className="relative w-full md:w-[70%] h-[500px] bg-gray-100 rounded-xl overflow-hidden flex flex-col">
      {/* Toolbar Icons */}
      <div className="absolute top-2 right-2 flex gap-2 z-20">
        <button
          title="Crop"
          onClick={() => setShowCrop(true)}
          className="bg-black/50 p-2 rounded-md text-white hover:bg-black/70"
        >
          <FiCrop size={18} />
        </button>
        <button
          title="Toggle Original / Edited"
          onClick={() => setShowOriginal((prev) => !prev)}
          className="bg-black/50 p-2 rounded-md text-white hover:bg-black/70"
        >
          <FiEye size={18} />
        </button>
      </div>

      {/* Crop Tool */}
      {showCrop ? (
        <CropTool
          selectedImage={selectedImage}
          onCropComplete={(updated) => {
            setSelectedImage(updated);
            updateImage?.(updated);
            setShowCrop(false);
          }}
          onCancel={() => setShowCrop(false)}
        />
      ) : (
        <img
          src={displayUrl}
          alt={selectedImage.name}
          className="w-full h-full object-contain"
        />
      )}

      {/* ✅ Show real dimensions */}
      {width && height && (
        <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded-md">
          {`${width} × ${height}`}
        </div>
      )}
    </div>
  );
}
