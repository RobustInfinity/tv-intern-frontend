/* eslint-disable radix */
import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
import Rating from '../component/rating';
import {
    Link
} from 'react-router-dom';
import {
    asyncLikeDislikeVendor,
    asyncShareModal
} from '../action/index';
import Cookies from 'universal-cookie';
import '../assets/css/trending.card.css';
import MdThumbUp from 'react-icons/lib/md/thumb-up';
import MdThumbDown from 'react-icons/lib/md/thumb-down';
import MdShare from 'react-icons/lib/md/share';
// import FaStar from 'react-icons/lib/fa/star';
import _ from 'lodash';
import {trustvardiCertifiedIcon} from "../assets/icons/icons";
import {toggleLoginModal} from "../action/asyncaction/user.asyncaction";
import { imageTransformation } from '../util/util';

class TrendingCard extends Component {

    goToVendor = (username) => {
        this.props.history.push({
            pathname: `/profile/${username}`
        });
        window.scrollTo(0, 0);
    };

    cardAction = (action, status, _id) => {
        const tempCookies = new Cookies();
        const token = tempCookies.get('token');

        const actionData = {
            action,
            status,
            vendor: _id,
            token
        };

        if (token) {
            this.props.dispatch(asyncLikeDislikeVendor(actionData));
        } else {
            this.props.dispatch(toggleLoginModal())
        }
    };

