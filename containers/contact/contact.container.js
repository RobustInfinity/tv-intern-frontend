import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
import {
    Helmet
} from 'react-helmet';
import {
    FaUser,
    FaEnvelope,
    FaPhone
} from 'react-icons/lib/fa';
import {
    SEND_QUERY_API
} from '../../constant/api';
import '../../assets/css/main.css';
import '../../assets/css/util.css';
import {postCallApi} from "../../util/util";

class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
          user_name:'',
          user_email:'',
            user_number: '',
            user_query:''
        };
    }

    clearState = () => {
        this.setState({
            user_name:'',
            user_email:'',
            user_query:'',
            user_number: ''
        })
    };

    submitMail = (event) => {
        event.preventDefault();
        if (this.state.user_name.length === 0) {
            alert('You need to give your name');
        } else if (this.state.user_email.length === 0) {
            alert('You need to give a valid emailId');
        } else if (this.state.user_query.length === 0) {
            alert('You need to write down a message');
        } else if (this.state.user_number.length === 0) {
            alert('You need to write down a phone number');
        }
        else {
            postCallApi(SEND_QUERY_API, this.state)
                .then((data) => {
                    if (data.success) {
                       document.getElementById('name').value = '';
                        document.getElementById('email').value = '';
                        document.getElementById('number').value = '';
                        document.getElementById('message').value = '';
                        alert('Query Submitted');
                    } else {
                        alert('Something went wrong please try again');
                    }
                });
        }
    };


    renderMetaTags = () => {
        return (
            <Helmet
                titleTemplate="%s">
                <title>Trustvardi | Contact us</title>
                <meta name="fragment" content="!" />
                <link rel="canonical" href="https://www.trustvardi.com/contact-us" />
                <link rel="alternate" hreflang="en" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta name="description" content='Trustvardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories.' />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content="" />
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name='HandheldFriendly' content='True' />
                <meta property="og:title" content="Trustvardi" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={`"https://www.trustvardi.com/contact-us"`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="trustvardi" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@trustvardi" />
                <meta name="twitter:creator" content="@trustvardi" />
                <meta name="twitter:title" content="TrustVardi" />
                <script type="application/ld+json">
                    {`
                        [{
                            "@context": "http://schema.org",
                            "url": "https://www.trustvardi.com/contact-us",
                            "@type": "Website"
                        }
                        ,{
                            "@context": "http://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [{
                                "@type": "ListItem",
                                "position": 1,
                                "item": {
                                    "@id": "https://www.trustvardi.com",
                                    "name": "TRUSTVARDI",
                                    "description": "home"
                                }
                            }, {
                                "@type": "ListItem",
                                "position": 2,
                                "item": {
                                    "@id": "https://www.trustvardi.com/contact-us",
                                    "name": "Contact us",
                                    "description": "Contact us"
                                }
                            }]
                        }]
                    `}
                </script>
            </Helmet>
        );
    };


    render() {
        return (
            <div style={{ overflow: 'auto', background: 'rgba(132,106,221,0.9)', marginBottom: '30px' }}>
                {this.renderMetaTags()}
                <div className="bg-contact100">
                    <div className="container-contact100">
                        <div className="wrap-contact100">
                            <div className="contact100-pic js-tilt" data-tilt>
                                <img src="https://res.cloudinary.com/trustvardi/image/upload/v1523980644/img-01_orul1z.png"
                                     alt="IMG"/>
                            </div>
                            <form className="contact100-form validate-form">
              <span className="contact100-form-title">
                Get in touch
              </span>
                                <div className="wrap-input100 validate-input">
                                    <input id="name" onChange={(event) => {
                                        this.setState({
                                            user_name: event.target.value
                                        })
                                    }} defaultValue={this.state.user_name} className="input100" type="text" name="name" placeholder="Name"/>
                                    <span className="focus-input100"/>
                                    <span className="symbol-input100">
                  <FaUser/>
                </span>
                                </div>
                                <div className="wrap-input100 validate-input">
                                    <input id="email" onChange={(event) => {
                                        this.setState({
                                            user_email: event.target.value
                                        })
                                    }} defaultValue={this.state.user_email} className="input100" type="text" name="email" placeholder="Email"/>
                                    <span className="focus-input100"/>
                                    <span className="symbol-input100">
                  <FaEnvelope/>
                </span>
                                </div>
                                <div className="wrap-input100 validate-input">
                                    <input id="number" onChange={(event) => {
                                        this.setState({
                                            user_number: event.target.value
                                        })
                                    }} defaultValue={this.state.user_number} className="input100" type="number" name="email" placeholder="PhoneNumber"/>
                                    <span className="focus-input100"/>
                                    <span className="symbol-input100">
                  <FaPhone/>
                </span>
                                </div>
                                <div className="wrap-input100 validate-input">
                                    <textarea id="message" onChange={(event) => {
                                        this.setState({
                                            user_query: event.target.value
                                        })
                                    }}  className="input100" name="message" placeholder="Message" defaultValue={this.state.user_query}/>
                                    <span className="focus-input100"/>
                                </div>
                                <div className="container-contact100-form-btn">
                                    <button onClick={this.submitMail} className="contact100-form-btn">
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state) => state)(Contact);