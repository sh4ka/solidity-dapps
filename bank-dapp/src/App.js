import React, {Component} from 'react'
import BankAccount from '../build/contracts/BankAccount.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class GreetingCustomer extends Component {
    render(props) {
        return (
        <div>
            <h1>You have:</h1>
            <p>{this.state.balance}</p>
        </div>
        );
    }
}

class GreetingGuest extends Component {
    render() {
        return (
            <div>
                <h1>You dont have an account in this Bank. Go away.</h1>
                <button className="createAccount" onClick={() => this.props.onClick()} >
                Create
                </button>
            </div>            
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            hasAccount: false,
            balance: 0,
            web3: null
        }
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3
            .then(results => {
                this.setState({
                    web3: results.web3
                })

                // Instantiate contract once web3 provided.
                this.instantiateContract()
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    instantiateContract() {

        const contract = require('truffle-contract')
        const bankAccount = contract(BankAccount)
        bankAccount.setProvider(this.state.web3.currentProvider)

        // Declaring this for later so we can chain functions on the BankAccount.
        var bankAccountInstance;

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            bankAccount.deployed().then((instance) => {
                bankAccountInstance = instance;

                // Stores a given value, 5 by default.
                return bankAccountInstance.getBalance(accounts[0], {from: accounts[0]});
            }).then((result) => {
                console.log(result);
                // Update state with the result.
                return this.setState({balance: result.c[0]});
            })
        })
    }

    renderGreeting() {
        if (this.state.hasAccount) {
            return <GreetingCustomer />
        }
        return <GreetingGuest 
        onClick={() => this.createAccount()}
        />;
    }

    createAccount() {
        this.state.web3.eth.getAccounts((error, accounts) => {
            const contract = require('truffle-contract')
            const bankAccount = contract(BankAccount)
            bankAccount.setProvider(this.state.web3.currentProvider)

            var bankAccountInstance;

            this.state.web3.eth.getAccounts((error, accounts) => {
                bankAccount.deployed().then((instance) => {
                    bankAccountInstance = instance;    
                    return bankAccountInstance.createBankAccount(
                        accounts[0],
                        {from: accounts[0]}
                    );
                }).then((result) => {
                    console.log(result); // todo: attach to event
                    // Update state with the result.
                    return this.setState({hasAccount: true});
                })
                
            })
        })
    }

    render() {
        return (
            <div className="App">
                <nav className="navbar pure-menu pure-menu-horizontal">
                    <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
                </nav>

                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">                            
                            {this.renderGreeting()}
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default App
