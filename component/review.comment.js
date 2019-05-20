/* eslint-disable array-callback-return, no-unused-vars */
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import Cookies from 'universal-cookie';
import ReactModal from 'react-modal';
import AddReview from './add.review';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Rating from './rating';
import {
    asyncFollowUnfollowUser,
    asyncLikeReview,
    asyncAddCommentReview,
    toggleLoginModal,
    asyncDeleteReview,
    asyncShareModal,
    asyncDeleteComment
} from '../action/index';
import Lightbox from 'lightbox-react';
import {
    FaUser,
} from 'react-icons/lib/fa';
import {
    MdThumbUp,
    MdDelete,
    MdEdit,
    MdShare
} from 'react-icons/lib/md';
import {
    convertDate, imageTransformation
} from '../util/util';
import _ from 'lodash';
import '../assets/css/trending.card.css';
import '../assets/css/review.comment.css';

let LOADER = false;

const mobileReviewModalStyle = {
    content: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px'
    },
    overlay: {
        zIndex: '11'
    }
};

const desktopReviewModalStyle = {
    content: {
        top: '50%',
        bottom: '0',
        left: '50%',
        right: '0',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        display: 'table',
        width: '45%'
    },
    overlay: {
        zIndex: '11'
    }
};

class ReviewComment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            title: '',
            user: '',
            vendor: '',
            rating: 1,
            content: '',
            reviewModal: false,
            openLightBox: false,
            photoIndex: 0,
            images: []
        };
    }

    componentWillMount() {
        if (this.props.card.media.length > 0) {
            const imagesArray = this.props.card.media
            const imageLinkArray = [];
            imagesArray.map((value) => {
                imageLinkArray.push(value.link);
            });
            this.setState({
                images: imageLinkArray
            });
        }
    }

    cardAction = (username, status) => {
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

    likeReview = (review, status) => {
        const tempCookie = new Cookies();
        if (tempCookie.get('token')) {
            const actionData = {
                review,
                status,
                token: tempCookie.get('token')
            };
            this.props.dispatch(asyncLikeReview(actionData));
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };

    renderFollowbutton = () => {
        let userReducerData = this.props.vendorReducer.users;

        if (this.props.match.path === '/user/:userId/:type?') {
            userReducerData = [this.props.userReducer.user];
        }

        if (!_.isEmpty(this.props.meReducer.userData)) {
            if (this.props.meReducer.userData.user.username !== this.props.card.user) {
                if (_.find(userReducerData, { username: this.props.card.user }).isFollowing) {
                    return (
                        <button className="review-follow-following-button"
                            onClick={() => this.cardAction(this.props.card.user, false)}>Following</button>
                    );
                } else {
                    return (
                        <button className="review-follow-following-button"
                            onClick={() => this.cardAction(this.props.card.user, true)}>Follow</button>
                    );
                }
            } else {
                return (
                    <div></div>
                );
            }
        } else {
            return (
                <button className="review-follow-following-button"
                    onClick={() => this.cardAction(this.props.card.user, true)}>Follow</button>
            );
        }
    };

    addComment = (review) => {
        const tempCookies = new Cookies();
        if (tempCookies.get('token')) {
            if (this.state.comment.length > 0 && this.state.comment !== '<p><br></p>') {
                LOADER = true;
                const actionData = {
                    comment: this.state.comment,
                    review,
                    token: tempCookies.get('token')
                };
                this.props.dispatch(asyncAddCommentReview(actionData))
                    .then((data) => {
                        LOADER = false;
                        if (data.success) {
                            this.setState({
                                comment: '',
                            });
                        }
                    })
                    .catch((error) => {
                        LOADER = false;
                    });
            } else {
                alert('You need to add comment');
                LOADER = false;
            }
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };


    goToProfile = (vendor) => {
        this.props.history.push({
            pathname: `/profile/${vendor}`
        });
    };

    goToUser = (user) => {
        this.props.history.push({
            pathname: `/user/${user}/reviews`
        });
    };

    closeModal = () => {
        this.setState({
            reviewModal: false
        })
    };

    deleteReview = () => {
        const tempCookies = new Cookies();
        const token = tempCookies.get('token');
        const vendor = this.props.card.vendor;
        if (token) {
            this.props.dispatch(asyncDeleteReview({
                token,
                vendor: this.props.card.vendor,
                reviewId: this.props.card._id
            }, false))
                .then((data) => {
                    if (data && this.props.match.path === '/review/:reviewId') {
                        this.props.history.push({
                            pathname: `/profile/${vendor}`
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };




    deleteComment = (commentId) => {
        const tempCookie = new Cookies();
        if (tempCookie.get('token') && this.props.meReducer.isLoggedIn) {
            this.props.dispatch(asyncDeleteComment(this.props.card._id, commentId, tempCookie.get('token')));
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };

    handleChange = (html) => {
        if (html !== '<p><br></p>') {
            this.setState({
                comment: html
            });
        } else {
            this.setState({
                comment: ''
            });
        }
    };

    render() {


        let userReducerData = this.props.vendorReducer.users;


        if (this.props.match.path === '/user/:userId/:type?') {
            userReducerData = this.props.userReducer.reviewUser;
        }

        if (this.props.match.path === '/admin/profile/:profileId/') {
            userReducerData = this.props.adminReducer.users;
        }


        if (this.props.match.path === '/review/:reviewId') {
            userReducerData = this.props.reviewReducer.user;
        }


        if (window.innerWidth > 768) {
            let margin = '60px';
            // if (this.props.match.path === '/profile/:profileId') {
            //     margin = '6%';
            // }
            return (
                <div className="review-comment-container">
                    <ReactModal
                        isOpen={this.state.reviewModal}
                        onRequestClose={this.closeModal}
                        style={desktopReviewModalStyle}
                    >
                        <AddReview match={this.props.match} data={this.state} closeModal={this.closeModal} />
                    </ReactModal>
                    {this.state.openLightBox && (
                        <Lightbox
                            mainSrc={this.state.images[this.state.photoIndex]}
                            nextSrc={this.state.images[(this.state.photoIndex + 1) % this.state.images.length]}
                            prevSrc={this.state.images[(this.state.photoIndex + this.state.images.length - 1) % this.state.images.length]}
                            onCloseRequest={() => this.setState({ openLightBox: false })}
                            onMovePrevRequest={() =>
                                this.setState({
                                    photoIndex: (this.state.photoIndex + this.state.images.length - 1) % this.state.images.length,
                                })
                            }
                            onMoveNextRequest={() =>
                                this.setState({
                                    photoIndex: (this.state.photoIndex + 1) % this.state.images.length,
                                })
                            }
                        />
                    )}
                    <div style={{ paddingBottom: '5px' }}>
                        <div style={{ height: '50px', position: 'relative' }}>
                            {this.props.match.path !== '/user/:userId/:type?' &&
                                <img onClick={() => this.goToUser(this.props.card.user)} className="review-user-picture"
                                    src={
                                        imageTransformation(
                                            _.find(userReducerData, { username: this.props.card.user }) ? _.find(userReducerData, { username: this.props.card.user }).profilePicture : '',
                                            100
                                        )
                                    }
                                    alt="" />
                            }
                            {this.props.match.path === '/user/:userId/:type?' &&
                                <img onClick={() => this.goToProfile(this.props.card.vendor)} className="review-user-picture"
                                    src={imageTransformation(_.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }) ? _.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }).profilePicture : '',
                                        100
                                    )}
                                    alt="" />
                            }
                            <div style={{ left: margin }} className="user-detail-container">
                                {this.props.match.path !== '/user/:userId/:type?' &&
                                    <span onClick={() => this.goToUser(this.props.card.user)}
                                        className="review-user-name">{_.find(userReducerData, { username: this.props.card.user }) ? _.find(userReducerData, { username: this.props.card.user }).displayName : ''}</span>
                                }
                                {this.props.match.path === '/user/:userId/:type?' &&
                                    <span onClick={() => this.goToProfile(this.props.card.vendor)}
                                        className="review-user-name">{_.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }) ? _.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }).displayName : ''}</span>
                                }
                                <span className="review-date">Posted On {convertDate(this.props.card.time)}</span>
                                {/*{this.props.match.path !== '/user/:userId/:type?' &&*/}
                                {/*// this.renderFollowbutton()*/}
                                {/*}*/}
                            </div>
                        </div>
                        <div style={{ marginLeft: margin, marginTop: '10px' }}>
                            {this.props.match.path === '/user/:userId/:type?' &&
                                <span
                                    className="review-review-count">{_.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }) ? _.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }).reviewCount : 0} Reviews</span>
                            }
                            {this.props.match.path !== '/user/:userId/:type?' &&
                                <span
                                    className="review-review-count">{_.find(userReducerData, { username: this.props.card.user }) ? _.find(userReducerData, { username: this.props.card.user }).reviewCount : 0} Reviews</span>
                            }
                            {this.props.match.path !== '/user/:userId/:type?' &&
                                <span
                                    className="review-review-follower">{_.find(userReducerData, { username: this.props.card.user }) ? _.find(userReducerData, { username: this.props.card.user }).followerCount : 0} Followers</span>
                            }
                            {this.props.match.path === '/user/:userId/:type?' &&
                                <span
                                    className="review-review-follower">{_.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }) ? _.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }).followerCount : ''} Followers</span>
                            }
                        </div>
                        <div style={{ position: 'relative', marginLeft: '55px', marginTop: '15px' }}>
                            <span style={{
                                verticalAlign: 'middle',
                                padding: '5px 5px',
                                color: 'white',
                                borderRadius: '2px',
                                fontSize: '12px',
                                display: 'inline-block'
                            }}>
                                <Rating rating={this.props.card.rating} width={'75px'} fontSize={'14px'} />
                            </span>
                            <span className="review-title">{this.props.card.title}</span>
                        </div>
                        <div style={{ marginLeft: margin }} className="review-comment"
                            dangerouslySetInnerHTML={{ __html: this.props.card.content }}></div>
                        {this.props.card.media.length > 0 &&
                            <div style={{ marginTop: '20px' }}>
                                {this.props.card.media.map((value, i) => {
                                    return (
                                        <img onClick={() => {
                                            this.setState({
                                                openLightBox: true,
                                                photoIndex: i
                                            });
                                        }} className="review-images" key={i} alt="" src={imageTransformation(value.link, 300)} />
                                    )
                                })}
                            </div>
                        }
                        <div style={{ marginLeft: margin }} className="review-action-button-holder">
                            <span className="review-action-button">
                                {!this.props.card.isLiked &&
                                    <MdThumbUp onClick={() => this.likeReview(this.props.card._id, true)}
                                        className="review-action-button-icon" />
                                }
                                {this.props.card.isLiked &&
                                    <MdThumbUp onClick={() => this.likeReview(this.props.card._id, false)}
                                        className="review-action-button-icon" style={{ fill: 'rgb(255, 159, 0)' }} />
                                }
                                {this.props.card.likeCount}
                            </span>
                            <span style={{ float: 'right' }}>
                                {this.props.meReducer.isLoggedIn && this.props.meReducer.userData.user.username === this.props.card.user &&
                                    <MdEdit onClick={() => {
                                        this.setState({
                                            reviewModal: true,
                                            title: this.props.card.title,
                                            content: this.props.card.content,
                                            rating: this.props.card.rating,
                                            vendor: this.props.card.vendor,
                                            user: this.props.card.user,
                                            media: this.props.card.media || []
                                        });
                                    }} className="review-edit-del-btn" />
                                }
                                {this.props.meReducer.isLoggedIn && this.props.meReducer.userData.user.username === this.props.card.user &&
                                    <MdDelete onClick={() => {
                                        if (window.confirm("Are you sure you want to delete your Review?")) {
                                            this.deleteReview();
                                        } else {
                                            console.log('cancel');
                                        }
                                    }} className="review-edit-del-btn" />
                                }
                                <MdShare onClick={() => {
                                    this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/review/${this.props.card._id}`))
                                }} className="review-edit-del-btn" />
                            </span>
                            {/*<span style={{ marginLeft: '20px' }} className="review-action-button"> {this.props.card.commentCount}</span>*/}
                        </div>
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        {this.props.card.comment &&
                            this.props.card.comment.map((value, i) => {
                                return (
                                    <div className="comment-reply-container" key={i}>
                                        <div className="comment-reply-user-pic-container">
                                            <img className="comment-reply-user-pic"
                                                src={imageTransformation(_.find(userReducerData, { username: value.user }) ? _.find(userReducerData, { username: value.user }).profilePicture : '', 100)}
                                                alt="" />
                                        </div>
                                        <div className="comment-reply-data-container">
                                            <div className="comment-reply-user-name">
                                                {_.find(userReducerData, { username: value.user }) ? _.find(userReducerData, { username: value.user }).displayName : ''}
                                            </div>
                                            {this.props.meReducer.isLoggedIn && this.props.meReducer.userData.user.username === value.user &&
                                                <span className="comment-delete-button" onClick={() => {
                                                    if (window.confirm("Are you sure your want to delete this comment?")) {
                                                        this.deleteComment(value._id);
                                                    }
                                                }}>Delete</span>
                                            }
                                            <div className="comment-reply-content" dangerouslySetInnerHTML={{ __html: value.comment }}></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div style={{ overflow: 'auto', width: '75%' }}>
                        <div className="review-comment-label-picture-container">
                            <FaUser className="review-comment-label-picture" />
                        </div>
                        <div className="write-comment-textarea-div">

                            <ReactQuill value={this.state.comment}
                                placeholder={'Write Your Comment Here...'}
                                onChange={this.handleChange} />
                        </div>
                        <button className="write-comment-send-button" onClick={() => this.addComment(this.props.card._id)}>
                            {LOADER &&
                                "SENDING"
                            }
                            {!LOADER &&
                                "SEND"
                            }
                        </button>
                    </div>
                </div>
            );
        } else if (window.innerWidth < 768) {
            let margin = '50px';
            return (
                <div className="review-comment-container">
                    <ReactModal
                        isOpen={this.state.reviewModal}
                        onRequestClose={this.closeModal}
                        style={mobileReviewModalStyle}>
                        <AddReview match={this.props.match} data={this.state} closeModal={this.closeModal} />
                    </ReactModal>
                    {this.state.openLightBox && (
                        <Lightbox
                            mainSrc={this.state.images[this.state.photoIndex]}
                            nextSrc={this.state.images[(this.state.photoIndex + 1) % this.state.images.length]}
                            prevSrc={this.state.images[(this.state.photoIndex + this.state.images.length - 1) % this.state.images.length]}
                            onCloseRequest={() => this.setState({ openLightBox: false })}
                            onMovePrevRequest={() =>
                                this.setState({
                                    photoIndex: (this.state.photoIndex + this.state.images.length - 1) % this.state.images.length,
                                })
                            }
                            onMoveNextRequest={() =>
                                this.setState({
                                    photoIndex: (this.state.photoIndex + 1) % this.state.images.length,
                                })
                            }
                        />
                    )}
                    <div style={{ height: '40px', position: 'relative' }}>
                        {this.props.match.path !== '/user/:userId/:type?' &&
                            <img onClick={() => this.goToUser(this.props.card.user)} className="review-user-picture"
                                src={imageTransformation(_.find(userReducerData, { username: this.props.card.user }).profilePicture, 100)} alt="" />
                        }
                        {this.props.match.path === '/user/:userId/:type?' &&
                            <img onClick={() => this.goToProfile(this.props.card.vendor)} className="review-user-picture"
                                src={imageTransformation(_.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }).profilePicture, 100)}
                                alt="" />
                        }
                        <div style={{ left: margin }} className="user-detail-container">
                            {this.props.match.path !== '/user/:userId/:type?' &&
                                <span onClick={() => this.goToUser(this.props.card.user)}
                                    className="review-user-name">{_.find(userReducerData, { username: this.props.card.user }).displayName}</span>
                            }
                            {this.props.match.path === '/user/:userId/:type?' &&
                                <span onClick={() => this.goToProfile(this.props.card.vendor)}
                                    className="review-user-name">{_.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }).displayName}</span>
                            }
                            <span className="review-date">Posted On {convertDate(this.props.card.time)}</span>
                            {/*{this.props.match.path !== '/user/:userId/:type?' &&*/}
                            {/*// this.renderFollowbutton()*/}
                            {/*}*/}
                        </div>
                    </div>
                    <div style={{ marginLeft: '0', marginTop: '10px' }}>
                        {this.props.match.path === '/user/:userId/:type?' &&
                            <span
                                className="review-review-count">{_.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }).reviewCount} Reviews</span>
                        }
                        {this.props.match.path !== '/user/:userId/:type?' &&
                            <span
                                className="review-review-count">{_.find(userReducerData, { username: this.props.card.user }).reviewCount} Reviews</span>
                        }
                        {this.props.match.path !== '/user/:userId/:type?' &&
                            <span
                                className="review-review-follower">{_.find(userReducerData, { username: this.props.card.user }).followerCount} Followers</span>
                        }
                        {this.props.match.path === '/user/:userId/:type?' &&
                            <span
                                className="review-review-follower">{_.find(this.props.userReducer.vendorWishlist, { username: this.props.card.vendor }).followerCount} Followers</span>
                        }
                    </div>
                    <div style={{ position: 'relative', marginLeft: '0', marginTop: '15px' }}>
                        <span style={{
                            display: "inline-block",
                            verticalAlign: 'middle',
                            padding: '5px 5px',
                            color: 'white',
                            borderRadius: '2px',
                            fontSize: '8px'
                        }}>
                            <Rating rating={this.props.card.rating} width={'75px'} fontSize={'10px'} />
                        </span>
                        <span className="review-title">{this.props.card.title}</span>
                    </div>
                    <div style={{ marginLeft: '0' }} className="review-comment"
                        dangerouslySetInnerHTML={{ __html: this.props.card.content }}></div>
                    {this.props.card.media.length > 0 &&
                        <div style={{ marginLeft: '6%', marginTop: '20px' }}>
                            {this.props.card.media.map((value, i) => {
                                return (
                                    <img onClick={() => {
                                        this.setState({
                                            openLightBox: true,
                                            photoIndex: i
                                        });
                                    }} className="review-images" key={i} alt="" src={imageTransformation(value.link, 300)} />
                                )
                            })}
                        </div>
                    }
                    <div style={{ marginLeft: '0' }} className="review-action-button-holder">
                        <span className="review-action-button">
                            {!this.props.card.isLiked &&
                                <MdThumbUp onClick={() => this.likeReview(this.props.card._id, true)}
                                    className="review-action-button-icon" />
                            }
                            {this.props.card.isLiked &&
                                <MdThumbUp onClick={() => this.likeReview(this.props.card._id, false)}
                                    className="review-action-button-icon" style={{ fill: 'rgb(255, 159, 0)' }} />
                            }
                            {this.props.card.likeCount}
                        </span>
                        <span style={{ float: 'right' }}>
                            {this.props.meReducer.isLoggedIn && this.props.meReducer.userData.user.username === this.props.card.user &&
                                <MdEdit onClick={() => {
                                    this.setState({
                                        reviewModal: true,
                                        title: this.props.card.title,
                                        content: this.props.card.content,
                                        rating: this.props.card.rating,
                                        vendor: this.props.card.vendor,
                                        user: this.props.card.user,
                                        media: this.props.card.media || []
                                    });
                                }} className="review-edit-del-btn" />
                            }
                            {this.props.meReducer.isLoggedIn && this.props.meReducer.userData.user.username === this.props.card.user &&
                                <MdDelete onClick={() => {
                                    if (window.confirm("Are you sure you want to delete your Review?")) {
                                        this.deleteReview();
                                    } else {
                                        console.log('cancel');
                                    }
                                }} className="review-edit-del-btn" />
                            }
                            <MdShare className="review-edit-del-btn" onClick={() => {
                                this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/review/${this.props.card._id}`))
                            }} />
                        </span>
                        {/*<span style={{ marginLeft: '20px' }} className="review-action-button"> {this.props.card.commentCount}</span>*/}
                        {/*<span onClick={() => { this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/review/${this.props.card._id}`)) }} className="review-action-button review-share-button-div"><MdShare className="review-action-button-icon"/> Share</span>*/}
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        {this.props.card.comment &&
                            this.props.card.comment.map((value, i) => {
                                return (
                                    <div className="comment-reply-container" key={i}>
                                        <div className="comment-reply-user-pic-container">
                                            <img className="comment-reply-user-pic"
                                                src={imageTransformation(_.find(userReducerData, { username: value.user }) ? _.find(userReducerData, { username: value.user }).profilePicture : '', 100)} alt="" />
                                        </div>
                                        <div className="comment-reply-data-container">
                                            <div className="comment-reply-user-name">
                                                {_.find(userReducerData, { username: value.user }) ? _.find(userReducerData, { username: value.user }).displayName : ''}
                                            </div>
                                            {this.props.meReducer.isLoggedIn && this.props.meReducer.userData.user.username === value.user &&
                                                <span className="comment-delete-button" onClick={() => {
                                                    if (window.confirm("Are you sure your want to delete this comment?")) {
                                                        this.deleteComment(value._id);
                                                    }
                                                }}>Delete</span>
                                            }
                                            <div className="comment-reply-content" dangerouslySetInnerHTML={{ __html: value.comment }}></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div style={{ overflow: 'auto', width: '100%', marginTop: '30px' }}>
                        <div className="write-comment-textarea-div">

                            <ReactQuill value={this.state.comment}
                                placeholder={'Write Your Comment Here...'}
                                onChange={this.handleChange} />
                        </div>
                        <button className="write-comment-send-button" onClick={() => this.addComment(this.props.card._id)}>
                            {LOADER &&
                                "SENDING"
                            }
                            {!LOADER &&
                                "SEND"
                            }
                        </button>
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

export default connect((state) => state, mapDispatchToProps)(ReviewComment);