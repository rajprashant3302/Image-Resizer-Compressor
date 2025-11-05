
import React from "react";
import ImageThumbnail from "./ImageThumbnail";

export default function ThumbnailBar({ images, selectedImage, setSelectedImage, removeImage }) {
  return (
    <div className="flex gap-3 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      {images.map((img) => (
        <ImageThumbnail
          key={img.name}
          image={img}
          isSelected={selectedImage?.name === img.name}
          onSelect={setSelectedImage}
          onDelete={removeImage}
        />
      ))}
    </div>
  );
}
