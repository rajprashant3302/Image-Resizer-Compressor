import ResizeBySize from "./ResizeBySize";
import ResizeByPercentage from "./ResizeByPercentage";
import ResizeBySocial from "./ResizeBySocial";

export default function ResizeSection({ selectedImage, resizeMode, updateImage, serverUrl }) {
  if (!selectedImage) return null;

  return (
    <div>
      {resizeMode === "size" && (
        <ResizeBySize selectedImage={selectedImage} updateImage={updateImage} serverUrl={serverUrl} />
      )}
      {resizeMode === "percent" && (
        <ResizeByPercentage selectedImage={selectedImage} updateImage={updateImage} serverUrl={serverUrl} />
      )}
      {resizeMode === "social" && (
        <ResizeBySocial selectedImage={selectedImage} updateImage={updateImage} serverUrl={serverUrl} />
      )}
    </div>
  );
}
