import React, { Component } from 'react'
import './CurrencyConverter.css'
import Exchange from '../../Components/Exchange/Exchange';
import axios from 'axios'
import Loader from '../../Components/UI/Loader/Loader';
class CurrencyConverter extends Component {

    // this state will have an array of some curruncies, the from currency value required to make a requst to the currency exchange api and change the select type, and the to currency value required, and the amount value required and some more secondary stuff
    state= {
        currencies: {},
        from: 'USD',
        fromName: '',
        to: 'EGP',
        toName: '',
        amount: 0,
        change: '',
        currenciesLoading: false,
        currenciesError: false,
        currenciesErrorMessage: null
    }


    changeCurrency = (e) => {

        // use the name trick to get a dynamic input name, this func is excuted to two select elements so i need to make difference between setting which state based on which select element, so i gave each select element a name
        // i excute the exchangeHandler Func inside the state because this function depends on the setting of [e.target.name] : e.target.value property so if i called the function after setting the state, i won`t get the updated state and (actually i will get the update if i selected a currency for the second time) and this will be a bug, so instead i passed the reference of the func so it immediately excuted after setting the state so it got the updated state. and the same thing i will do for the get Amount when typing in the input to get the amount (but calling the function right after setting the state not inside it will do the jop but in this case, it is not the best practice)
        this.setState({[e.target.name] : e.target.value}, this.exchangeHandler)
    }

    getAmount =(e) => {
        // excute this func when we write in the input to get the input value
        // same thing, update the amount state prop based on the user input then immediately excute the func that make a request to get the updated state
        this.setState({amount: e.target.value},this.exchangeHandler)        
    }

    
    componentDidMount() {


        this.setState({currenciesLoading: true})

        // get the available currencies for this api 
        const config = {

            headers : {
                "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
                "x-rapidapi-key": "7bc106f21cmsh326da27a670d09dp15f81ejsn2c58228c0035"
            }
        }

        axios.get("https://currency-converter5.p.rapidapi.com/currency/list",config).then(response => {
            this.setState({currencies: response.data.currencies, currenciesLoading: false, currenciesError: false})
        }).catch(error => {
            this.setState({currenciesError: true, currenciesLoading: false, currenciesErrorMessage: error.message})
        })

    }

    
    exchangeHandler = () => {

        console.log(this.state.amount);
        
        // in this method, i will make a request to get some data like the change rate and from currency name and the to currency name and make the operation to get the change rate, all of that will be based on the from, to and the amount states
        const config = {

            headers : {
                "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
                "x-rapidapi-key": "7bc106f21cmsh326da27a670d09dp15f81ejsn2c58228c0035"
            }
        }

        axios.get(`https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=${this.state.from}&to=${this.state.to}&amount=${this.state.amount}`,config).then(response => {

            // get the rate between each to currencies and multiply the amount the user wrote with the rate to get the change  
            let rate = response.data.rates[this.state.to].rate

            let amount = this.state.amount

            let change = (rate * amount).toFixed(2)


            // setting the fromName, toName, and the change rate
            this.setState({
                    fromName: response.data.base_currency_name,
                    toName: response.data.rates[this.state.to].currency_name,
                    change: change,
                    
                })
            
        }).catch(error => {
            alert(error.message)
        })

    }


    switchHandler = () => {
        // switching the currencies types (everything depeends on the from and to type, so changing them and making a request to get new data is just the key)
        let from = this.state.from;
        let to = this.state.to;

        this.setState({from: to, to: from}, this.exchangeHandler)
    }
    render() {


        // make validations to prevent the negative value insertion
        let exchangeMessage;
        if(this.state.amount) {

            if(this.state.amount < 0) {
                exchangeMessage = <h4 style={{color: 'red'}}>Please enter a positive number!</h4>
            }
            else{
                exchangeMessage= <h4> {this.state.amount} {this.state.fromName} is equivelant to  {this.state.change} {this.state.toName}</h4>

            }
        }
        else{
            exchangeMessage = null
        }


        // justa simple check to make a loading if the user has a low network performance, however this api is simple and super fast 
        let currencyConverter;
        if(this.state.currenciesLoading){
            currencyConverter = <Loader />

        }
        else{

                currencyConverter = (
                    <div> <h1>Currency Exchange</h1>
    
                    <Exchange currencies ={this.state.currencies} disabled ={false} selectValue = {this.state.from} name='from' changeCurrency = {this.changeCurrency} getAmount = {this.getAmount} type ='number'/>
    
                    <Exchange currencies ={this.state.currencies} disabled ={true} selectValue = {this.state.to} name='to' changeCurrency = {this.changeCurrency} change = {this.state.change} type ='text'/>
    
    
                    {/* this is the hint message and it really depends on the AMOUNT prop state so i want to only display it if the AMOUNT value started to get triggered  */}
                    {exchangeMessage}
                    <div className='Switch' onClick={this.switchHandler}>Switch</div>
                </div>
                )


        }

        if(this.state.currenciesError) {
        currencyConverter = <h1 style={{color:'red',textAlign: 'center'}}>{this.state.currenciesErrorMessage}</h1>
        }

        return (
            <div className='CurrencyConverter'>
                {currencyConverter}
            </div>
        )
    }
}

export default CurrencyConverter
