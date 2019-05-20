import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    MdShare
} from 'react-icons/lib/md';
import {
    FaCamera
} from 'react-icons/lib/fa';
import {
    Helmet
} from 'react-helmet';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookies from 'universal-cookie';
import _ from 'lodash';
import Loadable from 'react-loadable';
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import Modal from 'react-modal'
import '../../assets/css/user.css';
import loader from '../../assets/icons/loader.svg';
import '../../assets/css/vendor.css';
import {
    userMetaDescription, imageTransformation, showLoader, postCallApiForm
} from '../../util/util';
import {
    fetchUser,
    asyncFollowUnfollowUser,
    asyncLogout,
    asyncTogglePicture,
    asyncShareModal,
    asyncUpdateUserData,
    // asyncFetchWishlist,
    asyncLoadMoreUserData
} from '../../action/index';
import { UPLOAD_IMAGE_API } from '../../constant/api'

const TAB_PRESENT = [
    'reviews',
    'bookmarks',
    'favorites',
    'wishlist',
    'articles'
];


const TrendingCard = Loadable({
    loader: () => import('../../component/trending.card'),
    loading: () => <div className="content-placeholder"></div>,
});

const ReviewComment = Loadable({
    loader: () => import('../../component/review.comment'),
    loading: () => <div>Loading...</div>,
});

const BlogCard = Loadable({
    loader: () => import('../../component/blog.card'),
    loading: () => <div>Loading...</div>,
});

const ProductCard = Loadable({
    loader: () => import('../../component/product.card'),
    loading: () => <div>Loading...</div>,
});


let LOAD_MORE = false;

let FIRST_LOAD = false;

const PROFILE_PICTURE = 'profilePicture'

const COVER_PICTURE = 'coverPicture'

const PROFILE_PICTURE_SIZES = [100, 400, 800]

const COVER_PICTURE_SIZES = [600]


class User extends Component {


