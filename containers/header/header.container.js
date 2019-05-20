/* eslint-disable array-callback-return, radix */
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import Sidebar from 'react-sidebar';
import _ from 'lodash';
import Modal from 'react-modal';
import Loadable from 'react-loadable';
import {
    Link
} from 'react-router-dom';
// import Loadable from 'react-loadable';
import Login from '../../component/login';
import ShareModal from '../../component/share.modal';
import AddReview from '../../component/add.review';
import '../../assets/css/header.css';
import '../../assets/css/sidebar.css';
import {
    asyncFacebookLogin,
    asyncGoogleSignin,
    asyncCheckUserToken,
    searchVendor,
    asyncSignUp,
    asyncLogin,
    toggleMobileSearchModal
} from '../../action/index';
import Cookies from 'universal-cookie';
import {
    FaBars,
    FaUser,
    FaAngleDown,
    FaAngleLeft,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaYoutubePlay,
    FaSearch,
    FaCaretDown
} from 'react-icons/lib/fa';
import {
    toggleLoginModal,
    asyncShareModal,
    asyncTogglePicture
} from '../../action/index';
import { newSearchIcon } from '../../assets/icons/icons';
import {
    MdClose,
    MdHome,
    MdPersonOutline,
    MdFavorite,
    MdBookmark,
    MdBookmarkOutline,
    MdFavoriteOutline,
    // MdSearch,
    MdRefresh
} from 'react-icons/lib/md';
import {
    collectionsObject,
    categoriesHome,
    // CITIES_SEARCH
} from '../../constant/static';
// import logo from '../../assets/image/logo.svg';
import ReactPixel from '../../util/fbPixel';
import loader from '../../assets/icons/loader.svg';
import { getCallApi, imageTransformation } from '../../util/util';

// const LocationInput = Loadable({
//     loader: () => import('../../component/location-input'),
//     loading: () => <div className="vendor-loader-container-desktop">
//         <img alt="" className="vendor-loader-desktop" src={loader}/>
//     </div>,
// });

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
    overlay: {
        zIndex: '12'
    }
};

const mobileSearchModalStyle = {
    content: {
        top: '0%',
        left: '0%',
        right: '0',
        bottom: '0',
        padding: '5px'
    },
    overlay: {
        zIndex: '12'
    }
};


const customStylesMobile = {
    content: {
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'white'
    },
    overlay: {
        zIndex: '12',
        height: '100%'
    }
};

const customShareStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: 'white'
    },
    overlay: {
        zIndex: '12'
    }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');


const sidebarStyleMobile = {
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    sidebar: {
        zIndex: 10,
        position: 'fixed',
        top: 0,
        bottom: 0,
        transition: 'transform .3s ease-out',
        WebkitTransition: '-webkit-transform .3s ease-out',
        willChange: 'transform',
        overflowY: 'auto',
        backgroundColor: 'white',
        width: '70%'
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'scroll',
        WebkitOverflowScrolling: 'touch',
        transition: 'left .3s ease-out, right .3s ease-out',
    },
    overlay: {
        zIndex: 8,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        visibility: 'hidden',
        transition: 'opacity .3s ease-out, visibility .3s ease-out',
        backgroundColor: 'rgba(0,0,0,.3)',
        overflow: 'hidden'
    },
    dragHandle: {
        zIndex: 1,
        position: 'fixed',
        top: 0,
        bottom: 0,
    },
};

let timeOut = null;

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

const options = {
    autoConfig: true, 	// set pixel's autoConfig
    debug: false, 		// enable logs
};
ReactPixel.init('810090905850948', null, options);

const MobileSearchModal = Loadable({
    loader: () => import('../../component/mobile.search.modal'),
    loading: () => <div className="vendor-loader-container-desktop">
        <img alt="" className="vendor-loader-desktop" src={loader} />
    </div>,
});


