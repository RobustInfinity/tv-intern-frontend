import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import {
    Helmet
} from 'react-helmet';
import {
    Link
} from 'react-router-dom';
import {
    asyncFetchReviews
} from '../../action/index';
import Rating from '../../component/rating';
import '../../assets/css/review-page.css';
import ReviewComment from '../../component/review.comment';
import NotFound from '../../component/NotFound';

class Review extends Component {

    componentWillMount() {
        const tempCookie = new Cookies();
        const reviewId = this.props.match.params.reviewId;
        this.props.dispatch(asyncFetchReviews(reviewId, tempCookie.get('token')));
    }

    renderMetaTags = () => {
        const vendorData = this.props.vendorReducer.vendor;
        return (
            <Helmet>
                <title>{(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user }))
                    ?
                    `${(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user })).displayName}'s`
                    :
                    ''
                } review for {this.props.reviewReducer.vendor.displayName}
                </title>
                <meta name="fragment" content="!" />
                <meta name="description" content={
                    (_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user }))
                        ?
                        `${(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user })).displayName} Rated ${this.props.reviewReducer.vendor.displayName}: ${this.props.reviewReducer.review.rating} | ${(this.props.reviewReducer.review.title.length > 0) ? `${this.props.reviewReducer.review.title}` : `Catch ${(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user })).displayName}'s Review on TrustVardi`} ${this.props.reviewReducer.review.content.length > 10 ? ` | ${_.truncate(String(this.props.reviewReducer.review.content.replace(/<(?:.|\n)*?>/gm, '')), { length: 50 })}` : ''}`
                        :
                        ''
                } />
                <link rel="canonical" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta name="robots" content="index, follow" />
                <meta name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta property="og:title" content={(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user }))
                    ?
                    `${(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user })).displayName}'s review for ${this.props.reviewReducer.vendor.displayName}`
                    :
                    ''
                } />
                <meta property="og:description" content={
                    (_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user }))
                        ?
                        `${(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user })).displayName} Rated ${this.props.reviewReducer.vendor.displayName}: ${this.props.reviewReducer.review.rating} | ${(this.props.reviewReducer.review.title.length > 0) ? `${this.props.reviewReducer.review.title}` : `Catch ${(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user })).displayName}'s Review on TrustVardi`} ${this.props.reviewReducer.review.content.length > 10 ? ` | ${_.truncate(String(this.props.reviewReducer.review.content.replace(/<(?:.|\n)*?>/gm, '')), { length: 50 })}` : ''}`
                        :
                        ''
                } />
                <link rel="alternate" hreflang="en" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={vendorData.coverPicture} />
                <meta property="og:site_name" content="trustvardi.com" />
                <meta property="article:section" content="Lifestyle" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@trustvardi" />
                <meta name="twitter:creator" content="trustvardi.com" />
                <meta name="amphtml" content={`https://www.trustvardi.com/amp/review/${this.props.reviewReducer.review._id}`} />
                <meta name="twitter:title" content={(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user }))
                    ?
                    `${(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user })).displayName}'s review for ${this.props.reviewReducer.vendor.displayName}`
                    :
                    ''
                } />
                <meta name="twitter:description" content={
                    (_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user }))
                        ?
                        `${(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user })).displayName} Rated ${this.props.reviewReducer.vendor.displayName}: ${this.props.reviewReducer.review.rating} | ${(this.props.reviewReducer.review.title.length > 0) ? `${this.props.reviewReducer.review.title}` : `Catch ${(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user })).displayName}'s Review on TrustVardi`} ${this.props.reviewReducer.review.content.length > 10 ? ` | ${_.truncate(String(this.props.reviewReducer.review.content.replace(/<(?:.|\n)*?>/gm, '')), { length: 50 })}` : ''}`
                        :
                        ''
                } />
                <meta name="twitter:image" content={vendorData.coverPicture} />
                {/*<meta property="trustvardicom:average_rating" content={`Rating: ${vendorData.rating}`}/>*/}
            </Helmet>
        );
    };

    render() {
        return (
            <div>
                {this.props.reviewReducer.loading &&
                    <div></div>
                }
                {!this.props.reviewReducer.loading && !_.isEmpty(this.props.reviewReducer.review) &&
                    <div style={{ overflow: 'auto' }}>
                        {this.renderMetaTags()}
                        {window.innerWidth >= 768 &&
                            <div>
                                <div style={{ display: 'block', fontSize: '22px', fontWeight: '600', margin: '6rem 9rem 0' }}>
                                    {
                                        (_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user }))
                                            ?
                                            `${(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user })).displayName}'s`
                                            :
                                            ''
                                    } review for {this.props.reviewReducer.vendor.displayName}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1.5rem 9rem' }}>
                                    <div className="review-page-review-container">
                                        <ReviewComment card={this.props.reviewReducer.review} match={this.props.match}
                                            history={this.props.history} />
                                    </div>
                                    <div className="review-page-vendor-container">
                                        <div className="review-page-vendor-image-container">
                                            <img className="review-page-vendor-image"
                                                src={this.props.reviewReducer.vendor.coverPicture} alt="" />
                                        </div>
                                        <div style={{ padding: '10px', backgroundColor: 'white', borderBottomRightRadius: '3px', borderBottomLeftRadius: '3px' }}>
                                            <div className="review-page-vendor-title">
                                                <Link rel="nofollow" style={{ color: 'black', textDecoration: 'none' }} to={`/profile/${this.props.reviewReducer.vendor.username}`}>
                                                    {this.props.reviewReducer.vendor.displayName}</Link>
                                                <span className="review-page-rating-container">
                                                    <Rating rating={this.props.reviewReducer.vendor.rating} width={'70px'}
                                                        fontSize={'14px'} />
                                                </span>
                                            </div>
                                            <div className="review-page-description-text">
                                                {this.props.reviewReducer.vendor.description}
                                            </div>
                                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                                <span
                                                    className="review-page-count-text">{this.props.reviewReducer.vendor.reviewCount} Reviews</span>
                                                <span
                                                    className="review-page-count-text">{this.props.reviewReducer.vendor.followerCount} Followers</span>
                                            </div>
                                            <button className="review-page-visit-profile">
                                                <Link rel="nofollow" to={`/profile/${this.props.reviewReducer.vendor.username}`}>Visit
                                            Profile</Link>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {window.innerWidth < 768 &&
                            <div>
                                <div style={{ display: 'block', fontSize: '14px', fontWeight: '600', margin: '4.5rem 10px 0' }}>
                                    {
                                        (_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user }))
                                            ?
                                            `${(_.find(this.props.reviewReducer.user, { username: this.props.reviewReducer.review.user })).displayName}'s`
                                            :
                                            ''
                                    } review for {this.props.reviewReducer.vendor.displayName}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0' }}>
                                    <div className="review-page-vendor-container">
                                        <div style={{ padding: '10px', backgroundColor: 'white', borderBottomRightRadius: '3px', borderBottomLeftRadius: '3px', display: 'flex', flexWrap: 'wrap' }}>
                                            <div style={{ width: '40%' }}>
                                                <img style={{ width: '100%', height: '120px', objectFit: 'cover' }} src={this.props.reviewReducer.vendor.profilePicture} alt="" />
                                            </div>
                                            <div style={{ width: '58%', marginLeft: '2%', position: 'relative' }}>
                                                <div className="review-page-vendor-title">
                                                    <Link rel="nofollow" style={{ color: 'black', textDecoration: 'none' }} to={`/profile/${this.props.reviewReducer.vendor.username}`}>
                                                        {this.props.reviewReducer.vendor.displayName}</Link>
                                                    <span className="review-page-rating-container">
                                                        <Rating rating={this.props.reviewReducer.vendor.rating} width={'70px'}
                                                            fontSize={'12px'} />
                                                    </span>
                                                </div>
                                                <div style={{ marginTop: '10px' }}>
                                                    <span
                                                        className="review-page-count-text">{this.props.reviewReducer.vendor.reviewCount} Reviews</span>
                                                    <span
                                                        className="review-page-count-text">{this.props.reviewReducer.vendor.followerCount} Followers</span>
                                                </div>
                                                <button style={{ position: 'absolute', bottom: '0' }} className="review-page-visit-profile">
                                                    <Link rel="nofollow" to={`/profile/${this.props.reviewReducer.vendor.username}`}>Visit
                                                Profile</Link>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="review-page-review-container">
                                        <ReviewComment card={this.props.reviewReducer.review} match={this.props.match}
                                            history={this.props.history} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }
                {!this.props.reviewReducer.loading && _.isEmpty(this.props.reviewReducer.review) &&
                    <NotFound />
                }
            </div>
        );
    }
}

export default connect((state) => state)(Review);