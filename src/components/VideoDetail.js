import React from 'react';

const VideoDetail = ({ video }) => {
  if (!video) {
    return <div>Loading...</div>;
  }

  const videoSrc = `https://www.youtube.com/embed/${video.id.videoId}?playlist=${video.id.videoId}&autoplay=1&rel=0`;

  return (
    <div>
      <div className="ui embed">
        <iframe title="video player" src={videoSrc} allowfullscreen="0" />
      </div>
      <div className="ui segment">
        <h4 className="ui header">{video.snippet.title}</h4>
        <p>{video.snippet.description}</p>

      </div>
    </div>
  );
};

export default VideoDetail;
