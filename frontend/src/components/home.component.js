import axios from 'axios';
import React, {Component} from 'react';


export default class Home extends Component{

    componentDidMount(){

        const config = {
            headrs : {
                Authrization: 'Bearer ' + localStorage.getItem('token')
            }
        }
        axios.get('user', config).then(
            res => {
                console.log(res);
            },
            err =>{
                console.log(err);
            }
        )
    }

    render(){
        return(
            <h2>aha!</h2>
        )
    }
}