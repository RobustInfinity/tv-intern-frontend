/* eslint-disable array-callback-return, radix */
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    MdThumbUp,
    MdThumbDown,
} from 'react-icons/lib/md';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import {
    asyncCommentAction
} from '../action/index';
import '../assets/css/comment.css';
import { imageTransformation } from '../util/util';

class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            likeCount: 0 ,
            dislikeCount: 0
        }
    }



    componentDidMount() {
        this.setState({
            likeCount: this.props.card.likeCount || 0,
            dislikeCount: this.props.card.dislikeCount || 0
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.card._id !== this.props.card._id) {
            this.setState({
                likeCount: nextProps.card.likeCount || 0,
                dislikeCount: nextProps.card.dislikeCount || 0
            });
        }
    }

    cardAction = (action, status, _id) => {
        const tempCookies = new Cookies();
        const token = tempCookies.get('token');

        const actionData = {
            action,
            status,
            commentId: _id,
            token
        };


        if (token) {
            if (action === 'like') {
                const comment = this.props.card;
                if (comment.isDisliked && status) {
                    comment.dislikeCount = parseInt(comment.dislikeCount) - 1;
                }
                if (status) {
                    comment.likeCount = parseInt(comment.likeCount) + 1;
                } else {
                    comment.likeCount = parseInt(comment.likeCount) - 1;
                }
                this.setState({
                    likeCount: comment.likeCount,
                    dislikeCount: comment.dislikeCount
                });
            } else if (action === 'dislike') {
                const comment = this.props.card;
                if (comment.isLiked && status) {
                    comment.likeCount = parseInt(comment.likeCount) - 1;
                }
                if (status) {
                    comment.dislikeCount = parseInt(comment.dislikeCount) + 1;
                } else {
                    comment.dislikeCount = parseInt(comment.dislikeCount) - 1;
                }
                this.setState({
                    likeCount: comment.likeCount,
                    dislikeCount: comment.dislikeCount
                });
            }
            this.props.dispatch(asyncCommentAction(actionData));
        }
    };

    render() {
        const {
            card,
            user
        } = this.props;
        return (
            <div className="comment-container">
                <div className="comment-video-picture-container">
                    <img className="comment-profile-picture" src={
                        imageTransformation(_.find(user, { username: card.user }) ? _.find(user, { username: card.user }).profilePicture : '', 100)
                    } alt=""/>
                </div>
                <div className="comment-video-name-container">
                    <span className="comment-video-name">{_.find(user, { username: card.user }) ? _.find(user, { username: card.user }).displayName : ''}</span>
                    <span className="comment-video-comment">{card.comment}</span>
                    <div className="comment-action-button-container">
                        <span className="comment-action-button">
                            {card.isLiked &&
                                <MdThumbUp onClick={() => this.cardAction('like', false, card._id)} className="comment-action-button-icon active"/>
                            }
                            {!card.isLiked &&
                                 <MdThumbUp onClick={() => this.cardAction('like', true, card._id)} className="comment-action-button-icon"/>
                            }
                            <span className="comment-action-button-count">{this.state.likeCount}</span>
                        </span>
                        <span className="comment-action-button">
                            {card.isDisliked &&
                                <MdThumbDown onClick={() => this.cardAction('dislike', false, card._id)} className="comment-action-button-icon active"/>
                            }
                            {!card.isDisliked &&
                                <MdThumbDown onClick={() => this.cardAction('dislike', true, card._id)} className="comment-action-button-icon"/>
                            }
                            <span className="comment-action-button-count">{card.dislikeCount}</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state) => state)(Comment);