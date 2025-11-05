import { useState } from "react";
import ResizeBySize from "./ResizeBySize";
import ResizeByPercentage from "./ResizeByPercentage";
import ResizeBySocial from "./ResizeBySocial";

export default function ResizeSection({ selectedImage, resizeMode, updateImage }) {
  if (!selectedImage) return null;

  return (
    <div>
      {resizeMode === "size" && (
        <ResizeBySize selectedImage={selectedImage} updateImage={updateImage} />
      )}
      {resizeMode === "percent" && (
        <ResizeByPercentage selectedImage={selectedImage} updateImage={updateImage} />
      )}
      {resizeMode === "social" && (
        <ResizeBySocial selectedImage={selectedImage} updateImage={updateImage} />
      )}
    </div>
  );
}
