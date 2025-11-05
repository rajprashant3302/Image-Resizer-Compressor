import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/imageUtils";
import { FiCheck, FiX } from "react-icons/fi";

export default function CropTool({ selectedImage, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const applyCrop = async () => {
    if (!selectedImage || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(selectedImage.url, croppedAreaPixels);
    const croppedUrl = URL.createObjectURL(croppedBlob);

    const updatedImage = {
      ...selectedImage,
      url: croppedUrl,
      file: new File([croppedBlob], selectedImage.name, { type: "image/jpeg" }),
      width: croppedAreaPixels.width,
      height: croppedAreaPixels.height,
    };

    onCropComplete(updatedImage);
  };

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-xl overflow-hidden">
      <Cropper
        image={selectedImage.url}
        crop={crop}
        zoom={zoom}
        aspect={selectedImage.width && selectedImage.height ? selectedImage.width / selectedImage.height : 1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        cropShape="rect"
        showGrid={true}
      />

      {/* Zoom Slider */}
      <div className="absolute bottom-16 left-4 right-4 bg-black/40 p-3 rounded-lg flex flex-col items-center gap-3">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-3/4 accent-green-400"
        />
      </div>

      {/* Buttons */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={applyCrop}
          className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 flex items-center gap-1"
        >
          <FiCheck /> Apply
        </button>
        <button
          onClick={onCancel}
          className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 flex items-center gap-1"
        >
          <FiX /> Cancel
        </button>
      </div>
    </div>
  );
}
