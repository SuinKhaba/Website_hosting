import React, { useState } from 'react';
import YouTubeDownloader from './YouTubeDownloader';
import PDFToWordConverter from './PDFToWordConverter';

const NAV_HEIGHT = 70;
const SIDEBAR_WIDTH = 260;

const NAV_OPTIONS = [
  { id: 'youtube', label: 'YouTube Video Downloader' },
  { id: 'pdf', label: 'PDF to Word Converter' }
];

function App() {
  const [page, setPage] = useState('youtube');
  const [menuOpen, setMenuOpen] = useState(false);

  function renderPage() {
    if (page === 'youtube') return <YouTubeDownloader />;
    if (page === 'pdf') return <PDFToWordConverter />;
    return <div style={{ color: "#fff" }}>Page not found.</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #101419 0%, #191c24 48%, #23262d 100%)",
        position: "relative",
        fontFamily: "Poppins, Arial, sans-serif"
      }}
    >
      {/* NavBar */}
      <div style={{
        width: "100vw",
        height: NAV_HEIGHT,
        background: "linear-gradient(90deg, rgba(17,18,24, 0.97) 60%, rgba(35,38,54, .95) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 34px",
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1002,
        backdropFilter: "blur(16px)",
        borderBottom: "1.5px solid rgba(80,100,120,0.15)",
        boxShadow: "0 2px 18px 0 #181b2050"
      }}>
        <span style={{
          color: "#e8eaed",
          fontFamily: "'Irish Grover', cursive",
          fontSize: 32,
          fontWeight: "bold",
          letterSpacing: "1.2px",
          textShadow: "0 1px 10px #10161b35"
        }}>
          Your Buddy
        </span>
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            cursor: "pointer",
            padding: 0,
            zIndex: 1010
          }}
        >
          <div style={{
            width: 38, height: 38, display: "flex", flexDirection: "column", justifyContent: "center"
          }}>
            <div style={{
              height: 5, width: '100%', background: "#fff", borderRadius: 3, marginBottom: 7
            }} />
            <div style={{
              height: 5, width: '100%', background: "#fff", borderRadius: 3, marginBottom: 7
            }} />
            <div style={{
              height: 5, width: '100%', background: "#fff", borderRadius: 3
            }} />
          </div>
        </button>
      </div>
      {/* Sidebar Menu */}
      <div style={{
        position: "fixed",
        top: NAV_HEIGHT,
        right: 0,
        width: SIDEBAR_WIDTH,
        background: "linear-gradient(120deg, rgba(35,38,45,1) 80%, rgba(19,18,24,0.92) 100%)",
        boxShadow: "-4px 4px 32px #14151a33",
        zIndex: 1005,
        transform: menuOpen ? "translateX(0)" : "translateX(110%)",
        transition: "transform 0.25s cubic-bezier(.57,-0.43,.54,1.42)",
        display: "flex",
        flexDirection: "column",
        borderRadius: "0 0 0 18px",
        backdropFilter: "blur(13px)",
        borderLeft: "1.5px solid #22242833"
      }}>
        {NAV_OPTIONS.map(opt => (
          <a
            key={opt.id}
            href="#"
            onClick={() => { setPage(opt.id); setMenuOpen(false); }}
            style={{
              color: "#f1f1f4",
              textDecoration: "none",
              padding: "18px 36px",
              fontSize: 17,
              fontWeight: "bold",
              borderBottom: "1px solid #23262d",
              transition: "background 0.18s",
              cursor: "pointer",
              letterSpacing: "1px"
            }}>
            {opt.label}
          </a>
        ))}
      </div>
      {/* Main Card/Page */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: `calc(100vh - ${NAV_HEIGHT}px)`,
        justifyContent: "center"
      }}>
        <div style={{
          borderRadius: 33,
          background: "rgba(21,23,28,0.75)",
          boxShadow: "0 12px 48px 0 #10121875",
          padding: "44px 40px",
          maxWidth: 440,
          width: "100%",
          marginTop: "95px",
          backdropFilter: "blur(18px)",
          border: "2px solid rgba(90,145,255,0.11)",
          transition: "box-shadow 0.3s"
        }}>
          {renderPage()}
        </div>
      </div>
      {/* Footer notice */}
      <footer style={{
        width: "100vw",
        position: "fixed",
        bottom: 0,
        left: 0,
        textAlign: "center",
        padding: "18px 0 12px 0",
        color: "#e5e7f0",
        fontWeight: "bold",
        letterSpacing: "1.1px",
        fontSize: "1rem",
        background: "none",
        textShadow: "0px 1.5px 7px #191c2465"
      }}>
        This website is only for educational purposes.
      </footer>
    </div>
  );
}

export default App;
