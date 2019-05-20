/* eslint-disable no-useless-escape, radix */
import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
import {
    Helmet
} from 'react-helmet';
import {
    Link
} from 'react-router-dom';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import loader from '../../assets/icons/loader.svg';
import Comment from '../../component/comment';
import {
    asyncFetchVideo,
    asyncLikeDislikeExperienceVideo,
    asyncFollowUnfollowUser,
    asyncShareModal,
    asyncAddVideoComments,
    asyncFetchComments
} from '../../action/index';
import {
    MdThumbUp,
    MdThumbDown,
    MdModeComment,
    MdShare,
    MdSend
} from 'react-icons/lib/md';
import '../../assets/css/video.css';
import {convertDate, googleTimeFormat, imageTransformation} from "../../util/util";
import {toggleLoginModal} from "../../action/asyncaction/user.asyncaction";

let FIRST_LOAD = false;

class VideoContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false
        };
    }

    componentWillMount() {
        window.scrollTo(0, 0);
        const {
            experienceId
        } = this.props.match.params;
        const tempCookie = new Cookies();
        FIRST_LOAD = true;
        this.props.dispatch(asyncFetchVideo(experienceId, tempCookie.get('token')))
            .then((data) => {
                this.props.dispatch(asyncFetchComments(experienceId, tempCookie.get('token')));
                FIRST_LOAD = false;
            });
    }

    componentWillReceiveProps(nextProps) {
        if (!FIRST_LOAD) {
            if (!_.isEmpty(nextProps.meReducer.userData)) {
                if (this.props.meReducer.userData !== nextProps.meReducer.userData) {
                    const {
                        experienceId
                    } = nextProps.match.params;
                    nextProps.dispatch(asyncFetchVideo(experienceId, nextProps.meReducer.userData.accessToken))
                        .then((data) => {
                            setTimeout(() => {
                                nextProps.dispatch(asyncFetchComments(experienceId, nextProps.meReducer.userData.accessToken));
                            }, 500);
                        });
                }
            }
        }
    }

    getId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            return match[2];
        } else {
            return 'error';
        }
    };

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
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };

    followUnfollow = (username, status) => {
        const tempCookie = new Cookies();
        if (tempCookie.get('token')) {
            const actionData = {
                username,
                status,
                token: tempCookie.get('token')
            };
            this.props.dispatch(asyncFollowUnfollowUser(actionData));
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };

    addComment = (articleId) => {
        if (this.props.meReducer.isLoggedIn) {
            if (!this.state.showLoading) {
                this.setState({
                    showLoading: true
                });
                setTimeout(() => {
                    console.log('hit');
                    const tempCookie = new Cookies();
                    const comment = document.getElementById('video-comment') ? document.getElementById('video-comment').value : '';
                    this.props.dispatch(asyncAddVideoComments(articleId, comment, tempCookie.get('token')))
                        .then((data) => {
                            this.setState({
                                showLoading: false
                            });
                            if (data.success) {
                                if (document.getElementById('video-comment')) {
                                    document.getElementById('video-comment').value = '';
                                }
                            }
                        });
                }, 100);
            }
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };

    renderMetaTags = () => {
        const videoData = this.props.videoReducer.video;
        return (
            <Helmet
                titleTemplate="%s">
                <title>{videoData.title}</title>
                <meta name="fragment" content="!"/>
                <meta name="description" content={`${videoData.metaDescription}`}/>
                <link rel="canonical" href={`https://www.trustvardi.com${this.props.location.pathname}`}/>
                <link rel="alternate" hreflang="en" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta name="robots" content="index, follow"/>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
                <meta property="og:title" content={`${videoData.title}`}/>
                <meta property="og:description" content={`${videoData.metaDescription}`}/>
                <meta property="og:locale" content="en_US"/>
                <meta property="og:url" content={`https://www.trustvardi.com${this.props.location.pathname}`}/>
                <meta property="og:type" content="article"/>
                <meta property="og:image" content={`${videoData.metaImage}`}/>
                <meta property="og:site_name" content="trustvardi.com"/>
                <meta property="article:section" content="Lifestyle"/>
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:site" content="@trustvardi"/>
                <meta name="twitter:creator" content="trustvardi.com"/>
                <meta name="twitter:title" content={`${videoData.title}`}/>
                <meta name="twitter:description" content={`${videoData.metaDescription}`}/>
                <meta name="twitter:image" content={`${videoData.metaImage}`}/>
                <link rel="amphtml" href={`https://www.trustvardi.com/amp/experience/${videoData.articleId}`}/>
                <script type="application/ld+json">
                    {`
                        [{
                            "@context": "http://schema.org",
                            "@type": "VideoObject",
                            "name": "${videoData.title}",
                            "description": "${videoData.metaDescription}",
                            "thumbnailUrl": "${videoData.metaImage}",
                            "uploadDate": "${googleTimeFormat(parseInt(videoData.creationDate))}"
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
                                    "@id": "https://www.trustvardi.com/products",
                                    "name": "EXPERIENCE",
                                    "description": "experience"
                                }
                            }, {
                                "@type": "ListItem",
                                "position": 3,
                                "item": {
                                    "@id": "https://www.trustvardi.com/products/${videoData.articleId}",
                                    "name": "${videoData.title}",
                                    "description": "masterPostTitle"
                                }
                            }]
                        }]
                    `}
                </script>
            </Helmet>
        );
    };


    render() {
        const {
            video,
            vendor,
            user,
            loading,
            comments,
            commentUser
        } = this.props.videoReducer;
        if (!_.isEmpty(video) && !loading) {
            if (window.innerWidth > 768) {
                return (
                    <div className="video-container-div">
                        {this.renderMetaTags()}
                        <div className="video-container-inner-div">
                            <iframe title="Experience Video" className="youtube-embed-video-page"
                                    src={`//www.youtube.com/embed/${this.getId(video.video.link)}`} frameBorder="0"
                                    allowFullScreen></iframe>
                            <div className="video-details">
                                <span className="video-detail-title">{video.title}</span>
                                <div className="video-secondary-detail">
                                    <div className="video-details-main-container">
                                        <div className="video-profile-pic-container">
                                            <img className="video-profile-pic" src={imageTransformation(user.profilePicture, 100)} alt=""/>
                                        </div>
                                        <div style={{marginTop: '10px'}} className="video-profile-pic-details">
                                        <span className="video-user-name">
                                        <Link rel="nofollow" style={{ color: 'black', textDecoration: 'none' }} to={{ pathname: `/user/${user.username}/reviews` }}> {user.displayName}</Link>
                                        <span
                                            className="video-published-date">Published On {convertDate(video.creationDate)}</span></span>
                                            <span className="video-user-vendor-name">For <Link rel="nofollow" style={{ color: 'black', textDecoration: 'none' }} to={{ pathname: `/profile/${video.vendor}` }}> {vendor.displayName}</Link></span>
                                            <span className="video-description">{video.metaDescription}</span>
                                            {!user.isFollowing &&
                                            <span className="video-follow-button"
                                                  onClick={() => this.followUnfollow(user.username, true)}>Follow</span>
                                            }
                                            {user.isFollowing &&
                                            <span className="video-follow-button"
                                                  onClick={() => this.followUnfollow(user.username, false)}>Following</span>
                                            }
                                            <div className="video-action-button-container">
                                                <div className="video-action-button-no-share-container">
                                                <span className="video-action-button">
                                                    {video.isLiked &&
                                                    <MdThumbUp onClick={() => this.cardAction('like', false, video._id)}
                                                               className="video-action-button-icon active"/>
                                                    }
                                                    {!video.isLiked &&
                                                    <MdThumbUp onClick={() => this.cardAction('like', true, video._id)}
                                                               className="video-action-button-icon"/>
                                                    }
                                                    {video.likeCount || 0} Likes
                                                </span>
                                                    <span className="video-action-button">
                                                    {video.isDisliked &&
                                                    <MdThumbDown
                                                        onClick={() => this.cardAction('dislike', false, video._id)}
                                                        className="video-action-button-icon active"/>
                                                    }
                                                        {!video.isDisliked &&
                                                        <MdThumbDown
                                                            onClick={() => this.cardAction('dislike', true, video._id)}
                                                            className="video-action-button-icon"/>
                                                        }
                                                        {video.dislikeCount || 0} Dislikes
                                            </span>
                                                    <span className="video-action-button">
                                                <MdModeComment className="video-action-button-icon"/>
                                                        {video.commentCount || 0} Comments
                                            </span>
                                                </div>
                                                <span
                                                    onClick={() => this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/experience/${video.articleId}`))}
                                                    className="video-share-button">
                                                <MdShare style={{verticalAlign: 'middle', marginRight: '10px'}}/>
                                                <span style={{verticalAlign: 'middle'}}>Share</span>
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="video-comment-container">
                                        <span className="video-comment-label">Comments</span>
                                        <div className="video-add-comment-container">
                                            <input id="video-comment" placeholder="Write your own comment."
                                                   onKeyUp={(event) => {
                                                       if (event.keyCode === 13) {
                                                           this.addComment(video.articleId)
                                                       }
                                                   }} className="add-comment-input" type="text"/>
                                            <MdSend onClick={() => this.addComment(video.articleId)}
                                                   style={{padding:'1px 25px'}} className="add-comment-button"/>
                                        </div>
                                        {this.props.videoReducer.commentsLoading &&
                                        <div style={{textAlign: 'center'}}>
                                            <img className="video-comments-loader" src={loader} alt=""/>
                                        </div>
                                        }
                                        {!this.props.videoReducer.commentsLoading &&
                                        <div>
                                            {comments && comments.length > 0 && comments.map((value, index) => {
                                                return (
                                                    <Comment key={index} index={index} history={this.props.history} card={value}
                                                             user={commentUser}/>
                                                );
                                            })}
                                            {comments.length === 0 &&
                                            <div style={{height: '30px'}}>

                                            </div>
                                            }
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="video-container-div">
                        <div className="video-container-inner-div">
                            {this.renderMetaTags()}
                            <iframe title="Experience Video" className="youtube-embed-video-page"
                                    src={`//www.youtube.com/embed/${this.getId(video.video.link)}`} frameBorder="0"
                                    allowFullScreen></iframe>
                            <div className="video-details">
                                <span className="video-detail-title">{video.title}</span>
                                <div className="video-secondary-detail">
                                    <div className="video-details-main-container">
                                        <div className="video-profile-pic-container">
                                            <img className="video-profile-pic" src={imageTransformation(user.profilePicture, 100)} alt=""/>
                                        </div>
                                        <div style={{marginTop: '10px'}} className="video-profile-pic-details">
                                        <Link rel="nofollow" to={{ pathname: `/user/${user.username}/reviews` }} style={{ textDecoration: 'none', color: 'black' }} className="video-user-name">{user.displayName}
                                        </Link>
                                            <span
                                                className="video-published-date">Published On {convertDate(video.creationDate)}</span>
                                            <Link rel="nofollow" style={{ textDecoration: 'none', color: 'black' }} to={{ pathname: `/profile/${vendor.username}` }} className="video-user-vendor-name">For {vendor.displayName}</Link>
                                            <span className="video-description">{video.metaDescription}</span>
                                            {!user.isFollowing &&
                                            <span className="video-follow-button"
                                                  onClick={() => this.followUnfollow(user.username, true)}>Follow</span>
                                            }
                                            {user.isFollowing &&
                                            <span className="video-follow-button"
                                                  onClick={() => this.followUnfollow(user.username, false)}>Following</span>
                                            }
                                            <div className="video-action-button-container">
                                                <div>
                                                    <div className="vendor-action-container-mobile">
                                                        {video.isLiked &&
                                                        <MdThumbUp
                                                            className="vendor-action-mobile-icon active"
                                                            onClick={() => this.cardAction('like', false, video._id)}/>
                                                        }
                                                        {!video.isLiked &&
                                                        <MdThumbUp
                                                            className="vendor-action-mobile-icon"
                                                            onClick={() => this.cardAction('like', true, video._id)}/>
                                                        }
                                                        <span className="vendor-action-mobile-text">
                                                            {video.likeCount || 0} Likes
                                                        </span>
                                                    </div>
                                                    <div className="vendor-action-container-mobile">
                                                        {video.isDisliked &&
                                                        <MdThumbDown
                                                            className="vendor-action-mobile-icon active"
                                                            onClick={() => this.cardAction('dislike', false, video._id)}/>
                                                        }
                                                        {!video.isDisliked &&
                                                        <MdThumbDown
                                                            className="vendor-action-mobile-icon"
                                                            onClick={() => this.cardAction('dislike', true, video._id)}/>
                                                        }
                                                        <span className="vendor-action-mobile-text">
                                                            {video.dislikeCount || 0} Dislikes
                                                        </span>
                                                    </div>
                                                    <div className="vendor-action-container-mobile">
                                                        <MdModeComment className="vendor-action-mobile-icon"/>
                                                        <span
                                                            className="vendor-action-mobile-text">{video.commentCount || 0} Comments</span>
                                                    </div>
                                                    <div className="vendor-action-container-mobile"
                                                         onClick={() => this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/experience/${video.articleId}`))}>
                                                        <MdShare className="vendor-action-mobile-icon"/>
                                                        <span className="vendor-action-mobile-text">Share</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="video-comment-container">
                                        <span className="video-comment-label">Comments</span>
                                        {this.props.videoReducer.commentsLoading &&
                                        <div style={{textAlign: 'center'}}>
                                            <img className="video-comments-loader" src={loader} alt=""/>
                                        </div>
                                        }
                                        {!this.props.videoReducer.commentsLoading &&
                                        <div>
                                            {comments && comments.length > 0 && comments.map((value, index) => {
                                                return (
                                                    <Comment key={index} index={index} history={this.props.history} card={value}
                                                             user={commentUser}/>
                                                );
                                            })}
                                            {comments.length === 0 &&
                                            <div style={{height: '30px'}}>

                                            </div>
                                            }
                                        </div>
                                        }
                                        <div className="video-add-comment-container">
                                            <input id="video-comment" placeholder="Write your own comment."
                                                   onKeyUp={(event) => {
                                                       if (event.keyCode === 13) {
                                                           this.addComment(video.articleId)
                                                       }
                                                   }} className="add-comment-input" type="text"/>
                                            <MdSend onClick={() => this.addComment(video.articleId)}
                                                    style={{padding:'1px 25px'}} className="add-comment-button"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        } else if (_.isEmpty(video) && loading) {
            return (
                <div className="vendor-loader-container-desktop">
                    <img alt="" className="vendor-loader-desktop" src={loader}/>
                </div>
            );
        } else {
            return (
                <div>

                </div>
            )
        }
    }
}

export default connect((state) => state)(VideoContainer);