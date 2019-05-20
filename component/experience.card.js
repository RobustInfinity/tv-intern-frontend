/* eslint-disable array-callback-return, radix */
import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
import {
    Link
} from 'react-router-dom';
import {
    asyncLikeDislikeExperienceVideo
} from '../action/index';
import Cookies from 'universal-cookie';
import ExperienceVideoModal from './experience.video.modal';
import FaPlayCircle from 'react-icons/lib/fa/play-circle';
import MdThumbUp from 'react-icons/lib/md/thumb-up';
import MdThumbDown from 'react-icons/lib/md/thumb-down';
import ReactModal from 'react-modal';
import _ from 'lodash';
import '../assets/css/experience.card.css';
import { imageTransformation } from '../util/util';

const videocardStyle = {
    overlay: {
        zIndex: '12'
    },
    content: {
        top: '30%',
        left: '0px',
        right: '0px',
        bottom: '30%'
    }
};

const videocardDesktopStyle = {
    content: {
        left: '20%',
        right: '20%',
        top: '20%',
        bottom: '20%'
    },
    overlay: {
        zIndex: '12'
    }
};


class ExperienceCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videoLink: '',
            experienceModal: false
        };
    }

    cardAction = (action, status, _id) => {
        const tempCookies = new Cookies();
        const token = tempCookies.get('token');

        const actionData = {
            action,
            status,
            experience: _id,
            token
        };


        if (token) {
            this.props.dispatch(asyncLikeDislikeExperienceVideo(actionData));
        }
    };


    closeModal = () => {
        this.setState({
            experienceModal: false,
            videoLink: ''
        });
        document.body.style.overflow = 'auto';
    };


    render() {

        let vendorReducerData = [];

        if(this.props.match.path.includes('/profile/:profileId')) {
            vendorReducerData.push(this.props.vendorReducer.vendor);
        } else {
            vendorReducerData = this.props.homeReducer.experienceVendor;
        }

        let marginBottom = '';

        if (this.props.match.url.includes('showall')) {
            marginBottom = '40px'
        }

        if (window.innerWidth > 768) {
            return (
                <div style={{ marginBottom }} className="experience-card-container">
                    <ReactModal
                        isOpen={this.state.experienceModal}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={videocardDesktopStyle}
                    >
                        <ExperienceVideoModal url={this.state.videoLink}  closeFunction={this.closeModal} />
                    </ReactModal>
                    <div className="experience-card-main">
                        <Link style={{ height: '100%', width: '100%' }} rel="nofollow" to={`/experience/${this.props.card.articleId}`}>
                            <div className="experience-card-img"
                                 style={{backgroundImage: `url(${imageTransformation(this.props.card.video.thumbnail, 300)})`}}
                            >
                                {this.props.card.vendorType === 'product' &&
                                <span className="product-badge">Product</span>
                                }
                                {this.props.card.vendorType === 'service' &&
                                <span className="service-badge">Service</span>
                                }
                                <FaPlayCircle className="experience-card-video-play-icon"/>
                            </div>
                        </Link>
                    </div>
                    <div className="experience-second-row">
                        {/*<img className="experience-user-image experience-card-vertically-center"*/}
                             {/*src={_.find(vendorReducerData, {username: this.props.card.vendor}).profilePicture}*/}
                             {/*alt=""/>*/}
                        <div className="experience-data">
                            <div className="experience-card-detail-holder experience-card-vertically-center">
                                <Link style={{ color: 'black' }} rel="nofollow" to={`/experience/${this.props.card.articleId}`}>
                                    <span className="experience-card-vendor-name experience-card-vertically-center">{this.props.card.title}</span>
                                </Link>
                                {/*{parseInt(this.props.card.rating) < 3 &&*/}
                                    {/*<span className="experience-card-vendor-rating-poor experience-card-vertically-center">*/}
                                    {/*<span className="experience-card-rating-holder">{this.props.card.rating}*/}
                                        {/*<FaStar style={{marginLeft: '5px'}}/>*/}
                                    {/*</span>*/}
                                {/*</span>*/}
                                {/*}*/}
                                {/*{parseInt(this.props.card.rating) > 3 &&*/}
                                {/*<span className="experience-card-vendor-rating experience-card-vertically-center">*/}
                                    {/*<span className="experience-card-rating-holder">{this.props.card.rating}*/}
                                        {/*<FaStar style={{marginLeft: '5px'}}/>*/}
                                    {/*</span>*/}
                                {/*</span>*/}
                                {/*}*/}
                            </div>
                        </div>
                    </div>
                    <div className="experience-third-row">
                        <div className="experience-description-holder">
                        <span
                            className="experience-card-description">{_.truncate(this.props.card.video.description, {
                            length: 100
                        })}</span>
                        </div>
                        <div className="experience-card-action">
                            {this.props.card.isLiked &&
                                <span ><MdThumbUp onClick={() => this.cardAction('like', false, this.props.card._id)} className="experience-card-action-like-icon-active"/> <span
                                    className="experience-card-action-like-count">{this.props.card.likeCount}</span></span>
                            }

                            {!this.props.card.isLiked &&
                            <span><MdThumbUp onClick={() => this.cardAction('like', true, this.props.card._id)} style={{ fill: 'rgb(255, 159, 0)!important' }} className="experience-card-action-like-icon"/> <span
                                className="experience-card-action-like-count">{this.props.card.likeCount}</span></span>
                            }
                            {this.props.card.isDisliked &&
                                <span  className="experience-card-action-dislike-icon"><MdThumbDown onClick={() => this.cardAction('dislike', false, this.props.card._id)} style={{ fill: 'rgb(255, 159, 0)' }} /> <span
                                    className="experience-card-action-dislike-count">{this.props.card.dislikeCount}</span></span>
                            }
                            {!this.props.card.isDisliked &&
                                <span  className="experience-card-action-dislike-icon"><MdThumbDown onClick={() => this.cardAction('dislike', true, this.props.card._id)}/> <span
                                    className="experience-card-action-dislike-count">{this.props.card.dislikeCount}</span></span>
                            }
                            {/*<span className="experience-card-vertically-center" style={{right: '0'}}><MdShare/> <span*/}
                                {/*style={{marginLeft: '2px'}}>Share</span></span>*/}
                        </div>
                    </div>
                </div>
            );
        } else if (window.innerWidth <= 768) {


            return (
                <div className="experience-card-container">
                    <ReactModal
                        isOpen={this.state.experienceModal}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={videocardStyle}
                    >
                        <ExperienceVideoModal url={this.state.videoLink}  closeFunction={this.closeModal} />
                    </ReactModal>
                    <div className="experience-card-main">
                        <Link style={{ height: '100%', width: '100%' }} rel="nofollow" to={`/experience/${this.props.card.articleId}`}>
                            <div className="experience-card-img" style={{backgroundImage: `url(${imageTransformation(this.props.card.video.thumbnail, 200)})`}}
                            >
                                {this.props.card.vendorType === 'product' &&
                                <span className="product-badge">Product</span>
                                }
                                {this.props.card.vendorType === 'service' &&
                                <span className="service-badge">Service</span>
                                }
                                <FaPlayCircle className="experience-card-video-play-icon"/>
                            </div>
                        </Link>
                    </div>
                    <div className="experience-second-row">
                        <Link style={{ color: 'black', textDecoration: 'none' }} rel="nofollow" to={`/experience/${this.props.card.articleId}`}>
                            <div className="experience-second-row-title">{this.props.card.title}</div>
                        </Link>
                        <div className="experience-second-row-description">{_.truncate(this.props.card.metaDescription, {
                            length: 100
                        })}</div>
                    </div>
                    {/*<div className="experience-card-action">*/}
                        {/*{!this.props.card.isLiked &&*/}
                        {/*<span><MdThumbUp onClick={() => this.cardAction('like', true, this.props.card._id)} className="experience-card-action-like-icon"/> <span*/}
                            {/*className="experience-card-action-like-count">{this.props.card.likeCount}</span></span>*/}
                        {/*}*/}
                        {/*{this.props.card.isLiked &&*/}
                        {/*<span><MdThumbUp onClick={() => this.cardAction('like', false, this.props.card._id)} className="experience-card-action-like-icon-active"/> <span*/}
                            {/*className="experience-card-action-like-count">{this.props.card.likeCount}</span></span>*/}
                        {/*}*/}
                        {/*{this.props.card.isDisliked &&*/}
                        {/*<span className="experience-card-action-dislike-icon"><MdThumbDown onClick={() => this.cardAction('dislike', false, this.props.card._id)} style={{ fill: 'rgb(255, 159, 0)' }}/> <span*/}
                            {/*className="experience-card-action-dislike-count">{this.props.card.dislikeCount}</span></span>*/}
                        {/*}*/}
                        {/*{!this.props.card.isDisliked &&*/}
                        {/*<span className="experience-card-action-dislike-icon"><MdThumbDown onClick={() => this.cardAction('dislike', true, this.props.card._id)} /> <span*/}
                            {/*className="experience-card-action-dislike-count">{this.props.card.dislikeCount}</span></span>*/}
                        {/*}*/}
                        {/*/!*<span className="experience-card-vertically-center" style={{right: '0'}}><MdShare/> <span*!/*/}
                        {/*/!*style={{marginLeft: '2px'}}>Share</span></span>*!/*/}
                    {/*</div>*/}
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

export default connect((state) => state, mapDispatchToProps)(ExperienceCard);