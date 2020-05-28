import React, { Component } from 'react';
import Header from '../main/Header';
import {API_ROOT_URL} from '../../constants';
import SnapshotTopic from './SnapshotTopic';
import './SnapshotPage.css';


const TOPICS_ORDER = {'pose':0, 'feelings':1, 'color_image':2, 'depth_image':3};
class SnapshotPage extends Component {
    /**topics- list of all the names of the topics.
    topics_data- a dictionary, key=name of topic, value=its data.
    */
    state = {topics: [], topics_data: {}};
    user_id = this.props.match.params.user_id;
    timestamp = this.props.match.params.timestamp;

    componentDidMount() {
    // Runs after the first render() lifecycle
    var path = API_ROOT_URL + "/users/" + this.user_id + "/snapshots/" + this.timestamp;

    fetch(path)
    .then(async response => {
            const data = await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            console.log("our path: "+path);
            this.setState({ topics: data });
    })   
    .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.log(error.toString());
            //console.error('There was an error!', error);
        });  


    }

    render() {
    //var not_loaded = (<div>Waiting for snapshot's data to load...</div>);
    var topics = this.state.topics;
    topics.sort((u1, u2) => TOPICS_ORDER[u1]-TOPICS_ORDER[u2]);
    if(!topics) { return (<div>Waiting for snapshot's data to load...</div>); }

    var result = [];
    var date = new Date(this.timestamp*1000);
    result.push(
      <div className="App">
        <Header title={"Snapshot by User #"+this.user_id} />
        <b class="snap_time">TIME OF SNAPSHOT: {date.toString()}</b> <br/>
        <a href={"/users/"+this.user_id}>Go back to user's page</a> <br/>
      </div>
    );

    var data; 
    var topic;
    for (var i = 0; i < topics.length; i++) {
        topic = topics[i];
        /*get_topic(this.user_id, this.timestamp, topic, this.state.topics_data);
        data = this.state.topics_data[topic];
        if(!data) {
            return (<div>Waiting for {topic} to load...</div>);
        }
        result.push(<div>{String(data)}</div>);*/
        console.log("SnapshotPage/render: index- "+i+", about to look at the topic- "+topic)
        result.push(<SnapshotTopic user_id={this.user_id} timestamp={this.timestamp} topic={topic} />);
    }

    return (result);
    }

}

export default SnapshotPage;