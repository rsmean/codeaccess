import React, {Component} from 'react';

class VideoSearch extends Component {

     constructor (props) {
          super(props);
          this.state = {
               term : ""
          };
     }

     render() {
          return (
               <div className = "search-bar">
               <input onChange = {(event) => this.onInputChange(event.target.value)}/>
               </div>
          )
     }

     onInputChange (item) {
          this.setState({term : item});
          this.props.onSearchVideo(item);
          console.log(this.state.term);
     }
}

export default VideoSearch;
