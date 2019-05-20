import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    Link
} from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
    MdShare,
    MdBookmarkOutline,
    MdBookmark,
    MdFavoriteBorder,
    MdFavorite
} from 'react-icons/lib/md';
import '../assets/css/article.card.css';
import { convertDate } from '../util/util';
import {
    toggleLoginModal,
    asyncArticleAction,
    asyncShareModal
} from '../action/index';

class ArticleCard extends Component {

    /**
     * Function to return read time of an article
     */
    readingTime = () => {
        const tag = document.createElement('div');
        tag.innerHTML = this.props.card.content;
        const txt = tag.innerText;
        const wordCount = txt.replace(/[^\w ]/g, "").split(/\s+/).length;
        const readingTimeInMinutes = Math.floor(wordCount / 228) + 1;
        const readingTimeAsString = readingTimeInMinutes + " min";
        return readingTimeAsString;
    }

    articleCardAction = (action, status) => {
        if (this.props.meReducer.isLoggedIn) {
            const tempCookie = new Cookies();
            const data = {
                action,
                status,
                token: tempCookie.get('token'),
                articleId: this.props.card.articleId
            };
            this.props.dispatch(asyncArticleAction(data));
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    }

    render() {
        return (
            <div id={`a-c-main-container-${this.props.index}`} className="article-card-container">
                <div style={{ height: document.getElementById(`a-c-main-container-${this.props.index}`) ? `${document.getElementById(`a-c-main-container-${this.props.index}`).offsetHeight}px` : '120px' }} className="article-card-image-container">
                    <Link to={{ pathname: `/article/${this.props.card.articleId}` }} rel="nofollow">
                        <img className="article-card-image" src={this.props.card.imageUrl} alt="" />
                    </Link>
                </div>
                <div className="article-card-information">
                    <Link style={{ textDecoration: 'none', color: 'black' }} rel="nofollow" to={{ pathname: `/article/${this.props.card.articleId}` }}>
                        <p className='article-card-title'>{this.props.card.title}</p>
                    </Link>
                    {window.innerWidth > 600 &&
                        <p className={(window.innerWidth > 600) ? "article-card-description line-clamp line-clamp-2" : "article-card-description line-clamp line-clamp-1"}>{this.props.card.metaDescription}</p>
                    }
                    <div className="article-card-bottom-container">
                        <div className="article-card-user-container">
                            {window.innerWidth > 600 &&
                                <Link style={{ display: 'flex', alignItems: 'center' }} rel="nofollow" to={{ pathname: `/user/${this.props.card.user}/reviews` }}>
                                    <img className="article-card-user-picture" src={this.props.user ? this.props.user.profilePicture : ''} alt="" />
                                </Link>
                            }
                            <div>
                                <Link style={{ textDecoration: 'none', color: 'black' }} rel="nofollow" to={{ pathname: `/user/${this.props.card.user}/reviews` }}>
                                    <p className="article-card-user-name">By {this.props.user ? this.props.user.displayName : ''}</p>
                                </Link>
                                <p className="article-card-date">{convertDate(this.props.card.publishedDate)} - {this.readingTime()} Read </p>
                            </div>
                        </div>
                        <div className="article-card-action-container">
                            <div className="article-card-action-icon-container">
                                {!this.props.card.isLiked &&
                                    <MdFavoriteBorder onClick={() => this.articleCardAction('like', true)} className="article-card-action-icon" />
                                }
                                {this.props.card.isLiked &&
                                    <MdFavorite onClick={() => this.articleCardAction('like', false)} className="article-card-action-icon" />
                                }
                            </div>
                            <div className="article-card-action-icon-container">
                                {!this.props.card.isBookmarked &&
                                    <MdBookmarkOutline onClick={() => this.articleCardAction('bookmark', true)} className="article-card-action-icon" />
                                }
                                {this.props.card.isBookmarked &&
                                    <MdBookmark onClick={() => this.articleCardAction('bookmark', false)} className="article-card-action-icon" />
                                }
                            </div>
                            <div className="article-card-action-icon-container">
                                <MdShare onClick={() => {
                                    this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/article/${this.props.card.articleId}`));
                                }} className="article-card-action-icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state) => state)(ArticleCard);