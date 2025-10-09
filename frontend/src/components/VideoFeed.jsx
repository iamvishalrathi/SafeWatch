import { useVideoFeed } from "../hooks/useApi";

const VideoFeed = () => {
  const videoFeedUrl = useVideoFeed();
  
  return (
    <>
      <img
        src={videoFeedUrl}
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
