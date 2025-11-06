import React, { useState } from "react";

function YouTubeDownloader() {
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [downloadLink, setDownloadLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDownload = async () => {
        setLoading(true);
        setError("");
        setDownloadLink("");
        try {
            const response = await fetch("http://localhost:5000/api/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ youtubeUrl }),
            });

            if (!response.ok) {
                let errorMsg = "Download failed";
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch { }
                throw new Error(errorMsg);
            }

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
                YouTube Video Downloader
            </h2>
            <input
                type="text"
                placeholder="Paste YouTube video URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                style={{
                    width: "93%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "rgba(30,33,42,0.92)",
                    color: "#f4f4f4",
                    fontSize: 16,
                    marginBottom: 16,
                    outline: "none",
                    boxShadow: "0 1px 8px #181a1e40",
                }}
            />
            <button
                onClick={handleDownload}
                disabled={loading || !youtubeUrl}
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
                {loading ? "Processing..." : "Download"}
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
                        download="video.mp4"
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
                        onClick={() => setTimeout(() => window.URL.revokeObjectURL(downloadLink), 1000)}
                    >
                        Download Your Video
                    </a>
                </div>
            )}
        </div>
    );
}

export default YouTubeDownloader;
