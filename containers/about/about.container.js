import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    Helmet
} from 'react-helmet';
import '../../assets/css/about.css';

class About extends Component {

    goToProfile = () => {
        this.props.history.push({
            pathname: '/profile/trustvardi'
        });
    };

    renderMetaTags = () => {
        return (
            <Helmet
                titleTemplate="%s">
                <title>Trustvardi | About us</title>
                <link rel="alternate" hreflang="en" href="https://www.trustvardi.com/about-us" />
                <link rel="alternate" hreflang="" href="https://www.trustvardi.com/about-us" />
                <meta name="fragment" content="!" />
                <link rel="canonical" href="https://www.trustvardi.com/about-us" />
                <meta name="description" content='Trustvardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories.' />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content="" />
                <meta name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name='HandheldFriendly' content='True' />
                <meta property="og:title" content="Trustvardi" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={`"http://www.trustvardi.com/about-us"`} />
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
                            "url": "https://www.trustvardi.com/about-us",
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
                                    "@id": "https://www.trustvardi.com/about-us",
                                    "name": "About us",
                                    "description": "About us"
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
            <div className="about-us-main-container">
                {this.renderMetaTags()}
                <div className="about-us-holder">
                    <p className="about-us-title">About us</p>
                    <p className="about-us-content-main">
                        TrustVardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories.
                    </p>
                    <p className="about-us-content-main">
                        With countless startups and established brands making an attempt to cater to all your needs and be your go-to site, choosing the best and the most suitable one becomes even more difficult. And that is exactly where we, swoop into the picture like a true friend would.
                    </p>
                    <p className="about-us-content-main">
                        Made exclusively for millennials, by the millennials, TrustVardi is a first-hand recommendation platform that lets you skim through brands and pick the one that caters to your whims and fancies. Our objective is to make your daily decisions (for and about everything) a cakewalk and worth it. Also, boasting and sugarcoating about not-so-worth it brands is not our thing as we strive to become your favourite and unbiased virtual friend next door.
                    </p>
                    <p style={{ marginBottom: '28px' }} className="about-us-content-main">
                        So, get ready for absolutely honest and transparent brand reviews that will make your life easier and us, happier! Trust-Worthy, ain't it?
                    </p>
                    <div style={{ textAlign: 'center' }}>
                        <button onClick={this.goToProfile} className="about-us-view-profile">View Our Profile</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state) => state)(About);