/* eslint-disable array-callback-return, radix, no-mixed-operators */
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import Cookies from 'universal-cookie';
import scrollToComponent from 'react-scroll-to-component';
import ReactModal from 'react-modal';
import { CLOUDINARY } from "../../constant/keys";
import { Link } from 'react-router-dom';
import NotFound from '../../component/NotFound'
import {
    // FaStar,
    FaLaptop,
    FaPhone,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaPinterestP,
    FaYoutubePlay,
    FaStar
} from 'react-icons/lib/fa';
import {
    MdEmail,
    MdThumbUp,
    MdCheckCircle,
    MdShare
} from 'react-icons/lib/md';
import _ from 'lodash';
import ReviewComment from '../../component/review.comment';
import AddReview from '../../component/add.review';
// import ProductCard from '../../component/product.card';
import Loadable from 'react-loadable';
import loader from '../../assets/icons/loader.svg';
import {
    Helmet
} from 'react-helmet';
import Ratings from 'react-ratings-declarative';
import {
    fetchVendor,
    asyncFollowUnfollowVendor,
    asyncLikeDislikeVendor,
    toggleLoginModal,
    asyncShareModal,
    asyncTogglePicture,
    fetchVendorDetails,
    asyncFetchSimilarVendors
} from '../../action/index';
import Lightbox from 'lightbox-react';
import {
    trustvardiCertifiedIcon,
    rupeeSign
} from '../../assets/icons/icons';
import Rating from '../../component/rating';
import '../../assets/css/vendor.css';
import '../../assets/css/circle.css';
import { categories } from "../../constant/static";
import ReactAnalytics from "../../util/ga";
import { imageTransformation, getCallApi } from '../../util/util';
import { UPDATE_VIEW_COUNT_PROFILE } from '../../constant/api';

const ExperienceCard = Loadable({
    loader: () => import('../../component/experience.card'),
    loading: () => <div>Loading...</div>,
});

