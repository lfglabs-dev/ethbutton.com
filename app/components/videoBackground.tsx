import React, { CSSProperties } from "react";

const VideoBackground = () => {
  return (
    <div style={containerStyle}>
      <video autoPlay muted loop playsInline style={videoStyle}>
        <source src="/background/output.webm" type="video/webm" />
      </video>
      <div style={overlayStyle} />
    </div>
  );
};

const videoStyle: CSSProperties = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const containerStyle: CSSProperties = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  zIndex: "0",
  overflow: "hidden",
};

const overlayStyle: CSSProperties = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  background: "rgba(17, 24, 39, 0.80)",
  boxShadow: "0px 2.488px 30.481px 0px rgba(0, 7, 72, 0.08)",
  backdropFilter: "blur(7.77584171295166px)",
  WebkitBackdropFilter: "blur(7.77584171295166px)",
  zIndex: "1",
};

export default VideoBackground;
