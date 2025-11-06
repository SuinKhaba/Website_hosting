require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Make sure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log("Created uploads directory:", uploadsDir);
}

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// PDF to Word Conversion Route with the corrected Python script path
app.post("/api/pdf-to-word", upload.single("pdfFile"), (req, res) => {
    console.log("PDF-to-Word conversion attempted at:", new Date().toISOString());

    if (!req.file) {
        console.log("No file uploaded!");
        return res.status(400).send("No file uploaded");
    }
    console.log("Received file:", req.file);

    const inputPdf = req.file.path;
    const outputDocx = inputPdf + ".docx";

    // The fix: script is referenced as Backend/convert.py
    execFile(
        process.env.PYTHON_PATH,
        ["Backend/" + process.env.PDF_SCRIPT, inputPdf, outputDocx],
        (error, stdout, stderr) => {
            console.log("execFile finished:", { error, stdout, stderr });
            if (error || (stderr && stderr.includes("ERROR:"))) {
                console.error("Conversion error:", error, stderr);
                return res.status(500).send("Conversion error: " + stderr + (error ? error.message : ""));
            }
            const docxPath = stdout.trim().split('\n').pop();
            console.log("docxPath resolved:", docxPath);
            fs.stat(docxPath, (statErr, stats) => {
                if (statErr || !stats.isFile()) {
                    console.error("Converted file not found or not a file:", docxPath, statErr);
                    return res.status(500).send("Converted file not found");
                }
                res.setHeader("Content-Disposition", 'attachment; filename="converted.docx"');
                res.sendFile(path.resolve(docxPath), (err) => {
                    if (err) console.error("Error sending file:", err);
                    fs.unlink(inputPdf, () => {});
                    fs.unlink(docxPath, () => {});
                });
            });
        }
    );
});

// Example YouTube downloader route (dummy response for testing)
app.post("/api/download", (req, res) => {
    const { youtubeUrl } = req.body;
    if (!youtubeUrl) {
        return res.status(400).json({ error: "No YouTube URL provided" });
    }
    console.log("YouTube download attempted for:", youtubeUrl);
    res.json({ status: "Received", youtubeUrl });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
