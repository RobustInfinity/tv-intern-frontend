/* eslint-disable array-callback-return, radix */
import React, { Component } from 'react';
import {
    FaFacebook,
    FaTwitter,
    // FaYoutubePlay,
    // FaInstagram,
    FaLinkedin,
    // FaWhatsapp
} from 'react-icons/lib/fa';
import {
    MdLink
} from 'react-icons/lib/md';

import {
    connect
} from 'react-redux';
import Comment from '../../component/comment';
import {
    Link
} from 'react-router-dom';
import NotFound from '../../component/NotFound'
import _ from 'lodash';
import loader from '../../assets/icons/loader.svg';
import { heart_outline, heart_filled, bookmark_outline, bookmark_filled } from '../../assets/icons/icons'
import Cookies from 'universal-cookie';
import {
    Helmet
} from 'react-helmet';
import BlogCard from '../../component/blog.card';
import {
    asyncFetchArticle,
    asyncArticleAction,
    toggleLoginModal,
    asyncShareModal,
    asyncFollowUnfollowVendor,
    asyncFollowUnfollowUser,
    asyncAddVideoComments,
    asyncFetchComments,
    asyncFetchSimilarArticles,
    asyncTrendingArticlesApi
} from '../../action/index';
import ReactAnalytics from "../../util/ga";
import {
    FaHeart,
    FaHeartO
} from 'react-icons/lib/fa';
import {
    MdShare,
    MdBookmarkOutline,
    MdBookmark,
    MdSend
} from 'react-icons/lib/md';
import '../../assets/css/article.css';
import '../../assets/css/vendor.css';
import '../../assets/css/video.css';
import { convertDate, googleTimeFormat, imageTransformation } from "../../util/util";
import { categories } from "../../constant/static";
// import { Prompt } from 'react-router';

let FIRST_LOAD = false;

let isScrollingDown = false;

//const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

class Article extends Component {

