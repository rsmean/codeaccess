
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import YTSearch from 'youtube-api-search';
import _ from 'lodash';
import VideoSearch from './components/video_search_box';
import VideoList from './components/video_list';
import VideoDetail from './components/video_detail';

const API_KEY = 'AIzaSyDiHlcnA4G4U6PXsuYySzgpupaVYOG2PqM';

class App extends Component {

     constructor (props) {
          super(props);
          this.state = {
               selectedItem : null,
               videos : []
          };
          this.searchVideo('maroon5');
     }

     searchVideo (term) {
          YTSearch( { key : API_KEY, term : term }, (videos) => {
               this.setState({
                    videos : videos,
                    selectedItem : videos[0]
               });
          });
     }

     render() {
          const videoDebounce = _.debounce((term)=> {
               this.searchVideo(term)
          }, 500 );

          return (
               <div>

                    <VideoSearch onSearchVideo = {videoDebounce}/>
                    <VideoDetail video = {this.state.selectedItem}/>
                    <VideoList onVideoSelect = {selectedItem=> this.setState({selectedItem})} videos = {this.state.videos}/>
               </div>
          )
     }

}

ReactDOM.render(<App />, document.querySelector('.container'));
