require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// YouTube Download Route
app.post("/api/download", (req, res) => {
    const { youtubeUrl } = req.body;
    if (!youtubeUrl) {
        return res.status(400).json({ error: "No YouTube URL provided" });
    }
    const outputDir = path.join(__dirname, process.env.DOWNLOAD_DIR);

    execFile(
        process.env.PYTHON_PATH,
        [process.env.YT_SCRIPT, youtubeUrl, outputDir],
        (error, stdout, stderr) => {
            if (error || (stderr && stderr.includes("ERROR:"))) {
                return res
                    .status(500)
                    .json({ error: "Download failed: " + (stderr || error.message) });
            }
            // Always use the last line (absolute path from Python script)
            const filePath = stdout.trim().split('\n').pop();
            const filename = path.basename(filePath);

            fs.stat(filePath, (statErr, stats) => {
                if (statErr || !stats.isFile() || path.extname(filePath) !== ".mp4") {
                    return res.status(500).json({ error: "File not found or not a video" });
                }
                res.setHeader("Content-Type", "video/mp4");
                res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
                res.sendFile(path.resolve(filePath), (err) => {
                    if (err) {
                        console.error("Failed to send file:", err);
                    }
                    // Optionally clean up: fs.unlink(filePath, () => {});
                });
            });
        }
    );
});

// PDF to Word Conversion Route
app.post("/api/pdf-to-word", upload.single("pdfFile"), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");

    const inputPdf = req.file.path;
    const outputDocx = inputPdf + ".docx";

    execFile(
        process.env.PYTHON_PATH,
        [process.env.PDF_SCRIPT, inputPdf, outputDocx],
        (error, stdout, stderr) => {
            if (error || (stderr && stderr.includes("ERROR:"))) {
                return res.status(500).send("Conversion error");
            }
            // Use last line of Python output (absolute .docx path)
            const docxPath = stdout.trim().split('\n').pop();

            fs.stat(docxPath, (statErr, stats) => {
                if (statErr || !stats.isFile()) {
                    return res.status(500).send("Converted file not found");
                }
                res.setHeader("Content-Disposition", 'attachment; filename="converted.docx"');
                res.sendFile(path.resolve(docxPath), (err) => {
                    fs.unlink(inputPdf, () => {});
                    fs.unlink(docxPath, () => {});
                });
            });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
