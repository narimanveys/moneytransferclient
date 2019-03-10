import React from 'react';
//import logo from './logo.svg';
import {Link, Redirect} from 'react-router-dom';
import './App.css';
import {postData} from './Utils.js'
import {$resource} from './constants'

class Authenticate extends React.Component {

    constructor() {
        super()
        this.state = {
            fullName: "",
            email: "",
            password: "",
            passwordConfirm: "",
            formErrors: {email: '', password: ''},
            emailValid: false,
            passwordValid: false,
            formValid: false,
            redirect: false,
            errorMessage : ""
        }
        this.handleType = this.handleType.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        let url = window.location.href;

        this.defaultAuthType = 'In'

        this.authMode = ( url.indexOf('?sign=') !== -1 ?  url.substring(url.indexOf('=') + 1, url.length) : this.defaultAuthType)
        this.authorizeEndpoints = {
            'In' : $resource.userAuthenticate(),
            'Up' : $resource.userRegister()
        }
        if(Object.keys(this.authorizeEndpoints).indexOf(this.authMode) === -1) this.authMode = this.defaultAuthType

    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
    
        switch(fieldName) {
        case 'email':
            emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            fieldValidationErrors.email = emailValid ? '' : ' is invalid';
            break;
        case 'password':
            passwordValid = value.length >= 1;
            fieldValidationErrors.password = passwordValid ? '': ' is too short';
            break;
        default:
            break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        emailValid: emailValid,
                        passwordValid: passwordValid
                    }, this.validateForm);
    }
  
    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    }


  handleType(event) {
    const {name, value} = event.target
    this.setState({
        [name]: value
    },
    () => {
        this.validateField(name, value)
    })
  }

  successHandler(data) {
    localStorage.removeItem('mts_accountData')
    localStorage.setItem('mts_accountData', JSON.stringify(data))
    this.setRedirect()
  }

  userAuthorize() {

    let formData = {
        "email" : this.state.email,
        "password" : this.state.password
    };
    if(this.authMode === 'Up'){
        formData.fullName = this.state.fullName
        formData.passwordConfirm = this.state.passwordConfirm
    }
    
    return postData(this.authorizeEndpoints[this.authMode], formData)
      .then(response => response.json())
      .then(data => {
        if(data.message) {
            this.setState({
                errorMessage: data.message
            })
            return Promise.reject();
        }
        return data
      })
  }

  confirmPasswordValidate() {
    return this.state.password === this.state.passwordConfirm
  }

  handleSubmit(event) {
    //console.log(this.state.email + " - " + this.state.password)
    event.preventDefault();

    this.setState({
        errorMessage: ""
    })

    if(this.authMode === 'Up' && !this.confirmPasswordValidate()) {
        alert("Password confirmed doesn't match to originally typed value")
        return;
    }
    this.userAuthorize().then(data => {
        if(this.authMode === 'Up'){
            this.authMode = 'In'
            this.userAuthorize().then(data => this.successHandler(data))
        } else if(this.authMode === 'In') {
            this.successHandler(data)
        }
        
    })

    
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/transd' />
    }
  }

  renderConfirmPassword() {
    if( this.authMode === 'Up' )
        return (
            <div className="form-group">
                <input
                    type="password"
                    value={this.state.passwordConfirm}
                    name="passwordConfirm"
                    placeholder="Confirm Password"
                    onChange={this.handleType}
                    className="form-control"
                />
            </div>
        )
  }

  renderFullName() {
    if( this.authMode === 'Up' )
        return (
            <div className="form-group">
                <input
                    type="text"
                    value={this.state.fullName}
                    name="fullName"
                    placeholder="Full Name"
                    onChange={this.handleType}
                    className="form-control"
                />
            </div>
        )
  }


  render() {

    return (
      <div>

        <Header />
        <div className="container">
            <form onSubmit={this.handleSubmit} className="demoForm form-signin">

                {this.renderFullName()}

                <div className="form-group">
                    <input
                        type="email"
                        value={this.state.email}
                        name="email"
                        placeholder="E-Mail"
                        onChange={this.handleType}
                        className="form-control"
                    />
                </div>
                
                <div className="form-group">
                    <input
                        type="password"
                        value={this.state.password}
                        name="password"
                        placeholder="Password"
                        onChange={this.handleType}
                        className="form-control"
                    />
                </div>

                {this.renderConfirmPassword()}


                <button  className="btn btn-primary" disabled={!this.state.formValid}>Sign {this.authMode}</button>
                <div className="error-msg">{this.state.errorMessage}</div>
            </form>
            {this.renderRedirect()}
        </div>
      </div>
    )
  }
}

class Header extends React.Component {
  render() {
      return (
        <div>
            <Link to="/">
                Home
            </Link>
        </div>
      )
  }
}

export default Authenticate;
