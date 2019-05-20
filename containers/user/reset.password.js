import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    CHECK_RESET_TOKEN,
    CHANGE_PASSWORD_API
} from '../../constant/api';
import {
    MdVpnKey
} from 'react-icons/lib/md';
import '../../assets/css/resetpassword.css';
import '../../assets/css/login.css';
import loader from '../../assets/icons/loader.svg';
import { getCallApi, postCallApi } from '../../util/util';

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            validToken: false,
            passwordChanging: false
        }
    }

    componentWillMount() {
        const token = this.props.match.params.token;
        this.setState({
            loading: true
        });
        getCallApi(CHECK_RESET_TOKEN(token))
            .then((data) => {
               this.setState({
                   validToken: data.success,
                   loading: false
               }) 
            })
    }

    resetPassword = (event) => {
        event.preventDefault();
        const token = this.props.match.params.token;
        const password = document.querySelector('#reset-password') ? document.querySelector('#reset-password').value : '';
        const confirmPassword = document.querySelector('#reset-confirm-password') ? document.querySelector('#reset-confirm-password').value : '';
        if (password === confirmPassword) {
            if (password.length > 8) {
                if(!this.state.passwordChanging) {
                    this.setState({
                        passwordChanging: true
                    });
                    postCallApi(CHANGE_PASSWORD_API, {
                        password,
                        token
                    })
                    .then((data) => {
                        this.setState({
                            passwordChanging: false
                        });
                        if (data.success) {
                            alert('Your password have been changed. Try to login now');
                            this.props.history.push({
                                pathname: '/'
                            });
                        } else {
                            alert('Something went wrong Try again later');
                        }
                    })
                    .catch((error) => {
                        this.setState({
                            passwordChanging: false
                        });
                        alert('Something went wrong Try again later');
                    })
                }
            } else {
                alert('Password too small. It should be more than 8 Characters');
            }
        } else {
            alert('Your password doesn\'t match');
        }
    }

    render() {
        if(this.state.loading) {
            return (
                <div className="reset-password-main-div">
                    <div className="reset-password-inner-div">
                        <img src={loader} className="loader-login" alt=""/>
                    </div>
                </div>
            );
        } else if(!this.state.loading && this.state.validToken) {
            return (
                <div className="reset-password-main-div">
                    <div className="reset-password-inner-div">
                        <h1 className="reset-password-label">Reset Password</h1>
                        <form onSubmit={this.resetPassword}>
                            <div className="login-input-credentials-container">
                                <div className="login-input-credentials-icon-container">
                                    <MdVpnKey className="login-input-credentials-icon" />
                                </div>
                                <input id="reset-password" placeholder="Enter New Password" className="login-input-credentials" type="password" required/>
                            </div>
                            <div className="login-input-credentials-container">
                                <div className="login-input-credentials-icon-container">
                                    <MdVpnKey className="login-input-credentials-icon" />
                                </div>
                                <input id="reset-confirm-password" placeholder="Confirm Password" className="login-input-credentials" type="password" required/>
                            </div>
                            <button onClick={this.resetPassword}  className="login-button" >
                                    {!this.state.passwordChanging &&
                                            'Reset Password'
                                        }
                                        {this.state.passwordChanging &&
                                        <img src={loader} className="loader-login" alt=""/>
                                        }
                            </button>     
                        </form>       
                    </div>
                </div>
            );
        } else {
            return (
                <div className="reset-password-main-div">
                    <div className="reset-password-inner-div">
                        <h1>Invalid token</h1>
                    </div>
                </div>
            );
        }
    }
}

export default connect((state) => state)(ResetPassword);