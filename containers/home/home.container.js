import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import {
    Link
} from 'react-router-dom';
import Loadable from 'react-loadable';
import {
    buggy,
    shoppingBag,
    firstAidKit,
    armedChair,
    broom,
    viewMore,
    // ballIcon
    // addPenMobileIcon
} from '../../assets/icons/icons';
import '../../assets/css/home.css';
import '../../assets/css/placeholder.min.css';
// import {
//      addPenIcon
// } from '../../assets/icons/icons';
import loader from '../../assets/icons/loader.svg';
import {
    fetchHomeData,
    searchVendor,
    asyncLoadBanner,
    toggleLoginModal,
    toggleMobileSearchModal
} from '../../action/index';
import {
    Helmet
} from 'react-helmet';
import { ViewPager, Frame, Track, View } from 'react-view-pager';
import MdSearch from 'react-icons/lib/md/search';
import {
    MdRefresh
} from 'react-icons/lib/md';
import { suggestedSearch, trendingSearchModal, categories } from "../../constant/static";
import TrendingCard from '../../component/trending.card';
import ReactAnalytics from "../../util/ga";
import ServiceCard from '../../component/service-card';
import { convertDate, getCallApi, imageTransformation, postCallApi, showLoader } from '../../util/util';
import { SEND_APP_MAIL_LINK } from '../../constant/api';

// const TrendingCard = Loadable({
//     loader: () => import('../../component/trending.card'),
//     loading: () => <div className="vendor-loader-container-desktop">
//         <img alt="" className="vendor-loader-desktop" src={loader}/>
//     </div>,
// });


const ReviewCard = Loadable({
    loader: () => import('../../component/review.card'),
    loading: () => <div className="vendor-loader-container-desktop">
        <img alt="" className="vendor-loader-desktop" src={loader} />
    </div>,
});

const ExperienceCard = Loadable({
    loader: () => import('../../component/experience.card'),
    loading: () => <div className="vendor-loader-container-desktop">
        <img alt="" className="vendor-loader-desktop" src={loader} />
    </div>,
});

const ProductCard = Loadable({
    loader: () => import('../../component/product.card'),
    loading: () => <div className="vendor-loader-container-desktop">
        <img alt="" className="vendor-loader-desktop" src={loader} />
    </div>,
});

const LocationInput = Loadable({
    loader: () => import('../../component/location-input'),
    loading: () => <div className="vendor-loader-container-desktop">
        <img alt="" className="vendor-loader-desktop" src={loader} />
    </div>,
});


