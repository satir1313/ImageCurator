import React, {Component} from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';


export default class Register extends Component{

    handleSubmit = e => {
        e.preventDefault();
        const data = {
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email,
            password: this.password,
            password_confirm: this.confirmPassword
        }
        

        const config = {
            headers: {

                'Access-Control-Allow-Origin': '*',
                'crossOrigin': true,
                'Content-Type': 'application/json'
            }
        };
        axios.post('egister', data).then(
            res =>{
                console.lod(res);
            }
        ).catch(error => {
            if (!error.response) {
                // network error
                this.errorStatus = 'Error: Network Error';
            } else {
                this.errorStatus = error.response.data.message;
            }
        }
        )
    };


    render(){
        return(
          <form onSubmit={this.handleSubmit}>
              <h3>Register</h3>

              <div className="form-group">
                <label>First Name</label>
                <input type="text" className="form-control" placeholder="First Name"
                        onChange={e => this.firstName = e.target.value}/>
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input type="text" className="form-control" placeholder="Last Name"
                        onChange={e => this.lastName = e.target.value}/>
              </div>

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

              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" className="form-control" placeholder="confirm password"
                        onChange={e => this.confirmPassword = e.target.value}/>
              </div>

              <button className="btn btn-primary btn-block">Sign up</button>
          </form>
        )
    }
}