const checkPMLevel = (value) => {
    if (value > 0 && value <= 50) {
        return `#15e812`
    } else if (value > 50 && value <= 100) {
        return `#ffde33`
    } if (value > 100 && value <= 150) {
        return `#ff9933`
    } if (value > 150 && value <= 200) {
        return `#ef83a1`
    } if (value > 200 && value <= 300) {
        return `#f16e6e`
    } if (value > 300 && value <= 1000) {
        return `#f10808`
    }
}

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sideBarOpen: false,
            showCollection: false,
            showUserSection: false,
            showLoginModal: true,
            showCategories: false,
            showSearchResult: false,
            reviewModal: false,
            showSearchHeader: false,
            showListingDiv: true,
            pmLevel: 0,
            city: ''
        };
    }

    componentWillMount() {
        const cookies = new Cookies();
        const x = cookies.get('token');

        if (window.innerWidth > 768) {
            this.getPmLevelLocation();
        }

        this.props.dispatch(asyncCheckUserToken(x));
    }


    getPmLevelLocation = () => {
        if (document.querySelector('#getPmLevelLocation')) {
            if (document.querySelector('#getPmLevelLocation')) {
                document.querySelector('#getPmLevelLocation').classList.remove('rotating');

                setTimeout(() => {
                    document.querySelector('#getPmLevelLocation').classList.add('rotating');
                }, 500)
            }
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                getCallApi(`https://api.waqi.info/feed/geo:${position.coords.latitude};${position.coords.longitude}/?token=69a6e0770bf0d2aead6f95a4d4b3f1aeba3f3d89`)
                    .then((data) => {
                        if (data.status === 'ok') {
                            this.setState({
                                pmLevel: data.data.aqi,
                                city: (data.data.city.name.split(',') && data.data.city.name.split(',').length > 1) ? data.data.city.name.split(',')[0] : ''
                            });
                        } else {
                            getCallApi('https://api.waqi.info/feed/delhi/?token=69a6e0770bf0d2aead6f95a4d4b3f1aeba3f3d89')
                                .then((data) => {
                                    if (data.status === 'ok') {
                                        this.setState({
                                            pmLevel: data.data.aqi,
                                            city: 'Delhi'
                                        });
                                    }
                                });
                        }

                    });
            }, (error) => {
                if (error) {
                    getCallApi('https://api.waqi.info/feed/delhi/?token=69a6e0770bf0d2aead6f95a4d4b3f1aeba3f3d89')
                        .then((data) => {
                            if (data.status === 'ok') {
                                this.setState({
                                    pmLevel: data.data.aqi,
                                    city: 'Delhi'
                                });
                            }
                        });
                }
            });
        } else {
            getCallApi('https://api.waqi.info/feed/delhi/?token=69a6e0770bf0d2aead6f95a4d4b3f1aeba3f3d89')
                .then((data) => {
                    if (data.status === 'ok') {
                        this.setState({
                            pmLevel: data.data.aqi,
                            city: 'Delhi'
                        });
                    }
                });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.url !== nextProps.match.url) {

            if (document.querySelector('.listing-header-div-animation')) {
                document.querySelector('.listing-header-div-animation').style.height = '1.5rem';
                document.querySelector('.listing-header-div-animation span').style.display = 'inline-block';
            }
        }
    }

    componentDidMount() {
        if(document.querySelector('.back-button-mobile')){
            document.querySelector('.back-button-mobile').setAttribute('viewBox', '5 10 50 20')
        }
       

        const tempCookie = new Cookies();
        if (this.props.location.search.includes('?invited=true') && !tempCookie.get('token')) {
            this.props.dispatch(toggleLoginModal());
            document.body.style.overflow = 'hidden';
        } else {
            setTimeout(() => {
                if (!tempCookie.get('token')) {
                    const tempCookie = new Cookies();
                    const closeTime = tempCookie.get('ldbc');
                    if (parseInt(closeTime) - Date.now() > 86400000 || !closeTime) {
                        // this.props.dispatch(toggleLoginModal());
                        // document.body.style.overflow = 'hidden';
                    }
                }
            }, 30000);
        }
        window.addEventListener('click', (event) => {
            if (document.querySelector('.desktop-dropdown')) {
                if (event.srcElement.id !== 'category-click' && document.querySelector('.desktop-dropdown').style.display === 'block') {
                    document.querySelector('.desktop-dropdown').style.display = 'none';
                }
            }


            if (document.querySelector('.desktop-dropdown-collection')) {
                if (event.srcElement.id !== 'collection-click' && document.querySelector('.desktop-dropdown-collection').style.display === 'block') {
                    document.querySelector('.desktop-dropdown-collection').style.display = 'none';
                }
            }
            if (event.target && event.target.id !== 'search-button-kk') {
                this.setState({
                    showSearchResult: false
                });
            }
            if (event.target.id === 'cover-pic-vendor') {
                this.props.dispatch(asyncTogglePicture(this.props.vendorReducer.vendor.coverPicture))
            }
        });
        if (window.pageYOffset > 350) {
            this.setState({
                showSearchHeader: true
            });
        } else {
            this.setState({
                showSearchHeader: false
            });
        }
        window.addEventListener('scroll', (event) => {
            if (window.innerWidth > 768) {
                if (window.pageYOffset > 350) {
                    this.setState({
                        showSearchHeader: true
                    });
                } else {
                    this.setState({
                        showSearchHeader: false
                    });
                }
            } else {
                const elemSearchHeader = document.getElementById('search-icon-mobile');
                if (elemSearchHeader && document.querySelector('#mobile-search-button-invoke')) {
                    const elemSearch = document.querySelector('#mobile-search-button-invoke').getBoundingClientRect();
                    if (this.props.match.url === '/') {
                        if (elemSearch.top >= 0) {
                            elemSearchHeader.style.opacity = '0';
                        } else {
                            elemSearchHeader.style.opacity = '1';
                        }
                    }
                }
            }
        });
        window.addEventListener('wheel', (e) => {
            if (document.querySelector('.listing-header-div-animation')) {
                if (window.pageYOffset > 580) {
                    if (e.deltaY < 0) {
                        document.querySelector('.listing-header-div-animation').style.height = '1.5rem';
                        document.querySelector('.listing-header-div-animation span').style.display = 'inline-block';
                    }
                    if (e.deltaY > 0) {
                        document.querySelector('.listing-header-div-animation').style.height = '0';
                        document.querySelector('.listing-header-div-animation span').style.display = 'none';
                    }
                } else {
                    document.querySelector('.listing-header-div-animation').style.height = '1.5rem';
                    document.querySelector('.listing-header-div-animation span').style.display = 'inline-block';
                }
            }
        });

        // Facebook Login initialization
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '1633741140006959',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v2.11'
            });
        };


        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    googleLogin = (responseData) => {
        if (this.getQueryVariable('refCode')) {
            responseData.referredBy = this.getQueryVariable('refCode');
            responseData.isReferred = true;
        }
        this.props.dispatch(asyncGoogleSignin(responseData, responseData.googleId))
            .then((data) => {
                if (data.success) {
                    const cookies = new Cookies();
                    cookies.set('token', data.accessToken, { path: '/', maxAge: 2592000 });
                    cookies.set('mode', 'google');
                }
                document.body.style.overflow = 'auto';
            })
            .catch(error => {
                document.body.style.overflow = 'auto';
            });
    };

    signUp = (signUpData) => {
        if (this.getQueryVariable('refCode')) {
            signUpData.referredBy = this.getQueryVariable('refCode');
            signUpData.isReferred = true;
        }
        this.props.dispatch(asyncSignUp(signUpData))
            .then((data) => {
                if (data.success) {
                    const cookies = new Cookies();
                    cookies.set('token', data.data.accessToken, { path: '/', maxAge: 2592000 });
                    cookies.set('mode', 'email');
                    this.closeModal();
                    document.body.style.overflow = 'auto';
                }
            })
            .catch(error => {
                alert(error.data.message);
            });
    };

    logIn = (loginData) => {
        this.props.dispatch(asyncLogin(loginData))
            .then((data) => {
                if (data.success) {
                    const cookies = new Cookies();
                    cookies.set('token', data.data.accessToken, { path: '/', maxAge: 2592000 });
                    cookies.set('mode', 'email');
                    this.closeModal();
                    document.body.style.overflow = 'auto';
                }
            })
            .catch(error => {
                alert(error.data.message);
            });
    };

    getQueryVariable = (variable) => {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    };

    facebookLogin = (responseData) => {
        if (responseData) {
            if (this.getQueryVariable('refCode')) {
                responseData.referredBy = this.getQueryVariable('refCode');
                responseData.isReferred = true;
            }
            this.props.dispatch(asyncFacebookLogin(responseData))
                .then(data => {
                    if (data.success) {
                        const cookies = new Cookies();
                        cookies.set('token', data.accessToken, { path: '/', maxAge: 2592000 });
                        cookies.set('mode', 'facebook');
                    }
                    document.body.style.overflow = 'auto';
                })
                .catch(error => {
                    document.body.style.overflow = 'auto';
                });
        }
    };

    sideBarTab = (tab) => {
        if (this.props.meReducer.isLoggedIn) {
            this.setState({
                sideBarOpen: false
            });
            this.props.history.push({
                pathname: `/user/${this.props.meReducer.userData.user.username}/${tab}`
            });
            document.body.style.overflow = 'auto';
        } else {
            this.setState({
                sideBarOpen: false
            });
            this.props.dispatch(toggleLoginModal());
            document.body.style.overflow = 'auto';
        }
    };


    sideBarContent = () => {
        return (
            <div className="side-bar-main-container">
                {!this.props.meReducer.isLoggedIn &&
                    <div className="side-bar-user-container" onClick={this.openModal}>
                        <FaUser className="side-bar-user-icon" />
                        <span className="side-bar-user-name-label">Login</span>
                    </div>
                }
                {this.props.meReducer.isLoggedIn &&
                    <div className="side-bar-user-container">
                        <img onClick={() => {
                            this.props.history.push({
                                pathname: `/user/${this.props.meReducer.userData.user.username}/reviews`
                            });
                            this.setState({
                                sideBarOpen: false
                            });
                            document.body.style.overflow = 'auto';
                        }} alt="" src={this.props.meReducer.userData.user.profilePicture}
                            className="side-bar-user-icon-profile-picture" />
                        <span onClick={() => {
                            this.props.history.push({
                                pathname: `/user/${this.props.meReducer.userData.user.username}/reviews`
                            });
                            this.setState({
                                sideBarOpen: false
                            });
                            document.body.style.overflow = 'auto';
                        }}
                            className="side-bar-user-name-label">{this.props.meReducer.userData.user ? this.props.meReducer.userData.user.displayName.split(' ')[0] : ''}</span>
                    </div>
                }
                <div className="side-bar-content">
                    <div className="side-bar-tab-selector" onClick={() => {
                        this.props.history.push({
                            pathname: '/'
                        });
                        this.setState({
                            sideBarOpen: false
                        });
                        document.body.style.overflow = 'auto';
                    }}>
                        <div className="side-bar-tab-label">
                            <span>Home</span>
                        </div>
                    </div>
                    <div className="side-bar-tab-selector" onClick={() => {
                        this.setState({ showCollection: !this.state.showCollection })
                    }}>
                        <div className="side-bar-tab-label">
                            <span>Collections</span>
                        </div>
                        <FaAngleDown className="side-bar-tab-down-icon" />
                    </div>
                    {this.state.showCollection &&
                        <div>
                            {_.map(collectionsObject, (value) => {
                                return (
                                    <div key={value.key} onClick={() => {
                                        this.setState({
                                            sideBarOpen: false
                                        });
                                        this.props.history.push({
                                            pathname: `/collections/${value.key}`
                                        });
                                        document.body.style.overflow = 'auto';
                                    }} className="side-bar-tab-selector">
                                        <img className="side-bar-inner-tab-down-icon" src={value.icon} alt="" />
                                        <div className="side-bar-inner-tab-label">
                                            <span>{value.name}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                    <div className="side-bar-tab-selector" onClick={() => {
                        this.setState({ showCategories: !this.state.showCategories })
                    }}>
                        <div className="side-bar-tab-label">
                            <span>Categories</span>
                        </div>
                        <FaAngleDown className="side-bar-tab-down-icon" />
                    </div>
                    {this.state.showCategories &&
                        <div>
                            {_.map(categoriesHome, (value) => {
                                return (
                                    <div key={value.key} onClick={() => {
                                        this.setState({
                                            sideBarOpen: false
                                        });
                                        this.props.history.push({
                                            pathname: `/category/${value.key}`
                                        });
                                        document.body.style.overflow = 'auto';
                                    }} className="side-bar-tab-selector">
                                        <img className="side-bar-inner-tab-down-icon" src={value.icon} alt="" />
                                        <div className="side-bar-inner-tab-label">
                                            <span>{value.name}</span>
                                        </div>
                                    </div>
                                )
                            })}
                            <div onClick={() => {
                                this.setState({
                                    sideBarOpen: false
                                });
                                this.props.history.push({
                                    pathname: `/category`
                                });
                                document.body.style.overflow = 'auto';
                            }} className="side-bar-tab-selector">
                                <div className="side-bar-inner-tab-label">
                                    <span style={{ color: '#ff9f00' }}>VIEW ALL</span>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="side-bar-tab-selector" onClick={() => {
                        this.setState({ showUserSection: !this.state.showUserSection })
                    }}>
                        <div className="side-bar-tab-label">
                            <span>My Account</span>
                        </div>
                        <FaAngleDown className="side-bar-tab-down-icon" />
                    </div>
                    {this.state.showUserSection &&
                        <div>
                            {/*<div className="side-bar-tab-selector">*/}
                            {/*<FaCartPlus className="side-bar-inner-tab-down-icon"/>*/}
                            {/*<div className="side-bar-inner-tab-label">*/}
                            {/*<span>Wishlist</span>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="side-bar-tab-selector">*/}
                            {/*<FaBookmarkO className="side-bar-inner-tab-down-icon"/>*/}
                            {/*<div className="side-bar-inner-tab-label">*/}
                            {/*<span onClick={() => this.sideBarTab('bookmarks')}>Bookmarks</span>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                            <div className="side-bar-tab-selector">
                                <FaUser className="side-bar-inner-tab-down-icon" />
                                <div className="side-bar-inner-tab-label">
                                    <span onClick={() => this.sideBarTab('reviews')}>Your Profile</span>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="side-bar-view-more">
                    <span className="side-bar-view-more-button">View More</span>
                </div>
                <div className="side-bar-content">
                    <div className="side-bar-tab-selector">
                        <div className="side-bar-tab-label" onClick={() => {
                            this.props.history.push({
                                pathname: '/contact-us'
                            });
                            this.setState({
                                sideBarOpen: false
                            });
                            document.body.style.overflow = 'auto';
                        }}>
                            <span>Contact Us</span>
                        </div>
                    </div>
                    <div className="side-bar-tab-selector">
                        <div className="side-bar-tab-label" onClick={() => {
                            this.props.history.push({
                                pathname: '/profile/trustvardi'
                            });
                            this.setState({
                                sideBarOpen: false
                            });
                            document.body.style.overflow = 'auto';
                        }}>
                            <span>About Us</span>
                        </div>
                    </div>
                    {!this.props.meReducer.isLoggedIn &&
                        <div className="side-bar-login-container">
                            <button className="side-bar-login-button" onClick={this.openModal}>Login/signup</button>
                        </div>
                    }
                </div>
            </div>
        );
    };

    /**
     * Function that makes sidebar open and close with touch on mobile.
     * @author Rishabh Rawat
     */
    onSetSidebarOpen = (open) => {
        this.setState({ sideBarOpen: open });
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    openModal = () => {
        if (!this.props.meReducer.isLoggedIn) {
            this.props.dispatch(toggleLoginModal());
            this.setState({
                sideBarOpen: false
            });
        } else {
            this.props.history.push({
                pathname: `/user/${this.props.meReducer.userData.user.username}/reviews`
            });
        }
    };

    toHome = () => {
        this.props.history.push({
            pathname: '/'
        });
        window.scrollTo(0, 0);
    };


    closeModal = () => {
        this.props.dispatch(toggleLoginModal());
        document.body.style.overflow = 'auto';
        const tempCookie = new Cookies();
        tempCookie.set('ldbc', Date.now());
    };

    closeShareModal = () => {
        this.props.dispatch(asyncShareModal())
    };

    closePictureModal = () => {
        this.props.dispatch(asyncTogglePicture(''));
    };

    colorHeader = () => {
        if (document.querySelector('.header-container')) {
            if (this.props.match.url === '/') {
                document.querySelector('.header-container').style.backgroundColor = 'rgba(89, 74, 165, 1)';
                document.querySelector('.header-container').style.animationDuration = '.3s'
                document.querySelector('.header-container').style.animationDelay = '0s'
            } else {
                document.querySelector('.header-container').style.backgroundColor = 'rgba(89, 74, 165, 1)';
                document.querySelector('.header-container').style.animationDuration = '.3s'
                document.querySelector('.header-container').style.animationDelay = '0s'
            }
        }
    };

    searchVendorHome = (value) => {
        clearTimeout(timeOut);

        if (value && value.length > 0) {
            timeOut = setTimeout(() => {
                const region = (this.props.location.pathname.includes('/profile') && this.props.location.pathname.split('/profile').length > 0) ? this.props.location.pathname.split('/profile')[0].replace('/', '') : null;
                this.props.dispatch(searchVendor(value, region))
                    .then((data) => {
                        if (this.props.homeReducer.searchResults.length > 0) {
                            this.setState({
                                showSearchResult: true
                            });
                        } else {
                            this.setState({
                                showSearchResult: false
                            });
                        }
                    });
            }, 500);
        } else {
            this.setState({
                showSearchResult: false
            });
        }
    };

    gotoHomescreen = () => {
        // let backpath = this.props.history.location.pathname.split('/');
        // this.props.history.push({
        //     pathname: `/${backpath[1]}` });
        if (this.props.history.length === 2) {

            this.props.history.push({
                pathname: `/`,
            });
        }
        else {
            this.props.history.goBack();
        }
    };

    navigateTab = (tab) => {
        let route = '';
        if (tab === 'home') {
            route = '/';
        } else if (this.props.meReducer.isLoggedIn) {
            const username = this.props.meReducer.userData.user.username;
            route = `/user/${username}/${tab}`;
        } else {
            this.props.dispatch(toggleLoginModal());
            return;
        }
        this.props.history.push({
            pathname: route
        });
    };

    renderBookmarkButton = () => {
        if (this.props.meReducer.isLoggedIn && this.props.match.url.includes(`/user/${this.props.meReducer.userData.user.username}/bookmark`)) {
            return (
                <MdBookmark className="mobile-navigation-icon" />
            );
        } else if (this.props.meReducer.isLoggedIn && !this.props.match.url.includes(`/user/${this.props.meReducer.userData.user.username}/bookmark`)) {
            return (
                <MdBookmarkOutline onClick={() => this.navigateTab('bookmarks')} className="mobile-navigation-icon" />
            );
        } else if (!this.props.meReducer.isLoggedIn) {
            return (
                <MdBookmarkOutline onClick={() => this.navigateTab('bookmarks')} className="mobile-navigation-icon" />
            );
        }
    };

    renderFavoritesButton = () => {
        if (this.props.meReducer.isLoggedIn && this.props.match.url.includes(`/user/${this.props.meReducer.userData.user.username}/favorites`)) {
            return (
                <MdFavorite className="mobile-navigation-icon" />
            );
        } else if (this.props.meReducer.isLoggedIn && !this.props.match.url.includes(`/user/${this.props.meReducer.userData.user.username}/favorites`)) {
            return (
                <MdFavoriteOutline onClick={() => this.navigateTab('favorites')} className="mobile-navigation-icon" />
            );
        } else if (!this.props.meReducer.isLoggedIn) {
            return (
                <MdFavoriteOutline onClick={() => this.navigateTab('favorites')} className="mobile-navigation-icon" />
            );
        }
    };

    closeSearchMobileModal = () => {
        this.props.dispatch(toggleMobileSearchModal());
        document.body.style.overflow = 'auto';
    };

    render() {
        this.colorHeader();
        if (window.innerWidth > 768) {
            // const urlArray = this.props.match.url.split('/');
            // if (urlArray && urlArray.length === 2 && _.find(CITIES_SEARCH, { key: urlArray[1] })) {
            if (this.props.match.url === '/') {
                return (
                    <div style={{ height: 'auto' }} className="header-container">
                        <div className="listing-header-div-animation" style={{ height: '1.5rem', backgroundColor: '#494086', borderBottom: '1px solid #494086', display: 'flex', flexWrap: 'nowrap', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden' }}>
                            {this.state.pmLevel > 0 &&
                                <span style={{
                                    color: checkPMLevel(this.state.pmLevel),
                                    fontSize: '14px',
                                    marginRight: '20px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>PM Level {(this.state.city && this.state.city.length > 0) ? `of ${this.state.city}` : ''}: {this.state.pmLevel}
                                    <MdRefresh onClick={this.getPmLevelLocation} id="getPmLevelLocation" style={{ color: 'white', marginLeft: '5px', cursor: 'pointer' }} />
                                </span>
                            }
                            {this.props.meReducer.isLoggedIn &&
                                <span style={{ fontSize: '14px', marginRight: '120px', cursor: 'pointer' }}>
                                    <Link to={{ pathname: '/addprofile' }} rel="nofollow" style={{ textDecoration: 'none', color: 'white' }} className="Get-Listed-on-TrustVardi">
                                        Get Listed on TrustVardi</Link></span>
                            }
                            {!this.props.meReducer.isLoggedIn &&
                                <span className="Get-Listed-on-TrustVardi" onClick={() => {
                                    this.props.dispatch(toggleLoginModal())
                                }}>Get Listed on TrustVardi</span>
                            }
                        </div>
                        <Modal
                            isOpen={this.props.userReducer.showLoginModal}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStyles}
                            contentLabel="Example Modal"
                        >
                            <Login logIn={this.logIn} signUp={this.signUp} facebookLogin={this.facebookLogin} googleLogin={this.googleLogin}
                                onClose={this.closeModal} />
                        </Modal>
                        <Modal
                            isOpen={this.props.meReducer.toggleShareModal}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeShareModal}
                            style={customShareStyles}
                            contentLabel="Example Modal"
                        >
                            <ShareModal onClose={this.closeShareModal} />
                        </Modal>
                        <Modal
                            isOpen={this.props.meReducer.togglePictureModal}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closePictureModal}
                            style={customShareStyles}
                            contentLabel="Example Modal">

                            <div className="image-modal-container">
                                <MdClose onClick={this.closePictureModal} className="image-modal-close-icon" />
                                <img className="image-modal-image" src={this.props.meReducer.imageUrl} alt="" />
                            </div>
                        </Modal>
                        <div style={{ height: '3.5rem' }} className="header-new-main-container">
                            <div style={{ width: '46%', display: 'flex', flexWrap: 'nowrap' }} className="header-new-main-logo-container">
                                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="header-logo-text" onClick={this.toHome}>
                                    <img onClick={this.toHome} className="logo-header"
                                        src="https://res.cloudinary.com/trustvardi/image/upload/v1527852932/icons/logo_new_-13.svg"
                                        alt="" />
                                    <span style={{ verticalAlign: 'sub' }}>TRUSTVARDI</span>
                                </span>
                                {this.state.showSearchHeader &&
                                    <div className="header-container-link-container-non-home" style={{ display: 'flex', alignItems: 'center', width: '55%', marginLeft: '7%' }}>
                                        <div className="input-animation-search animated slideInUp faster" style={{ height: '35px', display: 'flex', flexWrap: 'nowrap', width: '100%' }}>
                                            <div style={{ width: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderTopLeftRadius: '3px', borderBottomLeftRadius: '3px' }}>
                                                <span style={{ width: '20px', height: '20px' }}>{newSearchIcon()}</span>
                                            </div>
                                            <input style={{ boxSizing: 'border-box', width: '100%', borderTopLeftRadius: '0', borderBottomLeftRadius: '0', padding: '0 5px' }} onKeyUp={(event) => this.searchVendorHome(event.target.value)}
                                                type="text"
                                                placeholder="What are you looking for?" className="header-non-home-search" />
                                        </div>
                                        {this.state.showSearchResult &&
                                            <div className="input-search-result-container-header" style={{ position: 'absolute', width: '100%' }}>
                                                <div>
                                                    {this.props.homeReducer.searchResults.map((value, i) => {
                                                        return (
                                                            <div key={i} onClick={() => {
                                                                this.setState({
                                                                    showSearchResult: false
                                                                });
                                                                this.props.history.push({
                                                                    pathname: `/profile/${value._source.username}`
                                                                });
                                                            }} className="search-result-item">
                                                                <img className="search-result-image"
                                                                    src={imageTransformation(value._source.profilePicture, 80)} alt="" />
                                                                <span
                                                                    className="search-result-name-non-home">{value._source.displayName}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>

                            {/*scroll menu*/}

                            <div style={{ height: '3.5rem', width: '54%', display: 'flex', flexWrap: 'nowrap', left: '0', position: 'relative' }} className="header-new-main-rest-container">
                                {/* <div style={{ position: 'absolute', left: '22%', height: '100%' }}>
                                    
                                </div> */}
                                <div id="side-header-1" style={{ marginRight: '1rem' }} className="header-home-rest-flex-container">
                                    <div className="header-cat-col-main">
                                        <div style={{ left: '50%' }} className="header-cat-col-main-con">
                                            <div className="header-new-tab" id="categories">
                                                <span id="category-click" >Categories</span>
                                                <div className="desktop-dropdown">
                                                    {_.map(categoriesHome, (value) => {
                                                        return (
                                                            <div key={value.key} onClick={() => {
                                                                this.props.history.push({
                                                                    pathname: `/category/${value.key}`
                                                                })
                                                            }} className="drop-down-item">
                                                                <img className="drop-down-icon" src={value.icon} alt="" />
                                                                <span className="drop-down-name">{value.name}</span>
                                                            </div>
                                                        )
                                                    })}
                                                    <div className="drop-down-item">
                                                        <span className="drop-down-view-all" onClick={() => {
                                                            this.props.history.push({
                                                                pathname: '/category'
                                                            });
                                                        }}>View All Categories</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="header-cat-col-main">
                                        <div style={{ left: '50%' }} className="header-cat-col-main-con">
                                            <div className="header-new-tab">
                                                <span id="collection-click" onClick={() => {
                                                    document.querySelector('.desktop-dropdown-collection').style.display = 'block';
                                                }}>Collections</span>
                                                <div className="desktop-dropdown-collection">
                                                    {_.map(collectionsObject, (value) => {
                                                        return (
                                                            <div key={value.key} onClick={() => {
                                                                this.props.history.push({
                                                                    pathname: `/collections/${value.key}`
                                                                })
                                                            }} className="drop-down-item">
                                                                <img className="drop-down-icon" src={value.icon} alt="" />
                                                                <span className="drop-down-name">{value.name}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ height: 'auto', position: 'relative', marginRight: '12px' }} className="header-new-tab-login logged-in-user-brands-list">
                                        {!this.props.meReducer.isLoggedIn &&
                                            <span onClick={this.openModal}
                                                className="header-new-tab-login"
                                                style={{ border: '1px solid white', borderRadius: '3px', padding: '5px 10px', whiteSpace: 'nowrap' }}>Login | Signup</span>
                                        }
                                        {this.props.meReducer.isLoggedIn &&
                                            <span style={{ verticalAlign: 'sub' }} onClick={this.openModal}>
                                                <img style={{ width: '20px', height: '20px' }}
                                                    className="social-icon-header"
                                                    src={this.props.meReducer.userData.user.profilePicture}
                                                    alt="" />
                                                <span>{this.props.meReducer.userData.user ? this.props.meReducer.userData.user.displayName.split(' ')[0] : ''}</span>
                                                <FaCaretDown style={{ height: '15px', width: '15px', fill: 'white' }} />
                                            </span>
                                        }
                                        {this.props.meReducer.isLoggedIn &&
                                            <div className="desktop-dropdown-vendors">
                                                <div className="drop-down-label" style={{ textAlign: 'center', justifyContent: 'center', display: 'flex', cursor: 'default' }}>
                                                    <span style={{ backgroundColor: 'white', fontWeight: 600, color: '#2c3249', cursor: 'default', display: 'flex', alignItems: 'center' }}>Your Profiles</span>
                                                </div>
                                                {this.props.meReducer.adminVendor.length > 0 && _.map(this.props.meReducer.adminVendor, (value) => {
                                                    return (
                                                        <div key={value.username} onClick={() => {
                                                            this.props.history.push({
                                                                pathname: `/admin/profile/${value.username}`
                                                            })
                                                        }} className="drop-down-item">
                                                            <img className="drop-down-icon" src={imageTransformation(value.profilePicture, 20)} alt="" />
                                                            <span className="drop-down-name">{value.displayName}</span>
                                                        </div>
                                                    )
                                                })}
                                                {this.props.meReducer.adminVendor.length === 0 &&
                                                    <div style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Link to={{ pathname: '/addprofile' }} rel="nofollow"><button className="list-brand-button">List your brand</button></Link>
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                    <div style={{ height: 'auto' }} className="header-new-tab">
                                        <span style={{ verticalAlign: 'middle' }}>|</span>
                                    </div>
                                    <div id="facebook" style={{ height: 'auto' }} className="header-new-tab">
                                        <FaFacebook alt="" onClick={() => {
                                            window.open('https://www.facebook.com/trustvardi/', '_blank');
                                        }}
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1527848432/icons/app_icons_-10.svg"
                                        />
                                    </div>
                                    <div style={{ height: 'auto' }} className="header-new-tab">
                                        <FaInstagram alt="" onClick={() => {
                                            window.open('https://www.instagram.com/trustvardi/', '_blank');
                                        }}
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1527848432/icons/app_icons_-09.svg"
                                        />
                                    </div>
                                    <div style={{ height: 'auto' }} className="header-new-tab">
                                        <FaTwitter onClick={() => {
                                            window.open('https://twitter.com/trustvardi', '_blank');
                                        }}
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1527848433/icons/app_icons_-11.svg"
                                            alt="" />
                                    </div>
                                    <div style={{ height: 'auto' }} className="header-new-tab">
                                        <FaLinkedin onClick={() => {
                                            window.open('https://www.linkedin.com/company/trustvardi/', '_blank');
                                        }}
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1527848432/icons/app_icons_-08.svg"
                                            alt="" />
                                    </div>
                                    <div style={{ height: 'auto' }} className="header-new-tab">
                                        <FaYoutubePlay
                                            onClick={() => {
                                                window.open('https://www.youtube.com/channel/UCE1R6EPAG6f3dhKKXS1T1_Q', '_blank');
                                            }}
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1527848431/icons/app_icons_-12.svg"
                                            alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div style={{ height: 'auto' }} id="header-height" className="header-container">
                        <div className="listing-header-div-animation" style={{ height: '1.5rem', backgroundColor: '#494086', borderBottom: '1px solid #494086', textAlign: 'right', overflow: 'hidden' }}>
                            {this.state.pmLevel > 0 &&
                                <span style={{
                                    color: checkPMLevel(this.state.pmLevel),
                                    fontSize: '14px',
                                    marginRight: '20px',
                                    display: 'inline-block',
                                    alignItems: 'center'
                                }}>PM Level {(this.state.city && this.state.city.length > 0) ? `of ${this.state.city}` : ''}: {this.state.pmLevel}
                                    {/* style={{ color: 'white', marginLeft: '5px', cursor: 'pointer' }} */}
                                    <MdRefresh onClick={this.getPmLevelLocation} id="getPmLevelLocation" style={{ color: 'white', marginLeft: '5px', cursor: 'pointer' }} />
                                </span>
                            }
                            {this.props.meReducer.isLoggedIn &&
                                <span style={{ marginRight: '120px' }} className="Get-Listed-on-TrustVardi"><Link to={{ pathname: '/addprofile' }} rel="nofollow" style={{ textDecoration: 'none', color: 'white' }}>Get Listed on TrustVardi</Link></span>
                            }
                            {!this.props.meReducer.isLoggedIn &&
                                <span className="Get-Listed-on-TrustVardi" onClick={() => {
                                    this.props.dispatch(toggleLoginModal())
                                }}>Get Listed on TrustVardi</span>
                            }
                        </div>
                        <Modal
                            isOpen={this.props.userReducer.showLoginModal}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStyles}
                            contentLabel="Login Modal"
                        >
                            <Login logIn={this.logIn} signUp={this.signUp} facebookLogin={this.facebookLogin} googleLogin={this.googleLogin}
                                onClose={this.closeModal} />
                        </Modal>
                        <Modal
                            isOpen={this.props.meReducer.toggleShareModal}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeShareModal}
                            style={customShareStyles}
                            contentLabel="Share Modal"
                        >
                            <ShareModal onClose={this.closeShareModal} />
                        </Modal>
                        <Modal
                            isOpen={this.props.meReducer.togglePictureModal}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closePictureModal}
                            style={customShareStyles}
                            contentLabel="Image Modal"
                        >
                            <div className="image-modal-container">
                                <MdClose onClick={this.closePictureModal} className="image-modal-close-icon" />
                                <img className="image-modal-image" src={this.props.meReducer.imageUrl} alt="" />
                            </div>
                        </Modal>
                        <Modal
                            isOpen={this.state.reviewModal}
                            onRequestClose={this.closeModal}
                            style={desktopReviewModalStyle}
                        >
                            <AddReview closeModal={this.closeModal} />
                        </Modal>
                        <div style={{ height: '3.5rem' }} id="headercontainer" className="header-new-main-container">
                            <div style={{ width: '46%', display: 'flex', flexWrap: 'nowrap' }} className="header-new-main-logo-container">
                                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="header-logo-text" onClick={this.toHome}>
                                    <img onClick={this.toHome} className="logo-header"
                                        src="https://res.cloudinary.com/trustvardi/image/upload/v1527852932/icons/logo_new_-13.svg"
                                        alt="" />
                                    <span style={{ verticalAlign: 'sub' }}>TRUSTVARDI</span>
                                </span>
                                <div className="header-container-link-container-non-home" style={{ display: 'flex', alignItems: 'center', width: '55%', marginLeft: '7%' }}>
                                    <div style={{ height: '35', display: 'flex', flexWrap: 'nowrap', width: '100%' }}>
                                        <div style={{ width: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderTopLeftRadius: '3px', borderBottomLeftRadius: '3px' }}>
                                            <span style={{ width: '20px', height: '20px' }}>{newSearchIcon()}</span>
                                        </div>
                                        <input style={{ boxSizing: 'border-box', width: '100%', borderTopLeftRadius: '0', borderBottomLeftRadius: '0', padding: '0 5px' }} onKeyUp={(event) => this.searchVendorHome(event.target.value)}
                                            type="text"
                                            placeholder="What are you looking for?" className="header-non-home-search" />
                                    </div>
                                    {this.state.showSearchResult &&
                                        <div className="input-search-result-container-header" style={{ position: 'absolute', width: '100%' }}>
                                            <div>
                                                {this.props.homeReducer.searchResults.map((value, i) => {
                                                    return (
                                                        <div key={i} onClick={() => {
                                                            this.setState({
                                                                showSearchResult: false
                                                            });
                                                            this.props.history.push({
                                                                pathname: `/profile/${value._source.username}`
                                                            });
                                                        }} className="search-result-item">
                                                            <img className="search-result-image"
                                                                src={imageTransformation(value._source.profilePicture, 80)} alt="" />
                                                            <span
                                                                className="search-result-name-non-home">{value._source.displayName}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>

                            {/*scroll menu*/}

                            <div style={{ height: '3.5rem', width: '54%', display: 'flex', flexWrap: 'nowrap', left: '0', position: 'relative', justifyContent: 'flex-end' }} className="header-new-main-rest-container">
                                {/* <div style={{ position: 'absolute', left: '22%', height: '100%' }}>
                                    
                                </div> */}
                                <div id="side-header-1" style={{ marginRight: '1rem' }} className="header-home-rest-flex-container">
                                    <div style={{ height: 'auto' }} className="header-new-tab logged-in-user-brands-list">
                                        {!this.props.meReducer.isLoggedIn &&
                                            <span className="header-new-tab-login" onClick={this.openModal} style={{ border: '1px solid white', borderRadius: '3px', padding: '5px 10px' }}>Login | Signup</span>
                                        }
                                        {this.props.meReducer.isLoggedIn &&
                                            <span style={{ verticalAlign: 'sub' }} onClick={this.openModal}>
                                                <img style={{ width: '20px', height: '20px' }}
                                                    className="social-icon-header"
                                                    src={this.props.meReducer.userData.user.profilePicture}
                                                    alt="" />
                                                <span>{this.props.meReducer.userData.user ? this.props.meReducer.userData.user.displayName.split(' ')[0] : ''}</span>
                                                <FaCaretDown style={{ height: '15px', width: '15px', fill: 'white' }} />
                                            </span>
                                        }
                                        {this.props.meReducer.isLoggedIn &&
                                            <div className="desktop-dropdown-vendors" style={{ top: '3rem' }}>
                                                <div className="drop-down-label" style={{ textAlign: 'center', justifyContent: 'center', display: 'flex', cursor: 'default' }}>
                                                    <span style={{ backgroundColor: 'white', fontWeight: 600, color: '#2c3249', cursor: 'default' }}>Your Profiles</span>
                                                </div>
                                                {this.props.meReducer.adminVendor.length > 0 && _.map(this.props.meReducer.adminVendor, (value) => {
                                                    return (
                                                        <div key={value.username} onClick={() => {
                                                            this.props.history.push({
                                                                pathname: `/admin/profile/${value.username}`
                                                            })
                                                        }} className="drop-down-item">
                                                            <img className="drop-down-icon" src={imageTransformation(value.profilePicture, 40)} alt="" />
                                                            <span className="drop-down-name">{value.displayName}</span>
                                                        </div>
                                                    )
                                                })}
                                                {this.props.meReducer.adminVendor.length === 0 &&
                                                    <div style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Link to={{ pathname: '/addprofile' }} rel="nofollow"><button className="list-brand-button">List your brand</button></Link>
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                    <div style={{ height: 'auto' }} className="header-new-tab">
                                        <span style={{ verticalAlign: 'middle' }}>|</span>
                                    </div>
                                    <div style={{ height: 'auto' }} className="header-new-tab">
                                        <FaFacebook alt="" onClick={() => {
                                            window.open('https://www.facebook.com/trustvardi/', '_blank');
                                        }}
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1527848432/icons/app_icons_-10.svg"
                                        />
                                    </div>
                                    <div style={{ height: 'auto' }} className="header-new-tab">
                                        <FaInstagram alt="" onClick={() => {
                                            window.open('https://www.instagram.com/trustvardi/', '_blank');
                                        }}
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1527848432/icons/app_icons_-09.svg"
                                        />
                                    </div>
                                    <div style={{ height: 'auto' }} className="header-new-tab">
                                        <FaTwitter onClick={() => {
                                            window.open('https://twitter.com/trustvardi', '_blank');
                                        }}
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1527848433/icons/app_icons_-11.svg"
                                            alt="" />
                                    </div>
                                    <div style={{ height: 'auto' }} className="header-new-tab">
                                        <FaLinkedin onClick={() => {
                                            window.open('https://www.linkedin.com/company/trustvardi/', '_blank');
                                        }}
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1527848432/icons/app_icons_-08.svg"
                                            alt="" />
                                    </div>
                                    <div style={{ height: 'auto' }} className="header-new-tab">
                                        <FaYoutubePlay
                                            onClick={() => {
                                                window.open('https://www.youtube.com/channel/UCE1R6EPAG6f3dhKKXS1T1_Q', '_blank');
                                            }}
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1527848431/icons/app_icons_-12.svg"
                                            alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        } else if (window.innerWidth <= 768) {
            return (
                <div>
                    <div className="header-container">
                        <Modal
                            isOpen={this.props.userReducer.showLoginModal}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStylesMobile}
                            contentLabel="Example Modal"
                        >
                            <Login logIn={this.logIn} signUp={this.signUp} facebookLogin={this.facebookLogin} googleLogin={this.googleLogin}
                                onClose={this.closeModal} />
                        </Modal>
                        <Modal
                            isOpen={this.props.meReducer.toggleShareModal}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeShareModal}
                            style={customShareStyles}
                            contentLabel="Example Modal"
                        >
                            <ShareModal onClose={this.closeShareModal} />
                        </Modal>
                        <Modal
                            isOpen={this.props.meReducer.togglePictureModal}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closePictureModal}
                            style={customShareStyles}
                            contentLabel="Example Modal"
                        >
                            <div className="image-modal-container">
                                <MdClose onClick={this.closePictureModal} className="image-modal-close-icon" />
                                <img className="image-modal-image" src={this.props.meReducer.imageUrl} alt="" />
                            </div>
                        </Modal>
                        <Modal
                            isOpen={this.state.reviewModal}
                            onRequestClose={this.closeModal}
                            style={mobileReviewModalStyle}
                        >
                            <AddReview closeModal={this.closeModal} />
                        </Modal>
                        <Modal
                            isOpen={this.props.homeReducer.showMobileSearchModal}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeSearchMobileModal}
                            style={mobileSearchModalStyle}
                        >
                            <MobileSearchModal closeSearchMobileModal={this.closeSearchMobileModal}
                                history={this.props.history} />
                        </Modal>
                        <Sidebar sidebar={this.sideBarContent()}
                            open={this.state.sideBarOpen}
                            onSetOpen={this.onSetSidebarOpen}
                            styles={sidebarStyleMobile}
                            pullRight={true}
                            touchHandleWidth={20}
                            dragToggleDistance={60}>
                            <div></div>
                        </Sidebar>
                        {/*<img onClick={this.toHome} className="logo-header-mobile" src={logo} alt=""/>*/}
                        <div className="header-mobile-container-flex">
                            <div style={{ width: '20px', marginLeft: '10px' }}>
                                {this.props.match.url !== '/' &&
                                    <FaAngleLeft className="back-button-mobile" onClick={this.gotoHomescreen} />
                                }
                            </div>
                            <span className="header-mobile-flex-logo-container" onClick={this.toHome}>
                                <img onClick={this.toHome} className="logo-header"
                                    src="https://res.cloudinary.com/trustvardi/image/upload/v1527852932/icons/logo_new_-13.svg"
                                    alt="" />
                                <span className="header-logo-text" >TRUSTVARDI</span>
                            </span>
                            <div className="header-mobile-flex-icon-container">
                                <FaSearch style={{ opacity: (this.props.match.url === '/') ? 0 : 1 }} id="search-icon-mobile" onClick={() => this.props.dispatch(toggleMobileSearchModal())} className="menu-mobile-icon" />
                                <FaBars className="menu-mobile-icon" onClick={() => this.onSetSidebarOpen(true)} />
                            </div>
                        </div>
                    </div>
                    {this.props.match.url === '/' &&
                        <div className="mobile-navigation-tab-container">
                            <div className="mobile-navigation-tab-div">
                                {this.props.match.url === '/' &&
                                    <MdHome className="mobile-navigation-icon" />
                                }
                                {this.props.match.url !== '/' &&
                                    <MdHome onClick={() => this.navigateTab('home')} className="mobile-navigation-icon-home" />
                                }
                            </div>
                            <div className="mobile-navigation-tab-div">
                                {this.renderFavoritesButton()}
                            </div>
                            <div className="mobile-navigation-tab-div">
                                {this.renderBookmarkButton()}
                            </div>
                            <div className="mobile-navigation-tab-div">
                                {!this.props.meReducer.isLoggedIn &&
                                    <MdPersonOutline onClick={() => this.navigateTab('reviews')}
                                        className="mobile-navigation-icon" />
                                }
                                {this.props.meReducer.isLoggedIn &&
                                    <img alt="" onClick={() => this.navigateTab('reviews')}
                                        src={this.props.meReducer.userData.user.profilePicture}
                                        style={{ border: '1px solid white' }} className="mobile-navigation-icon" />
                                }
                            </div>
                        </div>
                    }
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

export default connect((state) => state, mapDispatchToProps)(Header);