const TrendingCard = Loadable({
    loader: () => import('../../component/trending.card'),
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

let FIRST_LOAD = false;

let isScrollingDown = false;

const colorCode = [
    '#ea1b26',
    '#e78a00',
    '#f7bb41',
    '#6ea53e',
    '#4e7b22'
];


class Vendor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openLightBox: false,
            photoIndex: 0,
            images: [],
            reviewModal: false,
            hover: false,
            hoverRating: 0,
            rating: 0,
        }
        this.onHover = this.onHover.bind(this);
        this.hoverOff = this.hoverOff.bind(this);
    };

    onHover = (rating) => {
        this.setState({
            hover: true,
            hoverRating: rating
        })
    }

    hoverOff = () => {
        this.setState({ hover: false })
    }

    componentDidMount() {
        window.addEventListener('wheel', (e) => {
            if (window.pageYOffset > 620) {
                if (e.deltaY < 0) {
                    isScrollingDown = false;
                }
                if (e.deltaY > 0) {
                    isScrollingDown = true;
                }
            }
        });
        window.addEventListener('scroll', (event) => {
            if (window.pageYOffset > 600) {
                if (document.getElementById("vendortabsholder")) {
                    document.getElementById("vendortabsholder").style.position = "fixed";
                    document.getElementById("vendortabsholder").style.top = `${isScrollingDown ? '3.5' : '5'}rem`;
                    document.getElementById("vendortabsholder").style.width = `${document.getElementById('vendor-more-information').offsetWidth}px`;
                    document.getElementById("vendortabsholder").style.zIndex = "2";
                    document.getElementById("vendortabsholder").style.border = '0.09375rem solid rgb(230, 230, 230)';
                }
            } if (window.pageYOffset < 600) {
                if (document.getElementById("vendortabsholder")) {
                    document.getElementById("vendortabsholder").style.position = "relative";
                    document.getElementById("vendortabsholder").style.top = null;
                    document.getElementById("vendortabsholder").style.width = null;
                    document.getElementById("vendortabsholder").style.zIndex = null;
                    document.getElementById("vendortabsholder").style.border = null;
                }
            }
        })
    }

    componentWillMount() {
        FIRST_LOAD = true
        window.scrollTo(0, 0);
        const username = this.props.match.params.profileId;
        const tempCookie = new Cookies();
        let type = 'desktop';
        if (window.innerWidth < 768) {
            type = 'mobile'
        }
        this.props.dispatch(fetchVendor(username, tempCookie.get('token'), type))
            .then(data => {
                setTimeout(() => {
                    const isDev = (this.props.location.search && this.props.location.search.indexOf('isDevelopment') > -1)
                        ?
                        true
                        :
                        false;
                    const pageUrl = this.props.match.url;

                    !isDev && ReactAnalytics.pageView(pageUrl);
                    !isDev && getCallApi(UPDATE_VIEW_COUNT_PROFILE(username));
                }, 600);
                this.renderMapAndProgressBar();
                window.prerenderReady = true;
                this.props.dispatch(fetchVendorDetails(username, tempCookie.get('token'), type))
                    .then(detailData => {
                        if (data.success && data.vendorData) {
                            if (!_.isEmpty(data.vendorData.vendor)) {
                                const imagesArray = this.props.vendorReducer.images;
                                const imageLinkArray = [];
                                if (imagesArray.length > 0) {
                                    imagesArray.map((value) => {
                                        imageLinkArray.push(value.image.link);
                                    });
                                }
                                this.setState({
                                    images: imageLinkArray,
                                    rating: data.vendorData.vendor.rating
                                });
                            }
                            this.props.dispatch(asyncFetchSimilarVendors(username, data.vendorData.vendor.category, type, tempCookie.get('token')))
                                .then((similar) => {
                                    FIRST_LOAD = false;
                                    window.prerenderReady = true;
                                });
                        }
                    });
            });
    }


    componentWillReceiveProps(nextProps) {
        let type = 'desktop';
        if (window.innerWidth < 768) {
            type = 'mobile'
        }
        if (!_.isEmpty(nextProps.meReducer.userData)) {
            if (!FIRST_LOAD) {
                if (this.props.meReducer.userData !== nextProps.meReducer.userData) {
                    const username = nextProps.match.params.profileId;
                    nextProps.dispatch(fetchVendor(username, nextProps.meReducer.userData.accessToken, type))
                        .then((data) => {
                            getCallApi(UPDATE_VIEW_COUNT_PROFILE(username));
                            nextProps.dispatch(fetchVendorDetails(username, nextProps.meReducer.userData.accessToken, type))
                                .then((detailsData) => {
                                    nextProps.dispatch(asyncFetchSimilarVendors(username, data.vendorData.vendor.category, type, nextProps.meReducer.userData.accessToken));
                                });
                        });
                }
            }
        }
        if (nextProps.match.url !== this.props.match.url) {
            window.scrollTo(0, 0);
            const username = nextProps.match.params.profileId;
            const tempCookie = new Cookies();
            nextProps.dispatch(fetchVendor(username, tempCookie.get('token'), type))
                .then(data => {
                    getCallApi(UPDATE_VIEW_COUNT_PROFILE(username));
                    this.renderMapAndProgressBar();
                    nextProps.dispatch(fetchVendorDetails(username, tempCookie.get('token'), type))
                        .then((detailData) => {
                            setTimeout(() => {
                                const pageUrl = nextProps.match.url;
                                const isDev = (nextProps.location.search && nextProps.location.search.indexOf('isDevelopment') > -1)
                                    ?
                                    true
                                    :
                                    false;

                                !isDev && ReactAnalytics.pageView(pageUrl);
                            }, 600);
                            if (data.success && data.vendorData) {
                                if (!_.isEmpty(data.vendorData.vendor)) {
                                    const imagesArray = nextProps.vendorReducer.images;
                                    const imageLinkArray = [];
                                    if (imagesArray.length > 0) {
                                        imagesArray.map((value) => {
                                            imageLinkArray.push(value.image.link);
                                        });
                                    }
                                    this.setState({
                                        images: imageLinkArray,
                                        rating: data.vendorData.vendor.rating
                                    });
                                    nextProps.dispatch(asyncFetchSimilarVendors(username, data.vendorData.vendor.category, type, tempCookie.get('token')));
                                }
                            }
                        })
                });
        }
    }


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

    cardAction = (action, status, _id) => {
        const tempCookies = new Cookies();
        const token = tempCookies.get('token');

        const actionData = {
            action,
            status,
            vendor: _id,
            token
        };

        if (token) {
            this.props.dispatch(asyncLikeDislikeVendor(actionData));
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };

    mapExperience = (card, i) => {
        return (
            <ExperienceCard key={i} match={this.props.match} history={this.props.history} card={card} />
        );
    };

    mapGallery = (card, i) => {
        if (this.props.vendorReducer.imageCount > 4 && i === 3) {
            return (
                <div key={i} style={{
                    backgroundImage: `url('${imageTransformation(card.image.link, 300)}')`,
                    width: '10rem',
                    backgroundSize: 'cover',
                    display: 'inline-block',
                    height: '10rem',
                    marginRight: '1%',
                    position: 'relative',
                    borderRadius: '8px'
                }} onClick={() => {
                    this.setState({
                        openLightBox: true,
                        photoIndex: i
                    });
                }}>
                    <span className="four-image-gallery">
                        <span className="four-image-gallery-image">
                            +{parseInt(this.props.vendorReducer.imageCount) - 4} Photos</span>
                    </span>
                    {/* <MdShare className="image-share-button" /> */}
                </div>
            );
        } else {
            return (
                <div key={i} style={{
                    backgroundImage: `url('${imageTransformation(card.image.link, 300)}')`,
                    width: '10rem',
                    cursor: 'pointer',
                    backgroundSize: 'cover',
                    display: 'inline-block',
                    height: '10rem',
                    marginRight: '1%',
                    position: 'relative',
                    borderRadius: '8px'
                }} onClick={() => {
                    this.setState({
                        openLightBox: true,
                        photoIndex: i
                    });
                }}>
                    {/* <MdShare className="image-share-button" /> */}
                </div>
            );
        }
    };

    openCloudinaryUploader = (event) => {
        event.preventDefault();
        window.cloudinary.openUploadWidget({
            cloud_name: CLOUDINARY.cloud_name,
            upload_preset: CLOUDINARY.upload_preset,
            api_key: CLOUDINARY.api_key,
            api_secret: CLOUDINARY.api_secret,
            folder: 'reviews',
            sources: ['local', 'url', 'camera', 'facebook'],
            gravity: 'custom',
            quality: 'auto:eco',
            max_file_size: 5000000,
            max_files: 7
        },
            (error, result) => {
                if (!error) {
                    if (result) {
                        if (result[0]) {

                        }
                    }
                }
            });
    };

    mapGalleryMobile = (card, i) => {
        if (this.props.vendorReducer.imageCount > 4 && i === 3) {
            return (
                <div key={i} style={{
                    backgroundImage: `url('${imageTransformation(card.image.link, 300)}')`,
                    width: '21%',
                    backgroundSize: 'cover',
                    display: 'inline-block',
                    height: '5rem',
                    marginRight: '1%',
                    position: 'relative',
                    borderRadius: '8px',
                    backgroundPosition: 'center'
                }} onClick={() => {
                    this.setState({
                        openLightBox: true,
                        photoIndex: i
                    });
                }}>
                    <span className="four-image-gallery">
                        <span style={{
                            fontSize: '10px'
                        }} className="four-image-gallery-image">+{parseInt(this.props.vendorReducer.imageCount) - 4} More</span>
                    </span>
                    {/* <MdShare className="image-share-button" /> */}
                </div>
            );
        } else {
            return (
                <div key={i} style={{
                    backgroundImage: `url('${imageTransformation(card.image.link, 300)}')`,
                    width: '21%',
                    backgroundSize: 'cover',
                    display: 'inline-block',
                    height: '5rem',
                    marginRight: '1%',
                    position: 'relative',
                    borderRadius: '8px',
                    backgroundPosition: 'center'
                }} onClick={() => {
                    this.setState({
                        openLightBox: true,
                        photoIndex: i
                    });
                }}>
                    {/* <MdShare className="image-share-button" /> */}
                </div>
            );
        }
    };

    renderMapAndProgressBar = () => {
        if (document.getElementById('map')) {
            const uluru = {
                lat: this.props.vendorReducer.vendor.address.coordinates.coordinates[0],
                lng: this.props.vendorReducer.vendor.address.coordinates.coordinates[1]
            };
            const map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: uluru
            });
            new window.google.maps.Marker({
                position: uluru,
                map: map
            });
        }
    };


    closeModal = () => {
        this.setState({
            reviewModal: false,
            rating: this.props.vendorReducer.vendor.rating
        });
    };

    renderMetaTags = () => {
        const vendorData = this.props.vendorReducer.vendor;
        return (
            <Helmet>
                <title>{vendorData.displayName} - Rating, Reviews & Experiences</title>
                <meta name="fragment" content="!" />
                <meta name="description" content={vendorData.description} />
                <link rel="canonical" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="en" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta name="robots" content="index, follow" />
                <meta name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta property="og:title" content={`${vendorData.displayName}  - Rating, Reviews & Experiences`} />
                <meta property="og:description" content={vendorData.description} />
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={vendorData.coverPicture} />
                <meta property="og:site_name" content="trustvardi.com" />
                <meta property="article:section" content="Lifestyle" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@trustvardi" />
                <meta name="twitter:creator" content="trustvardi.com" />
                <meta name="twitter:title" content={`${vendorData.displayName}  - Rating, Reviews & Experiences`} />
                <meta name="twitter:description" content={vendorData.description} />
                <meta name="twitter:image" content={vendorData.coverPicture} />
                <link rel="amphtml" href={`https://www.trustvardi.com/amp/profile/${vendorData.username}`} />
                {/*<meta property="trustvardicom:average_rating" content={`Rating: ${vendorData.rating}`}/>*/}
                <script type="application/ld+json">
                    {`
                        [{
                            "@context": "http://schema.org",
                            "name": "${vendorData.displayName}",
                            "@type": "LocalBusiness",
                            ${vendorData.address.address ? `"address":"${vendorData.address.address}",` : ''}
                            ${(vendorData.contactPhoneNumber && vendorData.contactPhoneNumber.length > 0) ? `"telephone":"${vendorData.contactPhoneNumber}",` : ''}
                            "url": "https://www.trustvardi.com/profile/${vendorData.username}",
                            "description": "${vendorData.description}",
                            "image": "${vendorData.coverPicture}",
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": ${vendorData.rating},
                                "ratingCount": ${(vendorData.reviewCount === 0) ? 1 : vendorData.reviewCount}
                            }
                            }
                        , {
                            "@context": "http://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [{
                                "@type": "ListItem",
                                "position": 1,
                                "item": {
                                    "@id": "https://www.trustvardi.com",
                                    "name": "TRUSTVARDI"
                                }
                            }, {
                                "@type": "ListItem",
                                "position": 2,
                                "item": {
                                    "@id": "https://www.trustvardi.com/profile",
                                    "name": "PROFILE"
                                }
                            }, {
                                "@type": "ListItem",
                                "position": 3,
                                "item": {
                                    "@id": "https://www.trustvardi.com/profile/${vendorData.username}",
                                    "name": "${vendorData.displayName}"
                                }
                            }]
                        }]
                    `}
                </script>
            </Helmet>
        );
    };


    onClaimProfile = () => {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSeUJSPKKt8gwowtGYwFlltFU2wQQWl9iGF2_qeGb0UkU_1SKA/viewform', '_blank');
    };

    goToAllProductsPage = () => {
        this.props.history.push({
            pathname: `/profile/${this.props.vendorReducer.vendor.username}/products`
        });
    };

    toShowAllPage = (type) => {
        this.props.history.push({
            pathname: `/profile/${this.props.vendorReducer.vendor.username}/${type}`
        });
    };

    changeRating = (newRating, name) => {
        if (this.props.meReducer.isLoggedIn) {
            this.setState({
                rating: newRating,
                reviewModal: true
            });
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };

    checkBar = (type) => {

        if (type === 'youtube') {
            if (
                (this.props.vendorReducer.vendor.pinterestUrl && this.props.vendorReducer.vendor.pinterestUrl.length > 0)
                ||
                (this.props.vendorReducer.vendor.facebookUrl && this.props.vendorReducer.vendor.facebookUrl.length > 0)
                ||
                (this.props.vendorReducer.vendor.instagramUrl && this.props.vendorReducer.vendor.instagramUrl.length > 0)
                ||
                (this.props.vendorReducer.vendor.twitterUrl && this.props.vendorReducer.vendor.twitterUrl.length > 0)
                ||
                (this.props.vendorReducer.vendor.linkedInUrl && this.props.vendorReducer.vendor.linkedInUrl.length > 0)
            ) {
                return (
                    <div style={{
                        borderRight: '1px solid rgba(0,0,0,0.4)',
                        display: 'inline-block',
                        height: '20px',
                        verticalAlign: 'middle'
                    }}>

                    </div>
                )
            }
        }

        if (type === 'pinterest') {
            if (
                (this.props.vendorReducer.vendor.facebookUrl && this.props.vendorReducer.vendor.facebookUrl.length > 0)
                ||
                (this.props.vendorReducer.vendor.instagramUrl && this.props.vendorReducer.vendor.instagramUrl.length > 0)
                ||
                (this.props.vendorReducer.vendor.twitterUrl && this.props.vendorReducer.vendor.twitterUrl.length > 0)
                ||
                (this.props.vendorReducer.vendor.linkedInUrl && this.props.vendorReducer.vendor.linkedInUrl.length > 0)
            ) {
                return (
                    <div style={{
                        borderRight: '1px solid rgba(0,0,0,0.4)',
                        display: 'inline-block',
                        height: '20px',
                        verticalAlign: 'middle'
                    }}>

                    </div>
                )
            }
        }

        if (type === 'facebook') {
            if (
                (this.props.vendorReducer.vendor.instagramUrl && this.props.vendorReducer.vendor.instagramUrl.length > 0)
                ||
                (this.props.vendorReducer.vendor.twitterUrl && this.props.vendorReducer.vendor.twitterUrl.length > 0)
                ||
                (this.props.vendorReducer.vendor.linkedInUrl && this.props.vendorReducer.vendor.linkedInUrl.length > 0)
            ) {
                return (
                    <div style={{
                        borderRight: '1px solid rgba(0,0,0,0.4)',
                        display: 'inline-block',
                        height: '20px',
                        verticalAlign: 'middle'
                    }}>

                    </div>
                )
            }
        }
        if (type === 'instagram') {
            if (
                (this.props.vendorReducer.vendor.twitterUrl && this.props.vendorReducer.vendor.twitterUrl.length > 0)
                ||
                (this.props.vendorReducer.vendor.linkedInUrl && this.props.vendorReducer.vendor.linkedInUrl.length > 0)
            ) {
                return (
                    <div style={{
                        borderRight: '1px solid rgba(0,0,0,0.4)',
                        display: 'inline-block',
                        height: '20px',
                        verticalAlign: 'middle'
                    }}>

                    </div>
                )
            }
        }
        if (type === 'twitter') {
            if (
                (this.props.vendorReducer.vendor.linkedInUrl && this.props.vendorReducer.vendor.linkedInUrl.length > 0)
            ) {
                return (
                    <div style={{
                        borderRight: '1px solid rgba(0,0,0,0.4)',
                        display: 'inline-block',
                        height: '20px',
                        verticalAlign: 'middle'
                    }}>

                    </div>
                )
            }
        }
    };

    renderExperienceDesktop = () => {
        if (this.props.vendorReducer.videos.length > 0 || this.props.vendorReducer.images.length > 0) {
            return (
                <div className="vendor-experiences">
                    <div className="vendor-experiences-container-tabs">
                        {this.props.vendorReducer.videos.length > 0 &&
                            <div style={{ overflow: 'auto', marginBottom: '30px' }}>
                                <span style={{
                                    float: 'left',
                                    fontWeight: '800',
                                    fontSize: '18px'
                                }}>Experiences</span>
                                {this.props.vendorReducer.videos.length === 3 &&
                                    <button style={{ float: 'right' }}
                                        onClick={() => this.toShowAllPage('experiences')}
                                        className="view-all-button">View All
                                    </button>
                                }
                            </div>
                        }
                        {this.props.vendorReducer.videos.length > 0 &&
                            <div ref={(section) => { this.video = section; }} style={{ overflow: 'auto' }}>
                                {this.props.vendorReducer.videos.map(this.mapExperience)}
                            </div>
                        }
                        {this.props.vendorReducer.images.length > 0 &&
                            <div style={{ marginTop: '20px', marginBottom: '50px' }}>
                                <div ref={(section) => { this.image = section; }} style={{ overflow: 'auto', marginBottom: '30px' }}>
                                    <span style={{
                                        float: 'left',
                                        fontWeight: '800',
                                        fontSize: '18px'
                                    }}>Images</span>
                                    {this.props.vendorReducer.images.length === 4 &&
                                        <button style={{ float: 'right' }}
                                            onClick={() => this.toShowAllPage('photos')}
                                            className="view-all-button">View All
                                        </button>
                                    }
                                </div>
                                {this.props.vendorReducer.images.map(this.mapGallery)}
                            </div>
                        }
                    </div>
                </div>
            );
        }
    };


    desktopUI = () => {
        if (!this.props.vendorReducer.loading && !_.isEmpty(this.props.vendorReducer.vendor)) {
            return (
                <div className="animated fadeIn"
                    style={{ minHeight: '100vh', backgroundColor: '#f3f3f3', overflow: 'auto' }}>
                    {this.renderMetaTags()}
                    <ReactModal
                        isOpen={this.state.reviewModal}
                        onRequestClose={this.closeModal}
                        style={desktopReviewModalStyle}
                    >
                        <AddReview match={this.props.match} rating={this.state.rating} closeModal={this.closeModal} />
                    </ReactModal>
                    {this.state.openLightBox && (
                        <Lightbox
                            imageCaption={`${this.state.photoIndex + 1} / ${this.state.images.length}`}
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
                    <div className="vendor-desktop-xyz-container">
                        <div id="cover-pic-vendor" style={{
                            backgroundImage: `linear-gradient(0deg,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(${imageTransformation(this.props.vendorReducer.vendor.coverPicture)})`,
                            height: '15rem',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            position: 'relative',
                            backgroundPosition: 'center',
                            cursor: 'pointer'
                        }}>
                            {this.props.vendorReducer.vendor.trusted && trustvardiCertifiedIcon('assured-icon')}
                            {this.props.vendorReducer.vendor.vendorType === 'product' &&
                                <span className="product-badge-vendor">Product Based</span>
                            }
                            {this.props.vendorReducer.vendor.vendorType === 'service' &&
                                <span className="service-badge-vendor">Service Based</span>
                            }
                            <img onClick={() => {
                                this.props.dispatch(asyncTogglePicture(this.props.vendorReducer.vendor.profilePicture))
                            }} className="vendor-profile-picture"
                                src={imageTransformation(this.props.vendorReducer.vendor.profilePicture, 180)} alt="" />
                            <div className="vendor-details">
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    className="vendor-name-page">
                                    <span
                                        style={{ verticalAlign: 'sub' }}>{this.props.vendorReducer.vendor.displayName}</span>
                                    {this.props.vendorReducer.vendor.isActive &&
                                        <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                                            <Rating rating={this.props.vendorReducer.vendor.rating} width={'75px'}
                                                fontSize={'14px'} />
                                        </div>
                                    }

                                    {!this.props.vendorReducer.vendor.isActive &&
                                        <div
                                            style={{
                                                background: 'rgb(89, 74, 165)',
                                                color: '#fff',
                                                fontSize: '12px',
                                                padding: '5px 10px',
                                                marginLeft: '10px'
                                            }}
                                        >Out of Service</div>
                                    }
                                </span>
                            </div>
                            {this.props.vendorReducer.vendor.isActive &&
                                <div style={{ position: 'absolute', bottom: '15px', right: '20px' }}>
                                    <span style={{
                                        marginRight: '5px',
                                        display: 'block',
                                        fontFamily: 'Avenir, sans-serif',
                                        color: 'white'
                                    }}>Rate {this.props.vendorReducer.vendor.displayName}</span>

                                    <div className="starPattern">
                                        <span style={{ paddingRight: '3px' }}
                                            onMouseEnter={() => this.onHover(0)}
                                            onMouseLeave={this.hoverOff}
                                            onClick={() => this.changeRating(0)}
                                        ><FaStar style={(this.state.hover && this.state.hoverRating >= 0) ? { color: colorCode[this.state.hoverRating] } : {}} /></span>

                                        <span style={{ paddingRight: '3px' }}
                                            onMouseEnter={() => this.onHover(1)}
                                            onMouseLeave={this.hoverOff}
                                            onClick={() => this.changeRating(1)}
                                        ><FaStar style={(this.state.hover && this.state.hoverRating >= 1) ? { color: colorCode[this.state.hoverRating] } : {}} /></span>

                                        <span style={{ paddingRight: '3px' }}
                                            onMouseEnter={() => this.onHover(2)}
                                            onMouseLeave={this.hoverOff}
                                            onClick={() => this.changeRating(2)}
                                        ><FaStar style={(this.state.hover && this.state.hoverRating >= 2) ? { color: colorCode[this.state.hoverRating] } : {}} /></span>

                                        <span style={{ paddingRight: '3px' }}
                                            onMouseEnter={() => this.onHover(3)}
                                            onMouseLeave={this.hoverOff}
                                            onClick={() => this.changeRating(3)}
                                        ><FaStar style={(this.state.hover && this.state.hoverRating >= 3) ? { color: colorCode[this.state.hoverRating] } : {}} /></span>

                                        <span
                                            onMouseEnter={() => this.onHover(4)}
                                            onMouseLeave={this.hoverOff}
                                            onClick={() => this.changeRating(4)}
                                        ><FaStar style={(this.state.hover && this.state.hoverRating >= 4) ? { color: colorCode[this.state.hoverRating] } : {}} /></span>
                                    </div>

                                </div>
                            }
                        </div>
                        <div className="vendor-basic-information-desktop">
                            <div className="vendor-basic-information-fame-desktop">
                                <span style={{ fontSize: '14px', width: '500px', wordBreak: 'break-word' }}>
                                    {this.props.vendorReducer.vendor.description}
                                </span>
                                {this.props.vendorReducer.vendor.isActive &&
                                    <div>
                                        <div style={{ marginTop: '20px' }}>
                                            <span>
                                                <span
                                                    className="vendor-review">{`${this.props.vendorReducer.vendor.reviewCount} `}
                                                    Reviews
                                    </span>
                                                <span
                                                    className="vendor-follower">{`${this.props.vendorReducer.vendor.followerCount} `}
                                                    Followers</span>
                                                {/*<span*/}
                                                {/*className="vendor-following">{`${this.props.vendorReducer.vendor.followingCount} `}*/}
                                                {/*Following</span>*/}
                                            </span>
                                        </div>
                                        <div style={{ marginTop: '30px' }}>
                                            {this.props.vendorReducer.vendor.isFollowing &&
                                                <span className="follow-vendor-page"
                                                    onClick={() => this.followUnFollowVendor(this.props.vendorReducer.vendor.username, false)}>Following</span>
                                            }
                                            {!this.props.vendorReducer.vendor.isFollowing &&
                                                <span className="follow-vendor-page"
                                                    onClick={() => this.followUnFollowVendor(this.props.vendorReducer.vendor.username, true)}>Follow</span>
                                            }
                                            {parseInt(this.props.vendorReducer.vendor.claimed) === 0 &&
                                                <span className="claim-profile-page" onClick={this.onClaimProfile}>Claim this Profile</span>
                                            }
                                            {this.props.vendorReducer.vendor.appUrl && this.props.vendorReducer.vendor.appUrl.length > 0 &&
                                                <span className="claim-profile-page" onClick={() => {
                                                    window.open(this.props.vendorReducer.vendor.appUrl, '_blank');
                                                }}>Download App</span>
                                            }
                                        </div>
                                        <div style={{ marginTop: '30px' }}>
                                            <span>
                                                {this.props.vendorReducer.vendor.website && this.props.vendorReducer.vendor.website.length > 0 &&
                                                    <FaLaptop style={{ height: '1.2rem', width: '1.2rem' }} />
                                                }
                                                {this.props.vendorReducer.vendor.website && this.props.vendorReducer.vendor.website.length > 0 &&
                                                    <span
                                                        onClick={() => {
                                                            window.open(this.props.vendorReducer.vendor.website, '_blank');
                                                        }}
                                                        className="visitwebsite"
                                                        style={{
                                                            fontSize: '14px',
                                                            marginLeft: '5px',
                                                            cursor: 'pointer'
                                                        }}>Visit Website</span>
                                                }
                                                {this.props.vendorReducer.vendor.email && this.props.vendorReducer.vendor.email.length > 0 &&
                                                    <MdEmail style={{
                                                        fontSize: '12px',
                                                        marginLeft: '15px',
                                                        height: '1.2rem',
                                                        width: '1.2rem'
                                                    }} />
                                                }
                                                {this.props.vendorReducer.vendor.email && this.props.vendorReducer.vendor.email.length > 0 &&
                                                    <span
                                                        // onClick={() => {
                                                        // window.open(`mailto:${this.props.vendorReducer.vendor.email}`, '_blank')
                                                        // console.log(this.props.vendorReducer.vendor)
                                                        // }} 
                                                        className="visitEmail"
                                                        style={{
                                                            fontSize: '14px',
                                                            marginLeft: '5px',
                                                        }}><Link to={{ pathname: `mailto:${this.props.vendorReducer.vendor.email}` }} rel="nofollow" target='_blank'>{this.props.vendorReducer.vendor.email}</Link></span>
                                                }
                                                {this.props.vendorReducer.vendor.customerContactPhoneNumber && this.props.vendorReducer.vendor.customerContactPhoneNumber.length > 0 &&
                                                    <FaPhone style={{
                                                        fontSize: '12px',
                                                        marginLeft: '15px',
                                                        height: '1.2rem',
                                                        width: '1.2rem'
                                                    }} />
                                                }
                                                {this.props.vendorReducer.vendor.customerContactPhoneNumber && this.props.vendorReducer.vendor.customerContactPhoneNumber.length > 0 &&
                                                    <span style={{
                                                        fontSize: '14px',
                                                        marginLeft: '5px'
                                                    }}>{this.props.vendorReducer.vendor.customerContactPhoneNumber}</span>
                                                }
                                            </span>
                                        </div>
                                        <div style={{ marginTop: '40px' }}>
                                            <span>
                                                {!this.props.vendorReducer.vendor.isLiked &&
                                                    <span className="like-vendor-desktop"
                                                        onClick={() => this.cardAction('like', true, this.props.vendorReducer.vendor._id)}>
                                                        <MdThumbUp style={{ marginRight: '10px' }} />
                                                        Like
                                    </span>
                                                }
                                                {this.props.vendorReducer.vendor.isLiked &&
                                                    <span className="like-vendor-desktop-active"
                                                        onClick={() => this.cardAction('like', false, this.props.vendorReducer.vendor._id)}>
                                                        <MdThumbUp style={{ marginRight: '10px' }} />
                                                        Liked
                                    </span>
                                                }
                                                <span className="share-vendor-desktop" onClick={() => {
                                                    this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/profile/${this.props.vendorReducer.vendor.username}`));
                                                }}>
                                                    <MdShare style={{ marginRight: '10px' }} />
                                                    Share
                                    </span>
                                                <span className="review-vendor-desktop" onClick={() => {
                                                    if (this.props.meReducer.isLoggedIn) {
                                                        this.setState({
                                                            reviewModal: true
                                                        });
                                                    } else {
                                                        this.props.dispatch(toggleLoginModal());
                                                    }
                                                }}>Write Review</span>
                                            </span>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="social-icons-vendor-desktop">
                                {this.props.vendorReducer.vendor.youtubeUrl &&
                                    <FaYoutubePlay alt="facebook"
                                        src="https://res.cloudinary.com/trustvardi/image/upload/v1530511353/icons/14-02.png"
                                        onClick={() => {
                                            window.open(this.props.vendorReducer.vendor.youtubeUrl, '_blank')
                                        }} className="social-icon-vendor-icons" />
                                }
                                {this.props.vendorReducer.vendor.youtubeUrl && this.props.vendorReducer.vendor.youtubeUrl.length > 0 && this.checkBar('youtube')}
                                {this.props.vendorReducer.vendor.pinterestUrl &&
                                    <FaPinterestP alt="facebook"
                                        src="https://res.cloudinary.com/trustvardi/image/upload/v1530511353/icons/14-02.png"
                                        onClick={() => {
                                            window.open(this.props.vendorReducer.vendor.pinterestUrl, '_blank')
                                        }} className="social-icon-vendor-icons" />
                                }
                                {this.props.vendorReducer.vendor.pinterestUrl && this.props.vendorReducer.vendor.pinterestUrl.length > 0 && this.checkBar('pinterest')}
                                {this.props.vendorReducer.vendor.facebookUrl &&
                                    <FaFacebook alt="facebook"
                                        src="https://res.cloudinary.com/trustvardi/image/upload/v1530511353/icons/14-02.png"
                                        onClick={() => {
                                            window.open(this.props.vendorReducer.vendor.facebookUrl, '_blank')
                                        }} className="social-icon-vendor-icons" />
                                }
                                {this.props.vendorReducer.vendor.facebookUrl && this.props.vendorReducer.vendor.facebookUrl.length > 0 && this.checkBar('facebook')}
                                {this.props.vendorReducer.vendor.instagramUrl &&
                                    <FaInstagram alt="instagram url"
                                        src="https://res.cloudinary.com/trustvardi/image/upload/v1530511360/icons/14-04.png"
                                        onClick={() => {
                                            window.open(this.props.vendorReducer.vendor.instagramUrl, '_blank')
                                        }} className="social-icon-vendor-icons" />
                                }
                                {this.props.vendorReducer.vendor.instagramUrl && this.props.vendorReducer.vendor.instagramUrl.length > 0 && this.checkBar('instagram')}
                                {this.props.vendorReducer.vendor.twitterUrl &&
                                    <FaTwitter alt="twitter"
                                        src="https://res.cloudinary.com/trustvardi/image/upload/v1530512522/icons/14-03_1.png"
                                        onClick={() => {
                                            window.open(this.props.vendorReducer.vendor.twitterUrl, '_blank')
                                        }} className="social-icon-vendor-icons" />
                                }
                                {this.props.vendorReducer.vendor.twitterUrl && this.props.vendorReducer.vendor.twitterUrl.length > 0 && this.checkBar('twitter')}
                                {this.props.vendorReducer.vendor.linkedInUrl &&
                                    <FaLinkedin
                                        src="https://res.cloudinary.com/trustvardi/image/upload/v1530511353/icons/14-05.png"
                                        alt="linkedin" onClick={() => {
                                            window.open(this.props.vendorReducer.vendor.linkedInUrl, '_blank')
                                        }} className="social-icon-vendor-icons" />
                                }
                            </div>
                            {this.props.vendorReducer.vendor.priceRange &&
                                <div style={{
                                    position: 'absolute',
                                    top: '70px',
                                    right: '20px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ overflow: 'auto', display: 'flex' }}>
                                        {rupeeSign((this.props.vendorReducer.vendor.priceRange >= 1) ? 'rupee-sign-desktop' : 'rupee-sign-desktop-inactive')}
                                        {rupeeSign((this.props.vendorReducer.vendor.priceRange >= 2) ? 'rupee-sign-desktop' : 'rupee-sign-desktop-inactive')}
                                        {rupeeSign((this.props.vendorReducer.vendor.priceRange >= 3) ? 'rupee-sign-desktop' : 'rupee-sign-desktop-inactive')}
                                    </span>
                                </div>
                            }
                        </div>
                        {this.props.vendorReducer.vendor.isActive &&
                            <div>
                                <div id="vendortabsholder">
                                    <div className="vendor-tabs-holder">
                                        <div className="vendor-tabs-div experience-vendor">
                                            {this.props.vendorReducer.videos.length > 0 &&
                                                <span style={{ width: '95%', marginLeft: '3px' }} className="vendor-tabs-div-span-active"
                                                    onClick={() => scrollToComponent(this.video, { duration: 500 })}
                                                >Experiences</span>
                                            }
                                            {this.props.vendorReducer.videos.length === 0 &&
                                                <span className="vendor-tabs-div-span"
                                                    style={{ color: '#d8d7d7', fontWeight: '600' }}>Experiences</span>
                                            }
                                            <span style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px' }}>|</span>
                                        </div>
                                        <div className="vendor-tabs-div gallery-vendor" style={{ left: '20%' }}>
                                            {this.props.vendorReducer.images.length > 0 &&
                                                <span style={{ width: '98%' }} className="vendor-tabs-div-span-active"
                                                    onClick={() => scrollToComponent(this.image, { duration: 500 })}
                                                >Gallery</span>
                                            }
                                            {this.props.vendorReducer.images.length === 0 &&
                                                <span className="vendor-tabs-div-span"
                                                    style={{ color: '#d8d7d7', fontWeight: '600' }}>Gallery</span>
                                            }
                                            <span style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px' }}>|</span>
                                        </div>
                                        <div className="vendor-tabs-div review-vendor" style={{ left: '40%' }}>
                                            {this.props.vendorReducer.reviews.length > 0 &&
                                                <span style={{ width: '98%' }} className="vendor-tabs-div-span-active"
                                                    onClick={() => scrollToComponent(this.review, { duration: 500 })}
                                                >Reviews</span>
                                            }
                                            {this.props.vendorReducer.reviews.length === 0 &&
                                                <span className="vendor-tabs-div-span"
                                                    style={{ color: '#d8d7d7', fontWeight: '600' }}>Reviews</span>
                                            }
                                            <span style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px' }}>|</span>
                                        </div>
                                        <div className="vendor-tabs-div product-vendor" style={{ left: '60%' }}>
                                            {this.props.vendorReducer.products.length > 0 &&
                                                <span style={{ width: '98%' }} className="vendor-tabs-div-span-active"
                                                    onClick={() => scrollToComponent(this.product, { duration: 500 })}
                                                >Products</span>
                                            }
                                            {this.props.vendorReducer.products.length === 0 &&
                                                <span className="vendor-tabs-div-span"
                                                    style={{ color: '#d8d7d7', fontWeight: '600' }}>Products</span>
                                            }
                                            <span style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px' }}>|</span>
                                        </div>
                                        <div className="vendor-tabs-div article-vendor" style={{ left: '80%' }}>
                                            {this.props.vendorReducer.articles.length > 0 &&
                                                <span style={{ width: '101%', marginLeft: '3px' }} className="vendor-tabs-div-span-active"
                                                    onClick={() => scrollToComponent(this.article, { duration: 500 })}
                                                >Articles</span>
                                            }
                                            {this.props.vendorReducer.articles.length === 0 &&
                                                <span className="vendor-tabs-div-span"
                                                    style={{ color: '#d8d7d7', fontWeight: '600' }}>Articles</span>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div id="vendor-more-information" className="vendor-detailed-information">
                                    <div className="vendor-detailed-text-information">
                                        <div className="vendor-detailed-text-information-holder">
                                            {this.props.vendorReducer.vendor.companyFeatures.length > 0 &&
                                                <div>
                                                    <p className="company-feature-label">Company Feature</p>
                                                    <span>
                                                        {this.props.vendorReducer.vendor.companyFeatures.map((value, i) => {
                                                            return (
                                                                <div style={{
                                                                    display: 'inline-block',
                                                                    marginRight: '15px',
                                                                    marginBottom: '5px'
                                                                }} key={i}>
                                                                    <MdCheckCircle className="icon-check-circle" />
                                                                    <span className="features-text"
                                                                        style={{ marginLeft: '5px' }}>{value}</span>
                                                                </div>
                                                            );
                                                        })
                                                        }
                                                    </span>
                                                </div>
                                            }
                                            <div style={{ marginTop: '30px' }}>
                                                <p style={{ fontWeight: '600' }}>Popular in Categories</p>
                                                <span style={{ overflow: 'auto', display: 'block' }}>
                                                    {this.props.vendorReducer.vendor.category.map((value, i) => {
                                                        if (categories[value]) {
                                                            return (
                                                                <div key={i} className="popular-categories-div">
                                                                    <Link to={{ pathname: `/category/${categories[value].key}` }} style={{ textDecoration: 'none' }} target='_blank'>
                                                                        <img alt=""
                                                                            src={categories[value] ? categories[value].icon : ''}
                                                                            className="popular-categories-div-icon" />
                                                                        <span
                                                                            className="popular-categories-div-text">{categories[value] ? categories[value].name : ''}</span>
                                                                    </Link>
                                                                </div>
                                                            );
                                                        }
                                                    })}
                                                </span>
                                            </div>
                                            {/* <div style={{ marginTop: '30px' }}>
                                    <p style={{ fontWeight: '600' }}>What People love About them</p>
                                    <span style={{ overflow: 'auto', display: 'block' }}>
                                        {this.props.vendorReducer.vendor.lovedCategories.map((value, i) => {
                                            return (
                                                <div key={i} className="popular-categories-div">
                                                    <img alt=""
                                                        src={collectionsObject[value] ? collectionsObject[value].icon : ''}
                                                        className="popular-categories-div-icon" />
                                                    <span
                                                        className="popular-categories-div-text">{collectionsObject[value] ? collectionsObject[value].name : value}</span>
                                                </div>
                                            );
                                        })}
                                    </span>
                                </div> */}
                                            <div style={{ marginTop: '30px' }}>
                                                <p style={{ fontWeight: '600' }}>Customer Experience</p>
                                                <div style={{ position: 'relative', height: '80px' }}>
                                                    <div
                                                        className={`c100 p${this.props.vendorReducer.vendor.customerExperience} small`}>
                                                        <span>{this.props.vendorReducer.vendor.customerExperience}%</span>
                                                        <div className="slice">
                                                            {this.props.vendorReducer.vendor.customerExperience < 40 &&
                                                                <div className="bar" style={{ border: '0.08em solid red' }}></div>
                                                            }
                                                            {this.props.vendorReducer.vendor.customerExperience > 40 &&
                                                                <div className="bar"></div>
                                                            }
                                                            <div className="fill"></div>
                                                        </div>
                                                    </div>
                                                    <p className="rating-positive-text">Positive Experience</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vendor-address-information">
                                        {this.props.vendorReducer.vendor.address.coordinates && this.props.vendorReducer.vendor.address.coordinates.coordinates && this.props.vendorReducer.vendor.address.coordinates.coordinates.length === 2 &&
                                            <div id="map" style={{ height: '250px' }}></div>
                                        }
                                        <div style={{ margin: '20px' }}>
                                            <p style={{ fontWeight: '900', marginBottom: '0' }}>
                                                Corporate Office
                                </p>
                                            <p style={{
                                                fontSize: '14px',
                                                width: '70%',
                                                marginBottom: '0',
                                                marginTop: '5px'
                                            }}>
                                                {this.props.vendorReducer.vendor.address.address}
                                            </p>
                                            <p onClick={() => {
                                                const url = `https://www.google.com/maps?z=12&t=m&q=loc:${this.props.vendorReducer.vendor.address.coordinates.coordinates[0]}+${this.props.vendorReducer.vendor.address.coordinates.coordinates[1]}`;
                                                window.open(url, '_blank');
                                            }} className="getDirection" style={{ color: '#ff9f00', fontSize: '12px', cursor: 'pointer' }}>
                                                Get Directions
                                </p>
                                            {this.props.vendorReducer.vendor.timings &&
                                                <p style={{ fontWeight: '900', margin: '10px 0 0 0' }}>
                                                    Timings
                                </p>
                                            }
                                            {this.props.vendorReducer.vendor.timings !== '00:00 am - 00:00 am' &&
                                                <p style={{
                                                    fontSize: '14px',
                                                    width: '70%',
                                                    marginBottom: '0',
                                                    marginTop: '5px'
                                                }}>
                                                    {this.props.vendorReducer.vendor.timings}
                                                </p>
                                            }
                                            {this.props.vendorReducer.vendor.timings === '00:00 am - 00:00 am' &&
                                                <p style={{
                                                    fontSize: '14px',
                                                    width: '70%',
                                                    marginBottom: '0',
                                                    marginTop: '5px'
                                                }}>
                                                    Always Available
                                </p>
                                            }
                                            {this.props.vendorReducer.vendor.contactPhoneNumber &&
                                                <p style={{ fontWeight: '900', marginBottom: '0' }}>
                                                    Call
                                </p>
                                            }
                                            {this.props.vendorReducer.vendor.contactPhoneNumber &&
                                                <p style={{
                                                    fontSize: '14px',
                                                    width: '70%',
                                                    marginBottom: '0',
                                                    marginTop: '5px'
                                                }}>
                                                    {this.props.vendorReducer.vendor.contactPhoneNumber}
                                                </p>
                                            }
                                            {this.props.vendorReducer.vendor.closedDays && this.props.vendorReducer.vendor.closedDays.length > 0 &&
                                                <p style={{ fontWeight: '900', marginBottom: '0' }}>
                                                    Closed Days
                                </p>
                                            }
                                            {this.props.vendorReducer.vendor.closedDays && this.props.vendorReducer.vendor.closedDays.length > 0 &&
                                                <p style={{
                                                    fontSize: '14px',
                                                    width: '70%',
                                                    marginBottom: '0',
                                                    marginTop: '5px'
                                                }}>
                                                    {_.map(this.props.vendorReducer.vendor.closedDays, (value, index) => {
                                                        return value
                                                    }).join(',')}
                                                </p>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {!this.props.vendorReducer.loadingDetail &&
                                    <div>
                                        <div>
                                            {this.renderExperienceDesktop()}
                                        </div>

                                        <div>
                                            <div className="vendor-review">
                                                <div ref={(section) => { this.review = section; }} className="vendor-review-container-tabs ">
                                                    <div style={{ overflow: 'auto', marginBottom: '30px' }}>
                                                        <span style={{
                                                            float: 'left',
                                                            fontWeight: '800',
                                                            fontSize: '18px'
                                                        }}>Reviews</span>
                                                        {/*<button style={{float: 'right'}} className="view-all-button">View All*/}
                                                        {/*</button>*/}
                                                    </div>
                                                    <div onClick={() => {
                                                        if (this.props.meReducer.isLoggedIn) {
                                                            this.setState({
                                                                reviewModal: true
                                                            });
                                                        } else {
                                                            this.props.dispatch(toggleLoginModal());
                                                        }
                                                    }} style={{
                                                        backgroundColor: '#f8f8f9',
                                                        height: '3rem',
                                                        position: 'relative',
                                                        width: '80%'
                                                    }}>
                                                        <span
                                                            className="write-review-label">Write your own reviews & help our users</span>
                                                        <span className="write-review-button">Write a Review</span>
                                                    </div>
                                                    {this.props.vendorReducer.reviews.length > 0 ?
                                                        <div>
                                                            {this.props.vendorReducer.reviews.map((card, i) => {
                                                                return (
                                                                    <ReviewComment history={this.props.history} key={i}
                                                                        match={this.props.match} card={card} />
                                                                );
                                                            })}
                                                        </div>
                                                        :
                                                        <div style={{ height: '6rem', position: 'relative' }}>
                                                            <span style={{
                                                                position: 'absolute',
                                                                top: '50%',
                                                                left: '50%',
                                                                transform: 'translate(-50%, -50%)',
                                                                fontSize: '18px',
                                                                fontWeight: '500',
                                                                textAlign: 'center'
                                                            }}>Be the first one to review.
                                    <button className="Write-a-review" onClick={() => {
                                                                    if (this.props.meReducer.isLoggedIn) {
                                                                        this.setState({
                                                                            reviewModal: true
                                                                        });
                                                                    } else {
                                                                        this.props.dispatch(toggleLoginModal());
                                                                    }
                                                                }}>Write a review</button>
                                                            </span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {this.props.vendorReducer.products.length > 0 &&
                                            <div>
                                                <div ref={(section) => { this.product = section; }} className="vendor-product">
                                                    <div className="vendor-product-container">
                                                        <div style={{ overflow: 'auto', marginBottom: '30px' }}>
                                                            <span style={{
                                                                float: 'left',
                                                                fontWeight: '800',
                                                                fontSize: '18px',
                                                                marginLeft: '15px'
                                                            }}>Have you tried these out, yet?</span>
                                                            {this.props.vendorReducer.products.length === 3 &&
                                                                <button style={{ float: 'right' }} className="view-all-button"
                                                                    onClick={this.goToAllProductsPage}>View All
                                        </button>
                                                            }
                                                        </div>
                                                        <div>
                                                            {this.props.vendorReducer.products.map((card, i) => {
                                                                return (
                                                                    <ProductCard key={i} match={this.props.match}
                                                                        history={this.props.history} card={card} />
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {this.props.vendorReducer.articles.length > 0 &&
                                            <div>
                                                <div ref={(section) => { this.article = section; }} className="vendor-article">
                                                    <div className="vendor-article-container">
                                                        <div style={{ overflow: 'auto', marginBottom: '30px' }}>
                                                            <span style={{
                                                                float: 'left',
                                                                fontWeight: '800',
                                                                fontSize: '18px',
                                                                marginLeft: '15px'
                                                            }}>Read More...</span>
                                                            {this.props.vendorReducer.articles.length === 3 &&
                                                                <button onClick={() => this.toShowAllPage('articles')}
                                                                    style={{ float: 'right' }}
                                                                    className="view-all-button">View All
                                        </button>
                                                            }
                                                        </div>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                            {this.props.vendorReducer.articles.map((card, i) => {
                                                                return (
                                                                    <BlogCard history={this.props.history} key={i} card={card} />
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {!this.props.vendorReducer.loadingSimilarVendors && this.props.vendorReducer.similarVendors.length > 0 &&
                                            <div>
                                                <div className="vendor-article">
                                                    <div className="vendor-article-container">
                                                        <div style={{ overflow: 'auto', marginBottom: '30px' }}>
                                                            <span style={{
                                                                float: 'left',
                                                                fontWeight: '800',
                                                                fontSize: '18px',
                                                                marginLeft: '15px'
                                                            }}>Similar Brands</span>
                                                        </div>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                            {this.props.vendorReducer.similarVendors.map((card, i) => {
                                                                return (
                                                                    <TrendingCard match={this.props.match} history={this.props.history} key={i} card={card} />
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {this.props.vendorReducer.loadingSimilarVendors &&
                                            <div style={{ height: '30vh', width: '100%', position: 'relative' }}>
                                                <img alt="" className="vendor-loader-desktop" src={loader} />
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        }
                        {this.props.vendorReducer.loadingDetail &&
                            <div style={{ height: '30vh', width: '100%', position: 'relative' }}>
                                <img alt="" className="vendor-loader-desktop" src={loader} />
                            </div>
                        }
                        {/*<iframe title="TrustVardi Widget" src={`https://trustvardiapi.com/web/widget/getRating/5ac13d17f29c1b7a398b823d/light`} height="80px" frameBorder="0" allowtopnavigation="true"></iframe>*/}
                    </div>
                </div>
            );
        } else if (this.props.vendorReducer.loading) {
            return (
                <div className="vendor-loader-container-desktop">
                    <img alt="" className="vendor-loader-desktop" src={loader} />
                </div>
            )
        } else if (!this.props.vendorReducer.loading && _.isEmpty(this.props.vendorReducer.vendor)) {
            return (
                <div className="vendor-loader-container-desktop">
                    <NotFound />
                </div>
            )
        }
    };

    mobileUI = () => {
        if (this.props.vendorReducer.loading) {
            return (
                <div className="vendor-loader-container-desktop">
                    <img alt="" className="vendor-loader-desktop" src={loader} />
                </div>
            )
        }
        else if (_.isEmpty(this.props.vendorReducer.vendor) && !this.props.vendorReducer.vendor.loading) {
            return (
                <div className="vendor-loader-container-desktop">
                    <NotFound />
                </div>
            );
        } else {
            return (
                <div className="animated fadeIn"
                    style={{ minHeight: '100vh', backgroundColor: '#fafafa', overflow: 'auto' }}>
                    {this.renderMetaTags()}
                    <ReactModal
                        isOpen={this.state.reviewModal}
                        onRequestClose={this.closeModal}
                        style={mobileReviewModalStyle}>
                        <AddReview match={this.props.match} rating={this.state.rating} closeModal={this.closeModal} />
                    </ReactModal>
                    {this.state.openLightBox && (
                        <Lightbox
                            imageCaption={`${this.state.photoIndex + 1} / ${this.state.images.length}`}
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
                    <div style={{ margin: '3.5rem 0' }}>
                        <div id="cover-pic-vendor" style={{
                            background: `linear-gradient(0deg,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(${imageTransformation(this.props.vendorReducer.vendor.coverPicture)})`,
                            height: '12rem',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            position: 'relative'
                        }}>
                            {trustvardiCertifiedIcon('assured-icon-mobile')}
                            {this.props.vendorReducer.vendor.vendorType === 'product' &&
                                <span className="product-badge-vendor-mobile">Product</span>
                            }
                            {this.props.vendorReducer.vendor.vendorType === 'service' &&
                                <span className="service-badge-vendor-mobile">Service</span>
                            }
                            <img onClick={() => {
                                this.props.dispatch(asyncTogglePicture(this.props.vendorReducer.vendor.profilePicture));
                            }} className="vendor-profile-picture-mobile"
                                src={imageTransformation(this.props.vendorReducer.vendor.profilePicture, 180)} alt="" />
                            {this.props.vendorReducer.vendor.isActive &&
                                <div style={{ marginBottom: '10px', position: 'absolute', bottom: '25px', right: '20px' }}>
                                    <div style={{ display: 'inline-block' }}>
                                        <Rating rating={this.props.vendorReducer.vendor.rating} width={'75px'}
                                            fontSize={'14px'} />
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="vendor-basic-information-mobile">
                            <div className="vendor-details-mobile">
                                <span
                                    className="vendor-name-page-mobile">{this.props.vendorReducer.vendor.displayName}</span>
                                {!this.props.vendorReducer.vendor.isActive &&
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            backgroundColor: 'rgb(89, 74, 165)',
                                            color: 'white',
                                            fontSize: '12px',
                                            padding: '5px 10px',
                                            marginBottom: '10px'
                                        }}>
                                        Out Of Service
                            </div>
                                }
                                {this.props.vendorReducer.vendor.priceRange &&
                                    <div style={{
                                        marginBottom: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span style={{ overflow: 'auto', display: 'flex' }}>
                                            {rupeeSign((this.props.vendorReducer.vendor.priceRange >= 1) ? 'rupee-sign' : 'rupee-sign-inactive')}
                                            {rupeeSign((this.props.vendorReducer.vendor.priceRange >= 2) ? 'rupee-sign' : 'rupee-sign-inactive')}
                                            {rupeeSign((this.props.vendorReducer.vendor.priceRange >= 3) ? 'rupee-sign' : 'rupee-sign-inactive')}
                                        </span>
                                    </div>
                                }
                                <div className="social-icons-vendor-mobile">
                                    {this.props.vendorReducer.vendor.facebookUrl &&
                                        <FaFacebook alt="facebook"
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1530511353/icons/14-02.png"
                                            onClick={() => {
                                                window.open(this.props.vendorReducer.vendor.facebookUrl, '_blank')
                                            }} className="social-icon-vendor-icons-mobile" />
                                    }
                                    {this.props.vendorReducer.vendor.instagramUrl &&
                                        <FaInstagram alt="instagram url"
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1530511360/icons/14-04.png"
                                            onClick={() => {
                                                window.open(this.props.vendorReducer.vendor.instagramUrl, '_blank')
                                            }} className="social-icon-vendor-icons-mobile" />
                                    }
                                    {this.props.vendorReducer.vendor.twitterUrl &&
                                        <FaTwitter alt="twitter"
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1530512522/icons/14-03_1.png"
                                            onClick={() => {
                                                window.open(this.props.vendorReducer.vendor.twitterUrl, '_blank')
                                            }} className="social-icon-vendor-icons-mobile" />
                                    }
                                    {this.props.vendorReducer.vendor.linkedInUrl &&
                                        <FaLinkedin
                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1530511353/icons/14-05.png"
                                            alt="linkedin" onClick={() => {
                                                window.open(this.props.vendorReducer.vendor.linkedInUrl, '_blank')
                                            }} className="social-icon-vendor-icons-mobile" />
                                    }
                                </div>
                                {this.props.vendorReducer.vendor.isActive &&
                                    <div>
                                        <div style={{
                                            height: '3rem',
                                            borderBottom: '1px solid #e7ecf3',
                                            borderTop: '1px solid #e7ecf3',
                                            overflow: 'hidden'
                                        }}>
                                            <span className="vendor-advance-detail-mobile">
                                                <div className="vendor-advance-detail-mobile-more">
                                                    <span
                                                        className="vendor-advance-detail-number-mobile">{this.props.vendorReducer.vendor.reviewCount}</span>
                                                    <span className="vendor-advance-detail-type-mobile">Reviews</span>
                                                </div>
                                            </span>
                                            <span className="vendor-advance-detail-mobile">
                                                <div className="vendor-advance-detail-mobile-more">
                                                    <span
                                                        className="vendor-advance-detail-number-mobile">{this.props.vendorReducer.vendor.followerCount}</span>
                                                    <span className="vendor-advance-detail-type-mobile">Followers</span>
                                                </div>
                                            </span>
                                            {/*<span className="vendor-advance-detail-mobile">*/}
                                            {/*<div className="vendor-advance-detail-mobile-more">*/}
                                            {/*<span*/}
                                            {/*className="vendor-advance-detail-number-mobile">{this.props.vendorReducer.vendor.followingCount}</span>*/}
                                            {/*<span className="vendor-advance-detail-type-mobile">Following</span>*/}
                                            {/*</div>*/}
                                            {/*</span>*/}
                                        </div>
                                        <div style={{ margin: '20px 0 10px 0' }}>
                                            <span style={{
                                                marginRight: '5px',
                                                display: 'block',
                                                fontFamily: 'Avenir, sans-serif',
                                                color: '#2c3249'
                                            }}>Rate {this.props.vendorReducer.vendor.displayName}</span>
                                            <Ratings
                                                rating={this.state.rating}
                                                changeRating={this.changeRating}
                                                name='rating'
                                                widgetSpacings="3px"
                                            >
                                                <Ratings.Widget
                                                    svgIconPath="m38.6 14.4q0 0.5-0.5 1.1l-8.1 7.9 1.9 11.2q0 0.1 0 0.4 0 0.5-0.2 0.8t-0.7 0.3q-0.4 0-0.9-0.2l-10-5.3-10 5.3q-0.5 0.2-0.9 0.2-0.5 0-0.7-0.3t-0.3-0.8q0-0.1 0.1-0.4l1.9-11.2-8.1-7.9q-0.6-0.6-0.6-1.1 0-0.8 1.3-1l11.2-1.6 5-10.2q0.4-0.9 1.1-0.9t1.1 0.9l5 10.2 11.2 1.6q1.2 0.2 1.2 1z"
                                                    widgetDimension="25px" widgetRatedColor={'#cbcbcb'}
                                                    widgetEmptyColor="#cbcbcb" widgetHoverColor="#cbcbcb" />
                                                <Ratings.Widget
                                                    svgIconPath="m38.6 14.4q0 0.5-0.5 1.1l-8.1 7.9 1.9 11.2q0 0.1 0 0.4 0 0.5-0.2 0.8t-0.7 0.3q-0.4 0-0.9-0.2l-10-5.3-10 5.3q-0.5 0.2-0.9 0.2-0.5 0-0.7-0.3t-0.3-0.8q0-0.1 0.1-0.4l1.9-11.2-8.1-7.9q-0.6-0.6-0.6-1.1 0-0.8 1.3-1l11.2-1.6 5-10.2q0.4-0.9 1.1-0.9t1.1 0.9l5 10.2 11.2 1.6q1.2 0.2 1.2 1z"
                                                    widgetDimension="25px" widgetRatedColor={'#cbcbcb'}
                                                    widgetEmptyColor="#cbcbcb" widgetHoverColor="#cbcbcb" />
                                                <Ratings.Widget
                                                    svgIconPath="m38.6 14.4q0 0.5-0.5 1.1l-8.1 7.9 1.9 11.2q0 0.1 0 0.4 0 0.5-0.2 0.8t-0.7 0.3q-0.4 0-0.9-0.2l-10-5.3-10 5.3q-0.5 0.2-0.9 0.2-0.5 0-0.7-0.3t-0.3-0.8q0-0.1 0.1-0.4l1.9-11.2-8.1-7.9q-0.6-0.6-0.6-1.1 0-0.8 1.3-1l11.2-1.6 5-10.2q0.4-0.9 1.1-0.9t1.1 0.9l5 10.2 11.2 1.6q1.2 0.2 1.2 1z"
                                                    widgetDimension="25px" widgetRatedColor={'#cbcbcb'}
                                                    widgetEmptyColor="#cbcbcb" widgetHoverColor="#cbcbcb" />
                                                <Ratings.Widget
                                                    svgIconPath="m38.6 14.4q0 0.5-0.5 1.1l-8.1 7.9 1.9 11.2q0 0.1 0 0.4 0 0.5-0.2 0.8t-0.7 0.3q-0.4 0-0.9-0.2l-10-5.3-10 5.3q-0.5 0.2-0.9 0.2-0.5 0-0.7-0.3t-0.3-0.8q0-0.1 0.1-0.4l1.9-11.2-8.1-7.9q-0.6-0.6-0.6-1.1 0-0.8 1.3-1l11.2-1.6 5-10.2q0.4-0.9 1.1-0.9t1.1 0.9l5 10.2 11.2 1.6q1.2 0.2 1.2 1z"
                                                    widgetDimension="25px" widgetRatedColor={'#cbcbcb'}
                                                    widgetEmptyColor="#cbcbcb" widgetHoverColor="#cbcbcb" />
                                                <Ratings.Widget
                                                    svgIconPath="m38.6 14.4q0 0.5-0.5 1.1l-8.1 7.9 1.9 11.2q0 0.1 0 0.4 0 0.5-0.2 0.8t-0.7 0.3q-0.4 0-0.9-0.2l-10-5.3-10 5.3q-0.5 0.2-0.9 0.2-0.5 0-0.7-0.3t-0.3-0.8q0-0.1 0.1-0.4l1.9-11.2-8.1-7.9q-0.6-0.6-0.6-1.1 0-0.8 1.3-1l11.2-1.6 5-10.2q0.4-0.9 1.1-0.9t1.1 0.9l5 10.2 11.2 1.6q1.2 0.2 1.2 1z"
                                                    widgetDimension="25px" widgetRatedColor={'#cbcbcb'}
                                                    widgetEmptyColor="#cbcbcb" widgetHoverColor="#cbcbcb" />
                                            </Ratings>
                                        </div>
                                        <div className="vendor-follow-claim-button-mobile">
                                            <div className="vendor-follow-claim-button-mobile-container">
                                                {!this.props.vendorReducer.vendor.isFollowing &&
                                                    <button className="vendor-follow-button-mobile"
                                                        onClick={() => this.followUnFollowVendor(this.props.vendorReducer.vendor.username, true)}>
                                                        Follow</button>
                                                }
                                                {this.props.vendorReducer.vendor.isFollowing &&
                                                    <button className="vendor-follow-button-mobile"
                                                        onClick={() => this.followUnFollowVendor(this.props.vendorReducer.vendor.username, false)}>
                                                        Following</button>
                                                }
                                            </div>
                                            <div className="vendor-follow-claim-button-mobile-container">
                                                {parseInt(this.props.vendorReducer.vendor.claimed) === 0 &&
                                                    <button className="vendor-claim-button-mobile" onClick={this.onClaimProfile}>
                                                        Claim profile
                                    </button>
                                                }
                                                {this.props.vendorReducer.vendor.appUrl && this.props.vendorReducer.vendor.appUrl.length > 0 &&
                                                    <button className="vendor-claim-button-mobile" onClick={() => {
                                                        window.open(this.props.vendorReducer.vendor.appUrl, '_blank');
                                                    }}>
                                                        Download App
                                    </button>
                                                }
                                            </div>
                                        </div>
                                        <div className="vendor-action-mobile">
                                            <div className="like-vendor-mobile">
                                                {!this.props.vendorReducer.vendor.isLiked &&
                                                    <span className="action-vendor-mobile-container"
                                                        onClick={() => this.cardAction('like', true, this.props.vendorReducer.vendor._id)}>
                                                        <MdThumbUp
                                                            style={{ fill: '#2c3249', marginRight: '10px', opacity: '0.42' }} />
                                                        Like
                                        </span>
                                                }
                                                {this.props.vendorReducer.vendor.isLiked &&
                                                    <span style={{ color: 'rgb(255, 159, 0)' }}
                                                        className="action-vendor-mobile-container"
                                                        onClick={() => this.cardAction('like', false, this.props.vendorReducer.vendor._id)}>
                                                        <MdThumbUp
                                                            style={{ fill: '#ff9f00', marginRight: '10px' }} />
                                                        Liked
                                        </span>
                                                }
                                            </div>
                                            <div className="share-vendor-mobile">
                                                <span onClick={() => {
                                                    this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/profile/${this.props.vendorReducer.vendor.username}`));
                                                }} className="action-vendor-mobile-container">
                                                    <MdShare
                                                        style={{ fill: '#2c3249', marginRight: '10px', opacity: '0.42' }} />
                                                    Share
                                        </span>
                                            </div>
                                            <div className="review-vendor-mobile">
                                                <span className="action-vendor-mobile-container"
                                                    style={{ width: '100%!important' }}
                                                    onClick={() => {
                                                        if (this.props.meReducer.isLoggedIn) {
                                                            this.setState({
                                                                reviewModal: true
                                                            })
                                                        } else {
                                                            this.props.dispatch(toggleLoginModal());
                                                        }
                                                    }}
                                                >
                                                    Write Review
                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        {this.props.vendorReducer.vendor.isActive &&
                            <div>
                                <div className="vendor-detailed-text-information">
                                    <div className="vendor-detailed-text-information-holder">
                                        <div>
                                            <p style={{ marginTop: '10px' }} className="company-feature-label">Description</p>
                                            <span style={{
                                                fontSize: '14px',
                                                wordBreak: 'break-word'
                                            }}>{this.props.vendorReducer.vendor.description}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="vendor-detailed-text-information">
                                    <div className="vendor-detailed-text-information-holder">
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            <p style={{ marginTop: '1px' }} className="company-feature-label">Feature</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                                                {this.props.vendorReducer.vendor.companyFeatures.map((value, i) => {
                                                    return (
                                                        <span key={i} className="company-feature-mobile">
                                                            <MdCheckCircle className="icon-check-circle" />
                                                            <span className="features-text"
                                                                style={{ marginLeft: '5px' }}>{value}</span>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '10px' }}>
                                            <p style={{ fontWeight: '600' }}>Popular in Categories</p>
                                            <span style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {this.props.vendorReducer.vendor.category.map((value, i) => {
                                                    if (categories[value]) {
                                                        return (
                                                            <div key={i} className="popular-categories-div">
                                                                <Link to={{ pathname: `/category/${categories[value].key}` }} style={{ textDecoration: 'none' }}>
                                                                    <img alt=""
                                                                        src={categories[value] ? categories[value].icon : ''}
                                                                        className="popular-categories-div-icon-mobile" />
                                                                    <span
                                                                        className="popular-categories-div-text">{categories[value] ? categories[value].name : ''}</span>
                                                                </Link>
                                                            </div>
                                                        );
                                                    }
                                                })}
                                            </span>
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '600' }}>Customer Experience</p>
                                            <div style={{ position: 'relative', height: '100px' }}>
                                                <div
                                                    className={`c100 p${this.props.vendorReducer.vendor.customerExperience} small`}>
                                                    <span>{this.props.vendorReducer.vendor.customerExperience}%</span>
                                                    <div className="slice">
                                                        {this.props.vendorReducer.vendor.customerExperience < 40 &&
                                                            <div className="bar" style={{ border: '0.08em solid red' }}></div>
                                                        }
                                                        {this.props.vendorReducer.vendor.customerExperience > 40 &&
                                                            <div className="bar"></div>
                                                        }
                                                        <div className="fill"></div>
                                                    </div>
                                                </div>
                                                <p className="rating-positive-text">Positive Experience</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vendor-address-information">
                                    {this.props.vendorReducer.vendor.address.address && this.props.vendorReducer.vendor.address.address.length > 0 && this.props.vendorReducer.vendor.address.coordinates && this.props.vendorReducer.vendor.address.coordinates.coordinates && this.props.vendorReducer.vendor.address.coordinates.coordinates.length === 2 &&
                                        <div id="map" style={{ height: '250px', width: '100%' }}></div>
                                    }
                                    <div style={{ margin: '20px', display: 'flex', flexWrap: 'wrap' }}>
                                        {this.props.vendorReducer.vendor.address.address && this.props.vendorReducer.vendor.address.address.length > 0 && this.props.vendorReducer.vendor.address.coordinates.coordinates && this.props.vendorReducer.vendor.address.coordinates.coordinates.length > 0 &&
                                            <p style={{ fontWeight: '900', display: 'inline-block', width: '40%', fontSize: '14px' }}>
                                                Corporate Office
                        </p>
                                        }
                                        {this.props.vendorReducer.vendor.address.address && this.props.vendorReducer.vendor.address.address.length > 0 && this.props.vendorReducer.vendor.address.coordinates.coordinates && this.props.vendorReducer.vendor.address.coordinates.coordinates.length > 0 &&
                                            <div style={{
                                                width: '55%',
                                                marginBottom: '0',
                                                display: 'inline-block',
                                                marginLeft: '5%'
                                            }}>
                                                <p style={{
                                                    fontSize: '14px',
                                                    marginBottom: '0'
                                                }}>{this.props.vendorReducer.vendor.address.address}</p>
                                                {this.props.vendorReducer.vendor.address.address && this.props.vendorReducer.vendor.address.address.length > 0 && this.props.vendorReducer.vendor.address.coordinates.coordinates && this.props.vendorReducer.vendor.address.coordinates.coordinates.length > 0 &&
                                                    <p onClick={() => {
                                                        const url = `https://www.google.com/maps?z=12&t=m&q=loc:${this.props.vendorReducer.vendor.address.coordinates.coordinates[0]}+${this.props.vendorReducer.vendor.address.coordinates.coordinates[1]}`;
                                                        window.open(url, '_blank');
                                                    }} style={{ color: '#ff9f00', fontSize: '12px', marginTop: '5px' }}>
                                                        Get Directions
                            </p>
                                                }
                                            </div>
                                        }

                                        {this.props.vendorReducer.vendor.timings && this.props.vendorReducer.vendor.timings.length > 0 &&
                                            <p style={{
                                                fontWeight: '900',
                                                margin: '0 0',
                                                width: '40%',
                                                fontSize: '14px',
                                                marginBottom: '10px'
                                            }}>
                                                Timings
                            </p>
                                        }
                                        {this.props.vendorReducer.vendor.timings && this.props.vendorReducer.vendor.timings.length > 0 &&
                                            this.props.vendorReducer.vendor.timings !== '00:00 am - 00:00 am' &&
                                            <p style={{
                                                fontSize: '14px',
                                                width: '55%',
                                                marginLeft: '5%',
                                                marginBottom: '0',
                                                marginTop: '0'
                                            }}>
                                                {this.props.vendorReducer.vendor.timings}
                                            </p>
                                        }
                                        {this.props.vendorReducer.vendor.timings && this.props.vendorReducer.vendor.timings.length > 0 &&
                                            this.props.vendorReducer.vendor.timings === '00:00 am - 00:00 am' &&
                                            <p style={{
                                                fontSize: '14px',
                                                width: '55%',
                                                marginLeft: '5%',
                                                marginBottom: '0',
                                                marginTop: '0'
                                            }}>
                                                Always Available
                            </p>
                                        }
                                        {this.props.vendorReducer.vendor.contactPhoneNumber && this.props.vendorReducer.vendor.contactPhoneNumber.length > 0 &&
                                            <p style={{ fontWeight: '900', width: '40%', fontSize: '14px', marginTop: '0' }}>
                                                Call
                            </p>
                                        }
                                        {this.props.vendorReducer.vendor.contactPhoneNumber && this.props.vendorReducer.vendor.contactPhoneNumber.length > 0 &&
                                            <p style={{
                                                fontSize: '14px',
                                                width: '55%',
                                                marginLeft: '5%',
                                                marginBottom: '0',
                                                marginTop: '0'
                                            }}>
                                                {this.props.vendorReducer.vendor.contactPhoneNumber}
                                            </p>
                                        }
                                        {this.props.vendorReducer.vendor.customerContactPhoneNumber && this.props.vendorReducer.vendor.customerContactPhoneNumber.length > 0 &&
                                            <p style={{ fontWeight: '900', width: '40%', marginTop: '0', fontSize: '14px' }}>
                                                Customer care
                            </p>
                                        }
                                        {this.props.vendorReducer.vendor.customerContactPhoneNumber && this.props.vendorReducer.vendor.customerContactPhoneNumber.length > 0 &&
                                            <p style={{
                                                fontSize: '14px',
                                                width: '55%',
                                                marginBottom: '0',
                                                marginTop: '0',
                                                marginLeft: '5%'
                                            }}>
                                                {this.props.vendorReducer.vendor.customerContactPhoneNumber}
                                            </p>
                                        }
                                        {this.props.vendorReducer.vendor.website && this.props.vendorReducer.vendor.website.length > 0 &&
                                            <p style={{ fontWeight: '900', fontSize: '14px', width: '40%', marginTop: '0' }}>
                                                Website
                            </p>
                                        }
                                        {this.props.vendorReducer.vendor.website && this.props.vendorReducer.vendor.website.length > 0 &&
                                            <p onClick={() => {
                                                window.open(this.props.vendorReducer.vendor.website, '_blank')
                                            }} style={{
                                                fontSize: '14px',
                                                width: '55%',
                                                marginBottom: '0',
                                                color: 'rgb(255, 159, 0)',
                                                marginLeft: '5%',
                                                marginTop: '0'
                                            }}>
                                                Visit Website
                            </p>
                                        }
                                        {this.props.vendorReducer.vendor.closedDays && this.props.vendorReducer.vendor.closedDays.length > 0 &&
                                            <p style={{ fontWeight: '900', fontSize: '14px', width: '40%', marginTop: '0' }}>
                                                Closed Days
                                </p>
                                        }
                                        {this.props.vendorReducer.vendor.closedDays && this.props.vendorReducer.vendor.closedDays.length > 0 &&
                                            <p style={{
                                                fontSize: '14px',
                                                width: '55%',
                                                marginBottom: '0',
                                                marginTop: '0',
                                                marginLeft: '5%'
                                            }}>
                                                {_.map(this.props.vendorReducer.vendor.closedDays, (value, index) => {
                                                    return value
                                                }).join(',')}
                                            </p>
                                        }
                                        {this.props.vendorReducer.vendor.email && this.props.vendorReducer.vendor.email.length > 0 &&
                                            <p style={{ fontWeight: '900', fontSize: '14px', width: '40%', marginTop: '0' }}>
                                                Email
                            </p>
                                        }
                                        {this.props.vendorReducer.vendor.email && this.props.vendorReducer.vendor.email.length > 0 &&
                                            <p style={{
                                                fontSize: '14px',
                                                width: '55%',
                                                marginBottom: '0',
                                                marginLeft: '5%',
                                                marginTop: '0'
                                            }}>
                                                {this.props.vendorReducer.vendor.email}
                                            </p>
                                        }
                                    </div>
                                </div>
                                {!this.props.vendorReducer.loadingDetail &&
                                    <div className="vendor-cards-mobile">
                                        {this.props.vendorReducer.videos.length > 0 &&
                                            <section className="border-shadow">
                                                <div style={{ margin: '10px', overflow: 'auto' }}>
                                                    <span
                                                        style={{ float: 'left', fontSize: '18px', fontWeight: '800' }}>Experiences</span>
                                                    {this.props.vendorReducer.videos.length > 2 &&
                                                        <span onClick={() => this.toShowAllPage('experiences')}
                                                            style={{ float: 'right', fontSize: '12px', color: '#ff9f00' }}>View All</span>
                                                    }
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 20px' }}>
                                                    {this.props.vendorReducer.videos.map((card, i) => {
                                                        return (
                                                            <ExperienceCard key={i} history={this.props.history}
                                                                match={this.props.match} card={card} />
                                                        )
                                                    })}
                                                </div>
                                            </section>
                                        }
                                        {this.props.vendorReducer.images.length > 0 &&
                                            <section className="border-shadow">
                                                <div style={{ margin: '10px 20px 0 20px', overflow: 'auto' }}>
                                                    <span style={{ float: 'left', fontSize: '18px', fontWeight: '800' }}>Gallery</span>
                                                    {this.props.vendorReducer.images.length === 4 &&
                                                        <span style={{ float: 'right', fontSize: '12px', color: '#ff9f00' }}
                                                            onClick={() => this.toShowAllPage('experiences')}>View All</span>
                                                    }
                                                </div>
                                                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '50px' }}>
                                                    {this.props.vendorReducer.images.map(this.mapGalleryMobile)}
                                                </div>
                                            </section>
                                        }
                                        <section className="border-shadow">
                                            <div style={{ margin: '10px 20px 0 20px', overflow: 'auto' }}>
                                                <span style={{
                                                    float: 'left',
                                                    fontSize: '18px',
                                                    fontWeight: '800'
                                                }}>Reviews</span>
                                                <span style={{ float: 'right', fontSize: '12px', color: '#ff9f00' }} onClick={() => {
                                                    if (this.props.meReducer.isLoggedIn) {
                                                        this.setState({
                                                            reviewModal: true
                                                        });
                                                    } else {
                                                        this.props.dispatch(toggleLoginModal());
                                                    }
                                                }}>Write a review</span>
                                            </div>
                                            {this.props.vendorReducer.reviews.length > 0 ?
                                                <div>
                                                    {this.props.vendorReducer.reviews.map((card, i) => {
                                                        return (
                                                            <ReviewComment history={this.props.history} key={i}
                                                                match={this.props.match} card={card} />
                                                        );
                                                    })}
                                                </div>
                                                :
                                                <div style={{ height: '6rem', position: 'relative' }}>
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        textAlign: 'center'
                                                    }}>
                                                        Be the first one to review.
                                    <button onClick={() => {
                                                            if (this.props.meReducer.isLoggedIn) {
                                                                this.setState({
                                                                    reviewModal: true
                                                                });
                                                            } else {
                                                                this.props.dispatch(toggleLoginModal());
                                                            }
                                                        }} style={{ color: '#ff9f00', backgroundColor: 'white', border: 'none' }}>Write a Review</button>
                                                    </span>
                                                </div>
                                            }
                                        </section>

                                        {this.props.vendorReducer.products.length > 0 &&
                                            <section className="border-shadow">
                                                <div style={{
                                                    margin: '10px 0 20px 1%',
                                                    overflow: 'auto',
                                                    fontSize: '18px',
                                                    fontWeight: '800'
                                                }}>
                                                    Have you tried these out, yet?
                            </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                    {this.props.vendorReducer.products.map((card, i) => {
                                                        return (
                                                            <ProductCard key={i} match={this.props.match}
                                                                history={this.props.history} card={card} />
                                                        )
                                                    })}
                                                </div>
                                                {this.props.vendorReducer.products.length === 3 &&
                                                    <div style={{
                                                        fontSize: '12px',
                                                        color: '#ff9f00',
                                                        textAlign: 'center',
                                                        marginBottom: '20px'
                                                    }}
                                                        onClick={this.goToAllProductsPage}>View All</div>
                                                }
                                            </section>
                                        }

                                        {this.props.vendorReducer.articles.length > 0 &&
                                            <section className="border-shadow">
                                                <div style={{ margin: '8px 10px', overflow: 'auto' }}>
                                                    <span style={{
                                                        float: 'left',
                                                        fontSize: '18px',
                                                        fontWeight: '800'
                                                    }}>Read More...</span>
                                                    <div onClick={() => this.toShowAllPage('articles')}
                                                        style={{
                                                            fontSize: '12px',
                                                            color: '#ff9f00',
                                                            textAlign: 'right',
                                                            marginTop: '5px'
                                                        }}>View All</div>
                                                </div>

                                                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 5px' }}>
                                                    {this.props.vendorReducer.articles.map((card, i) => {
                                                        return (
                                                            <BlogCard key={i} history={this.props.history} card={card} />
                                                        )
                                                    })}
                                                </div>
                                                {/* <div onClick={() => this.toShowAllPage('articles')}
                                        style={{
                                            fontSize: '12px',
                                            color: '#ff9f00',
                                            textAlign: 'center',
                                            marginBottom: '20px'
                                        }}>View All</div> */}
                                            </section>
                                        }

                                        {!this.props.vendorReducer.loadingSimilarVendors && this.props.vendorReducer.similarVendors.length > 0 &&
                                            <section className="border-shadow">
                                                <div style={{ margin: '8px 10px', overflow: 'auto' }}>
                                                    <span style={{
                                                        float: 'left',
                                                        fontSize: '18px',
                                                        fontWeight: '800'
                                                    }}>Similar Profile</span>
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 5px' }}>
                                                    {this.props.vendorReducer.similarVendors.map((card, i) => {
                                                        return (
                                                            <TrendingCard match={this.props.match} key={i} history={this.props.history} card={card} />
                                                        )
                                                    })}
                                                </div>
                                            </section>
                                        }
                                        {this.props.vendorReducer.loadingSimilarVendors &&
                                            <div style={{ height: '30vh', width: '100%', position: 'relative' }}>
                                                <img alt="" className="vendor-loader-desktop" src={loader} />
                                            </div>
                                        }
                                        {/*<section>*/}
                                        {/*<div style={{margin: '20px 20px 0 20px', overflow: 'auto'}}>*/}
                                        {/*<span style={{*/}
                                        {/*float: 'left',*/}
                                        {/*fontSize: '18px',*/}
                                        {/*fontWeight: '800'*/}
                                        {/*}}>Similar Company</span>*/}
                                        {/*<span style={{float: 'right', fontSize: '12px', color: '#ff9f00'}}>View All</span>*/}
                                        {/*</div>*/}
                                        {/*<ViewPager tag="main">*/}
                                        {/*<Frame className="frame-blog-mobile">*/}
                                        {/*<Track*/}
                                        {/*ref={c => this.track = c}*/}
                                        {/*viewsToShow={2}*/}
                                        {/*className="track-vendor"*/}
                                        {/*>*/}
                                        {/*{SIMILAR_PROFILE.map((card, i) => {*/}
                                        {/*return (*/}
                                        {/*<View className="view" key={i}>*/}
                                        {/*<TrendingCard card={card}/>*/}
                                        {/*</View>*/}
                                        {/*)*/}
                                        {/*})}*/}
                                        {/*</Track>*/}
                                        {/*</Frame>*/}
                                        {/*</ViewPager>*/}
                                        {/*</section>*/}
                                    </div>
                                }
                            </div>
                        }
                        {this.props.vendorReducer.loadingDetail &&
                            <div style={{ height: '30vh', width: '100%', position: 'relative' }}>
                                <img alt="" className="vendor-loader-desktop" src={loader} />
                            </div>
                        }

                    </div>
                </div>
            );
        }
    }


    render() {
        if (window.innerWidth > 768) {
            return (
                <div>
                    {this.desktopUI()}
                </div>
            );
        } else if (window.innerWidth <= 768) {
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

export default connect((state) => state, mapDispatchToProps)(Vendor);