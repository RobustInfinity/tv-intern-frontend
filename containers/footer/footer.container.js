import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    FaFacebook,
    FaTwitter,
    FaYoutubePlay,
    FaInstagram,
    FaLinkedin,
    FaWhatsapp
} from 'react-icons/lib/fa';
import '../../assets/css/footer.css';
import {
    getCallApi
} from '../../util/util.js';
import { Link } from 'react-router-dom';


class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileImg: []
        }
    }

    componentDidMount() {
        getCallApi("https://trustvardiapi.com/web/home/getinstagramimage")
            .then((data) => {
                this.setState({
                    profileImg: data.data
                })
            })
    }

    render() {

        if (window.innerWidth > 768) {
            return (
                <div id="footermaincontainer" className="footer-main-container">
                    <div className="footer-container">
                        <section className="about-us-section">
                            <p className="label-footer">ABOUT US</p>
                            <p className="about-us-content">
                                TrustVardi is a first hand content based recommendation platform that lets you skim through brands and pick the one that caters to your whims & fancies, just like a true friend would recommend.

                                Basically, Trustvardi is your best friend's virtual doppelganger!
                            </p>
                            <Link rel="nofollow" style={{ textDecoration: 'none' }} target="_blank" to={{ pathname: 'https://api.whatsapp.com/send?phone=919818042339&text=I%27d%20like%20to%20receive%20daily%20updates%20from%20TrustVardi.%20' }}>
                                <p className="whatsapp">
                                <FaWhatsapp className="whatapps" style={{ marginRight: '5px' }} /> +91 9818042339</p>
                            </Link>
                            <p style={{fontSize: '14px', color: 'white', marginTop: '1px', marginBottom: '15px' }}>
                            <Link rel="nofollow" className="mail_class" to={{pathname:`${'mailto:info@trustvardi.com'}`}} target='_blank'>Info@trustvardi.com</Link>
                            </p>
                        </section>
                        <section className="company-section">
                            <p className="label-footer" style={{ marginBottom: '10px' }}>COMPANY</p>
                            <div>
                                <div style={{ display: 'inline-block', float: 'left' }}>
                                    <li className="footer-list" >
                                        <ul onClick={() => {
                                            this.props.history.push({
                                                pathname: '/'
                                            });
                                            window.scrollTo(0, 0);
                                        }}>Home</ul>
                                        <ul onClick={() => {
                                            this.props.history.push({
                                                pathname: '/about-us'
                                            });
                                            window.scrollTo(0, 0);
                                        }}>About us</ul>
                                        <ul onClick={() => {
                                            this.props.history.push({
                                                pathname: '/contact-us'
                                            });
                                            window.scrollTo(0, 0);
                                        }}>Contact Us</ul>
                                        <ul onClick={() => {
                                            this.props.history.push({
                                                pathname: '/privacy'
                                            });
                                            window.scrollTo(0, 0);
                                        }}>Privacy & Policy</ul>
                                    </li>
                                </div>
                                {/*<div style={{display: 'inline-block', float: 'left'}}>*/}
                                {/*<li className="footer-list" style={{ marginLeft: '100px' }}>*/}
                                {/*<ul>Privacy & Policy</ul>*/}
                                {/*</li>*/}
                                {/*</div>*/}
                            </div>

                        </section>

                        <section className="instagram-section">
                            <p className="label-footer" >INSTAGRAM</p>
                            <div style={{ float: 'left', width: '55%', marginTop: '3px' }}>
                                {this.state.profileImg.map((value, index) => {
                                    return <Link rel="nofollow" key={index} to={{ pathname: value.link }} target="_blank">
                                    <img src={value.images.thumbnail.url} className="instagram-pic" alt="" /></Link>
                                })}
                                <Link  rel="nofollow" to={{
                                    pathname: 'https://www.instagram.com/trustvardi/'
                                }} target="_blank"><p className="view-all-photo">VIEW ALL PHOTOS</p></Link>
                            </div>
                        </section>

                    </div>
                    <section className="footer-bottom">
                        <span className="copy-right-text" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}>
                            Copyright @ 2018 Trustvardi. All Right reserved.
                        </span>
                        <div className="footer-social-icon-right">
                            <FaFacebook onClick={() => {
                                window.open('https://www.facebook.com/trustvardi/', '_blank');
                            }} className="social-icons-footer" />
                            <FaTwitter onClick={() => {
                                window.open('https://twitter.com/trustvardi', '_blank');
                            }} className="social-icons-footer" />
                            <FaInstagram onClick={() => {
                                window.open('https://www.instagram.com/trustvardi/', '_blank');
                            }} className="social-icons-footer" />
                            <FaLinkedin onClick={() => {
                                window.open('https://www.linkedin.com/company/trustvardi/', '_blank');
                            }} className="social-icons-footer" />
                            <FaYoutubePlay onClick={() => {
                                window.open('https://www.youtube.com/channel/UCE1R6EPAG6f3dhKKXS1T1_Q', '_blank');
                            }} className="social-icons-footer" />
                        </div>
                    </section>
                </div>
            );
        } else if (window.innerWidth <= 768) {
            return (
                <div>
                </div>
            );
        }
    }
}

export default connect((state) => state)(Footer);