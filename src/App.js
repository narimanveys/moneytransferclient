import React, { Component } from 'react';
//import logo from './logo.svg';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import './App.css';

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      isLoggedIn : false,
      character : {},
      loading : false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState(prevState => {
      return {
        isLoggedIn: !prevState.isLoggedIn
      }
    })
  }

  componentDidMount() {
    this.setState({loading : true})
    fetch("https://swapi.co/api/people/1")
      .then(response => response.json())
      .then(data => {
        this.setState({
          character: data,
          loading : false
        })
      })
  }

  render() {
    let buttonText = this.state.isLoggedIn ? "Log Out" : "Log In"
    const characterInfo = Object.keys(this.state.character).map((key, index) => 
      <span key={index}><p>{key + " - " + this.state.character[key]}</p></span>
    )
    return (
        <div>
            <Header username={this.state.isLoggedIn ? "igoryamba" : "someone"}/>
            <button onClick={this.handleClick}>{buttonText}</button>
            <div>
              {this.state.loading ? "loading..." : characterInfo}
            </div>
        </div>
    )
  }
}

class Header extends React.Component {
  render() {
      return (
          <header>
              <p>Welcome, {this.props.username}</p>
          </header>
      )
  }
}

export default App;
