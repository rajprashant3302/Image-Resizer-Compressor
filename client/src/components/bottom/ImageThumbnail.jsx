import React from "react";
import { FiX } from "react-icons/fi";

export default function ImageThumbnail({ image, isSelected, onSelect, onDelete }) {
  return (
    <div
      className={`relative w-24 h-24 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 ${
        isSelected ? "border-blue-500 ring-2 ring-blue-400" : "border-gray-200"
      }`}
      onClick={() => onSelect(image)}
    >
      <img
        src={image.url}
        alt={image.name}
        className="w-full h-full object-cover"
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(image.name); // pass name for frontend-only delete
        }}
        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
      >
        <FiX size={14} />
      </button>
    </div>
  );
}
