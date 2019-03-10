import React from 'react';
//import logo from './logo.svg';
import {BrowserRouter, Link, Route} from 'react-router-dom';
import Authenticate from './Authenticate.js';
import TransactionsDashboard from './Transactions'

function Basic() {
    return (
        <BrowserRouter>
            <div>
                <Route exact path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/login" component={Authenticate} />
                <Route path="/transd" component={TransactionsDashboard} />
            </div>
            
        </BrowserRouter>
    )
}

function Home() {
    return (
        <div>
            {/* <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="/">Money Transfer System</a>
                    </div>
                
                    <div class="collapse navbar-collapse" id="myNavbar">
                        <ul class="nav navbar-nav navbar-right">
                            <li><a href="#"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
                            <li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
                        </ul>
                    </div>
                </div>
                
            </nav> */}
            <h1>Welcome to Money Transfer System</h1>
            <hr>
            </hr>
            <ul>
                <li>
                    <Link to="/about">
                        About
                    </Link>
                </li>
                <li>
                    <Link to="/login?sign=In">
                        Sign In
                    </Link>
                </li>
                <li>
                    <Link to="/login?sign=Up">
                        Sign Up
                    </Link>
                </li>
            </ul>
        </div>
    )

}

function About() {
    return (
      <div>
        <Link to="/">
            Home
        </Link>
        <h2>About</h2>
      </div>
    );
  }

export default Basic;
