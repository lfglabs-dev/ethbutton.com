import React, { CSSProperties } from "react";

const VideoBackground = () => {
  return (
    <div style={containerStyle}>
      <video autoPlay muted loop style={videoStyle}>
        <source src="/background/output.webm" type="video/webm" />
        Your browser does not support HTML5 video.
      </video>
      <div style={overlayStyle} />
    </div>
  );
};

const videoStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const containerStyle: CSSProperties = {
  position: "fixed",
  right: "0",
  bottom: "0",
  minWidth: "100%",
  minHeight: "100%",
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
  zIndex: "1",
};

export default VideoBackground;
