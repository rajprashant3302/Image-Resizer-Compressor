// import express from "express";
// import multer from "multer";
// import sharp from "sharp";
// import fs from "fs-extra";
// import path from "path";
// import archiver from "archiver";
// import cors from "cors";
// import dotenv from "dotenv";
// import { v2 as cloudinary } from "cloudinary";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Local temp dir (used before upload)
// const TEMP_DIR = path.join(process.cwd(), "temp");
// fs.ensureDirSync(TEMP_DIR);

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, TEMP_DIR),
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // ---------- UPLOAD ----------
// app.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "image-tool/uploads",
//     });

//     // Clean up temp file
//     await fs.remove(req.file.path);

//     res.json({
//       original: result.secure_url,
//       filename: result.public_id,
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "Upload failed", details: err.message });
//   }
// });

// // ---------- RESIZE ----------
// app.post("/resize", async (req, res) => {
//   try {
//     const { filename, width, height } = req.body;
//     if (!filename || !width || !height)
//       return res
//         .status(400)
//         .json({ error: "Filename, width, and height required" });

//     const resizedUrl = cloudinary.url(filename, {
//       transformation: [
//         { width: Number(width), height: Number(height), crop: "scale" },
//       ],
//     });

//     res.json({ processed: resizedUrl, filename });
//   } catch (err) {
//     console.error("Resize failed:", err);
//     res.status(500).json({ error: "Resize failed", details: err.message });
//   }
// });

// // ---------- COMPRESS ----------
// app.post("/compress", async (req, res) => {
//   try {
//     const { filename, quality = 80 } = req.body;
//     if (!filename) return res.status(400).json({ error: "Filename required" });

//     const compressedUrl = cloudinary.url(filename, {
//       quality: Number(quality),
//       fetch_format: "auto",
//     });

//     res.json({
//       processed: compressedUrl,
//       filename,
//       usedQuality: quality,
//     });
//   } catch (err) {
//     console.error("Compression failed:", err);
//     res.status(500).json({ error: "Compression failed", details: err.message });
//   }
// });

// // ---------- DOWNLOAD ----------
// app.post("/download", async (req, res) => {
//   try {
//     const { files } = req.body;
//     if (!files || files.length === 0)
//       return res.status(400).json({ error: "No files provided" });

//     const fileList = Array.isArray(files) ? files : [files];

//     if (fileList.length === 1) {
//       const fileUrl = cloudinary.url(fileList[0]);
//       return res.json({ downloadUrl: fileUrl });
//     }

//     // If multiple, create ZIP
//     const zipName = `images-${Date.now()}.zip`;
//     const zipPath = path.join(TEMP_DIR, zipName);
//     const output = fs.createWriteStream(zipPath);
//     const archive = archiver("zip", { zlib: { level: 9 } });

//     archive.pipe(output);

//     for (const id of fileList) {
//       const fileUrl = cloudinary.url(id);
//       archive.append(await (await fetch(fileUrl)).arrayBuffer(), {
//         name: `${id}.jpg`,
//       });
//     }

//     await archive.finalize();

//     res.download(zipPath, zipName, async () => {
//       await fs.remove(zipPath);
//     });
//   } catch (err) {
//     console.error("Download error:", err);
//     res.status(500).json({ error: "Server error during download" });
//   }
// });

// // ---------- SERVER ----------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


import express from "express";
import multer from "multer";
import fs from "fs-extra";
import path from "path";
import archiver from "archiver";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Local temp dir (used before upload)
const TEMP_DIR = path.join(process.cwd(), "temp");
fs.ensureDirSync(TEMP_DIR);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TEMP_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ---------- UPLOAD ----------
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "image-tool/uploads",
    });

    await fs.remove(req.file.path);

    res.json({
      original: result.secure_url,
      filename: result.public_id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// ---------- RESIZE ----------
app.post("/resize", async (req, res) => {
  try {
    const { filename, width, height } = req.body;
    if (!filename || !width || !height)
      return res
        .status(400)
        .json({ error: "Filename, width, and height required" });

    const resizedUrl = cloudinary.url(filename, {
      transformation: [
        { width: Number(width), height: Number(height), crop: "scale" },
      ],
    });

    res.json({ processed: resizedUrl, filename });
  } catch (err) {
    console.error("Resize failed:", err);
    res.status(500).json({ error: "Resize failed", details: err.message });
  }
});

// ---------- COMPRESS ----------
app.post("/compress", async (req, res) => {
  try {
    const { filename, processed, quality = 80 } = req.body;
    if (!filename) return res.status(400).json({ error: "Filename required" });

    // Compress processed image if exists, else original
    const targetId = processed || filename;

    const compressedUrl = cloudinary.url(targetId, {
      quality: Number(quality),
      fetch_format: "auto",
    });

    res.json({
      processed: compressedUrl,
      filename: targetId,
      usedQuality: quality,
    });
  } catch (err) {
    console.error("Compression failed:", err);
    res.status(500).json({ error: "Compression failed", details: err.message });
  }
});

// ---------- DOWNLOAD ----------
app.post("/download", async (req, res) => {
  try {
    const { files } = req.body; // Expect array of { id, transformations }

    if (!files || files.length === 0)
      return res.status(400).json({ error: "No files provided" });

    const fileList = Array.isArray(files) ? files : [files];

    // Single file download
    if (fileList.length === 1) {
      const { id, transformations } = fileList[0];
      const fileUrl = cloudinary.url(id, transformations || {});
      const response = await axios.get(fileUrl, { responseType: "stream" });

      res.setHeader("Content-Disposition", `attachment; filename="${id}.jpg"`);
      return response.data.pipe(res);
    }

    // Multiple files → create ZIP
    const zipName = `images-${Date.now()}.zip`;
    const zipPath = path.join(TEMP_DIR, zipName);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(output);

    for (const file of fileList) {
      const { id, transformations } = file;
      const fileUrl = cloudinary.url(id, transformations || {});
      const response = await axios.get(fileUrl, { responseType: "stream" });
      archive.append(response.data, { name: `${id}.jpg` });
    }

    await archive.finalize();

    output.on("close", () => {
      res.download(zipPath, zipName, async () => {
        await fs.remove(zipPath); // cleanup temp ZIP
      });
    });

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Server error during download" });
  }
});

// ---------- SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
