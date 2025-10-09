import React, { useState, useRef, useEffect } from "react";
const VideoFeed = () => {
  return (
    <>
      {" "}
      <img
        src="http://localhost:5000/video_feed"
        alt="Live Video Feed"
        style={{
          width: "664px",
          height: "450px",
          borderRadius: "8px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
        }}
      />
    </>
  );
};

export default VideoFeed;