    shareModal = () => {
        this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/profile/${this.props.card.username}`));
    };

    render() {
        if(window.innerWidth > 768) {
            let height = '12rem';
            let trendingMargin = '30px';
            let shareMargin = '17%';
            let width = '33%';

            //console.log(this.props.match.path);
            if (this.props.match.path === '/') {
                width = '50%';
            }

            if (this.props.height) {
                height = '10rem';
                trendingMargin = '20px';
            }
            if (this.props.match.path.includes('/user/:userId')) {
                shareMargin = '24%';
            }
            if(this.props.index === 0 || this.props.index === 3) {
                return (
                    <div style={{ width: width, float: 'left', marginBottom: trendingMargin }} className="trending-card-container">
                        <div className="tending-card-main">
                            <div className="trending-card-img" style={{backgroundImage: `url(${imageTransformation(this.props.card.coverPicture, 400 ,true)})`, cursor: 'pointer', height}}>
                                <Link rel="nofollow" style={{ height: '100%', width: '100%' }} to={`/profile/${this.props.card.username}`}>
                                    <div className="trending-img-overlay-hover">
                                        <span className="trending-img-overlay-hover-text">VIEW PROFILE</span>
                                    </div>
                                    {this.props.card.trusted && trustvardiCertifiedIcon('assured-icon-mobile-card')}
                                    {this.props.card.vendorType === 'product' &&
                                    <span className="product-badge">Product</span>
                                    }
                                    {this.props.card.vendorType === 'service' &&
                                    <span className="service-badge">Service</span>
                                    }
                                    <div className="trending-card-img-overlay">
                                    <span className="trending-card-overlay-span-container">
                                        <img className="trending-card-img-overlay-image" src={imageTransformation(this.props.card.profilePicture, 100, true)} alt=""/>
                                        <span className="trending-card-img-overlay-title">{this.props.card.displayName}</span>
                                    </span>
                                        {/*<p className="trending-card-img-overlay-address">{_.truncate(this.props.card.address.address, {*/}
                                        {/*length: 50*/}
                                        {/*})}</p>*/}
                                    </div>
                                </Link>
                            </div>
                            <div className="trending-second-row">
                                {parseInt(this.props.card.rating) >= 3  &&
                                <div className="trending-card-vertically-center" style={{ display: 'inline-block', position: 'relative' }}>
                                    <Rating fontSize={'14px'} width={'70px'} rating={this.props.card.rating}/>
                                </div>
                                }
                                {/*<span className="trending-card-vendor-rating trending-card-vertically-center">*/}
                                    {/*<span className="trending-card-rating-holder">{this.props.card.rating}*/}
                                        {/*<FaStar className="trending-card-vertically-center" style={{marginLeft: '5px'}}/>*/}
                                    {/*</span>*/}
                                {/*</span>*/}
                                {parseInt(this.props.card.rating) < 3 &&
                                <div className="trending-card-vertically-center" style={{ display: 'inline-block', position: 'relative' }}>
                                    <Rating fontSize={'14px'} width={'70px'} rating={this.props.card.rating}/>
                                </div>
                                }
                                {/*<span className="trending-card-vendor-rating-poor trending-card-vertically-center">*/}
                                    {/*<span className="trending-card-rating-holder">*/}
                                        {/*<span style={{marginLeft: '5px'}}>{this.props.card.rating}</span>*/}
                                        {/*<FaStar className="trending-card-vertically-center" style={{marginLeft: '5px'}}/>*/}
                                {/*</span>*/}
                                {/*</span>*/}
                                <span className="trending-card-vertically-center trending-card-review-count">
                            <span className="trending-card-review-count-number">{this.props.card.reviewCount} Reviews</span>
                        </span>
                                {!this.props.card.isLiked &&
                                <MdThumbUp onClick={() => this.cardAction('like', true, this.props.card._id)} className="trending-card-vertically-center like-trending-icon" style={{ left: '65%' }}/>
                                }
                                {this.props.card.isLiked &&
                                <MdThumbUp onClick={() => this.cardAction('like', false, this.props.card._id)} className="trending-card-vertically-center like-trending-icon" style={{ left: '65%', fill: '#ff9f00' }}/>
                                }
                                <span className="trending-card-vertically-center like-trending-count" style={{ left: '75%', color:'#2c3249', fontSize: '12px' }}>{this.props.card.likeCount}</span>
                                {this.props.card.isDisliked &&
                                <MdThumbDown onClick={() => this.cardAction('dislike', false, this.props.card._id)} className="trending-card-vertically-center dislike-trending-icon" style={{ left: '81%', fill: '#ff9f00' }}/>
                                }
                                {!this.props.card.isDisliked &&
                                <MdThumbDown onClick={() => this.cardAction('dislike', true, this.props.card._id)} className="trending-card-vertically-center dislike-trending-icon" style={{ left: '81%' }}/>
                                }
                                <span className="trending-card-vertically-center dislike-trending-count" style={{ left: '91%', color:'#2c3249', fontSize: '12px' }}>{this.props.card.dislikeCount}</span>
                            </div>
                            <div className="trending-third-row" onClick={() => this.goToVendor(this.props.card.username)}>
                        <span
                            className="trending-card-vertically-center trending-card-description">{_.truncate(this.props.card.description, {
                            length: 100
                        })}</span>
                            </div>
                            <div onClick={this.shareModal} className="trending-fourth-row">
                                <MdShare className="trending-card-vertically-center share-icon-trending" style={{ right: shareMargin, cursor: 'pointer' }}/>
                                <span className="trending-card-vertically-center" style={{ right: '7%', fontSize: '12px', cursor: 'pointer'}}>Share</span>
                            </div>
                        </div>
                    </div>
                );
            } else if (this.props.index === 2 || this.props.index === 5) {
                return (
                    <div style={{width: width, marginBottom: trendingMargin }} className="trending-card-container">
                        <div className="tending-card-main">
                            <div className="trending-card-img" style={{backgroundImage: `url(${imageTransformation(this.props.card.coverPicture, 400, true)})`, cursor: 'pointer', height}}>
                                <Link rel="nofollow" style={{ height: '100%', width: '100%' }} to={`/profile/${this.props.card.username}`}>
                                    <div className="trending-img-overlay-hover">
                                        <span className="trending-img-overlay-hover-text">VIEW PROFILE</span>
                                    </div>
                                    {this.props.card.trusted && trustvardiCertifiedIcon('assured-icon-mobile-card')}
                                    {this.props.card.vendorType === 'product' &&
                                    <span className="product-badge">Product</span>
                                    }
                                    {this.props.card.vendorType === 'service' &&
                                    <span className="service-badge">Service</span>
                                    }
                                    <div className="trending-card-img-overlay">
                                    <span className="trending-card-overlay-span-container">
                                        <img className="trending-card-img-overlay-image" src={this.props.card.profilePicture} alt=""/>
                                        <span className="trending-card-img-overlay-title">{this.props.card.displayName}</span>
                                    </span>
                                        {/*<p className="trending-card-img-overlay-address">{_.truncate(this.props.card.address.address, {*/}
                                        {/*length: 50*/}
                                        {/*})}</p>*/}
                                    </div>
                                </Link>
                            </div>
                            <div className="trending-second-row">
                                {parseInt(this.props.card.rating) >= 3 &&
                                <div className="trending-card-vertically-center" style={{ display: 'inline-block', position: 'relative' }}>
                                    <Rating fontSize={'14px'} width={'70px'} rating={this.props.card.rating}/>
                                </div>
                                }
                                {parseInt(this.props.card.rating) < 3 &&
                                <div className="trending-card-vertically-center" style={{ display: 'inline-block', position: 'relative' }}>
                                    <Rating fontSize={'14px'} width={'70px'} rating={this.props.card.rating}/>
                                </div>
                                }
                                <span className="trending-card-vertically-center trending-card-review-count">
                            <span className="trending-card-review-count-number">{this.props.card.reviewCount} Reviews</span>
                        </span>
                                {!this.props.card.isLiked &&
                                <MdThumbUp onClick={() => this.cardAction('like', true, this.props.card._id)} className="trending-card-vertically-center like-trending-icon" style={{ left: '65%' }}/>
                                }
                                {this.props.card.isLiked &&
                                <MdThumbUp onClick={() => this.cardAction('like', false, this.props.card._id)} className="trending-card-vertically-center like-trending-icon" style={{ left: '65%', fill: '#ff9f00' }}/>
                                }
                                <span className="trending-card-vertically-center like-trending-count" style={{ left: '75%', color:'#2c3249', fontSize: '12px' }}>{this.props.card.likeCount}</span>
                                {this.props.card.isDisliked &&
                                <MdThumbDown onClick={() => this.cardAction('dislike', false, this.props.card._id)} className="trending-card-vertically-center dislike-trending-icon" style={{ left: '81%', fill: '#ff9f00' }}/>
                                }
                                {!this.props.card.isDisliked &&
                                <MdThumbDown onClick={() => this.cardAction('dislike', true, this.props.card._id)} className="trending-card-vertically-center dislike-trending-icon" style={{ left: '81%' }}/>
                                }
                                <span className="trending-card-vertically-center dislike-trending-count" style={{ left: '91%', color:'#2c3249', fontSize: '12px' }}>{this.props.card.dislikeCount}</span>
                            </div>
                            <div className="trending-third-row" onClick={() => this.goToVendor(this.props.card.username)}>
                        <span
                            className="trending-card-vertically-center trending-card-description">{_.truncate(this.props.card.description, {
                            length: 100
                        })}</span>
                            </div>
                            <div onClick={this.shareModal} className="trending-fourth-row">
                                <MdShare className="trending-card-vertically-center share-icon-trending" style={{ right:shareMargin, cursor: 'pointer' }}/>
                                <span className="trending-card-vertically-center" style={{ right: '7%', fontSize: '12px' , cursor: 'pointer'}}>Share</span>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div style={{width: width, marginBottom: trendingMargin }} className="trending-card-container">
                        <div className="tending-card-main">
                            <div className="trending-card-img" style={{backgroundImage: `url(${imageTransformation(this.props.card.coverPicture, 400, true)})`, cursor: 'pointer', height}}>
                                <Link rel="nofollow" style={{ height: '100%', width: '100%' }} to={`/profile/${this.props.card.username}`}>
                                    <div className="trending-img-overlay-hover">
                                        <span className="trending-img-overlay-hover-text">VIEW PROFILE</span>
                                    </div>
                                    {this.props.card.trusted && trustvardiCertifiedIcon('assured-icon-mobile-card')}
                                    {this.props.card.vendorType === 'product' &&
                                    <span className="product-badge">Product</span>
                                    }
                                    {this.props.card.vendorType === 'service' &&
                                    <span className="service-badge">Service</span>
                                    }
                                    <div className="trending-card-img-overlay">
                                    <span className="trending-card-overlay-span-container">
                                        <img className="trending-card-img-overlay-image" src={this.props.card.profilePicture} alt=""/>
                                        <span className="trending-card-img-overlay-title">{this.props.card.displayName}</span>
                                    </span>
                                        {/*<p className="trending-card-img-overlay-address">{_.truncate(this.props.card.address.address, {*/}
                                        {/*length: 50*/}
                                        {/*})}</p>*/}
                                    </div>
                                </Link>
                            </div>
                            <div className="trending-second-row">
                                {parseInt(this.props.card.rating) >= 3 &&
                                <div className="trending-card-vertically-center" style={{ display: 'inline-block', position: 'relative' }}>
                                    <Rating fontSize={'14px'} width={'70px'} rating={this.props.card.rating}/>
                                </div>
                                }
                                {parseInt(this.props.card.rating) < 3 &&
                                <div className="trending-card-vertically-center" style={{ display: 'inline-block', position: 'relative' }}>
                                    <Rating fontSize={'14px'} width={'70px'} rating={this.props.card.rating}/>
                                </div>
                                }
                                <span className="trending-card-vertically-center trending-card-review-count">
                            <span className="trending-card-review-count-number">{this.props.card.reviewCount} Reviews</span>
                        </span>
                                {!this.props.card.isLiked &&
                                <MdThumbUp onClick={() => this.cardAction('like', true, this.props.card._id)} className="trending-card-vertically-center like-trending-icon" style={{ left: '65%' }}/>
                                }
                                {this.props.card.isLiked &&
                                <MdThumbUp onClick={() => this.cardAction('like', false, this.props.card._id)} className="trending-card-vertically-center like-trending-icon" style={{ left: '65%', fill: '#ff9f00' }}/>
                                }
                                <span className="trending-card-vertically-center like-trending-count" style={{ left: '75%', color:'#2c3249', fontSize: '12px' }}>{this.props.card.likeCount}</span>
                                {this.props.card.isDisliked &&
                                <MdThumbDown onClick={() => this.cardAction('dislike', false, this.props.card._id)} className="trending-card-vertically-center dislike-trending-icon" style={{ left: '81%', fill: '#ff9f00' }}/>
                                }
                                {!this.props.card.isDisliked &&
                                <MdThumbDown onClick={() => this.cardAction('dislike', true, this.props.card._id)} className="trending-card-vertically-center dislike-trending-icon" style={{ left: '81%' }}/>
                                }
                                <span className="trending-card-vertically-center dislike-trending-count" style={{ left: '91%', color:'#2c3249', fontSize: '12px' }}>{this.props.card.dislikeCount}</span>
                            </div>
                            <div className="trending-third-row" onClick={() => this.goToVendor(this.props.card.username)}>
                        <span
                            className="trending-card-vertically-center trending-card-description">{_.truncate(this.props.card.description, {
                            length: 100
                        })}</span>
                            </div>
                            <div onClick={this.shareModal} className="trending-fourth-row">
                                <MdShare className="trending-card-vertically-center share-icon-trending" style={{ right: shareMargin, cursor: 'pointer' }}/>
                                <span className="trending-card-vertically-center" style={{ right: '7%', fontSize: '12px', cursor: 'pointer' }}>Share</span>
                            </div>
                        </div>
                    </div>
                );
            }
        } else if (window.innerWidth <= 768) {
            return (
                <div className="trending-card-mobile-holder">
                    <div className="trending-card-container">
                        <div className="tending-card-main">
                            <div onClick={() => this.goToVendor(this.props.card.username)} className="trending-card-img" style={{backgroundImage: `url(${imageTransformation(this.props.card.coverPicture, 400, true)})`}}>
                                {this.props.card.trusted && trustvardiCertifiedIcon('assured-icon-mobile-card')}
                                <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
                                    <Rating rating={this.props.card.rating} width={'70px'} fontSize={'8px'} />
                                </div>
                                {this.props.card.vendorType === 'product' &&
                                <div className="product-badge-mobile">Product</div>
                                }
                                {this.props.card.vendorType === 'service' &&
                                <div className="service-badge-mobile">Service</div>
                                }
                            </div>
                        </div>
                        <div className="trending-second-row">
                            <div className="trending-mobile-name">{this.props.card.displayName}</div>
                            <div className="trending-description-mobile">
                                {_.truncate(this.props.card.description, {
                                    length: 100
                                })}
                            </div>
                        </div>
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

export default connect((state) => state, mapDispatchToProps)(TrendingCard);