let timeOut = null;

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

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showSearchResult: false,
            showQuickSearch: false,
            showMobileSearch: false,
            showNoResult: false,
            pmLevel: 0,
            city: ''
        };
    }

    readingTime = (content) => {
        const tag = document.createElement('div');
        tag.innerHTML = content;
        const txt = tag.innerText;
        const wordCount = txt.replace(/[^\w ]/g, "").split(/\s+/).length;
        const readingTimeInMinutes = Math.floor(wordCount / 228) + 1;
        const readingTimeAsString = readingTimeInMinutes + " min";
        return readingTimeAsString;
    }


    componentWillMount() {
        const tempCookie = new Cookies();
        // if (this.props.match.path === '/') {
        //     const city = tempCookie.get('city') || 'delhincr';
        //     this.props.history.push({
        //         pathname: `/${city}`
        //     });
        // }

        let type = 'desktop';
        if (window.innerWidth < 768) {
            type = 'mobile';
            this.getPmLevelLocation();
        }
        this.props.dispatch(fetchHomeData(type, tempCookie.get('token')));
        setTimeout(() => {
            const pageUrl = this.props.match.url;
            ReactAnalytics.pageView(pageUrl);
        }, 500);
        this.props.dispatch(asyncLoadBanner());
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
        if (!_.isEmpty(nextProps.meReducer.userData)) {
            if (this.props.meReducer.userData !== nextProps.meReducer.userData) {
                let type = 'desktop';
                if (window.innerWidth < 768) {
                    type = 'mobile';
                }
                nextProps.dispatch(fetchHomeData(type, nextProps.meReducer.userData.accessToken));
            }
        }
        if (nextProps.match.url !== this.props.match.url) {
            const pageUrl = nextProps.match.url;
            ReactAnalytics.pageView(pageUrl);
        }
    }

    componentDidMount() {
        // ReactPixel.track('ViewContent', {
        //     content_name: 'TrustVardi | Tried by Us, Trusted by You!',
        // });
        window.addEventListener('click', (event) => {
            if (event.target.className !== 'input-search-main' && event.target.id !== 'search-button-desktop-id') {
                this.setState({
                    showSearchResult: false,
                    showQuickSearch: false
                });
            }
        });
    }


    mapTrendingCard = (card, i) => {
        return (
            <TrendingCard history={this.props.history} match={this.props.match} index={i} key={i} card={card} />
        )
    };


    mapReviews = (card, i) => {
        return (
            <ReviewCard history={this.props.history} index={i} key={i} card={card} />
        );
    };

    mapExperience = (card, i) => {
        return (
            <ExperienceCard key={i} history={this.props.history} match={this.props.match} card={card} />
        );
    };

    mapProductCard = (card, i) => {
        return (
            <ProductCard key={i} history={this.props.history} match={this.props.match} card={card} />
        )
    }


    searchVendorHome = (value) => {
        clearTimeout(timeOut);

        if (value && value.length > 0) {
            timeOut = setTimeout(() => {
                const city = null;
                this.props.dispatch(searchVendor(value, city))
                    .then((data) => {
                        if (this.props.homeReducer.searchResults.length > 0) {
                            this.setState({
                                showSearchResult: true,
                                showQuickSearch: false,
                                showNoResult: false
                            });
                        } else {
                            this.setState({
                                showSearchResult: false,
                                showQuickSearch: false,
                                showNoResult: true
                            });
                        }
                    });
            }, 500);
        } else {
            this.setState({
                showSearchResult: false,
                showQuickSearch: true,
                showNoResult: false
            });
        }
    };

    toShowAllPage = (type) => {
        this.props.history.push({
            pathname: `/${type}`
        });
    };

    focusInput = (event) => {
        if (event.target.value.length === 0) {
            this.setState({
                showQuickSearch: true
            });
        } else {
            this.setState({
                showQuickSearch: false
            });
        }
    };

    goToQuickSearch = (type, key) => {
        this.props.history.push({
            pathname: `/${type}/${key}`
        });
    };

    closeSearchMobileModal = () => {
        this.setState({
            showMobileSearch: false
        });
        document.body.style.overflow = 'auto';
    };

    emailAppLink = () => {
        const email = document.getElementById('email-app') ? document.getElementById('email-app').value : '';
        if (email && email.length > 0) {
            showLoader(true);
            postCallApi(SEND_APP_MAIL_LINK, {
                email
            })
                .then((data) => {
                    showLoader(false);
                    if (data.success) {
                        alert('Email sent');
                    } else {
                        alert('Something went wrong, try again later');
                    }
                })
                .catch((error) => {
                    showLoader(false);
                    alert('Something went wrong, try again later');
                });
        } else {
            alert('Insert valid e-mail');
        }
    }

    renderMetaTags = () => {
        return (
            <Helmet>
                <title>TrustVardi | Tried by Us, Trusted by You!</title>
                <meta name="fragment" content="!" />
                <link rel="canonical" href="https://www.trustvardi.com" />
                <link rel="alternate" hreflang="en" href={`https://www.trustvardi.com/`} />
                <link rel="alternate" hreflang="" href={`https://www.trustvardi.com/`} />
                <meta name="description" content='TrustVardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories.' />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content="Find out of the box brands,Online Shopping in India,online Shopping store,Online Shopping Site,Buy Online,Shop Online,Online Shopping,TrustVardi,Hire Services in India" />
                <meta name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name='HandheldFriendly' content='True' />
                <meta property="og:title" content="Trustvardi" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={`https://www.trustvardi.com/`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="trustvardi" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@trustvardi" />
                <meta name="twitter:creator" content="trustvardi.com" />
                <meta name="twitter:title" content="TrustVardi" />
                <script type="application/ld+json">{
                    `
                    {
                        "@context": "http://schema.org",
                        "@type": "Organization",
                        "url": "https://www.trustvardi.com/",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://res.cloudinary.com/trustvardi/image/upload/v1527852932/icons/logo_new_-13.svg"
                            "width": 200,
                            "height": 200
                            },
                        "sameAs": [
                            "https://www.facebook.com/trustvardi", "https://twitter.com/trustvardi", "https://www.linkedin.com/company/trustvardi"
                        ]
                    }
                    `
                }</script>
            </Helmet>
        );
    };
    render() {
        if (window.innerWidth > 768) {
            return (
                <div className="homepage-container-main">
                    <div style={{ overflow: 'auto' }}>
                        {this.renderMetaTags()}
                        <div className="search-section-home">
                            <section className="search-container">
                                <div className="login-btn-container">
                                </div>
                                <div className="search-label">
                                    <div className="search-label-1"><h2>Find #OTB <br /> Brands, Products &amp; Services </h2></div>
                                </div>
                                <form action="" style={{ textAlign: 'center', minWidth: '1000px' }}>
                                    <div className="search-logo-input-holder">
                                        <div style={{ display: 'inline-block' }}>
                                            <LocationInput city={this.props.city} history={this.props.history} />
                                        </div>
                                        <div className="input-search-container">
                                            <input onFocus={this.focusInput} placeholder="What are you looking for?"
                                                onKeyUp={(event) => this.searchVendorHome(event.target.value)}
                                                className="input-search-main" type="text" />
                                        </div>
                                        <button id="search-button-desktop-id" onClick={(event) => {
                                            event.preventDefault()
                                        }} className="search-btn">Search
                                        </button>
                                        {this.state.showQuickSearch &&
                                            <div className="input-search-quick-search-container">
                                                <div className="input-quick-search-holder">
                                                    <span className="label-quick-search">Trending</span>
                                                    <div style={{ overflow: 'auto' }}>
                                                        {_.map(trendingSearchModal, (value, i) => {
                                                            return (
                                                                <div className="trending-tab-quick-search" key={i}>
                                                                    <div
                                                                        onClick={() => this.goToQuickSearch('category', value.key)}
                                                                        className="trending-tab-quick-search-inner">
                                                                        <img className="trending-tab-icon-quick-search"
                                                                            src={value.icon ? value.icon : ''} alt="" />
                                                                        <span
                                                                            className="trending-tab-icon-name">{value.name ? value.name : ''}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <span className="label-quick-search-2">Suggested Searches</span>
                                                    <div style={{ overflow: 'auto' }}>
                                                        {_.map(suggestedSearch, (value, i) => {
                                                            return (
                                                                <div className="suggest-tab-quick-search" key={i}>
                                                                    <div
                                                                        onClick={() => this.goToQuickSearch('category', value.key)}
                                                                        className="suggest-tab-quick-search-inner">
                                                                        <img className="suggest-tab-icon-quick-search"
                                                                            src={value.icon ? value.icon : ''} alt="" />
                                                                        <span
                                                                            className="suggest-tab-icon-name">{value.name ? value.name : ''}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {this.state.showNoResult &&
                                            <div className="input-search-result-container">
                                                <div>
                                                    <div className="search-result-item">
                                                        <span
                                                            className="search-no-result">No Results found</span>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {this.state.showSearchResult &&
                                            <div className="input-search-result-container">
                                                <div>
                                                    {this.props.homeReducer.searchResults.map((value, i) => {
                                                        return (
                                                            <div key={i} onClick={() => {
                                                                this.props.history.push({
                                                                    pathname: `/profile/${value._source.username}`
                                                                })
                                                            }} className="search-result-item">
                                                                <img className="search-result-image"
                                                                    src={imageTransformation(value._source.profilePicture, 80)} alt="" />
                                                                <span
                                                                    className="search-result-name">{value._source.displayName}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </form>
                            </section>
                        </div>
                        <section className="quick-search-icons-container">
                            <div className="quick-search-icon-holder-holder">
                                <div className="quick-search-icon-holder"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category/travel`
                                        })
                                    }}>
                                    <div className="quick-search-center-div">
                                        <img alt="" src={categories.travel.icon} />
                                        <br />
                                        <span>Travel</span>
                                    </div>
                                </div>
                                <div className="quick-search-icon-holder"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category/onlinestartups`
                                        })
                                    }}>
                                    <div className="quick-search-center-div">
                                        <img alt="" src={categories.onlinestartups.icon} />
                                        <br />
                                        <span>Online Startups</span>
                                    </div>
                                </div>
                                <div className="quick-search-icon-holder" onClick={() => {
                                    this.props.history.push({
                                        pathname: `/category/gifting`
                                    })
                                }}>
                                    <div className="quick-search-center-div">
                                        {shoppingBag()}
                                        <br />
                                        <span>Gifting</span>
                                    </div>
                                </div>
                                <div className="quick-search-icon-holder"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category/healthandwellness`
                                        })
                                    }}>
                                    <div className="quick-search-center-div">
                                        {firstAidKit()}
                                        <br />
                                        <span>Health & wellness</span>
                                    </div>
                                </div>
                                <div className="quick-search-icon-holder"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category/furniture`
                                        })
                                    }}>
                                    <div className="quick-search-center-div">
                                        {armedChair()}
                                        <br />
                                        <span>Furniture</span>
                                    </div>
                                </div>
                                <div className="quick-search-icon-holder"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category/cleaningservices`
                                        })
                                    }}>
                                    <div className="quick-search-center-div">
                                        {broom()}
                                        <br />
                                        <span>Cleaning Services</span>
                                    </div>
                                </div>
                                <div className="quick-search-icon-holder"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category/homedecor`
                                        })
                                    }}>
                                    <div className="quick-search-center-div">
                                        <img alt="" src={categories.homedecor.icon} />
                                        <br />
                                        <span>Home Decor</span>
                                    </div>
                                </div>
                                <div className="quick-search-icon-holder"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category`
                                        })
                                    }}>
                                    <div className="quick-search-center-div">
                                        {/*{ballIcon()}*/}
                                        {viewMore()}
                                        <br />
                                        <span style={{ color: 'rgba(252, 156, 4, 1)' }}>View More</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {!_.isEmpty(this.props.homeReducer.ad) &&
                            <section className="ad-sections">
                                <Link rel="nofollow" target="_blank" to={{ pathname: this.props.homeReducer.ad.url }}>
                                    <img className="ad-section-image" alt={this.props.homeReducer.ad.title} src={imageTransformation(this.props.homeReducer.ad.desktopImage)} />
                                </Link>
                            </section>
                        }
                    </div>

                    {
                        this.props.homeReducer.vendors.length > 0 &&
                        <section className="trending-section">
                            <div className="trending-section-label-container">
                                <p className="trending-section-label">Trending Right now</p>
                            </div>

                            <div className="trending-section-main">
                                <div style={{ width: '70%' }}>
                                    {
                                        this.props.homeReducer.vendors.map(this.mapTrendingCard)
                                    }
                                </div>
                                <div className="trending-section-articles">
                                    {this.props.homeReducer.articles.map((value, index) => {
                                        return <Link rel="nofollow" key={index} to={{ pathname: `/article/${value.articleId}` }}>
                                            <div className="trending-section-articles-div">
                                                <img style={{ float: 'left' }} src={imageTransformation(value.imageUrl, 100, true)} className="articles-pic" alt="" />
                                                <div><p style={{ margin: '5px 0px' }}>{value.title}</p>
                                                    <span style={{ color: 'rgb(132, 132, 132)', display: 'flex', fontWeight: '700', fontSize: '0.8rem', padding: '2px 1px 1px' }}>
                                                        {convertDate(value.creationDate)} {" - "} {this.readingTime(value.content)} read</span></div>
                                            </div>
                                        </Link>
                                    })}
                                </div>
                            </div>

                            <div style={{ display: 'flex', minWidth: '1000px' }}>
                                <div style={{ width: '70%' }} className="view-all-container">
                                    <button className="view-all-button" style={{ marginRight: '0' }} onClick={() => this.toShowAllPage('profile')}>
                                        View All
                                    </button>
                                </div>
                                <div style={{ width: '30%' }} className="view-all-container">
                                    <button className="view-all-button" style={{ marginRight: '0' }} onClick={() => this.toShowAllPage('articles')}>
                                        View All
                                    </button>
                                </div>
                            </div>

                        </section>
                    }
                    {
                        !this.props.homeReducer.loading &&
                        <div style={{ minWidth: '1000px' }}>
                            {this.props.homeReducer.services && this.props.homeReducer.services.length > 0 &&
                                <section
                                    style={{
                                        padding: '30px 6rem',
                                        backgroundColor: 'white'
                                    }}>
                                    <div className="experience-section-label-container">
                                        <p className="experience-section-label">Hire Services</p>
                                    </div>
                                    {/*<div className="add-experience-container">*/}
                                    {/*<span className="home-vertically-center" style={{ left: '50px' }}>Create your own experience help our user’s to understand which service is best for them..</span>*/}
                                    {/*<button className="home-vertically-center add-experience-button">{addPenIcon()} Add Experience</button>*/}
                                    {/*</div>*/}

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                        {
                                            this.props.homeReducer.services.map((value, index) => {
                                                return (
                                                    <ServiceCard
                                                        key={index}
                                                        card={value}
                                                        history={this.props.history}
                                                    />
                                                )
                                            })
                                        }
                                        <div
                                            style={{
                                                marginTop: '30px',
                                                width: '100%'
                                            }}
                                            className="view-all-container">
                                            <button className="view-all-button" onClick={() => this.toShowAllPage('services')}>View All</button>
                                        </div>
                                    </div>
                                </section>
                            }
                            {this.props.homeReducer.experiences.length > 0 &&
                                <section className="experience-section">
                                    <div className="experience-section-label-container">
                                        <p className="experience-section-label">Videos</p>
                                    </div>
                                    {/*<div className="add-experience-container">*/}
                                    {/*<span className="home-vertically-center" style={{ left: '50px' }}>Create your own experience help our user’s to understand which service is best for them..</span>*/}
                                    {/*<button className="home-vertically-center add-experience-button">{addPenIcon()} Add Experience</button>*/}
                                    {/*</div>*/}

                                    <div>
                                        {
                                            this.props.homeReducer.experiences.map(this.mapExperience)
                                        }
                                        <div style={{ marginTop: '30px' }} className="view-all-container">
                                            <button className="view-all-button" onClick={() => this.toShowAllPage('experience')}>View All</button>
                                        </div>
                                    </div>
                                </section>
                            }
                            {this.props.homeReducer.products.length > 0 &&
                                <section className="exclusive-deals-section">
                                    <div className="exclusive-deals-section-label-container">
                                        <p className="exclusive-deals-section-label">Featured Products & Services</p>
                                    </div>
                                    <div style={{ margin: '0 6rem' }}>
                                        {
                                            this.props.homeReducer.products.map(this.mapProductCard)
                                        }
                                        <div className="view-all-container">
                                            <button className="view-all-button" onClick={() => this.toShowAllPage('products')}>View All</button>
                                        </div>
                                    </div>
                                </section>
                            }
                            {this.props.homeReducer.users.length > 0 &&
                                <section className="review-section">
                                    <div className="review-section-label-container">
                                        <p className="review-section-label">Our Most TrustVardi Reviews</p>
                                    </div>
                                    <div className="review-holder">
                                        {
                                            this.props.homeReducer.reviews.map(this.mapReviews)
                                        }
                                    </div>
                                    {/*<div className="view-all-container">*/}
                                    {/*<button className="view-all-button">View All</button>*/}
                                    {/*</div>*/}
                                </section>
                            }
                            <section className="add-experience-container-bottom">
                                <div className="add-experience-main-container">
                                    <img className="add-experience-container-bottom-image"
                                        src="https://res.cloudinary.com/trustvardi/image/upload/v1520857250/page-1_cqj2fi.svg"
                                        alt="" />
                                    <span className="add-experience-bottom-label-button-container">
                                        <span className="add-experience-bottom-label-container">Looking to grow your Business? Join us now</span>
                                        <br />
                                        <button className="add-experience-bottom-button"
                                            onClick={() => {
                                                if (this.props.meReducer.isLoggedIn) {
                                                    this.props.history.push({
                                                        pathname: '/addprofile'
                                                    });
                                                } else {
                                                    this.props.dispatch(toggleLoginModal());
                                                }
                                            }}>Join us now</button>
                                    </span>
                                </div>
                            </section>
                            <section
                                style={{
                                    display: 'flex',
                                    margin: '100px 11rem 50px',
                                    backgroundColor: 'white'
                                }}>
                                <div
                                    style={{
                                        width: '60%',
                                        padding: '40px',
                                        boxSizing: 'border-box'
                                    }}>
                                    <span
                                        style={{
                                            fontSize: '30px'
                                        }}
                                        className="add-experience-bottom-label-container">Get The Best Of Quirky Products & Services At Your Fingertips</span>
                                    <span
                                        style={{
                                            display: 'block',
                                            marginTop: '10px',
                                            opacity: '0.8',
                                            fontFamily: 'Avenir',
                                            fontWeight: 'normal',
                                            fontStyle: 'normal',
                                            fontStretch: 'normal',
                                            lineHeight: 'normal',
                                            letterSpacing: '0.2px',
                                            color: '#2c3249',
                                            fontSize: '18px'
                                        }}>We'll send you a link, open it on your phone to download the app</span>
                                    <div
                                        style={{
                                            display: 'flex',
                                            marginTop: '40px',
                                            alignItems: 'center'
                                        }}>
                                        <input
                                            id="email-app"
                                            onKeyUp={(e) => {
                                                if (e.keyCode === 13) {
                                                    this.emailAppLink();
                                                }
                                            }}
                                            style={{
                                                height: '40px',
                                                width: '70%',
                                                borderTopLeftRadius: '3px',
                                                borderBottomLeftRadius: '3px',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                fontSize: '16px',
                                                padding: '0 10px',
                                                boxSizing: 'border-box'
                                            }}
                                            type="email"
                                            name="email"
                                            placeholder="Enter your E-mail" />
                                        <button
                                            onClick={this.emailAppLink}
                                            style={{
                                                height: '40px',
                                                borderTopRightRadius: '3px',
                                                borderBottomRightRadius: '3px',
                                                border: 'none',
                                                fontSize: '16px',
                                                padding: '0 10px',
                                                backgroundColor: '#ff9f00',
                                                color: 'white'
                                            }}
                                        >Send Link</button>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            marginTop: '40px'
                                        }}>
                                        <a
                                            rel="noopener noreferrer"
                                            href="https://itunes.apple.com/us/app/trustvardi/id1447643751?ls=1&mt=8"
                                            target="_blank">
                                            <img height="45" src="https://trustvardi.sfo2.digitaloceanspaces.com/icons/app_store_badge.svg" alt="" />
                                        </a>
                                        <a
                                            rel="noopener noreferrer"
                                            style={{
                                                marginLeft: '20px'
                                            }}
                                            href="https://play.google.com/store/apps/details?id=com.trustvardi&hl=en"
                                            target="_blank">
                                            <img height="45" src="https://trustvardi.sfo2.digitaloceanspaces.com/icons/google-play-download-android-app.svg" alt="" />
                                        </a>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        width: '40%',
                                        textAlign: 'center'
                                    }}>
                                    <img
                                        style={{
                                            width: '50%',
                                            marginTop: '-100px',
                                            marginBottom: '50px'
                                        }}
                                        src="https://trustvardi.sfo2.digitaloceanspaces.com/images/trustvardiappsc.png" alt="" />
                                </div>
                            </section>
                        </div>
                    }
                    {
                        this.props.homeReducer.loading &&
                        <div className="vendor-loader-container-desktop">
                            <img alt="" className="vendor-loader-desktop" src={loader} />
                        </div>
                    }
                </div >
            );
            // else {
            //     return (
            //         <div className="vendor-loader-container-desktop">
            //             <img className="vendor-loader-desktop" src={loader} />
            //         </div>
            //     )
            // }
        } else if (window.innerWidth <= 768) {
            return (
                <div style={{ backgroundColor: 'white' }}>
                    <div className="search-section-home">
                        {this.renderMetaTags()}
                        <section className="search-container" style={{ paddingTop: '1px' }}>
                            <div style={{
                                color: checkPMLevel(this.state.pmLevel),
                                textAlign: 'right',
                                padding: '10px 20px 0 0',
                                fontSize: '12px',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center'
                            }}>PM Level {(this.state.city && this.state.city.length > 0) ? `of ${this.state.city}` : ''}: {this.state.pmLevel}
                                <MdRefresh onClick={this.getPmLevelLocation} id="getPmLevelLocation" style={{ color: 'white', marginLeft: '10px' }} />
                            </div>
                            <div className="search-label">
                                <p className="search-label-1">Find #OTB</p>
                                <p style={{ margin: '0 0 10px 0' }} className="search-label-1">Brands, Products &amp; Services</p>
                            </div>
                            <div>
                                <LocationInput city={this.props.city} history={this.props.history} />
                            </div>
                            <form action="" style={{ textAlign: 'center', marginTop: '10px' }}>
                                <div>
                                    <div id="mobile-search-button-invoke" className="mobile-search-container">
                                        <MdSearch style={{
                                            margin: 'auto 0 auto 7px',
                                            height: '2rem',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '0%',
                                            transform: 'translateY(-50%)'
                                        }} />
                                        <span id="mobile-search" onClick={() => {
                                            this.props.dispatch(toggleMobileSearchModal());
                                            document.body.style.overflow = 'hidden';
                                        }} style={{
                                            outline: 'none',
                                            margin: '0',
                                            width: '80%',
                                            border: 'none',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            fontSize: '12px',
                                            textAlign: 'left',
                                            paddingLeft: '5px'
                                        }} type="text">
                                            What are you looking for?
                                        </span>
                                    </div>
                                    {this.state.showSearchResult &&
                                        <div className="mobile-search-result-container">
                                            <div>
                                                {this.props.homeReducer.searchResults.map((value, i) => {
                                                    return (
                                                        <div key={i} onClick={() => {
                                                            this.props.history.push({
                                                                pathname: `/profile/${value._source.username}`
                                                            })
                                                        }} className="search-result-item-mobile">
                                                            <img className="search-result-image-mobile"
                                                                src={value._source.profilePicture} alt="" />
                                                            <span
                                                                className="search-result-name-mobile">{value._source.displayName}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </form>
                        </section>
                    </div>
                    <section className="mobile-quick-search-icons-container">
                        <div className="mobile-quick-search-icon-holder-holder">
                            <div className="mobile-quick-search-icon-holder">
                                <div className="mobile-quick-search-icon-center"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category/gifting`
                                        })
                                    }}>
                                    {shoppingBag()}
                                    <span style={{ display: 'block', fontSize: '10px' }}>Gifting</span>
                                </div>
                            </div>
                            <div className="mobile-quick-search-icon-holder">
                                <div className="mobile-quick-search-icon-center"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category/forkids`
                                        })
                                    }}>
                                    {buggy()}
                                    <span style={{ display: 'block', fontSize: '10px' }}>For kids</span>
                                </div>
                            </div>
                            <div className="mobile-quick-search-icon-holder">
                                <div className="mobile-quick-search-icon-center"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category/healthandwellness`
                                        })
                                    }}>
                                    {firstAidKit()}
                                    <span style={{ display: 'block', fontSize: '10px' }}>Health & wellness</span>
                                </div>
                            </div>
                            <div className="mobile-quick-search-icon-holder">
                                <div className="mobile-quick-search-icon-center" onClick={() => {
                                    this.props.history.push({
                                        pathname: `/category/cleaningservices`
                                    })
                                }}>
                                    {broom()}
                                    <span style={{ display: 'block', fontSize: '10px' }}>Cleaning Services</span>
                                </div>
                            </div>
                            <div className="mobile-quick-search-icon-holder">
                                <div className="mobile-quick-search-icon-center"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category/furniture`
                                        })
                                    }}>
                                    {armedChair()}
                                    <span style={{ display: 'block', fontSize: '10px' }}>Furniture</span>
                                </div>
                            </div>
                            {/* <div className="mobile-quick-search-icon-holder">
                                <div className="mobile-quick-search-icon-center"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category/sports`
                                        })
                                    }}>
                                    {ballIcon()}
                                    <span style={{ display: 'block', fontSize: '10px' }}>Sports</span>
                                </div>
                            </div> */}
                            <div className="mobile-quick-search-icon-holder">
                                <div className="mobile-quick-search-icon-center"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/category`
                                        })
                                    }}>
                                    {/*{ballIcon()}*/}
                                    {viewMore()}
                                    <br />
                                    <span style={{ color: 'rgba(252, 156, 4, 1)' }} className="quick-search-center-div-mobile">View More</span>
                                </div>
                            </div>
                        </div>
                        {/* <div style={{ textAlign: 'center', padding: '10px 0' }}>
                            <button style={{ color: '#ff9f00', backgroundColor: 'white', border: 'none' }} onClick={() => {
                                this.props.history.push({
                                    pathname: `/category`
                                })
                            }}>VIEW MORE</button>
                        </div> */}
                    </section>
                    {!_.isEmpty(this.props.homeReducer.ad) &&
                        <section className="ad-section-mobile">
                            <Link rel="nofollow" target="_blank" to={{ pathname: this.props.homeReducer.ad.url }}>
                                <img className="ad-section-image-mobile" alt={this.props.homeReducer.ad.title} src={this.props.homeReducer.ad.mobileImage} />
                            </Link>
                        </section>
                    }
                    {!this.props.homeReducer.loading &&
                        <div className="home-card-container" style={{ backgroundColor: '#fafafa', overflow: 'auto' }}>
                            <section className="trending-mobile-view">
                                <div style={{ margin: '10px', overflow: 'auto' }}>
                                    <span style={{
                                        float: 'left',
                                        fontSize: '18px',
                                        fontWeight: '800'
                                    }}>Trending Profiles</span>
                                    {/*<span style={{float: 'right', fontSize: '16px'}}*/}
                                    {/*onClick={() => this.toShowAllPage('profile')}>VIEW ALL</span>*/}
                                    {/* <div className="view-all-container"> */}
                                    <button className="view-all-button-mobiles" onClick={() => this.toShowAllPage('profile')}>View All</button>
                                    {/* </div> */}
                                </div>
                                {this.props.homeReducer.vendors.length > 0 &&
                                    <div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 5px' }}>
                                            {this.props.homeReducer.vendors.map((card, i) => {
                                                return (
                                                    <TrendingCard key={i} match={this.props.match} history={this.props.history} card={card} />
                                                )
                                            })}
                                        </div>
                                    </div>
                                }
                            </section>

                            {this.props.homeReducer.articles.length > 0 &&
                                <section>
                                    <div className="trending-section-articles-mobile" style={{ width: '100%', background: 'white' }}>
                                        {/* <label><h1>Read</h1></label> */}
                                        <div style={{ margin: '10px' }}>
                                            <span style={{
                                                float: 'left',
                                                fontSize: '18px',
                                                fontWeight: '800'
                                            }}>Read</span>
                                            {/*<span style={{float: 'right', fontSize: '16px'}}*/}
                                            {/*onClick={() => this.toShowAllPage('profile')}>VIEW ALL</span>*/}
                                            {/* <div className="view-all-container"> */}
                                            <button className="view-all-button-mobiles" onClick={() => this.toShowAllPage('articles')}>View All</button>
                                            {/* </div> */}
                                        </div>
                                        {this.props.homeReducer.articles.map((value, index) => {
                                            return <Link rel="nofollow" style={{ textDecoration: 'none' }} key={index} to={{ pathname: `/article/${value.articleId}` }}>
                                                <div className="trending-section-articles-div-mobile">
                                                    <div><img src={value.imageUrl} className="articles-pic-mobile" alt="" /></div>
                                                    <div><p style={{ marginTop: '0px' }}>{value.title}</p>{convertDate(value.creationDate)}
                                                        {" - "} {this.readingTime(value.content)} read</div>
                                                </div>
                                            </Link>
                                        })}
                                    </div>
                                </section>
                            }

                            <section className="trending-mobile-view">
                                <div style={{ margin: '10px', overflow: 'auto' }}>
                                    <span style={{
                                        float: 'left',
                                        fontSize: '18px',
                                        fontWeight: '800'
                                    }}>Hire Services</span>
                                    {/*<span style={{float: 'right', fontSize: '16px'}}*/}
                                    {/*onClick={() => this.toShowAllPage('profile')}>VIEW ALL</span>*/}
                                    {/* <div className="view-all-container"> */}
                                    <button className="view-all-button-mobiles" onClick={() => this.toShowAllPage('services')}>View All</button>
                                    {/* </div> */}
                                </div>
                                {this.props.homeReducer.services.length > 0 &&
                                    <div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                margin: '0 1%'
                                            }}>
                                            {this.props.homeReducer.services.map((card, i) => {
                                                return (
                                                    <ServiceCard
                                                        key={i}
                                                        history={this.props.history}
                                                        card={card} />
                                                )
                                            })}
                                        </div>
                                    </div>
                                }
                            </section>

                            {this.props.homeReducer.experiences.length > 0 &&
                                <section className="experience-mobile-view">
                                    <div style={{ margin: '10px', overflow: 'auto' }}>
                                        <span style={{ float: 'left', fontSize: '18px', fontWeight: '800' }}>Videos</span>
                                        {/*<span style={{ float:'right', fontSize: '16px' }} onClick={() => this.toShowAllPage('experience')}>VIEW ALL</span>*/}
                                        {/* <div className="view-all-container"> */}
                                        <button className="view-all-button-mobiles" onClick={() => this.toShowAllPage('experience')}>View All</button>
                                        {/* </div> */}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 5px' }}>
                                        {this.props.homeReducer.experiences.map((card, i) => {
                                            return (
                                                <ExperienceCard key={i} history={this.props.history}
                                                    match={this.props.match} card={card} />
                                            )
                                        })}
                                    </div>

                                </section>
                            }
                            {this.props.homeReducer.products.length > 0 &&
                                <section className="exclusive-deals-mobile">
                                    <div style={{ overflow: 'auto', fontSize: '18px', fontWeight: '800', margin: '10px' }}>
                                        Featured Products & Services
                                    {/*<span style={{float: 'right', fontSize: '16px'}} onClick={() => this.toShowAllPage('experience')}>VIEW ALL</span>*/}
                                        {/* <div className="view-all-container"> */}
                                        <button className="view-all-button-mobiles" onClick={() => this.toShowAllPage('products')}>View All</button>
                                        {/* </div> */}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '3px' }}>
                                        {this.props.homeReducer.products.map((card, i) => {
                                            return (
                                                <ProductCard key={i} history={this.props.history} match={this.props.match} card={card} />
                                            )
                                        })}

                                    </div>
                                </section>
                            }
                            <div style={{
                                backgroundColor: 'white', marginTop: '10px', marginBottom: '20px', boxShadow: '0 1px 1px 1px rgba(0,0,0,.12)',
                                border: '1px solid #ededed'
                            }}>
                                <section className="user-review-mobile">
                                    <div style={{
                                        margin: '10px', fontSize: '18px',
                                        fontWeight: '800'
                                    }}>
                                        Most Trustvardi Users
                                    {/*<span style={{ float:'right', fontSize: '16px' }}>VIEW ALL</span>*/}
                                    </div>
                                    {this.props.homeReducer.users.length > 0 &&
                                        <div>
                                            <ViewPager tag="main">
                                                <Frame className="frame-review">
                                                    <Track
                                                        ref={c => this.track = c}
                                                        viewsToShow={2}
                                                        className="track-review"
                                                    >
                                                        {this.props.homeReducer.reviews.map((card, i) => {
                                                            return (
                                                                <View className="view-holder-card-mobile-3" key={i}>
                                                                    <ReviewCard history={this.props.history} index={i} card={card} />
                                                                </View>
                                                            )
                                                        })}
                                                    </Track>
                                                </Frame>
                                            </ViewPager>
                                        </div>
                                    }
                                </section>
                            </div>
                            <div style={{ margin: '10px 10px 3rem 10px' }}>
                                <section className="add-experience-container-bottom-mobile">
                                    <img className="add-experience-container-bottom-image-mobile"
                                        src="https://res.cloudinary.com/trustvardi/image/upload/v1520857250/page-1_cqj2fi.svg"
                                        alt="" />
                                    <span className="add-experience-bottom-label-container">Are you a Brand looking to grow your product/service business?</span>
                                    <div style={{ marginBottom: '20px' }}>
                                        <button
                                            className="add-experience-bottom-button-mobile"
                                            onClick={() => {
                                                if (this.props.meReducer.isLoggedIn) {
                                                    this.props.history.push({
                                                        pathname: '/addprofile'
                                                    });
                                                } else {
                                                    this.props.dispatch(toggleLoginModal());
                                                }
                                            }}>Join us now
                                </button>
                                    </div>
                                </section>
                            </div>
                            <div
                                style={{ margin: '10px 10px 5rem 10px' }}>
                                <section>
                                    <div
                                        style={{
                                            textAlign: 'center'
                                        }}>
                                        <span
                                            style={{
                                                fontWeight: '800',
                                                fontSize: '18px',
                                                margin: '10px'
                                            }}>Get The Best Of Quirky Products & Services At Your Fingertips</span>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                marginTop: '20px'
                                            }}>
                                            <a
                                                rel="noopener noreferrer"
                                                href="https://itunes.apple.com/us/app/trustvardi/id1447643751?ls=1&mt=8"
                                                target="_blank">
                                                <img height="45" src="https://trustvardi.sfo2.digitaloceanspaces.com/icons/app_store_badge.svg" alt="" />
                                            </a>
                                            <a
                                                rel="noopener noreferrer"
                                                style={{
                                                    marginLeft: '20px'
                                                }}
                                                href="https://play.google.com/store/apps/details?id=com.trustvardi&hl=en"
                                                target="_blank">
                                                <img height="45" src="https://trustvardi.sfo2.digitaloceanspaces.com/icons/google-play-download-android-app.svg" alt="" />
                                            </a>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    }
                    {this.props.homeReducer.loading &&
                        <div className="vendor-loader-container-desktop">
                            <img alt="" className="vendor-loader-desktop" src={loader} />
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

export default connect((state) => state, mapDispatchToProps)(Home);