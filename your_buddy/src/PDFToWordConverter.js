import React, { useState } from "react";

function PDFToWordConverter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [error, setError] = useState("");

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setDownloadLink("");
    const formData = new FormData();
    formData.append("pdfFile", file);

    try {
      const response = await fetch("http://localhost:5000/api/pdf-to-word", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Conversion failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadLink(url);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{
        color: "#f2f3f7",
        marginBottom: 28,
        textAlign: "center",
        letterSpacing: "1px",
        fontWeight: 600,
        fontSize: "1.25rem"
      }}>
        PDF to Word Converter
      </h2>
      <input
        type="file"
        accept=".pdf"
        onChange={e => setFile(e.target.files[0])}
        style={{
          width: "95%",
          marginBottom: 18,
          color: "#f4f4f4",
          background: "rgba(30,33,42,0.97)",
          border: "none",
          borderRadius: 8,
          padding: 10,
          boxShadow: "0 1px 8px #181a1e30"
        }}
      />
      <button
        style={{
          width: "100%",
          padding: "12px 0",
          background: "linear-gradient(90deg, #23243a 40%, #191d29 100%)", // glass black gradient
          color: "#ededff",
          border: "none",
          borderRadius: 8,
          fontSize: 17,
          fontWeight: "bold",
          marginBottom: 12,
          boxShadow: "0 2px 18px #16162022",
          letterSpacing: "0.5px",
          transition: "background 0.2s",
        }}

        disabled={!file || loading}
        onClick={handleConvert}
      >
        {loading ? "Converting..." : "Convert PDF to Word"}
      </button>
      {error && (
        <div style={{ color: "#f45151", marginBottom: 8 }}>
          {error}
        </div>
      )}
      {downloadLink && (
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <a
            href={downloadLink}
            download="converted.docx"
            style={{
              width: "100%",
              padding: "12px 0",
              background: "linear-gradient(90deg, #23243a 40%, #191d29 100%)", // glass black gradient
              color: "#ededff",
              border: "none",
              borderRadius: 8,
              fontSize: 17,
              fontWeight: "bold",
              marginBottom: 12,
              boxShadow: "0 2px 18px #16162022",
              letterSpacing: "0.5px",
              transition: "background 0.2s",
              textDecoration: "none", // <--- removes underline
              display: "inline-block"
            }}
          >
            Download Word File
          </a>
        </div>
      )}
    </div>
  );
}

export default PDFToWordConverter;
