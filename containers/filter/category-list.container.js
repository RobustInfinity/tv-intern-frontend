import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import {
    Helmet
} from 'react-helmet';
import {
    categories,
    collectionsObject
} from "../../constant/static";
import '../../assets/css/category-list.css';

class CategoryList extends Component {

    toCategory = (type, key) => {
        this.props.history.push({
            pathname: `/${type}/${key}`
        })
    };

    renderMetaTags = (type) => {
        return (
            <Helmet>
                <title>{type} | TrustVardi</title>
                <meta name="fragment" content="!" />
                <link rel="canonical" href={`https://www.trustvardi.com/${type.toLowerCase()}`} />
                <meta name="description" content='Trustvardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories.' />
                <meta name="robots" content="index, follow" />
                <link rel="alternate" hreflang="en" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta name="keywords" content={`${type}, trustvardi`}/>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name='HandheldFriendly' content='True' />
                <meta property="og:title" content={`${type} | Trustvardi`} />
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={`https://www.trustvardi.com/${type.toLowerCase()}`} />
                <meta property="og:site_name" content="trustvardi" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@trustvardi" />
                <meta name="twitter:creator" content="trustvardi.com" />
                <meta name="twitter:title" content="TrustVardi" />
                <script type="application/ld+json">{
                    `
                    {
                        "@context": "http://schema.org",
                        "@type": "Organization",
                        "url": "https://www.trustvardi.com/",
                        "logo": "https://res.cloudinary.com/trustvardi/image/upload/v1527852932/icons/logo_new_-13.svg",
                        "sameAs": [
                            "https://www.facebook.com/trustvardi", "https://www.facebook.com/trustvardi", "https://twitter.com/trustvardi", "https://www.linkedin.com/company/trustvardi"
                        ]
                    }
                    `
                }</script>
                <script type="application/ld+json">
                    {`
                        [{
                            "@context": "http://schema.org",
                            "url": "https://www.trustvardi.com/${type.toLowerCase()}",
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
                                    "@id": "https://www.trustvardi.com/${type.toLowerCase()}",
                                    "name": "${type.toUpperCase()}",
                                    "description": "${type}"
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
            <div className="category-outer-container">
                {this.props.match.url.includes('category') ? this.renderMetaTags('Category') : this.renderMetaTags('Collections')}
                <div className="category-inner-container">
                    <label htmlFor="" className="category-label">What interest you the most?</label>
                    {this.props.match.url.includes('/category') && 
                        <div style={{ marginTop: '20px' }}>
                            {_.map(categories, (value, i) => {
                                return (
                                    <div onClick={() => this.toCategory('category', value.key)} key={value.key} className="category-item">
                                        <img className="category-icon-page" src={value.icon} alt=""/>
                                        <span className="category-item-inner-span">
                                    {value.name}
                                </span>
                                    </div>
                                );
                            })}
                        </div>
                    }
                    {this.props.match.url.includes('/collections') &&
                    <div style={{ marginTop: '20px' }}>
                        {_.map(collectionsObject, (value, i) => {
                            return (
                                <div onClick={() => this.toCategory('collections', value.key)} key={value.key} className="category-item">
                                    <img className="category-icon-page" src={value.icon} alt=""/>
                                    <span className="category-item-inner-span">
                                    {value.name}
                                </span>
                                </div>
                            );
                        })}
                    </div>
                    }
                </div>
            </div>
        );
    }
}

export default connect((state) => state)(CategoryList);