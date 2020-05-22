import React, { Component } from 'react';
//import logo from './logo.svg';
import Header from '../main/Header';
import {API_ROOT_URL} from '../../constants';
import './UsersPage.css';

class SingleUser extends Component {
    render() {
        var user = this.props.user;
        var user_id = user['user_id'];
        var username = user['username'];
        return (
        <div>
        <a href={"/users/"+user_id}> User {'#'+user_id}'s page- {username}</a>
        <br />
        </div>
        );
    }
}

function users_index(users_list) {
    var result = [];
    for (var i = 0; i < users_list.length; i++) {
        result.push(<SingleUser user={users_list[i]}/>);
    }
    return result;
}
class UsersPage extends Component {
    state = {users: null};

   /** componentDidMount() {
    // Runs after the first render() lifecycle
    var path = API_ROOT_URL + "/users";
    fetch(path)
    .then(response => response.json())
    .then(data => this.setState({ users: data }));
    }*/

    
    componentDidMount() {
    // Runs after the first render() lifecycle
    var path = API_ROOT_URL + "/users";
    
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
            this.setState({ users: data });
    })   
    .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });  
    }
    

  render() {
    var users_list = this.state.users;
    if (!users_list) {
        return (<div>Waiting for users list to load...</div>);
    }
    return (
      <div className="App">
        <Header title="Users Page" />
        Here are all the users: <br/> 
        {users_index(users_list)}
      </div>
    );
  }
}

export default UsersPage;