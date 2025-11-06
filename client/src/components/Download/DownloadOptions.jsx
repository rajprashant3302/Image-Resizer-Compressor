import { useState } from "react";

export default function DownloadOptions({ selectedImage, editedImages, images, serverUrl }) {
  const [downloading, setDownloading] = useState(false);

  // 🖼️ Download single image (edited if available)
  const handleDownloadSingle = async () => {
    if (!selectedImage) return alert("Please select an image first.");

    // Prefer processed image if it exists
    const modifiedFile =
      editedImages?.[selectedImage.name]?.serverFilename ||
      selectedImage.serverFilename ||
      selectedImage.filename;

    if (!modifiedFile) return alert("No file available to download.");

    try {
      setDownloading(true);
      const response = await fetch(`${serverUrl}/download?files=${modifiedFile}`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedImage.name || modifiedFile;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Single download error:", err);
      alert("Failed to download image");
    } finally {
      setDownloading(false);
    }
  };

  // 📦 Download all images (each one either edited or original)
  const handleDownloadAll = async () => {
    const allFiles = images
      ?.map((img) => {
        const edited = editedImages?.[img.name]?.serverFilename;
        return edited || img.serverFilename || img.filename;
      })
      .filter(Boolean);

    if (!allFiles || allFiles.length === 0)
      return alert("No images available to download.");

    try {
      setDownloading(true);
      const response = await fetch(`${serverUrl}/download?files=${allFiles.join(",")}`);
      if (!response.ok) throw new Error("ZIP download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `images-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP download error:", err);
      alert("Failed to download ZIP");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      <h3 className="font-semibold text-gray-700">Download Options</h3>

      <button
        onClick={handleDownloadSingle}
        disabled={downloading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
      >
        {downloading ? "Downloading..." : "Download Selected Image"}
      </button>

      <button
        onClick={handleDownloadAll}
        disabled={downloading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-60"
      >
        {downloading ? "Preparing ZIP..." : "Download All as ZIP"}
      </button>
    </div>
  );
}