    copyClipBoard = (e) => {
        let copyText = document.getElementById("articleInput");
        var tmpElem = document.createElement("div");
        document.body.appendChild(tmpElem);
        tmpElem.textContent = copyText.value;
        let selection = document.getSelection();
        let range = document.createRange();
        range.selectNode(tmpElem);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        document.body.removeChild(tmpElem);
        let x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);
    };

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

    componentWillMount() {
        const articleId = this.props.match.params.articleId;
        const tempCookie = new Cookies();
        const actionData = {
            articleId,
            token: tempCookie.get('token')
        };
        FIRST_LOAD = true;
        this.props.dispatch(asyncFetchArticle(actionData))
            .then((data) => {
                setTimeout(() => {
                    this.scrollArticle();
                }, 0);
                window.prerenderReady = true;
                const pageUrl = this.props.match.url;
                const isDev = (this.props.location.search && this.props.location.search.indexOf('isDevelopment') > -1)
                    ?
                    true
                    :
                    false;

                !isDev && ReactAnalytics.articlePage(pageUrl, data.data.article.title);
                this.props.dispatch(asyncFetchComments(articleId, tempCookie.get('token')));
                this.props.dispatch(asyncFetchSimilarArticles({ articleId, category: data.data.article.category }));
                this.props.dispatch(asyncTrendingArticlesApi(articleId));
                FIRST_LOAD = false;
            });
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if (!FIRST_LOAD) {
            if (!_.isEmpty(nextProps.meReducer.userData)) {
                if (this.props.meReducer.userData !== nextProps.meReducer.userData) {
                    const articleId = nextProps.match.params.articleId;
                    const actionData = {
                        articleId,
                        token: nextProps.meReducer.userData.accessToken
                    };
                    nextProps.dispatch(asyncFetchArticle(actionData))
                        .then((data) => {
                            setTimeout(() => {
                                this.scrollArticle();
                                nextProps.dispatch(asyncFetchComments(articleId, nextProps.meReducer.userData.accessToken));
                                nextProps.dispatch(asyncFetchSimilarArticles({ articleId, category: data.data.article.category }))
                                FIRST_LOAD = false;
                            }, 500);
                        });
                }
            }
        } if (this.props.match.url !== nextProps.match.url) {
            window.scrollTo(0, 0);
            const articleId = nextProps.match.params.articleId;
            const actionData = {
                articleId,
                token: nextProps.meReducer.userData.accessToken
            };
            nextProps.dispatch(asyncFetchArticle(actionData))
                .then((data) => {
                    setTimeout(() => {
                        this.scrollArticle();
                        if (nextProps.match.url.indexOf('/article') !== -1) {
                            const pageUrl = nextProps.match.url;
                            const isDev = (nextProps.location.search && nextProps.location.search.indexOf('isDevelopment') > -1)
                                ?
                                true
                                :
                                false;

                            !isDev && ReactAnalytics.articlePage(pageUrl);
                        }
                        nextProps.dispatch(asyncFetchComments(articleId, nextProps.meReducer.userData.accessToken));
                        nextProps.dispatch(asyncFetchSimilarArticles({ articleId, category: data.data.article.category }))
                        FIRST_LOAD = false;
                    }, 500);
                });
        }
    }

    componentDidMount() {
        window.addEventListener('wheel', (e) => {
            if (e.deltaY < 0) {
                isScrollingDown = false;
            }
            if (e.deltaY > 0) {
                isScrollingDown = true;
            }
        });

        window.addEventListener('scroll', this.scrollArticle, false);
    }

    scrollArticle = (event) => {
        if (document.querySelector("#similartrendingsectionarticles")) {
            let rect1 = document.querySelector("#similartrendingsectionarticles").getBoundingClientRect();
            let rect2 = document.querySelector('#count-div').getBoundingClientRect();
            let rect4 = document.querySelector('#footermaincontainer').getBoundingClientRect();
            const overlap = !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom);
            const searchContainer = document.getElementById('similartrendingsectionarticles');
            const parentWidth = document.getElementById('similar-article-width').offsetWidth;
            const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            if (h >= rect4.top) {
                searchContainer.style.bottom = `1.5rem`;
                searchContainer.style.position = 'absolute';
                searchContainer.style.width = `${parentWidth}px`;
            } else {
                if (isScrollingDown) {
                    if (searchContainer.style.position === 'fixed') {
                        searchContainer.style.position = 'fixed';
                        searchContainer.style.bottom = '20px';
                        searchContainer.style.top = null;
                        searchContainer.style.width = `${parentWidth}px`;
                    } else {
                        if (h >= rect1.bottom) {
                            searchContainer.style.position = 'fixed';
                            searchContainer.style.bottom = '20px';
                            searchContainer.style.top = null;
                            searchContainer.style.width = `${parentWidth}px`;
                        } else if (window.pageYOffset > 500) {
                            searchContainer.style.position = 'fixed';
                            searchContainer.style.bottom = '20px';
                            searchContainer.style.top = null;
                            searchContainer.style.width = `${parentWidth}px`;
                        }
                    }
                } else {
                    if (overlap) {
                        searchContainer.style.position = 'absolute';
                        searchContainer.style.top = null;
                        searchContainer.style.bottom = null;
                        searchContainer.style.width = `${parentWidth}px`;
                    } else {
                        searchContainer.style.position = 'fixed';
                        searchContainer.style.bottom = null;
                        searchContainer.style.width = `${parentWidth}px`;
                    }
                }
            }
        }


        let a = document.querySelector(".scroll-action");
        if (document.querySelector(".scroll-action")) {
            let rect1 = document.querySelector(".scroll-action").getBoundingClientRect();
            const rect2 = document.querySelector('.article-image-desktop').getBoundingClientRect();
            const rect3 = document.querySelector('.footer-main-container').getBoundingClientRect();
            const overlap = !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom);

            const overlapRelated = !(rect1.right < rect3.left ||
                rect1.left > rect3.right ||
                rect1.bottom < rect3.top ||
                rect1.top > rect3.bottom);

            if (overlapRelated) {
                a.style.visibility = 'hidden';
            } else if (overlap) {
                a.style.visibility = 'hidden';
            } else {
                a.style.visibility = 'visible';
            }
        }
    }

    articleAction = (action, status) => {
        if (this.props.meReducer.isLoggedIn) {
            const tempCookie = new Cookies();
            const data = {
                action,
                status,
                token: tempCookie.get('token'),
                articleId: this.props.match.params.articleId
            };
            this.props.dispatch(asyncArticleAction(data));
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };

    goToProfile = () => {
        this.props.history.push({
            pathname: `/profile/${this.props.articleReducer.vendor.username}`
        });
    };

    goToUser = () => {
        this.props.history.push({
            pathname: `/user/${this.props.articleReducer.user.username}/reviews`
        });
    };

    renderMetaTags = () => {
        const articleData = this.props.articleReducer.article;
        const userData = this.props.articleReducer.user;
        return (
            <Helmet
                titleTemplate="%s">
                <title>{articleData.metaTitle}</title>
                <meta name="fragment" content="!" />
                <link rel="alternate" hreflang="en" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta name="description" content={articleData.metaDescription} />
                <link rel="canonical" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="author" href={articleData.createBy} />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content={articleData.metaKeywords} />
                <link rel="amphtml" href={`https://www.trustvardi.com/amp/article/${articleData.articleId}`} />
                {/*<link rel="amphtml" href={`https://so.city/amp/${articleData._id}.html`}/>*/}
                <meta name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <script type="application/ld+json">{`
                    {
                        "@context": "http://schema.org",
                        "@type": "Article",
                        "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": "https://www.trustvardi.com/article/${articleData.articleId}"
                    },
                        "headline": "${articleData.metaTitle}",
                        "image": [
                            "${articleData.metaImage}"
                        ],
                        "datePublished": "${googleTimeFormat(parseInt(articleData.creationDate))}",
                        "dateModified": "${googleTimeFormat(parseInt(articleData.creationDate))}",
                        "author": {
                        "@type": "Person",
                        "name": "${userData.displayName}"
                    },
                        "publisher": {
                        "@type": "Organization",
                        "name": "TrustVardi",
                        "logo": {
                        "@type": "ImageObject",
                        "url": "https://res.cloudinary.com/trustvardi/image/upload/v1527855910/icons/ios_logo_final-14.png"
                    }
                    },
                        "description": "${articleData.metaDescription}"
                    }
                 `}
                </script>
                <meta name='HandheldFriendly' content='True' />
                <meta property="og:title" content={articleData.title} />
                <meta property="og:description" content={articleData.metaDescription} />
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={articleData.metaImage} />
                <meta property="og:site_name" content="trustvardi" />
                <meta property="article:published_time" content={googleTimeFormat(articleData.creationDate)} />
                <meta property="article:tag" content={articleData.metaKeywords} />
                <meta property="article:section" content="Lifestyle" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@trustvardi" />
                <meta name="twitter:creator" content="trustvardi.com" />
                <meta name="twitter:title" content={articleData.title} />
                <meta name="twitter:description" content={articleData.metaDescription} />
                <meta name="twitter:image" content={articleData.metaImage} />
            </Helmet>
        );
    };

    toggleShareModal = (link) => {
        this.props.dispatch(asyncShareModal(link));
    };

    followUnFollowVendor = (username, status) => {
        const tempCookie = new Cookies();
        if (tempCookie.get('token')) {
            const actionData = {
                username,
                status,
                token: tempCookie.get('token')
            };
            this.props.dispatch(asyncFollowUnfollowVendor(actionData));
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };

    followUnfollowUser = (username, status) => {
        const tempCookie = new Cookies();
        if (tempCookie.get('token')) {
            const actionData = {
                username,
                status,
                token: tempCookie.get('token')
            };
            this.props.dispatch(asyncFollowUnfollowUser(actionData));
        }
    };

    addComment = (articleId) => {
        if (this.props.meReducer.isLoggedIn) {
            const tempCookie = new Cookies();
            const comment = document.getElementById('video-comment') ? document.getElementById('video-comment').value : '';
            this.props.dispatch(asyncAddVideoComments(articleId, comment, tempCookie.get('token')))
                .then((data) => {
                    if (data.success) {
                        if (document.getElementById('video-comment')) {
                            document.getElementById('video-comment').value = '';
                        }
                    }
                });
        }
    };

    toShowAllPage = (type) => {
        this.props.history.push({
            pathname: `/${type}`
        });
    };

    transformArticleContentImage = (content) => {
        const div = document.createElement('div');
        div.innerHTML = content;
        for (let el of div.querySelectorAll("img[src]")) {
            el.src = imageTransformation(el.src, 800, true);
        }
        return div.innerHTML;
    }

    render() {
        // <Prompt
        // when={true}
        // message="Are you sure you want to leave?"
        // />
        if (window.innerWidth > 768) {
            if (!this.props.articleReducer.loading) {
                if (!_.isEmpty(this.props.articleReducer.article)) {
                    const {
                        comments,
                        commentUser
                    } = this.props.articleReducer;
                    return (
                        <div>
                            <div className="similar-trending-section-main">
                                <div className="article-desktop-container">
                                    {this.renderMetaTags()}
                                    <div className="article-main-container-desktop">
                                        <div className="scroll-action">
                                            {!this.props.articleReducer.article.isLiked &&
                                                <span onClick={() => this.articleAction('like', true)}
                                                    className="scroll-item" >
                                                    {heart_outline('heart-outline')}
                                                </span>
                                            }
                                            {this.props.articleReducer.article.isLiked &&
                                                <span onClick={() => this.articleAction('like', false)}
                                                    className="scroll-item">
                                                    {heart_filled()}
                                                </span>
                                            }

                                            <MdShare onClick={() => this.toggleShareModal(`https://www.trustvardi.com/article/${this.props.articleReducer.article.articleId}`)} className="scroll-item" />

                                            {!this.props.articleReducer.article.isBookmarked &&
                                                <span onClick={() => this.articleAction('bookmark', true)}
                                                    className="scroll-item" >
                                                    {bookmark_outline('bookmark-outline')}
                                                </span>
                                            }
                                            {this.props.articleReducer.article.isBookmarked &&
                                                <span onClick={() => this.articleAction('bookmark', false)}
                                                    className="scroll-item">
                                                    {bookmark_filled()}
                                                </span>
                                            }
                                        </div>
                                        {/*<div className="article-vendor-details">*/}
                                        {/*<img className="article-vendor-profile-picture"*/}
                                        {/*onClick={this.goToProfile} src={this.props.articleReducer.vendor.profilePicture} alt=""/>*/}
                                        {/*<span*/}
                                        {/*onClick={this.goToProfile} className="article-vendor-name">{this.props.articleReducer.vendor.displayName}</span>*/}
                                        {/*<span*/}
                                        {/*className="article-vendor-date">{convertDate(this.props.articleReducer.article.creationDate)}</span>*/}
                                        {/*</div>*/}

                                        <div className="similar-view-all-container" style={{ margin: '1rem 1rem 0rem 1rem' }}>
                                            {(this.props.articleReducer.article.category && this.props.articleReducer.article.category.length > 0) &&
                                                categories[this.props.articleReducer.article.category[0]] &&
                                                <Link rel="nofollow" to={{ pathname: `/category/${this.props.articleReducer.article.category[0]}` }} target='_blank'>
                                                    <button className="similar-view-all-button-news">
                                                        {categories[this.props.articleReducer.article.category[0]].name}
                                                    </button></Link>
                                            }

                                            <p className="article-title-desktop">
                                                {this.props.articleReducer.article.title}
                                            </p>

                                        </div>

                                        <div className="article-detail-container-header">
                                            <div className="article-detail-image-container-header">
                                                <Link rel="nofollow" to={`/user/${this.props.articleReducer.user.username}/reviews`}>
                                                    <img className="article-user-profile-picture-header" src={this.props.articleReducer.user.profilePicture} alt="" />
                                                </Link>
                                            </div>
                                            <div className="article-detail-text-container-header">
                                                <div>
                                                    <div className="article-user-name-header">
                                                        <Link rel="nofollow" to={`/user/${this.props.articleReducer.user.username}/reviews`}>{this.props.articleReducer.user.displayName}</Link>
                                                    </div>
                                                    {/* <Link className="article-follower-count-header" style={{fontWeight:'500px'}} target="_blank" to={`/profile/${this.props.articleReducer.vendor.username}`}>{this.props.articleReducer.vendor.displayName}</Link> */}
                                                    <div className="article-follower-count-header" style={{ fontWeight: '500px' }}>Content Writer at TrustVardi</div>


                                                    <div style={{ marginTop: '2px', color: '#7e7b7b' }} className="article-follower-count-header">
                                                        {convertDate(this.props.articleReducer.article.creationDate)} {" . "} {this.readingTime(this.props.articleReducer.article.content)} read</div>
                                                    {/* <Link className="article-follower-count-header" target="_blank" to={`/user/${this.props.articleReducer.user.username}/reviews`}>Find more about author</Link> */}
                                                    {/* {console.log(this.props.articleReducer.article)} */}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#594aa5', padding: '5px 8px', textTransform: 'uppercase', fontSize: '12px', fontWeight: '300' }}>share</div>
                                                <div className="similar-social-icon-right">
                                                    <FaFacebook onClick={() => {
                                                        window.open(
                                                            `https://www.facebook.com/sharer/sharer.php?u=${this.props.meReducer.url}`,
                                                            '_blank'
                                                        );
                                                    }} className="social-icons" />
                                                    <FaTwitter onClick={() => {
                                                        window.open("https://twitter.com/share?url=" + this.props.meReducer.url, '',
                                                            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=700');
                                                    }} className="social-icons" />
                                                    <FaLinkedin onClick={() => {
                                                        window.open(
                                                            `https://www.linkedin.com/sharing/share-offsite/?url=https://www.trustvardi.com/article/${this.props.articleReducer.article.articleId}`,
                                                            '_blank'
                                                        );
                                                    }} className="social-icons" />

                                                    <div id="snackbar">link copied</div>
                                                    <MdLink className="social-icons" onClick={this.copyClipBoard} />
                                                    <input style={{ display: 'none' }} type="text" defaultValue={`https://www.trustvardi.com/article/${this.props.articleReducer.article.articleId}`} id="articleInput" />
                                                    {/* {navigator.share &&
                                                <MdLink className="social-icons" onClick={this.openNativeShare}>More</MdLink>
                                                } */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="article-title-recommended">
                                            {this.props.articleReducer.article.recommendedFor && this.props.articleReducer.article.recommendedFor.length > 0 &&
                                                <span><strong>Recommended for:</strong> {this.props.articleReducer.article.recommendedFor}</span>
                                            }
                                        </div>

                                        <div className="container-credit">
                                            <img className="article-image-desktop" src={imageTransformation(this.props.articleReducer.article.imageUrl)}
                                                alt="" />
                                            {this.props.articleReducer.article.headerImageCredit && this.props.articleReducer.article.headerImageCredit.length > 0 &&
                                                <span className="article-image-credit bottom-right"><em style={{ fontSize: '7px' }}><strong>Picture Credits:</strong> {this.props.articleReducer.article.headerImageCredit}</em></span>
                                            }
                                        </div>
                                        <div className="article-content-desktop"
                                            dangerouslySetInnerHTML={{ __html: this.transformArticleContentImage(this.props.articleReducer.article.content) }}>
                                            
                                        </div>
                                        <div className="article-content-category">
                                            {this.props.articleReducer.article.category.map((value) => {
                                                return (
                                                    <Link rel="nofollow" style={{ textDecoration: 'none', color: '#000000' }} to={{ pathname: `/category/${value}` }} key={value} className="article-tab-category">{
                                                        _.find(categories, { key: value }) ? _.find(categories, { key: value }).name : ''
                                                    }</Link>
                                                );
                                            })}
                                        </div>
                                        <div className="article-user-details-container">
                                            {!_.isEmpty(this.props.articleReducer.vendor) &&
                                                <div style={{ width: '49%', marginRight: '2%' }} className="article-user-details">
                                                    <div className="article-label-container">
                                                        <span className="article-container-detail">Browse Here</span>
                                                    </div>
                                                    <div className="article-detail-container">
                                                        <div className="article-detail-image-container">
                                                            <Link rel="nofollow" to={`/profile/${this.props.articleReducer.vendor.username}`}>
                                                                <img className="article-user-profile-picture" src={this.props.articleReducer.vendor.profilePicture} alt="" />
                                                            </Link>
                                                        </div>
                                                        <div className="article-detail-text-container">
                                                            <div style={{ marginLeft: '30px', lineHeight: '27px' }}>
                                                                <div className="article-user-name">
                                                                    <Link rel="nofollow" to={`/profile/${this.props.articleReducer.vendor.username}`}>{this.props.articleReducer.vendor.displayName}</Link>
                                                                </div>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <span className="article-follower-count">{this.props.articleReducer.vendor.followerCount || 0} Followers</span>
                                                                    <span className="article-review-count">{this.props.articleReducer.vendor.reviewCount || 0} Reviews</span>
                                                                </div>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    {!this.props.articleReducer.vendor.isFollowing &&
                                                                        <button onClick={() => this.followUnFollowVendor(this.props.articleReducer.vendor.username, true)} className="follow-button-article-page">Follow</button>
                                                                    }
                                                                    {this.props.articleReducer.vendor.isFollowing &&
                                                                        <button onClick={() => this.followUnFollowVendor(this.props.articleReducer.vendor.username, false)} className="follow-button-article-page">Following</button>
                                                                    }
                                                                    <button className="follow-button-article-page" onClick={() => this.toggleShareModal(`https://www.trustvardi.com/profile/${this.props.articleReducer.vendor.username}`)} style={{ marginLeft: '25px' }}>Share</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {!_.isEmpty(this.props.articleReducer.user) &&
                                                <div className="article-user-details">
                                                    <div className="article-label-container">
                                                        <span className="article-container-detail">Written By</span>
                                                    </div>
                                                    <div className="article-detail-container">
                                                        <div className="article-detail-image-container">
                                                            <Link rel="nofollow" to={`/user/${this.props.articleReducer.user.username}/reviews`}>
                                                                <img className="article-user-profile-picture" src={this.props.articleReducer.user.profilePicture} alt="" />
                                                            </Link>
                                                        </div>
                                                        <div className="article-detail-text-container">
                                                            <div style={{ marginLeft: '30px', lineHeight: '21px' }}>
                                                                <div className="article-user-name">
                                                                    <Link rel="nofollow" to={`/user/${this.props.articleReducer.user.username}/reviews`}>{this.props.articleReducer.user.displayName}</Link>
                                                                </div>
                                                                <div style={{ marginTop: '2px' }} className="article-follower-count">{convertDate(this.props.articleReducer.article.creationDate)}</div>
                                                                <Link rel="nofollow" className="article-follower-count" target="_blank" to={`/user/${this.props.articleReducer.user.username}/reviews`}>Find more about author</Link>
                                                                <div style={{ marginTop: '2px' }}>
                                                                    {!this.props.articleReducer.user.isFollowing &&
                                                                        <button onClick={() => this.followUnfollowUser(this.props.articleReducer.user.username, true)} className="follow-button-article-page">Follow</button>
                                                                    }
                                                                    {this.props.articleReducer.user.isFollowing &&
                                                                        <button onClick={() => this.followUnfollowUser(this.props.articleReducer.user.username, false)} className="follow-button-article-page">Following</button>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className="video-comment-container-article">
                                            <span className="video-comment-label-article">Comments</span>
                                            <div className="video-add-comment-container-article">
                                                <textarea id="video-comment" onChange={() => {
                                                    document.querySelector('#video-comment').style.height = '';
                                                    document.querySelector('#video-comment').style.height = `${Math.min(document.querySelector('#video-comment').scrollHeight)}px`
                                                }} placeholder="Write your own comment."
                                                    onKeyUp={(event) => {
                                                        if (event.keyCode === 13) {
                                                            // this.addComment(this.props.articleReducer.article.articleId)
                                                        }
                                                    }} className="article-comment-input" type="text" />
                                                <MdSend style={{ marginLeft: '5px' }} onClick={() => this.addComment(this.props.articleReducer.article.articleId)}
                                                    className="add-comment-button" />
                                            </div>
                                            {this.props.videoReducer.commentsLoading &&
                                                <div style={{ textAlign: 'center' }}>
                                                    <img className="video-comments-loader" src={loader} alt="" />
                                                </div>
                                            }
                                            {!this.props.videoReducer.commentsLoading &&
                                                <div>
                                                    {comments && comments.length > 0 && comments.map((value, index) => {
                                                        return (
                                                            <Comment key={index} history={this.props.history} card={value}
                                                                user={commentUser} />
                                                        );
                                                    })}
                                                    {comments.length === 0 &&
                                                        <div style={{ height: '30px' }}>

                                                        </div>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="article-main-container-trending">
                                        <label className="similar-title-trending">Trending Articles</label>
                                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', margin: '8px' }}>
                                            {this.props.articleReducer.trendingArticle.map((value, index) => {
                                                return (
                                                    <BlogCard trendingBlogs={true} history={this.props.history} card={value} key={index} />
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div id="similar-article-width" style={{ transition: 'all 1s ease-in 1s' }} className="similar-trending-section-articles">
                                    <div id="count-div"></div>
                                    <div id="similartrendingsectionarticles" style={{ transition: 'all 1s ease-in 1s', backgroundColor: 'white', border: '.09375rem solid #e6e6e6', borderRadius: '.8rem', minHeight: '500px' }}>
                                        <div style={{ margin: '1rem 1rem 0rem' }}>
                                            <label className="similar-title">Similar Articles</label>
                                            {this.props.articleReducer.similarArticle.map((value, index) => {
                                                return (
                                                    <div key={index} style={{ display: 'flex', flexWrap: 'wrap', lineHeight: '22px' }}>
                                                        <div className="similar-view-all-container">
                                                            {(value.category && value.category.length > 0) &&
                                                                categories[value.category[0]] &&
                                                                <Link rel="nofollow" to={{ pathname: `/category/${value.category[0]}` }} target='_blank'>
                                                                    <button className="similar-view-all-button-feature">
                                                                        {categories[value.category[0]].name}
                                                                    </button></Link>
                                                            }
                                                        </div>
                                                        <div className="similar-trending-section-articles-div">
                                                            {/* <img src={value.imageUrl} style={{float:'left'}} ClassName="similar-articles-pic" alt="" /> */}
                                                            <div>
                                                                <Link rel="nofollow" key={index} to={{ pathname: `/article/${value.articleId}` }} target="_blank">
                                                                    <div className="similar-trending-section-articles-title">{value.title}</div>
                                                                </Link>
                                                                <div style={{ color: 'rgb(132, 132, 132)', display: 'flex', fontWeight: '400', fontSize: '0.8rem', padding: '2px 1px 1px' }}>By {_.find(this.props.articleReducer.similarArticleUsers, { username: value.user }) ?
                                                                    _.find(this.props.articleReducer.similarArticleUsers, { username: value.user }).displayName.split(" ")[0] : ''} {" - "}

                                                                    {convertDate(value.creationDate)} {" - "} {this.readingTime(value.content)} read</div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="vendor-loader-container-desktop">
                        <NotFound />
                    </div>
                    )
                }
            } else {
                return (
                    <div className="vendor-loader-container-desktop">
                        <img alt="" className="vendor-loader-desktop" src={loader} />
                    </div>
                );
            }
        } else {
            if (!this.props.articleReducer.loading) {
                if (!_.isEmpty(this.props.articleReducer.article)) {
                    const {
                        comments,
                        commentUser
                    } = this.props.articleReducer;
                    return (
                        <div className="article-desktop-container-mobile">
                            {this.renderMetaTags()}
                            <div className="article-action-mobile">
                                <span className="article-action-item-container">
                                    <div className="article-action-item">
                                        {!this.props.articleReducer.article.isLiked &&
                                            <FaHeartO onClick={() => this.articleAction('like', true)} />
                                        }
                                        {this.props.articleReducer.article.isLiked &&
                                            <FaHeart onClick={() => this.articleAction('like', false)} style={{ fill: 'red' }} />
                                        }
                                        <span style={{ fontSize: '12px', marginLeft: '2px' }}>Like</span>
                                    </div>
                                </span>
                                <span className="article-action-item-container">
                                    <div className="article-action-item">
                                        <MdShare onClick={() => this.toggleShareModal(`https://www.trustvardi.com/article/${this.props.articleReducer.article.articleId}`)} />
                                        <span onClick={() => this.toggleShareModal(`https://www.trustvardi.com/article/${this.props.articleReducer.article.articleId}`)} style={{ fontSize: '12px', marginLeft: '2px' }}>Share</span>
                                    </div>
                                </span>
                                <span className="article-action-item-container">
                                    <div className="article-action-item">
                                        {!this.props.articleReducer.article.isBookmarked &&
                                            <MdBookmarkOutline onClick={() => this.articleAction('bookmark', true)} />
                                        }
                                        {this.props.articleReducer.article.isBookmarked &&
                                            <MdBookmark onClick={() => this.articleAction('bookmark', false)} />
                                        }
                                        <span style={{ fontSize: '12px', marginLeft: '2px' }}>Bookmark</span>
                                    </div>
                                </span>
                            </div>
                            <div className="article-main-container-mobile">

                                <div style={{ display: 'flex', height: '30px' }}>
                                    <div className="similar-view-all-container-mobile">
                                        {(this.props.articleReducer.article.category && this.props.articleReducer.article.category.length > 0) &&
                                            categories[this.props.articleReducer.article.category[0]] &&
                                            <Link rel="nofollow" to={{ pathname: `/category/${this.props.articleReducer.article.category[0]}` }} target='_blank'>
                                                <button className="similar-view-all-button-news-mobile">
                                                    {categories[this.props.articleReducer.article.category[0]].name}
                                                </button></Link>
                                        }
                                    </div>
                                </div>

                                <div className="article-title-mobile">
                                    {this.props.articleReducer.article.title}
                                </div>
                                <div className="article-detail-container-header-mobile">
                                    <div className="article-detail-image-container-header-mobile">
                                        <Link rel="nofollow" to={`/user/${this.props.articleReducer.user.username}/reviews`}>
                                            <img className="article-user-profile-picture-header-mobile" src={this.props.articleReducer.user.profilePicture} alt="" />
                                        </Link>
                                    </div>
                                    <div className="article-detail-text-container-header-mobile">
                                        <div>
                                            <div className="article-user-name-header-mobile">
                                                <Link rel="nofollow" to={`/user/${this.props.articleReducer.user.username}/reviews`}>{this.props.articleReducer.user.displayName}</Link>
                                            </div>
                                            {/* <Link target="_blank" to={`/profile/${this.props.articleReducer.vendor.username}`}>
                                                        <div className="article-follower-count-header-mobile">{this.props.articleReducer.vendor.displayName}</div>
                                                    </Link> */}
                                            <div className="article-follower-count-header-mobile" style={{ fontWeight: '500px' }}>Content Writer at TrustVardi</div>

                                            <div style={{ marginTop: '2px', color: '#7e7b7b' }} className="article-follower-count-header-mobile">
                                                {convertDate(this.props.articleReducer.article.creationDate)} . {this.readingTime(this.props.articleReducer.article.content)} read</div>

                                            {/* <Link className="article-follower-count-header" target="_blank" to={`/user/${this.props.articleReducer.user.username}/reviews`}>Find more about author</Link> */}
                                            {/* {console.log(this.props.articleReducer)} */}
                                        </div>
                                    </div>
                                </div>
                                {this.props.articleReducer.article.recommendedFor && this.props.articleReducer.article.recommendedFor.length > 0 &&
                                    <div className="article-title-recommended-mobile">
                                        <span><strong>Recommended for:</strong> {this.props.articleReducer.article.recommendedFor}</span>
                                    </div>
                                }
                                <div className="container-credit-mobile">
                                    <img className="article-image-mobile" src={imageTransformation(this.props.articleReducer.article.imageUrl)}
                                        alt="" />
                                    {this.props.articleReducer.article.headerImageCredit && this.props.articleReducer.article.headerImageCredit.length > 0 &&
                                        <span className="article-image-credit bottom-right"><em style={{ fontSize: '7px' }}><strong>Picture Credits:</strong> {this.props.articleReducer.article.headerImageCredit}</em></span>
                                    }
                                </div>
                                <div className="article-content-mobile"
                                    dangerouslySetInnerHTML={{ __html: this.transformArticleContentImage(this.props.articleReducer.article.content) }}>

                                </div>
                                <div style={{ margin: '0 10px', fontWeight: '500' }}>
                                    Browse Here <Link rel="nofollow" style={{ color: '#ff9f00' }} to={`/profile/${this.props.articleReducer.vendor.username}`}>{this.props.articleReducer.vendor.displayName}</Link>
                                </div>
                                <div className="article-content-category-mobile">
                                    {this.props.articleReducer.article.category.map((value) => {
                                        return (
                                            <Link rel="nofollow" style={{ textDecoration: 'none', color: '#000000' }} to={{ pathname: `/category/${value}` }} key={value} className="article-tab-category-mobile">{
                                                _.find(categories, { key: value }) ? _.find(categories, { key: value }).name : ''
                                            }</Link>
                                        );
                                    })}
                                </div>
                                <div style={{ marginLeft: '12px' }} className="video-comment-container-article">
                                    <span className="video-comment-label-article">Comments</span>
                                    <div className="video-add-comment-container-article">
                                        <textarea id="video-comment" onChange={() => {
                                            document.querySelector('#video-comment').style.height = '';
                                            document.querySelector('#video-comment').style.height = `${Math.min(document.querySelector('#video-comment').scrollHeight)}px`
                                        }} placeholder="Write your own comment."
                                            onKeyUp={(event) => {
                                                if (event.keyCode === 13) {
                                                    this.addComment(this.props.articleReducer.article.articleId)
                                                }
                                            }} className="article-comment-input" type="text" />
                                        <MdSend onClick={() => this.addComment(this.props.articleReducer.article.articleId)}
                                            className="add-comment-button-mobile" />
                                    </div>
                                    {this.props.videoReducer.commentsLoading &&
                                        <div style={{ textAlign: 'center' }}>
                                            <img className="video-comments-loader" src={loader} alt="" />
                                        </div>
                                    }
                                    {!this.props.videoReducer.commentsLoading &&
                                        <div>
                                            {comments && comments.length > 0 && comments.map((value, index) => {
                                                return (
                                                    <Comment key={index} history={this.props.history} card={value}
                                                        user={commentUser} />
                                                );
                                            })}
                                            {comments.length === 0 &&
                                                <div style={{ height: '30px' }}>

                                                </div>
                                            }
                                        </div>
                                    }

                                </div>
                            </div>
                            <div className="similar-trending-section-articles-mobile">
                                <div style={{ marginTop: '4%' }}>
                                    <label className="similar-title-mobile">Similar Articles</label>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: '5px' }}>
                                        {this.props.articleReducer.similarArticle.map((value, index) => {
                                            return (
                                                <BlogCard history={this.props.history} articlePage={true} card={value} key={index} />
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="similar-trending-section-articles-trending-mobile">
                                <div style={{ marginTop: '4%' }}>
                                    <label className="similar-title-mobile">Trending Articles</label>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: '5px' }}>
                                        {this.props.articleReducer.trendingArticle.map((value, index) => {
                                            return (
                                                <BlogCard trendingBlogsMobile={true} articlePage={true} history={this.props.history} card={value} key={index} />
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="vendor-loader-container-desktop">
                        <NotFound />
                    </div>
                    )
                }
            } else {
                return (
                    <div className="vendor-loader-container-desktop">
                        <img alt="" className="vendor-loader-desktop" src={loader} />
                    </div>
                );
            }
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
};

export default connect((state) => state, mapDispatchToProps)(Article);