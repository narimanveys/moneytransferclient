import React, { Component } from 'react';
//import logo from './logo.svg';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';


class WelcomePage extends React.Component {


  render() {
    
    return (
        <Router>
            <Route path="/">
                <Header />
            </Route>
            <Route path="/about" component={About} />
            
        </Router>
    )
  }
}

class Header extends React.Component {
  render() {
      return (
          <header>
              <h1>Welcome to Money Transfer System</h1>
              <Link to="/login">
                Login
              </Link>
          </header>
      )
  }
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

export default WelcomePage;
