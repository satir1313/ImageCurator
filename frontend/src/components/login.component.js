import axios from 'axios';
import React, {Component} from 'react';

const express = require("express");

const app = express(); 
const router = express.Router();

export default class Login extends Component{

    handleSubmit = e => {
        e.preventDefault();
        const data = {
            email: this.email,
            password: this.password,
        }
        
        /*app.post('login', data).then(
            res =>{
                localStorage.setItem('token', res.data.token);
            }
        ).catch(
            err => {
                console.log(err);
            }
        )*/

        router.get("/test", (req, res, next) => {
            console.log("'/test' call");
            axios.get("https://api.neoscan.io/api/main_net/v1/get_all_nodes")
               .then(data => res.json(data))
               .catch(err => res.secn(err));
        })
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
            <h3>Login</h3>

            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" placeholder="email"
                      onChange={e => this.email = e.target.value}/>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="password"
                      onChange={e => this.password = e.target.value}/>
            </div>

            <button className="btn btn-primary btn-block">Login</button>
        </form>
        )
    }
}