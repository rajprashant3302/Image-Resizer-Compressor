import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Create a ZIP file from an array of image objects
 * @param {Array} images - Array of { name, url } or { name, compressedUrl, url }
 * @returns {Promise<Blob>} - ZIP blob
 */
export async function zipImages(images) {
  const zip = new JSZip();

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const url = img.compressedUrl || img.url;

    if (!url) continue;

    const response = await fetch(url);
    const blob = await response.blob();
    zip.file(img.name || `image-${i + 1}.jpg`, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  return content;
}

/**
 * Create a ZIP from images and trigger download
 * @param {Array} images - Array of image objects
 * @param {String} fileName - Output ZIP name
 */
export async function zipAndDownload(images, fileName = "images.zip") {
  const zipBlob = await zipImages(images);
  saveAs(zipBlob, fileName);
}
