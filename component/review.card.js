import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
import FaStar from 'react-icons/lib/fa/star';
import _ from 'lodash';
import '../assets/css/review.card.css';
import { imageTransformation } from '../util/util';

const curvyDivArray = [
    'https://res.cloudinary.com/trustvardi/image/upload/v1520925202/path-46_1_k3tswz.svg',
    'https://res.cloudinary.com/trustvardi/image/upload/v1520925201/path-46_2_q9yui3.svg',
    'https://res.cloudinary.com/trustvardi/image/upload/v1520925202/path-46_3_i3cgw8.svg'
];

class ReviewCard extends Component {

    goToUser = (username) => {
      this.props.history.push({
          pathname: `/user/${username}/reviews`
      });
      window.scrollTo(0, 0);
    };

    goToProfile = (username) => {
        this.props.history.push({
            pathname: `/profile/${username}`
        });
        window.scrollTo(0, 0);
    };

    render() {

        if(window.innerWidth > 768) {
            return (
                <div className="review-card-container">
                    <div className="review-card-main">
                        <div style={{height: '4rem', position: 'relative'}}>
                            <img className="review-card-img review-card-vertically-center" onClick={() => this.goToProfile(this.props.card.vendor)} src={
                                _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }) ?
                                    _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }).profilePicture : ''
                            }
                                 alt=""/>
                            <span style={{height: '4rem', width: '100%'}} className="review-card-vertically-center">
                            <span className="review-card-vertically-center review-card-desktop-profile-detail-container">
                                <span style={{ cursor: 'pointer' }} onClick={() => this.goToProfile(this.props.card.vendor)}>{
                                    _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }) ?
                                        _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }).displayName : ''
                                }</span>
                                <div>
                                <span className="review-count">{_.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }) ?
                                    _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }).reviewCount : ''} Reviews</span>
                                <span className="review-follower">{_.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }) ?
                                    _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }).followerCount : ''} Followers</span>
                            </div>
                                </span>
                        </span>
                        </div>
                        <div className="review-second-row">
                            <span className="review-card-description">{_.truncate(this.props.card.content, {
                                length: '180'
                            })}</span>
                            <img className="review-card-user-img" onClick={() => this.goToUser(this.props.card.user)} src={imageTransformation(_.find(this.props.homeReducer.users, { username: this.props.card.user }) ?
                                _.find(this.props.homeReducer.users, { username: this.props.card.user }).profilePicture : '', 100)} alt=""/>
                        </div>
                        <div className="review-third-row" style={{
                            background: `url(${curvyDivArray[this.props.index]}), no-repeat`,
                            backgroundSize: 'cover',
                            height: '170px',
                            backgroundColor: 'white'
                        }}>
                            <p className="review-card-user-name" onClick={() => this.goToUser(this.props.card.user)}>By {
                                _.find(this.props.homeReducer.users, { username: this.props.card.user }) ?
                                    _.find(this.props.homeReducer.users, { username: this.props.card.user }).displayName : ''
                            }</p>
                            <div style={{ textAlign: 'center' }}>
                                <span className="review-rating">{
                                    _.find(this.props.homeReducer.users, { username: this.props.card.user }) ?
                                        _.find(this.props.homeReducer.users, { username: this.props.card.user }).rating : ''
                                }<FaStar className="review-star" /></span>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                <span className="review-count" style={{ color: 'white', float: 'none' }}>{
                                    _.find(this.props.homeReducer.users, { username: this.props.card.user }) ?
                                        _.find(this.props.homeReducer.users, { username: this.props.card.user }).reviewCount : ''
                                } Reviews</span>
                                <span className="review-follower" style={{ color: 'white', float: 'none' }}>{_.find(this.props.homeReducer.users, { username: this.props.card.user }) ?
                                    _.find(this.props.homeReducer.users, { username: this.props.card.user }).followerCount : ''} Followers</span>
                            </div>

                            {/*<div className="review-card-img-container">*/}
                            {/*<img className="review-card-img" src={this.props.card.image} alt=""/>*/}
                            {/*<p className="review-card-name">{this.props.card.name}</p>*/}
                            {/*<span className="review-rating">{this.props.card.rating}<FaStar className="review-star" /></span>*/}
                            {/*<div style={{ marginTop: '10px' }}>*/}
                            {/*<span className="review-count">{this.props.card.reviews} Reviews</span>*/}
                            {/*<span className="review-follower">{this.props.card.follower} Followers</span>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            );
        } else if(window.innerWidth <= 768) {
            return (
                <div className="review-card-container">
                    <div className="review-card-main">
                        <div style={{height: '3rem', position: 'relative'}}>
                            <img onClick={() => this.goToProfile(this.props.card.vendor)} className="review-card-img review-card-vertically-center" src={
                                imageTransformation(
                                    _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }) ?
                                    _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }).profilePicture : '',
                                    50
                                )
                            }
                                 alt=""/>
                            <span style={{height: '3rem', width: '100%'}} className="review-card-vertically-center">
                            <span style={{left: '18%'}} className="review-card-vertically-center review-vendor-mobile-review">
                                <span className="vendor-name-mobile-review" onClick={() => this.goToProfile(this.props.card.vendor)}>
                                    {
                                        _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }) ?
                                            _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }).displayName : ''
                                    }
                                </span>
                                <div>
                                <span className="review-count">{
                                    _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }) ?
                                        _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }).reviewCount : ''
                                } Reviews</span>
                                <span className="review-follower">{
                                    _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }) ?
                                        _.find(this.props.homeReducer.reviewVendor, { username: this.props.card.vendor }).followerCount : ''
                                } Followers</span>
                            </div>
                                </span>
                        </span>
                        </div>
                        <div className="review-second-row">
                            <span className="review-card-description">{_.truncate(this.props.card.content, {
                                length: 150
                            })}</span>
                            <img className="review-card-user-img" onClick={() => this.goToUser(this.props.card.user)} src={
                                _.find(this.props.homeReducer.users, { username: this.props.card.user }) ?
                                    _.find(this.props.homeReducer.users, { username: this.props.card.user }).profilePicture : ''
                            } alt=""/>
                        </div>
                        <div className="review-third-row" style={{
                            background: `url(${curvyDivArray[this.props.index]}), no-repeat`,
                            backgroundSize: 'cover',
                            height: '180px',
                            backgroundColor: 'white'
                        }}>
                            <p className="review-card-user-name" onClick={() => this.goToUser(this.props.card.user)}>By {
                                _.find(this.props.homeReducer.users, { username: this.props.card.user }) ?
                                    _.find(this.props.homeReducer.users, { username: this.props.card.user }).displayName : ''
                            }</p>
                            <div style={{ textAlign: 'center' }}>
                                <span className="review-rating">{
                                    _.find(this.props.homeReducer.users, { username: this.props.card.user }) ?
                                        _.find(this.props.homeReducer.users, { username: this.props.card.user }).rating : ''
                                }<FaStar className="review-star" /></span>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <span  className="review-count" style={{ color: 'white', float: 'none' }}>{
                                    _.find(this.props.homeReducer.users, { username: this.props.card.user }) ?
                                        _.find(this.props.homeReducer.users, { username: this.props.card.user }).reviewCount : ''
                                } Reviews</span>
                                <span className="review-follower" style={{ color: 'white', float: 'none' }}>{
                                    _.find(this.props.homeReducer.users, { username: this.props.card.user }) ?
                                        _.find(this.props.homeReducer.users, { username: this.props.card.user }).followerCount : ''
                                } Followers</span>
                            </div>

                            {/*<div className="review-card-img-container">*/}
                            {/*<img className="review-card-img" src={this.props.card.image} alt=""/>*/}
                            {/*<p className="review-card-name">{this.props.card.name}</p>*/}
                            {/*<span className="review-rating">{this.props.card.rating}<FaStar className="review-star" /></span>*/}
                            {/*<div style={{ marginTop: '10px' }}>*/}
                            {/*<span className="review-count">{this.props.card.reviews} Reviews</span>*/}
                            {/*<span className="review-follower">{this.props.card.follower} Followers</span>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default connect((state) => state)(ReviewCard);