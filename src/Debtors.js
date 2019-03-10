import React, { Component } from 'react';
import {postData} from './Utils.js'

//import logo from './logo.svg';
//import {BrowserRouter as Router, Link, Route} from 'react-router-dom';


class Debtors extends React.Component {

  constructor() {
    super()
    this.state = {
      isLoggedIn : false,
      debtors : [],
      loading : false,
      debtorId : -1,
      amount: 0,
      creditorId: 2
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    
  }

  validation() {
    return (parseInt(this.state.amount) > 0 || parseFloat(this.state.amount) > 0) && parseInt(this.state.debtorId) !== -1
  }

  handleClick() {
    if(!this.validation()) return;
    postData("https://localhost:44371/api/Transaction/add", {"amount": this.state.amount, "creditorId": this.state.creditorId, "debtorId": this.state.debtorId})
    .then(data => {
        
        console.log(data);
    })
  }

  handleChange(event) {
    const {name, value, type, checked} = event.target;
    const intentStateMapper = {};
    intentStateMapper[event.target.dataset.intent] = event.target.value
    this.setState(intentStateMapper)
    console.log(event.target.dataset.intent)
  }

  componentDidMount() {
    this.setState({loading : true})
    fetch("https://localhost:44371/api/Account/getall/2")
      .then(response => response.json())
      .then(data => {
        this.setState({
            debtors: data,
        })
      })
  }

  render() {
    let buttonText = this.state.isLoggedIn ? "Log Out" : "Log In"
    const debtorsInfo = this.state.debtors.map((account, index) => 
      <option key={index} value={account['user']['id']}>{account['user']['fullName']}</option>
    )
    return (
        <div>
            <select
                value={this.state.debtorId}
                onChange={this.handleChange}
                data-intent="debtorId"
            >
                <option value={-1}></option>

                {debtorsInfo}
            </select>
            <input 
                type="text"
                placeholder="Money Amount"
                value={this.state.amount}
                onChange={this.handleChange}
                data-intent="amount"
            >
            </input>
            <br>
            </br>
            <span>{this.state.debtorId}</span>
            <br>
            </br>
            <span>{this.state.amount}</span>
            <br>
            </br>
            <button onClick={this.handleClick}>Transfer</button>
        </div>
    )
  }
}


export default Debtors;
