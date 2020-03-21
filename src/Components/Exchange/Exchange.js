import React from 'react'
import './Exchange.css'

const Exchange = (props) => {

    // loop through the object of currencies and return option element based on them
    const currencies = Object.keys(props.currencies).map(curr => {
        return <option key ={curr}>{curr}</option>
    })


    // make a validations for the negative values
    let change = props.change;
    let val ;
        if(change < 0 ) {
            val = 'Insert Positive Value';
        }
        else{
            val = change;
        }


    return (
        <div className='exchangeContainer'>
        {/* implement the getAmount func to get the value and set it to the amount state */}
        <input className='Inp' type={props.type}  disabled={props.disabled ? true : false} onChange = {props.getAmount} min='1' value={val}/>

        {/* give the select a value cuz i need to start with initial value and then make change event listner to it to set the value to the selected vale and this value can be the from or to value  */}
        <select className='Select' name={props.name} value ={props.selectValue} onChange={props.changeCurrency} >
            {currencies}
        </select>
        </div>
    );
}

export default Exchange
