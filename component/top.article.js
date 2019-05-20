import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    Link
} from 'react-router-dom';
import '../assets/css/top.article.css';
import { convertDate } from '../util/util';

class TopArticleCard extends Component {

    readingTime = () => {
        const tag = document.createElement('div');
        tag.innerHTML = this.props.card.content;
        const txt = tag.innerText;
        const wordCount = txt.replace(/[^\w ]/g, "").split(/\s+/).length;
        const readingTimeInMinutes = Math.floor(wordCount / 228) + 1;
        const readingTimeAsString = readingTimeInMinutes + " min";
        return readingTimeAsString;
    }

    render() {
        return (
            <Link
                style={{
                    textDecoration: 'none'
                }}
                to={{
                    pathname: `/article/${this.props.card.articleId}`
                }}>
                <div className="top-article-container">
                    <div className="top-article-title">{this.props.card.title}</div>
                    <div className="top-article-user-name">{this.props.user.displayName}</div>
                    <div className="top-article-date">{convertDate(this.props.card.publishedDate)} - {this.readingTime()}</div>
                </div>
            </Link>
        );
    }
}

export default connect((state) => state)(TopArticleCard);