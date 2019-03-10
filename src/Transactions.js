import React from 'react';
import {postData, getDateInUSFormat, getDateInEUFullFormat, getTimeByDate} from './Utils.js'
import {$resource} from './constants'
import {Redirect} from 'react-router-dom';
import CurrencyInput from 'react-currency-input';





class TransactionsDashboard extends React.Component {

    constructor() {
        super()
        this.creditorAccount = JSON.parse( localStorage.getItem('mts_accountData') )

        this.state = {
            loading : false,
            transHist: [],
            transHeaders: [],
            debtors : [],
            debtorId : -1,
            amount: 0,
            creditorAccountInfo: {},
            currentTime: new Date(),
            loggedIn: (this.creditorAccount ? true : false),
            // transferValid: false
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handleAmount = this.handleAmount.bind(this)
        
        if(this.creditorAccount) this.timeUpdater = setInterval(() => {
            this.setState({
                currentTime: new Date()
            })
        }, 1000)
        
    }

    renderRedirectToLogin = () => {
        return <Redirect to='/login' />
      }

    setLoggedOut = () => {
        this.setState({
            loggedIn: false
        })
    }

    handleLogout(event) {
        event.stopPropagation()
        localStorage.removeItem('mts_accountData')
        clearInterval( this.timeUpdater )
        this.setLoggedOut()
    }

    renderLogout() {
        if (!this.state.loggedIn) {
            return <Redirect to='/login' />
        }
    }

    validation() {
        return parseFloat(this.state.amount) > 0 && parseInt(this.state.debtorId) !== -1
    }

    
    handleClick() {
        if(!this.validation()) return;
        postData($resource.addTransaction(), 
            {"amount": this.state.amount, "creditorId": this.creditorAccount.id, "debtorId": this.state.debtorId})
        .then(data => {
            this.loadCreditorInfo()
            this.loadTransactions()
            // console.log(data);
        })
    }

    handleChange(event) {
        // const {name, value, type, checked} = event.target;
        const intentStateMapper = {};
        intentStateMapper[event.target.dataset.intent] = event.target.value
        this.setState(intentStateMapper)
        // console.log(event.target.dataset.intent)
        
        // console.log(this.refs.myinput.getFloatValue())
    }

    handleAmount(event, maskedvalue, floatvalue) {
        this.setState({amount: floatvalue});
        // if( floatvalue !== 0 && this ) this.setState({transferValid: true});
        // console.log('maskedvalue: ', maskedvalue)
    }

    loadTransactions() {
        this.setState({loading : true})
        fetch($resource.getTransactionsByAccountId({
            accountId: this.creditorAccount.id
        }))
        .then(response => response.json())
        .then(data => {
            this.setState({
                transHist: data,
                loading : false,
                transHeaders : (data.length ? Object.keys(data[0]).map((key, index) => key) : [])
            })
        })
    }

    loadCreditorInfo() {
        fetch($resource.getCreditorAccountDataByAccId({
            accountId: this.creditorAccount.id
        })).then(response => response.json())
        .then(data => {
            this.setState({
                creditorAccountInfo: data
            })
        })
    }
  
    componentDidMount() {
        if(this.creditorAccount === null) return this.renderRedirectToLogin()
        
        this.loadCreditorInfo()
        this.loadTransactions()

        fetch($resource.getDebtorAccountsByCreditorAccId({
            accountId: this.creditorAccount.id
        }))
        .then(response => response.json())
        .then(data => {
            this.setState({
                debtors: data,
            })
        })
    }

    renderStatusesBar() {
        
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand nav-header" href="/about">Money Transfer System</a>
                    </div>
                
                    <div className="collapse navbar-collapse" id="myNavbar">
                        <div className="nav navbar-nav navbar-right">
                            <div className="common-inline">
                                <div><span className="loggedin-user-header">Welcome, {this.creditorAccount && this.creditorAccount.username}!</span></div>
                                <div onClick={this.handleLogout}>
                                    <span className="glyphicon glyphicon-log-out logout-group" >&nbsp;Logout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </nav>
          
            
        )
    }

    timeConverter = (date) => {
        if( typeof date === 'string' ) date = new Date(date)
        return date.toDateString() + " " + date.toTimeString()
    }

  
    render() {

        const debtorsInfo = this.state.debtors.map((account, index) => 
            <option key={index} value={account['user']['id']}>{account['user']['fullName']}</option>
        )
        const tableHeaders = this.state.transHeaders.filter((key, index) => key.toLowerCase().indexOf('id') === -1).map((key, index) => <th key={index}>{key}</th>);
        const transInfo = this.state.transHist.map((element, index) => 
            <tr key={index}>
                <td>{index+1}</td>
                {Object.keys(element)
                    .filter((key, index) => key.toLowerCase().indexOf('id') === -1)
                    .map((key, index) => <td key={index}>{(key === 'created' ? getDateInUSFormat(element[key]) : element[key])}</td>)}
            </tr>
        )
        
        return (

        <div>
         {!this.state.loggedIn && this.renderRedirectToLogin()}
            <div className="container">

                {this.renderStatusesBar()}

                <div>
                    <div><span className="time-group">{getDateInEUFullFormat(this.state.currentTime)}, {getTimeByDate(this.state.currentTime)}</span></div>
                </div>

                <CommonDataCategory
                    catName="Creditor Info"
                    subjectLabel="Available amount"
                    subjectValue={this.state.creditorAccountInfo.availableAmount}/>
                <hr></hr>
                <fieldset className="transfer-money-border">
                    <legend className="transfer-money-border">Transfer From Your Account</legend>
                    <div className="amount-group">
                    <div>
                        <span className="amount-labels">Debtors: </span>
                    </div>
                    <div>
                        <select
                            value={this.state.debtorId}
                            onChange={this.handleChange}
                            data-intent="debtorId"
                        >
                            <option value={-1}></option>

                            {debtorsInfo}
                        </select>
                    </div>
                    <div className="label-group-separator">
                        &nbsp;
                    </div>
                    <div>
                        <span className="amount-labels">Amount: </span>
                    </div>
                    <div>
                        <CurrencyInput 
                            value={this.state.amount}
                            onChangeEvent={this.handleAmount}
                            className="form-control"
                        />
                    </div>
                    {/* <br>
                    </br>
                    <br>
                    </br>
                    <span>{this.state.debtorId}</span>
                    <br>
                    </br>
                    <span>{this.state.amount}</span>
                    <br>
                    </br> */}
                    <div className="label-group-separator">
                        &nbsp;
                    </div>
                    <button 
                        className="btn btn-default"
                        onClick={this.handleClick}
                        disabled={this.state.amount === 0 || parseInt(this.state.debtorId) === -1}
                    >
                        Transfer
                    </button>
                </div>
                </fieldset>
                <hr></hr>
                <h6>Transactions History</h6>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>#</th>
                        {tableHeaders}
                    </tr>
                    </thead>
                    <tbody>
                        {transInfo}
                    </tbody>
                </table>
            </div>
            </div>
        )
    }
  }
  
  class CommonDataCategory extends React.Component {
      render() {
          return (
            <div className="card">
                <article className="card-group-item">
                    <header className="card-header"><h6 className="title">{this.props.catName}</h6></header>
                    <div className="filter-content">
                        <div className="list-group list-group-flush">
                            <a href="#" className="list-group-item">
                                {this.props.subjectLabel}
                                <span className="float-right badge badge-light round">
                                    {this.props.subjectValue}
                                </span>
                            </a>
                        </div>
                    </div>
                </article>
                
            </div> 
          )
      }
  }


export default TransactionsDashboard;