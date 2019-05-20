import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
import GoogleLogin from 'react-google-login';
import {
    MdClose,
    MdEmail,
    MdVpnKey,
    MdPerson
} from 'react-icons/lib/md';
import {
    FaFacebook,
} from 'react-icons/lib/fa';
import {
    SEND_RESET_PASSWORD_LINK
} from '../constant/api';
import {
    postCallApi
} from '../util/util';
import google from '../assets/icons/google.svg';
import loaderWhite from '../assets/icons/loader-white.svg';
import loader from '../assets/icons/loader.svg';
import '../assets/css/login.css';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showSignup: false,
            showLogin: true,
            showForgotPassword: false,
            resetPasswordLogin: false
        };
    }

    componentDidMount() {
        if(!this.props.admin) {
            document.body.style.overflow = 'hidden';
        }
    }

    googleSuccessResponse = (response) => {
        if(!response.error) {
            this.props.googleLogin(response);
        }
    };

    facebookResponse = () => {
        window.FB.login((response) => {
            if (response.authResponse) {
                window.FB.api('/me', {fields: 'id,name,email, picture.width(500).height(500), cover,gender'}, (response) => {
                    if (response.picture) {
                        response.profilePicture = response.picture.data.url;
                        delete response.picture;
                    }

                    if (!response.cover) {
                        response.coverPicture = 'https://res.cloudinary.com/trustvardi/image/upload/w_800,f_auto/v1523563434/editors_yqijva.jpg';
                    }

                    if (response.cover) {
                        response.coverPicture = response.cover.source;
                        delete response.cover;
                    }

                    if (response.name) {
                        response.displayName = response.name;
                        delete response.name;
                    }
                    this.props.facebookLogin(response);
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'public_profile,email'});

        // firebaseAuth().signInWithPopup(facebookProvider)
        //     .then((result) => {
        //         this.props.facebookLogin(result);
        //     })
        //     .catch(error => {
        //         if(error.code === 'auth/popup-closed-by-user') {
        //             alert('Either you closed the sign in dialog or you are using a private browser tab. Which does not support this feature. Please, try again in normal browsing mode instead of private mode');
        //         }
        //     });
    };


    emailLogin = (event) => {
        event.preventDefault();
        const email = document.querySelector('#login-email') ? document.querySelector('#login-email').value : '';
        const password = document.querySelector('#login-password') ? document.querySelector('#login-password').value : '';
        if (email.length > 0 && password.length > 0) {
            this.props.logIn({email, password});
        } else {
            alert('Provide valid credentials');
        }
    };

    emailSignup = (event) => {
        event.preventDefault();
        const email = document.querySelector('#signup-email') ? document.querySelector('#signup-email').value : '';
        const displayName = document.querySelector('#signup-displayname') ? document.querySelector('#signup-displayname').value : '';
        const password = document.querySelector('#signup-password') ? document.querySelector('#signup-password').value : '';
        const confirmPassword = document.querySelector('#signup-confirm-password') ? document.querySelector('#signup-confirm-password').value : '';
        if (email.length > 0 && displayName.length > 0 && password.length > 0 && confirmPassword.length > 0) {
            if (password === confirmPassword) {
                if (password.length > 8) {
                    this.props.signUp({
                        email,
                        displayName,
                        password,
                        confirmPassword
                    });
                } else {
                    alert('Password should be more than 8 Characters');
                }
            } else {
                alert('Your password does not match');
            }
        }
    };

    resetPassword = (event) => {
        event.preventDefault();
        const email = document.querySelector('#reset-email') ? document.querySelector('#reset-email').value : '';
        if (email.length > 0) {
            if(!this.state.resetPasswordLogin) {
                this.setState({
                    resetPasswordLogin: true
                });
                postCallApi(SEND_RESET_PASSWORD_LINK, {
                    email
                })
                    .then((data) => {
                        this.setState({
                            resetPasswordLogin: false
                        });
                        if (data.success) {
                            alert(data.data.message);
                            this.props.onClose();
                        } else {
                            alert(data.data.message);
                        }
                    })
                    .catch((error) => {
                        alert('Something went wrong try again later');
                    });   
            }
        } else {
            alert('You need to give a valid e-mail');
        }
    };

    render() {
        if (window.innerWidth < 768) {
            return (
                <div className="login-container">
                    <div style={{ overflow: 'auto', position: 'relative', width: '90%', margin: '0 auto 20px' }}>
                        <span className="login-label">Sign up or Log in to TrustVardi</span>
                        <MdClose className="login-close-button" onClick={() => this.props.onClose()}/>
                    </div>
                    <div className="login-main-container">
                        {/* <div style={{ overflow: 'auto', textAlign: 'center', marginBottom: '20px' }}>
                            <span className="login-label">LOGIN</span>
                        </div> */}
                        {this.state.showForgotPassword &&
                         <form onSubmit={this.resetPassword}>
                        <p style={{ fontSize: '12px' }}>Please enter your e-mail and we will send you the password recovery link.</p>
                         <div className="login-input-credentials-container">
                             <div className="login-input-credentials-icon-container">
                                 <MdEmail className="login-input-credentials-icon" />
                             </div>
                             <input id="reset-email" placeholder="Enter Email" className="login-input-credentials" type="email" required/>
                         </div>
                         <div className="login-button-container">
                             <button type="submit" onClick={this.resetPassword}  className="login-button">
                             {!this.state.resetPasswordLogin &&
                                        'Reset Password'
                                    }
                                    {this.state.resetPasswordLogin &&
                                    <img src={loader} className="loader-login" alt=""/>
                                    }
                             </button>
                         </div>
                         <div style={{ textAlign: 'center', margin: '30px 0 0' }}>
                            <span className="signup-label">Want to <span onClick={() => {
                                            this.setState({
                                                showForgotPassword: false,
                                                showLogin: true,
                                                showSignup: false
                                            })
                                        }} className="signup-button">Login?</span></span>
                         </div>
                     </form>   
                        }
                        {!this.state.showForgotPassword && 
                            <div>
                            {this.state.showLogin &&
                                <form onSubmit={this.emailLogin}>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdEmail className="login-input-credentials-icon" />
                                    </div>
                                    <input id="login-email" placeholder="Enter Email" className="login-input-credentials" type="email" required/>
                                </div>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdVpnKey className="login-input-credentials-icon" />
                                    </div>
                                    <input id="login-password" placeholder="Enter Password" className="login-input-credentials" type="password" required/>
                                </div>
                                <div className="login-button-container">
                                <button onClick={this.emailLogin} className="login-button" >
                                {!this.props.meReducer.loginLoading &&
                                        'Login'
                                    }
                                    {this.props.meReducer.loginLoading &&
                                    <img src={loader} className="loader-login" alt=""/>
                                    }
                                </button>
                                </div>
                                <div className="signup-container">
                                    <span className="forgot-password" onClick={() => {
                                            this.setState({
                                                showForgotPassword: true,
                                                showLogin: false,
                                                showSignup: false
                                            });
                                        }}>Forgot Password?</span>
                                </div>
                            </form>
                            }
                            {this.state.showSignup &&
                            <form onSubmit={this.emailSignup}>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdPerson className="login-input-credentials-icon" />
                                    </div>
                                    <input placeholder="Enter Name" id="signup-displayname" className="login-input-credentials" type="text" required/>
                                </div>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdEmail className="login-input-credentials-icon" />
                                    </div>
                                    <input placeholder="Enter Email" id="signup-email" className="login-input-credentials" type="email" required/>
                                </div>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdVpnKey className="login-input-credentials-icon" />
                                    </div>
                                    <input placeholder="Enter Password" id="signup-password" className="login-input-credentials" type="password" required/>
                                </div>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdVpnKey className="login-input-credentials-icon" />
                                    </div>
                                    <input placeholder="Confirm Password" id="signup-confirm-password" className="login-input-credentials" type="password" required/>
                                </div>
                                <div className="login-button-container">
                                <button type="submit" className="login-button" onClick={this.emailSignup}>
                                    {!this.props.meReducer.signUpLoading &&
                                        'Sign up'
                                    }
                                    {this.props.meReducer.signUpLoading &&
                                    <img src={loader} className="loader-login" alt=""/>
                                    }
                                </button>
                                </div>
                            </form>
                            }
                            <div className="ui horizontal divider">or</div>
                            <div style={{ marginTop: '20px' }}>
                                <button className="login-facebook-button" onClick={this.facebookResponse}>
                                    {!this.props.meReducer.facebookLoading &&
                                    <FaFacebook className="login-facebook-icon"/>
                                    }
                                    {!this.props.meReducer.facebookLoading &&
                                    <span className="login-facebook-label">Login With Facebook</span>
                                    }
                                    {this.props.meReducer.facebookLoading &&
                                    <img className="loader-login" src={loaderWhite} alt=""/>
                                    }
                                </button>
                                <GoogleLogin
                                    clientId="699655601504-c3kh83hosefj1ab81t1ae9epr4th5v09.apps.googleusercontent.com"
                                    onSuccess={this.googleSuccessResponse}
                                    onFailure={this.googleSuccessResponse}
                                    className="login-google-button">
                                    {!this.props.meReducer.googleLoading &&
                                    <img alt="" src={google} className="login-google-icon"/>
                                    }
                                    {!this.props.meReducer.googleLoading &&
                                    <span className="login-google-label">Login With Google</span>
                                    }
                                    {this.props.meReducer.googleLoading &&
                                    <img src={loader} className="loader-login" alt=""/>
                                    }
                                </GoogleLogin>
                            </div>
                            <div style={{ textAlign: 'center', margin: '30px 0 0' }} >
                                {!this.state.showSignup &&
                                    <span className="signup-label">Don't have an account? <span onClick={() => {
                                        this.setState({
                                            showForgotPassword: false,
                                            showLogin: false,
                                            showSignup: true
                                        });
                                        window.scrollTo(0, 0);
                                    }} className="signup-button">Sign Up</span></span>
                                }
                                {!this.state.showLogin &&
                                    <span className="signup-label">Already have an account? <span onClick={() => {
                                        this.setState({
                                            showForgotPassword: false,
                                            showLogin: true,
                                            showSignup: false
                                        });
                                        window.scrollTo(0, 0);
                                    }} className="signup-button">Login</span></span>
                                }
                            </div>
                        </div>
                        }
                    </div>
                </div>
            );
        } else {
            return (
                <div className="login-container">
                    <div style={{ overflow: 'auto', position: 'relative', width: '90%', margin: '0 auto 20px' }}>
                        <span className="login-label">{this.props.admin ? 'TrustVardi Business Login' : 'Sign up or Log in to TrustVardi'}</span>
                        {this.props.admin &&
                            <span style={{ display: 'block' }}>Login from your TrustVardi Admin E-mail</span>
                        }
                        {!this.props.admin &&
                            <MdClose className="login-close-button" onClick={() => this.props.onClose()}/>
                        }
                    </div>
                    <div className="login-main-container">
                        {/* <div style={{ overflow: 'auto', textAlign: 'center', marginBottom: '20px' }}>
                            <span className="login-label">LOGIN</span>
                        </div> */}
                        {this.state.showForgotPassword &&
                         <form onSubmit={this.resetPassword}>
                        <p style={{ fontSize: '12px' }}>Please enter your e-mail and we will send you the password recovery link.</p>
                         <div className="login-input-credentials-container">
                             <div className="login-input-credentials-icon-container">
                                 <MdEmail className="login-input-credentials-icon" />
                             </div>
                             <input id="reset-email" placeholder="Enter Email" className="login-input-credentials" type="email" required/>
                         </div>
                         <div className="login-button-container">
                         <button type="submit" onClick={this.resetPassword}  className="login-button">
                             {!this.state.resetPasswordLogin &&
                                        'Reset Password'
                                    }
                                    {this.state.resetPasswordLogin &&
                                    <img src={loader} className="loader-login" alt=""/>
                                    }
                             </button>
                         </div>
                         <div style={{ textAlign: 'center', margin: '30px 0 0' }}>
                            <span className="signup-label">Want to <span onClick={() => {
                                            this.setState({
                                                showForgotPassword: false,
                                                showLogin: true,
                                                showSignup: false
                                            })
                                        }} className="signup-button">Login?</span></span>
                         </div>
                     </form>   
                        }
                        {!this.state.showForgotPassword && 
                            <div>
                            {this.state.showLogin &&
                                <form onSubmit={this.emailLogin}>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdEmail className="login-input-credentials-icon" />
                                    </div>
                                    <input id="login-email" placeholder="Enter Email" className="login-input-credentials" type="email" required/>
                                </div>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdVpnKey className="login-input-credentials-icon" />
                                    </div>
                                    <input id="login-password" placeholder="Enter Password" className="login-input-credentials" type="password" required/>
                                </div>
                                <div className="login-button-container">
                                <button onClick={this.emailLogin}  className="login-button" value="Login">
                                {!this.props.meReducer.loginLoading &&
                                        'Login'
                                    }
                                    {this.props.meReducer.loginLoading &&
                                    <img src={loader} className="loader-login" alt=""/>
                                    }</button>
                                </div>
                                <div className="signup-container">
                                    <span className="forgot-password" onClick={() => {
                                            this.setState({
                                                showForgotPassword: true,
                                                showLogin: false,
                                                showSignup: false
                                            })
                                        }}>Forgot Password?</span>
                                </div>
                            </form>
                            }
                            {this.state.showSignup &&
                            <form onSubmit={this.emailSignup}>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdPerson className="login-input-credentials-icon" />
                                    </div>
                                    <input placeholder="Enter Name" id="signup-displayname" className="login-input-credentials" type="text" required/>
                                </div>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdEmail className="login-input-credentials-icon" />
                                    </div>
                                    <input placeholder="Enter Email" id="signup-email" className="login-input-credentials" type="email" required/>
                                </div>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdVpnKey className="login-input-credentials-icon" />
                                    </div>
                                    <input placeholder="Enter Password" id="signup-password" className="login-input-credentials" type="password" required/>
                                </div>
                                <div className="login-input-credentials-container">
                                    <div className="login-input-credentials-icon-container">
                                        <MdVpnKey className="login-input-credentials-icon" />
                                    </div>
                                    <input placeholder="Confirm Password" id="signup-confirm-password" className="login-input-credentials" type="password" required/>
                                </div>
                                <div className="login-button-container">
                                <button onClick={this.emailSignup} type="submit" className="login-button">
                                {!this.props.meReducer.signUpLoading &&
                                        'Sign up'
                                    }
                                    {this.props.meReducer.signUpLoading &&
                                    <img src={loader} className="loader-login" alt=""/>
                                    }
                                </button>
                                </div>
                            </form>
                            }
                            <div className="ui horizontal divider">or</div>
                            <div style={{ marginTop: '20px' }}>
                                <button className="login-facebook-button" onClick={this.facebookResponse}>
                                    {!this.props.meReducer.facebookLoading &&
                                    <FaFacebook className="login-facebook-icon"/>
                                    }
                                    {!this.props.meReducer.facebookLoading &&
                                    <span className="login-facebook-label">Login With Facebook</span>
                                    }
                                    {this.props.meReducer.facebookLoading &&
                                    <img className="loader-login" src={loaderWhite} alt=""/>
                                    }
                                </button>
                                <GoogleLogin
                                    clientId="699655601504-c3kh83hosefj1ab81t1ae9epr4th5v09.apps.googleusercontent.com"
                                    onSuccess={this.googleSuccessResponse}
                                    onFailure={this.googleSuccessResponse}
                                    className="login-google-button">
                                    {!this.props.meReducer.googleLoading &&
                                    <img alt="" src={google} className="login-google-icon"/>
                                    }
                                    {!this.props.meReducer.googleLoading &&
                                    <span className="login-google-label">Login With Google</span>
                                    }
                                    {this.props.meReducer.googleLoading &&
                                    <img src={loader} className="loader-login" alt=""/>
                                    }
                                </GoogleLogin>
                            </div>
                            <div style={{ textAlign: 'center', margin: '30px 0 0' }} >
                                {!this.state.showSignup &&
                                    <span className="signup-label">Don't have an account? <span onClick={() => {
                                        this.setState({
                                            showForgotPassword: false,
                                            showLogin: false,
                                            showSignup: true
                                        })
                                    }} className="signup-button">Sign Up</span></span>
                                }
                                {!this.state.showLogin &&
                                    <span className="signup-label">Already have an account? <span onClick={() => {
                                        this.setState({
                                            showForgotPassword: false,
                                            showLogin: true,
                                            showSignup: false
                                        })
                                    }} className="signup-button">Login</span></span>
                                }
                            </div>
                        </div>
                        }
                    </div>
                </div>
            );
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
};

export default connect((state) => state, mapDispatchToProps)(Login);