import React from 'react';
import SearchBar from './SearchBar';
import youtube from '../apis/youtube';
import VideoList from './VideoList';
import VideoDetail from './VideoDetail';
import axios from 'axios';

class App extends React.Component {
  state = { videos: [], selectedVideo: null };

  componentDidMount() {
    this.onTermSubmit('winter mix 2018');
  }

  onTermSubmit = async term => {
    const response = await youtube.get('/search', {
      params: {
        q: term
      }
    });

    this.setState({
      videos: response.data.items,
      selectedVideo: response.data.items[0]
    });
    console.log(response.data.items)
  };

  onVideoSelect = video => {
    this.setState({ selectedVideo: video });
    // downLoadVideo(video.id.videoId)
  };

  downLoadVideo = async () => {
    if (this.state.selectedVideo !== null) {
      const { videoId } = this.state.selectedVideo.id
      const data = { url: `https://youtu.be/${videoId}` }
      const response = await axios.post('api/download', data)
    }


  }

  render() {
    return (
      <div className="ui container">
        <a href='/api/downloadTest' download>Click to download</a>
        <button onClick={this.downLoadVideo} className="ui button">Test Button</button>
        <SearchBar onFormSubmit={this.onTermSubmit} />
        <VideoDetail video={this.state.selectedVideo} />
        <div className="five wide column">
          <VideoList
            onVideoSelect={this.onVideoSelect}
            videos={this.state.videos}
          />
        </div>
      </div>
    );
  }
}

export default App;