    constructor(props) {
        super(props)
        this.state = {
            imageType: null,
            isImageSelected: false,
            imageFile: {}
        }
    }
    componentWillMount() {
        FIRST_LOAD = true;
        if (!this.props.match.params.type) {
            this.props.history.push({
                pathname: `/user/${this.props.match.params.userId}/reviews`
            });
        } else if (TAB_PRESENT.indexOf(this.props.match.params.type) === -1) {
            this.props.history.push({
                pathname: `/user/${this.props.match.params.userId}/reviews`
            });
        }
        const tempCookie = new Cookies();
        this.props.dispatch(fetchUser(this.props.match.params.userId, tempCookie.get('token')))
            .then((data) => {
                window.prerenderReady = true;
                this.selectedTab();
                this.loadMoreUser(this.props);
                FIRST_LOAD = false;
            })
            .catch((error) => console.log(error));
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps.meReducer.userData) && !FIRST_LOAD) {
            if (this.props.meReducer.userData !== nextProps.meReducer.userData) {
                const username = nextProps.match.params.userId;
                nextProps.dispatch(fetchUser(username, nextProps.meReducer.userData.accessToken))
                    .then((data) => {
                        this.selectedTab();
                        this.loadMoreUser(nextProps);
                    })
                    .catch((error) => console.log(error));
            }
        }
        if (this.props.match.params.userId !== nextProps.match.params.userId) {
            const username = nextProps.match.params.userId;
            nextProps.dispatch(fetchUser(username, nextProps.meReducer.userData.accessToken))
                .then((data) => {
                    this.selectedTab();
                    this.loadMoreUser(nextProps);
                })
                .catch((error) => console.log(error));
        }
        if (this.props.match.params.userId === nextProps.match.params.userId) {
            if (this.props.match.params.type !== nextProps.match.params.type) {
                this.loadMoreUser(nextProps);
            }
        }
    }

    componentDidMount() {
        this.selectedTab();
    }

    onLogout = () => {
        document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setTimeout(() => {
            this.props.dispatch(asyncLogout());
            this.props.history.push({
                pathname: '/'
            });
        }, 500);
    };

    renderUserProfileContentDesktop = () => {
        const tabType = this.props.match.params.type;
        if (!this.props.userReducer.loadingData) {
            if (tabType === 'reviews') {
                if (this.props.userReducer.reviews.length > 0) {
                    return (
                        <div className="user-review-card-container">
                            {this.props.userReducer.reviews.map((card, i) => {
                                return (
                                    <ReviewComment history={this.props.history} match={this.props.match} key={i} card={card} />
                                )
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            No Reviews
                        </div>
                    );
                }
            } else if (tabType === 'bookmarks') {
                if (this.props.userReducer.bookmarks.length > 0) {
                    return (
                        <div className="user-bookmark-card-container">
                            {this.props.userReducer.bookmarks.map((card, i) => {
                                return (
                                    <BlogCard userPage={true} match={this.props.match} history={this.props.history} key={i} card={card} />
                                );
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            No Bookmarks
                        </div>
                    );
                }
            } else if (tabType === 'favorites') {
                if (this.props.userReducer.favorites.length > 0) {
                    return (
                        <div style={{ margin: '20px 0 0 0' }}>
                            {this.props.userReducer.favorites.map((card, i) => {
                                return (
                                    <TrendingCard height={true} history={this.props.history} match={this.props.match} card={card} key={i} />
                                )
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            No Favorites
                        </div>
                    );
                }
            } else if (tabType === 'wishlist') {
                if (this.props.userReducer.products.length > 0) {
                    return (
                        <div style={{ margin: '1rem 0 1rem 0' }}>
                            {this.props.userReducer.products.map((card, i) => {
                                return (
                                    <ProductCard userPage={true} history={this.props.history} match={this.props.match} card={card} key={i} />
                                )
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            No Products
                        </div>
                    );
                }
            } else if (tabType === 'articles') {
                if (this.props.userReducer.blogs.length > 0) {
                    return (
                        <div className="user-bookmark-card-container">
                            {this.props.userReducer.blogs.map((card, i) => {
                                return (
                                    <BlogCard userPage={true} match={this.props.match} history={this.props.history} key={i} card={card} />
                                );
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            No Articles
                        </div>
                    );
                }
            }
        } else {
            return (
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    <img alt="" className="vendor-loader-desktop" src={loader} />
                </div>
            );
        }
    };

    renderUserProfileContentMobile = () => {
        const tabType = this.props.match.params.type;
        if (!this.props.userReducer.loadingData) {
            if (tabType === 'reviews') {
                if (this.props.userReducer.reviews.length > 0) {
                    return (
                        <div className="user-review-card-container">
                            {this.props.userReducer.reviews.map((card, i) => {
                                return (
                                    <ReviewComment history={this.props.history} key={i} match={this.props.match} card={card} />
                                )
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            No review
                        </div>
                    );
                }
            } else if (tabType === 'bookmarks') {
                if (this.props.userReducer.bookmarks.length > 0) {
                    return (
                        <div className="user-bookmark-card-container">
                            {this.props.userReducer.bookmarks.map((card, i) => {
                                return (
                                    <BlogCard match={this.props.match} history={this.props.history} key={i} card={card} />
                                );
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            No Bookmarks
                        </div>
                    );
                }
            } else if (tabType === 'favorites') {
                if (this.props.userReducer.favorites.length > 0) {
                    return (
                        <div style={{ margin: '5px 0 20px 0', display: 'flex', flexWrap: 'wrap' }}>
                            {this.props.userReducer.favorites.map((card, i) => {
                                return (
                                    <TrendingCard key={i} match={this.props.match} history={this.props.history} card={card} />
                                )
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            No Favories
                        </div>
                    );
                }
            } else if (tabType === 'wishlist') {
                if (this.props.userReducer.products.length > 0) {
                    return (
                        <div style={{ margin: '45px 0 20px 0', display: 'flex', flexWrap: 'wrap' }}>
                            {this.props.userReducer.products.map((card, i) => {
                                return (
                                    <ProductCard history={this.props.history} match={this.props.match} card={card} key={i} />
                                )
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            No Products
                        </div>
                    );
                }
            } else if (tabType === 'articles') {
                if (this.props.userReducer.blogs.length > 0) {
                    return (
                        <div className="user-bookmark-card-container">
                            {this.props.userReducer.blogs.map((card, i) => {
                                return (
                                    <BlogCard match={this.props.match} history={this.props.history} key={i} card={card} />
                                );
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            No Articles
                        </div>
                    );
                }
            }
        } else {
            return (
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    <img alt="" className="vendor-loader-desktop" src={loader} />
                </div>
            );
        }
    };


    changeTabs = (tabs) => {
        this.props.history.push({
            pathname: `/user/${this.props.match.params.userId}/${tabs}`
        })
    };

    selectedTab = () => {
        const tab = this.props.match.params.type;
        if (document.querySelector('.user-mobile-tabs')) {
            if (tab === 'reviews') {
                const selectedTab = document.querySelector(`#${tab}`);
                selectedTab.style.color = '#ff9f00';
                const unselectedTab = document.querySelector('#bookmarks');
                const unselectedTab2 = document.querySelector('#favorites');
                const unselectedTab3 = document.querySelector('#wishlist');
                const unselectedTab4 = document.querySelector('#articles');
                unselectedTab4.style.color = 'black';
                unselectedTab3.style.color = 'black';
                unselectedTab.style.color = 'black';
                unselectedTab2.style.color = 'black';
            } else if (tab === 'bookmarks') {
                const selectedTab = document.querySelector(`#${tab}`);
                selectedTab.style.color = '#ff9f00';
                const unselectedTab = document.querySelector('#reviews');
                const unselectedTab2 = document.querySelector('#favorites');
                const unselectedTab3 = document.querySelector('#wishlist');
                const unselectedTab4 = document.querySelector('#articles');
                unselectedTab4.style.color = 'black';
                unselectedTab3.style.color = 'black';
                unselectedTab.style.color = 'black';
                unselectedTab2.style.color = 'black';
            } else if (tab === 'favorites') {
                const selectedTab = document.querySelector(`#${tab}`);
                selectedTab.style.color = '#ff9f00';
                const unselectedTab = document.querySelector('#reviews');
                const unselectedTab2 = document.querySelector('#bookmarks');
                const unselectedTab3 = document.querySelector('#wishlist');
                const unselectedTab4 = document.querySelector('#articles');
                unselectedTab4.style.color = 'black';
                unselectedTab3.style.color = 'black';
                unselectedTab.style.color = 'black';
                unselectedTab2.style.color = 'black';
            } else if (tab === 'wishlist') {
                const selectedTab = document.querySelector(`#${tab}`);
                selectedTab.style.color = '#ff9f00';
                const unselectedTab = document.querySelector('#reviews');
                const unselectedTab2 = document.querySelector('#bookmarks');
                const unselectedTab3 = document.querySelector('#favorites');
                const unselectedTab4 = document.querySelector('#articles');
                unselectedTab4.style.color = 'black';
                unselectedTab3.style.color = 'black';
                unselectedTab.style.color = 'black';
                unselectedTab2.style.color = 'black';
            }
            else if (tab === 'articles') {
                const selectedTab = document.querySelector(`#${tab}`);
                selectedTab.style.color = '#ff9f00';
                const unselectedTab = document.querySelector('#reviews');
                const unselectedTab2 = document.querySelector('#bookmarks');
                const unselectedTab3 = document.querySelector('#favorites');
                const unselectedTab4 = document.querySelector('#wishlist');
                unselectedTab3.style.color = 'black';
                unselectedTab.style.color = 'black';
                unselectedTab2.style.color = 'black';
                unselectedTab4.style.color = 'black';
                document.querySelector('.mobile-tab').scrollTo(0, 0);
            }
        }
    };

    cardAction = (username, status) => {
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

    renderFollowbuttonDesktop = () => {

        if (!_.isEmpty(this.props.meReducer.userData)) {
            if (this.props.meReducer.userData.user.username !== this.props.userReducer.user.username) {
                if (this.props.userReducer.user.isFollowing) {
                    return (
                        <button className="user-follow-button-desktop" onClick={() => this.cardAction(this.props.userReducer.user.username, false)}>Following</button>
                    );
                } else {
                    return (
                        <button className="user-follow-button-desktop" onClick={() => this.cardAction(this.props.userReducer.user.username, true)}>Follow</button>
                    );
                }
            } else {
                return (
                    <button className="user-follow-button-desktop" onClick={this.onLogout}>Logout</button>
                );
            }
        } else {
            return (
                <button className="user-follow-button-desktop" onClick={() => this.cardAction(this.props.userReducer.user.username, false)}>Follow</button>
            );
        }
    };

    renderFollowbuttonMobile = () => {

        if (!_.isEmpty(this.props.meReducer.userData)) {
            if (this.props.meReducer.userData.user.username !== this.props.userReducer.user.username) {
                if (this.props.userReducer.user.isFollowing) {
                    return (
                        <button className="user-follow-button-mobile" onClick={() => this.cardAction(this.props.userReducer.user.username, false)}>Following</button>
                    );
                } else {
                    return (
                        <button className="user-follow-button-mobile" onClick={() => this.cardAction(this.props.userReducer.user.username, true)}>Follow</button>
                    );
                }
            } else {
                return (
                    <button className="user-follow-button-mobile" onClick={this.onLogout}>Logout</button>
                );
            }
        } else {
            return (
                <button className="user-follow-button-mobile" onClick={() => this.cardAction(this.props.userReducer.user.username, false)}>Follow</button>
            );
        }
    };

    renderMetaTags = () => {
        const vendorData = this.props.userReducer.user;
        return (
            <Helmet
                titleTemplate="%s">
                <title>{vendorData.displayName}</title>
                <meta name="fragment" content="!" />
                <meta name="description" content={userMetaDescription(this.props.userReducer.user.displayName)} />
                <link rel="canonical" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="en" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta name="robots" content="index, follow" />
                <meta name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta property="og:title" content={vendorData.displayName} />
                <meta property="og:description" content={userMetaDescription(this.props.userReducer.user.displayName.split(' ')[0])} />
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={vendorData.coverPicture} />
                <meta property="og:site_name" content="trustvardi.com" />
                <meta property="article:section" content="Lifestyle" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@trustvardi" />
                <meta name="twitter:creator" content="@trustvardi" />
                <meta name="twitter:title" content={vendorData.displayName} />
                <meta name="twitter:description" content={userMetaDescription(this.props.userReducer.user.displayName)} />
                <meta name="twitter:image" content={vendorData.coverPicture} />
            </Helmet>
        );
    };

    loadMoreUser = (props) => {
        LOAD_MORE = true;
        let skip = 0;
        const tempCookies = new Cookies();
        let tabType = props.match.params.type;
        if (tabType === 'reviews') {
            skip = props.userReducer.reviews.length;
        } else if (tabType === 'bookmarks') {
            skip = props.userReducer.bookmarks.length;
        } else if (tabType === 'favorites') {
            skip = props.userReducer.favorites.length;
        } else if (tabType === 'wishlist') {
            skip = props.userReducer.products.length;
        } else if (tabType === 'articles') {
            tabType = 'userarticles';
            skip = props.userReducer.blogs.length;
        }
        props.dispatch(asyncLoadMoreUserData(skip, props.userReducer.user.username, tabType, tempCookies.get('token')))
            .then((data) => {
                LOAD_MORE = false;
            });
    };

    desktopUI = () => {
        if (!_.isEmpty(this.props.userReducer.user)) {
            const userData = this.props.userReducer.user;
            return (

                <div className="animated fadeIn">
                    {this.renderMetaTags()}
                    { this.state.isImageSelected && this.state.imageFile && this.renderUploadModal()}

                    }
                    <div className="user-profile-cover-container">
                        <img onClick={() => {
                            this.props.dispatch(asyncTogglePicture(userData.coverPicture))
                        }} className="user-profile-cover-picture-img" src={imageTransformation(userData.coverPicture)} alt="" />
                        {this.props.meReducer.isLoggedIn && this.props.meReducer.userData.user.username === userData.username &&
                            <button
                                className="user-cover-picture-button"
                                onClick={(event) => {
                                    this.setState({
                                        imageType: COVER_PICTURE,
                                    }, () => {
                                        this.handleFileSelect(event)
                                    })
                                }}>Change Cover Picture</button>
                        }
                    </div>
                    <div className="user-profile-main-container">
                        <div className="user-profile-basic-information-container">
                            <div className="user-profile-picture-container">
                                <img onClick={() => {
                                    this.props.dispatch(asyncTogglePicture(userData.profilePicture))
                                }} className="user-profile-picture-desktop" src={imageTransformation(userData.profilePicture, 300)} alt="" />
                                {this.props.meReducer.isLoggedIn && this.props.meReducer.userData.user.username === userData.username &&
                                    <FaCamera
                                        onClick={(event) => {
                                            this.setState({
                                                imageType: PROFILE_PICTURE,
                                            }, () => {
                                                this.handleFileSelect(event)
                                            })
                                        }}
                                        className="user-profile-picture-button" />
                                }
                            </div>
                            <div className="user-profile-basic-detail-container">
                                <div className="user-profile-basic-detail-inside-container">
                                    <div className="user-follow-share-desktop">
                                        {this.renderFollowbuttonDesktop()}
                                        <button onClick={() => {
                                            this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/user/${userData.username}/reviews`))
                                        }} className="user-share-button-desktop">
                                            Share
                                            <MdShare style={{ marginLeft: '5px' }} />
                                        </button>
                                    </div>
                                    <span className="user-name-desktop">{userData.displayName}</span>
                                    <div>
                                        <span className="user-address-desktop">{userData.address}</span>
                                    </div>
                                    <div style={{ marginTop: '20px', marginBottom: '10px' }}>
                                        <span className="user-description-desktop">{userData.description}</span>
                                    </div>
                                    {userData.featuredPublisher &&
                                        <span className="user-featured-publisher-tag-desktop">Featured Publisher</span>
                                    }
                                    <div style={{ marginTop: '20px' }}>
                                        <span className="user-follower-desktop">{userData.followerCount} Followers</span>
                                        <span className="user-following-desktop">{userData.followingCount} Following</span>
                                        <span className="user-reviews-desktop">{userData.reviewCount} Reviews</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="user-profile-content-container">
                            <div className="user-profile-tabs-desktop">
                                <div style={(this.props.match.url.includes('/reviews')) ? { backgroundColor: 'rgba(0,0,0,0.04)' } : { backgroundColor: 'white' }} className="user-profile-tab-container" onClick={() => this.changeTabs('reviews')}>
                                    <span className="user-profile-tab-label">Reviews</span>
                                    <span className="user-profile-tab-count">{userData.reviewCount}</span>
                                </div>
                                {/*<div className="user-profile-tab-container">*/}
                                {/*<span className="user-profile-tab-label">Rating</span>*/}
                                {/*<span className="user-profile-tab-count">{userData.rating}</span>*/}
                                {/*</div>*/}
                                <div style={(this.props.match.url.includes('/bookmarks')) ? { backgroundColor: 'rgba(0,0,0,0.04)' } : { backgroundColor: 'white' }} className="user-profile-tab-container" onClick={() => this.changeTabs('bookmarks')}>
                                    <span className="user-profile-tab-label">Bookmarks</span>
                                    <span className="user-profile-tab-count">{userData.articleBookmarked ? userData.articleBookmarked.length : 0}</span>
                                </div>
                                <div style={(this.props.match.url.includes('/favorites')) ? { backgroundColor: 'rgba(0,0,0,0.04)' } : { backgroundColor: 'white' }} className="user-profile-tab-container" onClick={() => this.changeTabs('favorites')}>
                                    <span className="user-profile-tab-label">Favorites</span>
                                    <span className="user-profile-tab-count">{userData.vendorLikedCount || 0}</span>
                                </div>
                                <div style={(this.props.match.url.includes('/wishlist')) ? { backgroundColor: 'rgba(0,0,0,0.04)' } : { backgroundColor: 'white' }} className="user-profile-tab-container" onClick={() => this.changeTabs('wishlist')}>
                                    <span className="user-profile-tab-label">Wishlist</span>
                                    <span className="user-profile-tab-count">{userData.wishList ? userData.wishList.length : 0}</span>
                                </div>
                                <div style={(this.props.match.url.includes('/articles')) ? { backgroundColor: 'rgba(0,0,0,0.04)' } : { backgroundColor: 'white' }} className="user-profile-tab-container" onClick={() => this.changeTabs('articles')}>
                                    <span className="user-profile-tab-label">Articles</span>
                                    <span className="user-profile-tab-count">{userData.articleCount ? userData.articleCount : 0}</span>
                                </div>
                            </div>
                            <div className="user-profile-tab-content">
                                <InfiniteScroll
                                    dataLength={() => {
                                        const tabType = this.props.match.params.type;
                                        if (tabType === 'wishlist') {
                                            return this.props.userReducer.products.length;
                                        } else {

                                        } return this.props.userReducer[tabType].length;
                                    }}
                                    next={() => {
                                        const tabType = this.props.match.params.type;
                                        let checkLoadedKey = '';
                                        if (tabType === 'reviews') {
                                            checkLoadedKey = 'Review';
                                        } else if (tabType === 'wishlist') {
                                            checkLoadedKey = 'Products';
                                        } else if (tabType === 'bookmarks') {
                                            checkLoadedKey = 'Bookmarks';
                                        } else if (tabType === 'favorites') {
                                            checkLoadedKey = 'Favorites'
                                        } else if (tabType === 'articles') {
                                            checkLoadedKey = 'Blogs'
                                        }
                                        if (!LOAD_MORE && !this.props.userReducer[`all${checkLoadedKey}Loaded`]) {
                                            this.loadMoreUser(this.props);
                                        } else {
                                            return;
                                        }
                                    }}
                                    hasMore={true}
                                    endMessage={
                                        <p style={{ textAlign: 'center' }}>
                                            <b>Yay! You have seen it all</b>
                                        </p>
                                    }
                                >
                                    {this.renderUserProfileContentDesktop()}
                                </InfiniteScroll>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="vendor-loader-container-desktop">
                    <img alt="" className="vendor-loader-desktop" src={loader} />
                </div>
            );
        }
    };



    mobileUI = () => {
        if (!_.isEmpty(this.props.userReducer.user)) {
            const userData = this.props.userReducer.user;
            this.selectedTab();
            return (
                <div style={{ overflow: 'auto' }} className="animated fadeIn">
                    {this.renderMetaTags()}
                    {this.state.isImageSelected && this.state.imageFile && this.renderUploadModal()}
                    <div className="user-profile-cover-container">
                        <img
                            onClick={() => {
                                this.props.dispatch(asyncTogglePicture(userData.coverPicture))
                            }}
                            className="user-profile-cover-picture-img"
                            src={imageTransformation(userData.coverPicture)}
                            alt="" />
                        {this.props.meReducer.isLoggedIn && this.props.meReducer.userData.user.username === userData.username &&
                            <button onClick={(event) => {
                                this.setState({
                                    imageType: COVER_PICTURE,
                                }, () => {
                                    this.handleFileSelect(event)
                                })
                            }} className="user-cover-picture-button">Change Cover Picture</button>
                        }
                    </div>
                    <div className="user-profile-main-container-mobile">
                        <div className="user-profile-basic-information-container-mobile">
                            <div className="user-profile-picture-container-mobile">
                                <img onClick={() => {
                                    this.props.dispatch(asyncTogglePicture(userData.profilePicture))
                                }} className="user-profile-picture-mobile" src={imageTransformation(userData.profilePicture, 100)} alt="" />
                                {this.props.meReducer.isLoggedIn && this.props.meReducer.userData.user.username === userData.username &&
                                    <FaCamera
                                        onClick={(event) => {
                                            this.setState({
                                                imageType: PROFILE_PICTURE,
                                            }, () => {
                                                this.handleFileSelect(event)
                                            })
                                        }}
                                        className="user-profile-picture-button-mobile" />
                                }
                            </div>
                            <div className="user-profile-picture-data-container-mobile">
                                <div className="user-profile-picture-data-container-mobile-center">
                                    <span className="user-name-mobile">{userData.displayName}</span>
                                    <div>
                                        <span className="user-address-mobile">{userData.address}</span>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <span className="user-description-mobile">{userData.description}</span>
                                    </div>
                                    {userData.featuredPublisher &&
                                        <span className="user-featured-publisher-tag-mobile">Featured Publisher</span>
                                    }
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <span className="user-follower-mobile">{userData.followerCount} Followers</span>
                                <span className="user-following-mobile">{userData.followingCount} Following</span>
                                <span className="user-reviews-mobile">{userData.reviewCount} Reviews</span>
                            </div>
                            <div className="user-follow-share-mobile">
                                {this.renderFollowbuttonMobile()}
                                <button onClick={() => {
                                    this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/user/${userData.username}/reviews`))
                                }} className="user-share-button-mobile">
                                    Share
                                    <MdShare style={{ marginLeft: '5px' }} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="user-mobile-tabs">
                        <div className="mobile-tab" id="reviews" style={{ borderRight: '1px solid #d5dde5' }}>
                            <span className="mobile-tab-content" onClick={() => this.changeTabs('reviews')}>Reviews</span>
                        </div>
                        <div className="mobile-tab" id="bookmarks" style={{ borderRight: '1px solid #d5dde5' }}>
                            <span className="mobile-tab-content" onClick={() => this.changeTabs('bookmarks')}>Bookmarks</span>
                        </div>
                        <div className="mobile-tab" id="favorites">
                            <span className="mobile-tab-content" onClick={() => this.changeTabs('favorites')}>Favorites</span>
                        </div>
                        <div className="mobile-tab" id="wishlist" style={{ borderLeft: '1px solid #d5dde5' }}>
                            <span className="mobile-tab-content" onClick={() => this.changeTabs('wishlist')}>Wishlist</span>
                        </div>
                        <div className="mobile-tab" id="articles" style={{ borderLeft: '1px solid #d5dde5' }}>
                            <span className="mobile-tab-content" onClick={() => this.changeTabs('articles')}>Articles</span>
                        </div>
                    </div>
                    <div className="user-mobile-content">
                        <InfiniteScroll
                            dataLength={() => {
                                const tabType = this.props.match.params.type;
                                if (tabType === 'wishlist') {
                                    return this.props.userReducer.products.length;
                                } else {

                                } return this.props.userReducer[tabType].length;
                            }}
                            next={() => {
                                const tabType = this.props.match.params.type;
                                let checkLoadedKey = '';
                                if (tabType === 'reviews') {
                                    checkLoadedKey = 'Review';
                                } else if (tabType === 'wishlist') {
                                    checkLoadedKey = 'Products';
                                } else if (tabType === 'bookmarks') {
                                    checkLoadedKey = 'Bookmarks';
                                } else if (tabType === 'favorites') {
                                    checkLoadedKey = 'Favorites'
                                }
                                if (!LOAD_MORE && !this.props.userReducer[`all${checkLoadedKey}Loaded`]) {
                                    this.loadMoreUser(this.props);
                                } else {
                                    return;
                                }
                            }}
                            hasMore={true}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >
                            {this.renderUserProfileContentMobile()}
                        </InfiniteScroll>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="vendor-loader-container-desktop">
                    <img alt="" className="vendor-loader-desktop" src={loader} />
                </div>
            );
        }
    };

    handleFileSelect = (event) => {
        event.preventDefault();
        const fileSelector = document.createElement('input')
        fileSelector.setAttribute('type', 'file')
        fileSelector.setAttribute('id', 'file')
        fileSelector.setAttribute('accept', '.jpg, .jpeg, .png, .gif, .bmp, .webp')
        fileSelector.click();
        fileSelector.addEventListener('change', (event) => {
            if (Object.keys(event.target.files).length === 1) {
                var file = event.target.files[0]
                this.setState({ isImageSelected: true, imageFile: file })
            }
        })
    }

    createCroppedImg = (imageFile) => {

        var pixelCrop = this.cropper.getData(true)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        var img = new Image()
        var reader = new FileReader()
        reader.readAsDataURL(imageFile)
        reader.onload = (e) => {
            if (e.target.readyState === FileReader.DONE) {
                img.src = e.target.result
                img.onload = () => {
                    ctx.drawImage(
                        img,
                        pixelCrop.x,
                        pixelCrop.y,
                        pixelCrop.width,
                        pixelCrop.height,
                        0, 0,
                        pixelCrop.width,
                        pixelCrop.height
                    )

                    if (img.complete) {
                        canvas.toBlob((blob) => {
                            blob.fileName = this.state.imageFile.name
                            this.uploadCroppedImg(blob)
                        }, 'image/jpeg')
                    }
                }


            }
        }
    }

    uploadCroppedImg = (croppedImgBlob) => {

        var file = new File([croppedImgBlob], this.state.imageFile.name)
        var formData = new FormData()
        formData.append('image', file)
        var type = this.state.imageType
        if (type === PROFILE_PICTURE) {
            var sizes = PROFILE_PICTURE_SIZES
        }
        if (type === COVER_PICTURE) {
            sizes = COVER_PICTURE_SIZES
        }


        showLoader(true)
        postCallApiForm(UPLOAD_IMAGE_API(), formData, sizes)
            .then(response => {
                const tempCookie = new Cookies()
                const imageLink = response.data.url
                if (response.data.error !== "") {
                    alert(response.data.error)
                } else {
                    if (imageLink !== undefined) {

                        this.props.dispatch(asyncUpdateUserData(tempCookie.get('token'), {
                            [type]: imageLink
                        }))
                            .then(result => {
                                if (result) {
                                    showLoader(false)
                                }
                            })
                            .catch(reason => {
                                console.log(reason)
                            })
                    } else {
                        alert('Some Error Occured')
                    }
                }

            })
            .catch(reason => {
                console.log(reason)
            })

        this.setState({
            imageType: null,
            isImageSelected: false,
            imageFile: {},
        })

    }

    renderUploadModal = ()=>{
        return (
            
            <div>
                {
                    <Modal
                        isOpen={this.state.isImageSelected}

                        style={window.innerWidth > 768 ? {
                            content: {
                                top: '50%',
                                bottom: '0',
                                left: '50%',
                                right: '0',
                                position: 'absolute',
                                transform: 'translate(-50%, -50%)',
                                overflow: 'hidden',
                                height: '70%',
                                width: '40%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                alignContent: 'center'
                            },
                            overlay: {
                                zIndex: '11',
                                overflow: 'auto'
                            }
                        } : {
                            content: {
                                top: '50%',
                                bottom: '0',
                                left: '50%',
                                right: '0',
                                position: 'absolute',
                                transform: 'translate(-50%, -50%)',
                                overflow: 'hidden',
                                height: '100%',
                                width: '90%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                alignContent: 'center'
                            },
                            overlay: {
                                zIndex: '11',
                                overflow: 'auto'
                            }
                        }}>
                        <div style={{ borderBottom: '1px solid #e7e7e7' }}>
                            <p
                                style={{
                                    color: 'black',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    margin: '0px',
                                    marginBottom: '16px'
                                }}>
                                Crop Your Picture</p></div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '16px',
                            maxHeight: '75%',
                            maxWidth: '100%',
                        }}>

                            <Cropper ref={(ref) => { this.cropper = ref }}
                                src={URL.createObjectURL(this.state.imageFile)}
                                style={{ maxWidth: '100%', objectFit: 'cover', display: 'flex' }}
                                aspectRatio={this.state.imageType === COVER_PICTURE ? 3 / 1 : 1 / 1}
                                responsive={true} viewMode={1} guides={false} background={false}
                                scalable={false} zoomable={false} modal={false} />

                        </div>
                        <div style={window.innerWidth > 768 ? {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'space-around',
                            width: '60%',
                            paddingTop: '16px'
                        } : {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'space-around',
                            width: '100%',
                            paddingTop: '16px'
                        }}>
                            <button style={{
                                display: 'flex',
                                fontSize: '16px',
                                backgroundColor: '#FC9C04',
                                border: '1px solid #FC9C04',
                                fontWeight: '300',
                                borderRadius: '0.2em',
                                color: 'white',
                                padding: '5px 8px'
                            }}
                                onClick={() => { this.createCroppedImg(this.state.imageFile) }}
                            >{this.state.imageType === PROFILE_PICTURE ? 'Set as Profile Photo' : 'Set as Profile Photo'}</button>
                            <button style={{
                                display: 'flex',
                                fontSize: '16px',
                                border: '1px solid #FC9C04',
                                backgroundColor: 'white',
                                borderRadius: '0.2em',
                                fontWeight: '300',
                                color: '#FC9C04',
                                padding: '5px 8px'
                            }}
                                onClick={() => { this.setState({ isImageSelected: false, imageFile: null }) }} >Cancel</button>
                        </div>
                    </Modal>
                }
            </div>
        )
    }


    render() {

        if (window.innerWidth > 768) {
            return (
                <div>
                    {this.desktopUI()}
                </div>
            );
        } else if (window.innerWidth < 768) {
            return (
                <div>
                    {this.mobileUI()}
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

export default connect((state) => state, mapDispatchToProps)(User);