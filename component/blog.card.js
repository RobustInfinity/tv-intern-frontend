import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import {
    convertDate, imageTransformation
} from '../util/util';
import '../assets/css/blog.card.css';
import { categories } from "../constant/static";
import {Link} from 'react-router-dom';

class BlogCard extends Component {

    toArticlePage = () => {
        this.props.history.push({
            pathname: `/article/${this.props.card.articleId}`
        });
    };

    /**
     * Function to return read time of an article
     */

    readingTime = (content) => {
        // const tag = document.createElement('div');
        // tag.innerHTML = content;
        // for (let el of tag.querySelectorAll("img[src]")) {
        //     el.src = imageTransformation(el.src);
        // }
        // const txt = tag.innerText;
        const wordCount = content.replace(/[^\w ]/g, "").split(/\s+/).length;
        const readingTimeInMinutes = Math.floor(wordCount / 228) + 1;
        const readingTimeAsString = readingTimeInMinutes + " min";
        return readingTimeAsString;
    }

    render() {
        if (window.innerWidth > 768) {

            let marginBottom = '1rem';

            // if(this.props.userPage) {
            //     marginBottom = '0';
            // }
            
            return (
                <div style={{ marginBottom, width: this.props.trendingBlogs ? '50%' : '33%' }} className="blog-card-container">
                    <div className="blog-card-main">
                        <div onClick={this.toArticlePage} className="blog-card-img" style={{ backgroundImage: `url(${imageTransformation(this.props.card.imageUrl, 400)})` }}>

                        </div>
                        <div className="blog-second-row">
                            <div style={{ marginBottom: '5px' }}>
                                <span className="blog-card-title" onClick={this.toArticlePage}>{this.props.card.title}</span>
                            <div style={{ marginBottom: '5px' }}>
                                <span className="blog-card-cat-date" style={{ margin:'8px 0px'}}>{convertDate(this.props.card.creationDate)} - {this.readingTime(this.props.card.content)} read</span>
                            </div>
                                {_.map(this.props.card.category, (value, i) => {
                                    return (
                                        <div className="blog-categories" key={i}>
                                        <Link to={{pathname:`/category/${categories[value] ? categories[value].key : ''}`}}>
                                            <img className="blog-categories-icon" src={categories[value] ? categories[value].icon : ''} alt="" />
                                        </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (window.innerWidth <= 768) {
            let width = '98%';
            if (this.props.match && this.props.match.path.includes('/user/')) {
                width = '48%'
            } else if (this.props.articlePage) {
                width = '48%';
            } else if (this.props.trendingBlogsMobile) {
                width = '48%';
            }
            return (
                <div className="blog-card-container" style={{ width }}>
                    <div className="blog-card-main">
                        <div onClick={this.toArticlePage} className="blog-card-img" style={{ backgroundImage: `url(${imageTransformation(this.props.card.imageUrl, 200)})`, height: this.props.articlePage ? '5rem' : '10rem' }}>

                        </div>
                        <div className="blog-second-row">
                            <div style={{ margin: '5px 0' }} className="blog-card-title line-clamp line-clamp-3" onClick={this.toArticlePage}>
                                {this.props.card.title}
                            </div>
                            <div style={{ margin: '5px 0' }} className="blog-card-cat-date">
                            {convertDate(this.props.card.creationDate)} - {this.readingTime(this.props.card.content)} Read time
                            </div>
                            {/*<div>*/}
                            {/*{_.map(this.props.card.category, (value, i) => {*/}
                            {/*return (*/}
                            {/*<div className="blog-categories" key={i}>*/}
                            {/*<img className="blog-categories-icon" src={categories[value] ? categories[value].icon : ''} alt=""/>*/}
                            {/*</div>*/}
                            {/*);*/}
                            {/*})}*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default connect((state) => state)(BlogCard);