/* eslint-disable array-callback-return, radix */
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import {
    Helmet
} from 'react-helmet';
import Cookies from 'universal-cookie';
import Loadable from 'react-loadable';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchCardPlaceholder from '../../component/SearchCardPlaceholder';
import ArticleCardPlaceHolder from '../../component/ArticelCardPlaceholder';
import {
    MdCheckBoxOutlineBlank,
    MdCheckBox,
    // MdArrowDropDown,
    MdClose
} from 'react-icons/lib/md';
import {
    FaStar
} from 'react-icons/lib/fa';
import Modal from 'react-modal';
import SearchCard from '../../component/search.card';
import loader from '../../assets/icons/loader.svg';
import {
    showAllVendors,
    showAllVideos,
    showAllProducts,
    asyncFetchAllArticles
} from '../../action/index';
import {
    categories,
    collectionsObject,
    CITIES_SEARCH
} from '../../constant/static';
import '../../assets/css/showall.css';
import '../../assets/css/search.css';
import ArticleCard from '../../component/article.card';
import TopArticleCard from '../../component/top.article';

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

let LOAD_MORE = false;

const customStyles = {
    content: {
        marginRight: '-50%',
        background: 'white',
        overflow: 'scroll',
        width: '100%',
        height: '100%',
        padding: '0',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0'
    },
    overlay: {
        zIndex: '12'
    }
};

const customStylesSort = {
    content: {
        marginRight: '-50%',
        background: 'white',
        overflow: 'scroll',
        width: '100%',
        padding: '0',
        top: 'none',
        left: '0',
        right: '0',
        bottom: '0'
    },
    overlay: {
        zIndex: '12',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    }
};

const popupStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        height: 'auto',
        backgroundColor: '#fafafa'
    },
    overlay: {
        zIndex: '12'
    }
};

let isScrollingDown = false;

let FIRST_LOAD = false;

class ShowAll extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPagePopup: false,
            minPrice: '',
            maxPrice: '',
            trusted: false,
            rating: '',
            discount: '',
            vendorType: [],
            showSortPopup: false,
            sort: '',
            popupType: '',
            category: [],
            collections: [],
        };
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
        window.addEventListener('scroll', (event) => {
            this.scrollCheck();
        });
    }

    scrollCheck = () => {
        if (document.querySelector("#searchfiltercontainer")) {
            let rect1 = document.querySelector("#searchfiltercontainer").getBoundingClientRect();
            let rect2 = document.querySelector('#count-div').getBoundingClientRect();
            let rect4 = document.querySelector('#footermaincontainer').getBoundingClientRect();
            const overlap = !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom);
            const searchContainer = document.getElementById('searchfiltercontainer');
            const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            const parentWidth = document.getElementById('searchfiltermaincontainer').offsetWidth;
            const headerHeight = document.getElementById('header-height').offsetHeight;
            if (h >= rect4.top) {
                searchContainer.style.bottom = `1.5rem`;
                searchContainer.style.position = 'absolute';
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
                        searchContainer.style.position = 'relative';
                        searchContainer.style.top = null;
                        searchContainer.style.bottom = null;
                    } else {
                        searchContainer.style.position = 'fixed';
                        searchContainer.style.top = `${headerHeight + 20}px`;
                        searchContainer.style.bottom = null;
                    }
                }
            }
        }

        if (document.getElementById('top-article-outer-container')) {
            const outer = document.getElementById('top-article-outer-container');
            const inner = document.getElementById('top-article-inner-container');
            inner.style.width = `${outer.offsetWidth}px`;
            let rect4 = document.querySelector('#footermaincontainer').getBoundingClientRect();
            const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            if (h >= rect4.top) {
                inner.style.bottom = `1.5rem`;
                inner.style.position = 'absolute';
            } else {
                inner.style.bottom = null;
                inner.style.position = 'fixed';
            }
        }
    }

    componentWillMount() {
        if (this.props.match.url.includes('/profile')) {
            const facets = this.props.location.search;
            const region = this.props.match.params.city ? this.props.match.params.city : '';
            this.props.dispatch(showAllVendors(0, facets, region));
            this.checkFilterForMobile();
        } else if (this.props.match.url.includes('/experience')) {
            const tempCookie = new Cookies();
            this.props.dispatch(showAllVideos(0, tempCookie.get('token')));
        } else if (this.props.match.url.includes('/products')) {
            this.props.dispatch(showAllProducts(0));
        } else if (this.props.match.url.includes('/articles')) {
            const tempCookie = new Cookies();
            FIRST_LOAD = true;
            this.props.dispatch(asyncFetchAllArticles(0, tempCookie.get('token')))
                .then((data) => {
                    FIRST_LOAD = false;
                    this.scrollCheck();
                });
        }
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.search !== nextProps.location.search) {
            window.scrollTo(0, 0);
            const facets = nextProps.location.search;
            const region = nextProps.match.params.city ? nextProps.match.params.city : '';
            nextProps.dispatch(showAllVendors(0, facets, region));
        }
        if (!FIRST_LOAD) {
            if (!_.isEmpty(nextProps.meReducer.userData)) {
                if (this.props.meReducer.userData !== nextProps.meReducer.userData) {
                    if (nextProps.match.url.includes('/articles')) {
                        FIRST_LOAD = true;
                        this.props.dispatch(asyncFetchAllArticles(0, nextProps.meReducer.userData.accessToken))
                            .then((data) => {
                                FIRST_LOAD = false;
                                this.scrollCheck();
                            });
                    }
                }
            }
        }
    }

    loadMore = () => {
        if (!LOAD_MORE) {
            LOAD_MORE = true;
            if (this.props.match.url.includes('/profile')) {
                const facets = this.props.location.search;
                const region = this.props.match.params.city ? this.props.match.params.city : '';
                const position = window.pageYOffset;
                this.props.dispatch(showAllVendors(this.props.homeReducer.showAllVendors.length, facets, region))
                    .then((data) => {
                        LOAD_MORE = false;
                        window.scrollTo(0, position);
                        this.scrollCheck();
                    });
            } else if (this.props.match.url.includes('/experience')) {
                const tempCookie = new Cookies();
                this.props.dispatch(showAllVideos(this.props.homeReducer.showAllVideos.length, tempCookie.get('token')))
                    .then((data) => {
                        LOAD_MORE = false;
                    });
            } else if (this.props.match.url.includes('/products')) {
                this.props.dispatch(showAllProducts(this.props.homeReducer.showAllProducts.length))
                    .then((data) => {
                        LOAD_MORE = false;
                    });
            } else if (this.props.match.url.includes('/articles')) {
                const tempCookie = new Cookies();
                this.props.dispatch(asyncFetchAllArticles(this.props.homeReducer.showAllArticles.length, tempCookie.get('token')))
                    .then((data) => {
                        LOAD_MORE = false;
                        // window.scrollTo(0, position);
                        this.scrollCheck();
                    });
            }
        }
    };

    renderSearchCards = (card, i) => {
        return (
            <div key={i}>
                <SearchCard history={this.props.history} card={card} />
            </div>
        );
    };

    renderVideoCard = (card, i) => {
        if (window.innerWidth > 768) {
            return (
                <ExperienceCard history={this.props.history} match={this.props.match} card={card} />
            );
        } else {
            return (
                <ExperienceCard key={i} history={this.props.history} match={this.props.match} card={card} />
            );
        }
    };

    renderProductCard = (card, i) => {
        if (window.innerWidth > 768) {
            return (
                <ProductCard key={i} history={this.props.history} match={this.props.match} card={card} />
            );
        } else {
            return (
                <ProductCard key={i} history={this.props.history} match={this.props.match} card={card} />
            );
        }
    };

    renderSort = () => {
        setTimeout(() => {
            const sortDiv = document.getElementsByClassName('sort-sortBy');
            if (sortDiv) {
                const value = this.getQueryVariable('sort');
                if (value && document.getElementById(value)) {
                    document.getElementById(value).classList.add('sort-selected');
                } else if (document.getElementById('ratingHigh')) {
                    document.getElementById('ratingHigh').classList.add('sort-selected');
                }
            }
            const sortDivMob = document.getElementsByClassName('sort-mobile-list-container');
            if (sortDivMob) {
                const value = this.getQueryVariable('sort');
                if (value && document.getElementById(`${value}Mob`)) {
                    document.getElementById(`${value}Mob`).classList.add('sort-selected-mobile');
                } else if (document.getElementById('ratingHighMob')) {
                    document.getElementById('ratingHighMob').classList.add('sort-selected-mobile');
                }
            }
        }, 100);
    };

    /**
     * Function to parse Query params from url
     * @param variable
     * @returns {string}
     */
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

    checkFilterForMobile = () => {
        const trusted = this.getQueryVariable('trusted');
        const minPrice = this.getQueryVariable('minPrice');
        const maxPrice = this.getQueryVariable('maxPrice');
        const rating = this.getQueryVariable('rating');
        const discount = this.getQueryVariable('discount');
        const vendorType = this.getQueryVariable('vendorType');
        const sort = this.getQueryVariable('sort');
        const category = this.getQueryVariable('category');
        const collections = this.getQueryVariable('collections');
        const data = {};
        if (trusted) {
            data.trusted = true;
        }
        if (minPrice) {
            data.minPrice = minPrice;
        }
        if (maxPrice) {
            data.maxPrice = maxPrice;
        }
        if (rating) {
            data.rating = rating;
        }
        if (discount) {
            data.discount = discount;
        }
        if (sort) {
            data.sort = sort;
        }
        if (vendorType) {
            data.vendorType = vendorType.split(',');
        }
        if (category) {
            data.category = category.split(',');
        }
        if (collections) {
            data.collections = collections.split(',');
        }
        this.setState(data);
    };


    sortMobile = (value) => {
        this.setState({
            sort: value
        });
        this.applyFacets('sort', value);
    }

    /**
     * Function to edit and apply facets for filter (price, rating, discount, trusted)
     * @param filter filter name
     * @param newValue newValue of the filter
     */
    applyFacets = (filter, newValue) => {
        let facetQuery = this.props.location.search;
        const oldValue = this.getQueryVariable(filter);
        if (facetQuery.includes('?') && facetQuery.includes(`${filter}=${oldValue}`)) {
            if (facetQuery.includes(`&${filter}=${oldValue}`)) {
                facetQuery = facetQuery.replace(`&${filter}=${oldValue}`, '');
            }
            if (facetQuery.includes(`${filter}=${oldValue}`)) {
                facetQuery = facetQuery.replace(`${filter}=${oldValue}`, '');
            }
            facetQuery = facetQuery.concat(`&${filter}=${newValue}`);
            if (facetQuery.indexOf('&') === 0) {
                facetQuery = facetQuery.replace(/^&/, "");
            }
        } else if (facetQuery.includes('?') && !facetQuery.includes(`${filter}=${oldValue}`)) {
            facetQuery = facetQuery.concat(`&${filter}=${newValue}`);
        }
        else {
            facetQuery = `?${filter}=${newValue}`;
        }
        if (facetQuery.length > 0 && facetQuery.charAt(1) === '&') {
            facetQuery = facetQuery.slice(1, 1) + facetQuery.slice(2);
        }
        this.props.history.push({
            pathname: `/profile`,
            search: facetQuery
        });
        this.setState({
            showSortPopup: false,
            showPagePopup: false
        });
        document.body.style.overflow = 'auto';
    };


    removeFacet = (filter) => {
        let facetQuery = this.props.location.search;
        const oldValue = this.getQueryVariable(filter);

        if (facetQuery.includes(`&${filter}=${oldValue}`)) {
            facetQuery = facetQuery.replace(`&${filter}=${oldValue}`, '');
        }
        if (facetQuery.includes(`${filter}=${oldValue}`)) {
            facetQuery = facetQuery.replace(`${filter}=${oldValue}`, '');
        }
        if (facetQuery.indexOf('&') === 0) {
            facetQuery = facetQuery.replace(/^&/, "");
        }
        this.props.history.push({
            pathname: `/profile`,
            search: facetQuery
        });
    };

    mobileFilter = () => {
        return (
            <div style={{ position: 'relative' }}>
                <div className="search-mobile-header-container">
                    <span className="search-mobile-header-label">Filters</span>
                    <span className="search-mobile-header-reset" onClick={() => {
                        this.closeModal();
                        this.resetFilter();
                        this.setState({
                            minPrice: '',
                            maxPrice: '',
                            trusted: '',
                            rating: '',
                            discount: '',
                            vendorType: [],
                        });
                    }}>Reset</span>
                </div>
                <div className="search-filter-container">
                    {/*<div className="search-price-filter-container">*/}
                    {/*<span className="search-label-2">Price</span>*/}
                    {/*<div style={{height: '30px', textAlign: 'center', marginTop: '20px'}}>*/}
                    {/*<input onChange={(event) => {*/}
                    {/*this.setState({*/}
                    {/*minPrice: event.target.value*/}
                    {/*});*/}
                    {/*}} placeholder="Min" id="min-price" defaultValue={this.state.minPrice}*/}
                    {/*className="search-price-filter-min-max"*/}
                    {/*maxLength={9} type="number"/>*/}
                    {/*<input onChange={(event) => {*/}
                    {/*this.setState({*/}
                    {/*maxPrice: event.target.value*/}
                    {/*});*/}
                    {/*}} placeholder="Max" id="max-price" defaultValue={this.state.maxPrice}*/}
                    {/*className="search-price-filter-min-max"*/}
                    {/*maxLength={9} type="number"/>*/}
                    {/*/!*<button onClick={this.applyPriceFilter} className="search-price-filter-button">Go</button>*!/*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    <div className="search-trustvardi-container">
                        <span className="search-label-2">Trustvardi Assured</span>
                        <div style={{ marginTop: '20px', position: 'relative' }}>
                            <span>
                                <img className="search-trustvardi-filter-icon"
                                    src="https://res.cloudinary.com/trustvardi/image/upload/v1528888369/icons/assured_icon-02.svg"
                                    alt="" />
                                <span
                                    className="search-trustvardi-assured-text">TrustVardi assured</span>
                            </span>
                            {!this.state.trusted &&
                                <MdCheckBoxOutlineBlank onClick={() => {
                                    this.setState({
                                        trusted: true
                                    });
                                }} className="search-trustvardi-check-button" />
                            }
                            {this.state.trusted &&
                                <MdCheckBox onClick={() => {
                                    this.setState({
                                        trusted: false
                                    });
                                }} style={{ fill: '#ff9f00' }}
                                    className="search-trustvardi-check-button" />
                            }
                        </div>
                    </div>
                    <div style={{ overflow: 'auto' }} className="search-trustvardi-container">
                        <span className="search-label-2">Category</span>
                        {_.map(categories, (value, index) => {
                            return (
                                <div key={index} style={{ marginTop: '20px', position: 'relative', width: '50%', display: 'inline-block', height: '30px', float: 'left' }}>
                                    <span style={{ display: 'inline-block', width: '70%', verticalAlign: 'sub' }} className="search-trustvardi-assured-text">
                                        {value.name}
                                    </span>
                                    {!this.state.category.includes(value.key) &&
                                        <MdCheckBoxOutlineBlank onClick={() => this.addCategoriesCollection('category', value.key)} className="search-trustvardi-check-button" />
                                    }
                                    {this.state.category.includes(value.key) &&
                                        <MdCheckBox onClick={() => this.removeCategoryCollection('category', value.key)} style={{ fill: '#ff9f00' }}
                                            className="search-trustvardi-check-button" />
                                    }
                                </div>
                            );
                        })
                        }
                    </div>
                    <div style={{ overflow: 'auto' }} className="search-trustvardi-container">
                        <span className="search-label-2">Collections</span>
                        {_.map(collectionsObject, (value, index) => {
                            return (
                                <div key={index} style={{ marginTop: '20px', position: 'relative', width: '50%', display: 'inline-block', height: '30px', float: 'left' }}>
                                    <span style={{ display: 'inline-block', width: '70%', verticalAlign: 'sub' }} className="search-trustvardi-assured-text">
                                        {value.name}
                                    </span>
                                    {!this.state.collections.includes(value.key) &&
                                        <MdCheckBoxOutlineBlank onClick={() => this.addCategoriesCollection('collections', value.key)} className="search-trustvardi-check-button" />
                                    }
                                    {this.state.collections.includes(value.key) &&
                                        <MdCheckBox onClick={() => this.removeCategoryCollection('collections', value.key)} style={{ fill: '#ff9f00' }}
                                            className="search-trustvardi-check-button" />
                                    }
                                </div>
                            );
                        })
                        }
                    </div>
                    <div className="search-trustvardi-container">
                        <span className="search-label-2">Rating</span>
                        <div style={{ marginTop: '20px', position: 'relative' }}>
                            <span>
                                <FaStar className="search-rating-star" />
                                <FaStar className="search-rating-star" />
                                <FaStar className="search-rating-star" />
                                <FaStar className="search-rating-star" />
                                <FaStar className="search-rating-star" />
                            </span>
                            {parseInt(this.state.rating) !== 5 &&
                                <MdCheckBoxOutlineBlank onClick={() => this.applyRatingFilterMobile(5)}
                                    className="search-trustvardi-check-button" />
                            }
                            {parseInt(this.state.rating) === 5 &&
                                <MdCheckBox onClick={() => this.removeRatingMobile()} style={{ fill: '#ff9f00' }}
                                    className="search-trustvardi-check-button" />
                            }
                        </div>
                        <div style={{ marginTop: '20px', position: 'relative' }}>
                            <span>
                                <FaStar className="search-rating-star" />
                                <FaStar className="search-rating-star" />
                                <FaStar className="search-rating-star" />
                                <FaStar className="search-rating-star" />
                                <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                    className="search-rating-star" />
                            </span>
                            {parseInt(this.state.rating) !== 4 &&
                                <MdCheckBoxOutlineBlank onClick={() => this.applyRatingFilterMobile(4)}
                                    className="search-trustvardi-check-button" />
                            }
                            {parseInt(this.state.rating) === 4 &&
                                <MdCheckBox onClick={() => this.removeRatingMobile()} style={{ fill: '#ff9f00' }}
                                    className="search-trustvardi-check-button" />
                            }
                        </div>
                        <div style={{ marginTop: '20px', position: 'relative' }}>
                            <span>
                                <FaStar className="search-rating-star" />
                                <FaStar className="search-rating-star" />
                                <FaStar className="search-rating-star" />
                                <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                    className="search-rating-star" />
                                <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                    className="search-rating-star" />
                            </span>
                            {parseInt(this.state.rating) !== 3 &&
                                <MdCheckBoxOutlineBlank onClick={() => this.applyRatingFilterMobile(3)}
                                    className="search-trustvardi-check-button" />
                            }
                            {parseInt(this.state.rating) === 3 &&
                                <MdCheckBox onClick={() => this.removeRatingMobile()} style={{ fill: '#ff9f00' }}
                                    className="search-trustvardi-check-button" />
                            }
                        </div>
                        <div style={{ marginTop: '20px', position: 'relative' }}>
                            <span>
                                <FaStar className="search-rating-star" />
                                <FaStar className="search-rating-star" />
                                <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                    className="search-rating-star" />
                                <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                    className="search-rating-star" />
                                <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                    className="search-rating-star" />
                            </span>
                            {parseInt(this.state.rating) !== 2 &&
                                <MdCheckBoxOutlineBlank onClick={() => this.applyRatingFilterMobile(2)}
                                    className="search-trustvardi-check-button" />
                            }
                            {parseInt(this.state.rating) === 2 &&
                                <MdCheckBox onClick={() => this.removeRatingMobile()} style={{ fill: '#ff9f00' }}
                                    className="search-trustvardi-check-button" />
                            }
                        </div>
                        <div style={{ marginTop: '20px', position: 'relative' }}>
                            <span>
                                <FaStar className="search-rating-star" />
                                <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                    className="search-rating-star" />
                                <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                    className="search-rating-star" />
                                <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                    className="search-rating-star" />
                                <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                    className="search-rating-star" />
                            </span>
                            {parseInt(this.state.rating) !== 1 &&
                                <MdCheckBoxOutlineBlank onClick={() => this.applyRatingFilterMobile(1)}
                                    className="search-trustvardi-check-button" />
                            }
                            {parseInt(this.state.rating) === 1 &&
                                <MdCheckBox onClick={() => this.removeRatingMobile()} style={{ fill: '#ff9f00' }}
                                    className="search-trustvardi-check-button" />
                            }
                        </div>
                    </div>
                    {/*<div className="search-trustvardi-container">*/}
                    {/*<span className="search-label-2">Discount</span>*/}
                    {/*{discountArray.map(this.renderDiscount)}*/}
                    {/*</div>*/}
                    <div className="search-trustvardi-container" style={{ marginBottom: '0' }}>
                        <span className="search-label-2">Company Type</span>
                        <div style={{ marginTop: '20px', position: 'relative' }}>
                            <span
                                className="search-trustvardi-assured-text">Product</span>
                            {this.state.vendorType.indexOf('product') === -1 &&
                                <MdCheckBoxOutlineBlank onClick={() => this.addVendorTypeFilterMobile('product')}
                                    className="search-trustvardi-check-button" />
                            }
                            {this.state.vendorType.indexOf('product') !== -1 &&
                                <MdCheckBox onClick={() => this.removeVendorTypeFilterMobile('product')}
                                    style={{ fill: '#ff9f00' }}
                                    className="search-trustvardi-check-button" />
                            }
                        </div>
                        <div style={{ marginTop: '20px', position: 'relative' }}>
                            <span
                                className="search-trustvardi-assured-text">Service</span>
                            {this.state.vendorType.indexOf('service') === -1 &&
                                <MdCheckBoxOutlineBlank onClick={() => this.addVendorTypeFilterMobile('service')}
                                    className="search-trustvardi-check-button" />
                            }
                            {this.state.vendorType.indexOf('service') !== -1 &&
                                <MdCheckBox onClick={() => this.removeVendorTypeFilterMobile('service')}
                                    style={{ fill: '#ff9f00' }}
                                    className="search-trustvardi-check-button" />
                            }
                        </div>
                    </div>
                    <div className="search-mobile-button-container">
                        <button className="mobile-search-filter-cancel" onClick={() => {
                            this.closeModal();
                            this.checkFilterForMobile();
                        }}>Cancel
                        </button>
                        <button className="mobile-search-filter-apply" onClick={this.applyFilter}>Apply</button>
                    </div>
                </div>
            </div>
        );
    };

    renderDiscount = (value, index) => {
        return (
            <div key={index} style={{ marginTop: '20px', position: 'relative' }}>
                <span className="search-trustvardi-assured-text">{value}% and Above</span>
                {this.state.discount !== value &&
                    <MdCheckBoxOutlineBlank onClick={() => {
                        this.setState({
                            discount: value
                        });
                    }} className="search-trustvardi-check-button" />
                }
                {this.state.discount === value &&
                    <MdCheckBox onClick={() => {
                        this.setState({
                            discount: ''
                        });
                    }} style={{ fill: '#ff9f00' }} className="search-trustvardi-check-button" />
                }
            </div>
        )
    };

    applyPriceFilter = () => {
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;


        if (minPrice) {
            this.applyFacets('minPrice', minPrice);
        }

        if (maxPrice) {
            setTimeout(() => {
                this.applyFacets('maxPrice', maxPrice);
            }, 100);
        }
    };

    addVendorTypeFilter = (type) => {
        let oldValue = this.getQueryVariable('vendorType');
        if (oldValue && !oldValue.includes(type)) {
            oldValue = oldValue.concat(`,${type}`);
            this.applyFacets('vendorType', oldValue);
        }
        if (!oldValue) {
            this.applyFacets('vendorType', type);
        }
    };

    addVendorTypeFilterMobile = (type) => {
        let oldValue = this.state.vendorType;
        if (oldValue.indexOf(type) === -1) {
            oldValue.push(type);
        }
        this.setState({
            vendorType: oldValue
        });
    };

    removeVendorTypeFilter = (type) => {
        let oldValue = this.getQueryVariable('vendorType');
        if (oldValue.includes('product') && oldValue.includes('service')) {
            if (oldValue.includes(type)) {
                oldValue = oldValue.replace(`${type}`, '');
                oldValue = oldValue.replace(`,`, '');
                this.applyFacets('vendorType', oldValue);
            }
        } else {
            this.removeFacet('vendorType');
        }
    };

    removeVendorTypeFilterMobile = (type) => {
        let vendorType = this.state.vendorType;
        if (vendorType.indexOf(type) !== -1) {
            vendorType.splice(_.findIndex(vendorType, type), 1);
        }
        this.setState({
            vendorType
        });
    };

    resetFilter = () => {

        this.props.history.push({
            pathname: `/profile`
        });
    };

    closeModal = () => {
        // document.querySelector('.ReactModal__Content').className += 'animated slideOutDown';
        setTimeout(() => {
            this.setState({
                showMobileFilter: false
            });
            document.body.style.overflow = 'auto';
        }, 500);
    };

    closeModalSort = () => {
        // document.querySelector('.ReactModal__Content').className += 'animated slideOutDown';
        this.setState({
            showSortPopup: false
        });
        document.body.style.overflow = 'auto';
    };

    closeModalPopup = () => {
        this.setState({
            showPagePopup: false,
            category: this.getQueryVariable('category') ? this.getQueryVariable('category') : [],
            collections: this.getQueryVariable('collections') ? this.getQueryVariable('collections') : []
        });
        document.body.style.overflow = 'auto';
    };

    applyRatingFilterMobile = (rating) => {
        this.setState({
            rating
        });
    };

    removeRatingMobile = () => {
        this.setState({
            rating: ''
        });
    };

    applyFilter = () => {
        let q = '?';
        const {
            minPrice,
            maxPrice,
            discount,
            rating,
            vendorType,
            trusted,
            sort,
            category,
            collections
        } = this.state;
        if (minPrice) {
            if (q.length > 1) {
                q = q.concat(`&minPrice=${minPrice}`);
            } else {
                q = q.concat(`minPrice=${minPrice}`);
            }
        }
        if (maxPrice) {
            if (q.length > 1) {
                q = q.concat(`&maxPrice=${maxPrice}`);
            } else {
                q = q.concat(`maxPrice=${maxPrice}`);
            }
        }
        if (trusted) {
            if (q.length > 1) {
                q = q.concat(`&trusted=${trusted}`);
            } else {
                q = q.concat(`trusted=${trusted}`);
            }
        }
        if (discount) {
            if (q.length > 1) {
                q = q.concat(`&discount=${discount}`);
            } else {
                q = q.concat(`discount=${discount}`);
            }
        }
        if (rating) {
            if (q.length > 1) {
                q = q.concat(`&rating=${rating}`);
            } else {
                q = q.concat(`rating=${rating}`);
            }
        }

        if (sort) {
            if (q.length > 1) {
                q = q.concat(`&sort=${sort}`);
            } else {
                q = q.concat(`sort=${sort}`);
            }
        }

        if (vendorType && vendorType.length > 0) {
            if (q.length > 1) {
                q = q.concat(`&vendorType=${vendorType.toString()}`);
            } else {
                q = q.concat(`vendorType=${vendorType.toString()}`);
            }
        }

        if (category && category.length > 0) {
            if (q.length > 1) {
                q = q.concat(`&category=${category.toString()}`);
            } else {
                q = q.concat(`category=${category.toString()}`);
            }
        }

        if (collections && collections.length > 0) {
            if (q.length > 1) {
                q = q.concat(`&collections=${collections.toString()}`);
            } else {
                q = q.concat(`collections=${collections.toString()}`);
            }
        }

        if (q.length === 1) {
            q = '';
        }
        this.closeModal();
        this.props.history.push({
            pathname: `/profile`,
            search: q
        });
    };

    showFilter = () => {
        this.setState({
            showMobileFilter: true
        });
        document.body.style.overflow = 'hidden';
    };

    addCategoriesCollection = (type, value) => {
        const array = this.state[type];
        if (!array.includes[value]) {
            array.push(value);
            if (type === 'category') {
                this.setState({
                    category: array
                });
            }
            if (type === 'collections') {
                this.setState({
                    collections: array
                });
            }
        }
    };

    removeCategoryCollection = (type, value) => {
        const array = this.state[type];
        console.log(value);
        if (array.includes(value)) {
            array.splice(array.indexOf(value), 1);
            if (type === 'category') {
                this.setState({
                    category: array
                });
            }
            if (type === 'collections') {
                this.setState({
                    collections: array
                });
            }
        }
    };

    renderMetaTags = (type) => {
        const metaTags = {
            Articles: {
                title: 'TrustVardi Experiences, Reads, Verdicts & More | From The Editor| TrustVardi',
                description: 'We\'ve listed down the best of the quirky and out of the box brands at one place, so you can read about them and make your decision easily'
            }
        }
        return (
            <Helmet>
                <title>{metaTags[type] ? metaTags[type].title : `${type} | TrustVardi`}</title>
                <meta name="fragment" content="!" />
                <link rel="canonical" href={`"https://www.trustvardi.com/${type.toLowerCase()}"`} />
                <meta name="description" content={metaTags[type] ? metaTags[type].description : 'Trustvardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories.'} />
                <meta name="robots" content="index, follow" />
                <link rel="alternate" hreflang="en" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta name="keywords" content={`"${type}, trustvardi" `} />
                <meta name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name='HandheldFriendly' content='True' />
                <meta property="og:title" content={`"${type} | Trustvardi"`} />
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={`"https://www.trustvardi.com/${type.toLowerCase()}"`} />
                <meta property="og:site_name" content="trustvardi" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@trustvardi" />
                <meta name="twitter:creator" content="@trustvardi" />
                <meta name="twitter:title" content="TrustVardi" />
                <script type="application/ld+json">
                    {`
                        [{
                            "@context": "http://schema.org",
                            "url": "https://www.trustvardi.com",
                            "@type": "Website"
                        }
                        ,{
                            "@context": "http://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [{
                                "@type": "ListItem",
                                "position": 1,
                                "item": {
                                    "@id": "https://www.trustvardi.com",
                                    "name": "TRUSTVARDI",
                                    "description": "home"
                                }
                            }, {
                                "@type": "ListItem",
                                "position": 2,
                                "item": {
                                    "@id": "https://www.trustvardi.com/${type.toLowerCase()}",
                                    "name": "${type.toUpperCase()}",
                                    "description": "${type}"
                                }
                            }]
                        }]
                    `}
                </script>
            </Helmet>
        );
    };

    renderArticlesCard = (card, index) => {
        return (
            <ArticleCard key={index} index={index} card={card} user={_.find(this.props.homeReducer.articlePageUsers, { username: card.user })} />
        );
    };

    renderTopArticles = (card, index) => {
        return (
            <TopArticleCard key={index} card={card} user={_.find(this.props.homeReducer.articlePageUsers, { username: card.user })} />
        );
    };

    render() {
        if (this.props.match.url.includes('/profile') && !this.props.homeReducer.showLoading) {
            const selectedSortText = {
                ratingLow: 'Rating: Low',
                ratingHigh: 'Rating: High',
                newly: 'Newly Added',
                priceLow: 'Price: Low',
                priceHigh: 'Price: High'
            };
            if (window.innerWidth > 768) {
                if (!this.props.filterReducer.loading) {
                    this.renderSort();
                    return (
                        <div className="search-page-container">
                            {this.renderMetaTags('Profile')}
                            <Modal
                                isOpen={this.state.showPagePopup}
                                onRequestClose={this.closeModalPopup}
                                style={popupStyles}
                                contentLabel="Example Modal"
                            >
                                <div className="input-search-quick-search-container-search">
                                    <div className="input-quick-search-holder">
                                        <span
                                            className="label-quick-search-page">Choose any one {this.state.popupType.includes('category') ? 'Category' : 'Collections'}</span>
                                        <MdClose onClick={this.closeModalPopup} className="label-close-button" />
                                        {this.state.popupType.includes('category') &&
                                            <div style={{ overflow: 'auto' }}>
                                                {_.map(categories, (value, i) => {
                                                    return (
                                                        <div key={i} style={{ width: '25%', display: 'inline-block' }}>
                                                            <div style={{ marginTop: '20px', position: 'relative' }}>
                                                                {!this.state.category.includes(value.key) &&
                                                                    <MdCheckBoxOutlineBlank
                                                                        onClick={() => this.addCategoriesCollection('category', value.key)}
                                                                        className="search-trustvardi-check-button" />
                                                                }
                                                                {this.state.category.includes(value.key) &&
                                                                    <MdCheckBox onClick={() => this.removeCategoryCollection('category', value.key)}
                                                                        style={{ fill: '#ff9f00' }}
                                                                        className="search-trustvardi-check-button" />
                                                                }
                                                                <span style={{ fontSize: '14px' }} className="search-trustvardi-assured-text">
                                                                    {value.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        }
                                        {this.state.popupType.includes('collection') &&
                                            <div style={{ overflow: 'auto' }}>
                                                {_.map(collectionsObject, (value, i) => {
                                                    return (
                                                        <div key={i} style={{ width: '25%', display: 'inline-block' }}>
                                                            <div style={{ marginTop: '20px', position: 'relative' }}>
                                                                {!this.state.collections.includes(value.key) &&
                                                                    <MdCheckBoxOutlineBlank
                                                                        onClick={() => this.addCategoriesCollection('collections', value.key)}
                                                                        className="search-trustvardi-check-button" />
                                                                }
                                                                {this.state.collections.includes(value.key) &&
                                                                    <MdCheckBox onClick={() => this.removeCategoryCollection('collections', value.key)}
                                                                        style={{ fill: '#ff9f00' }}
                                                                        className="search-trustvardi-check-button" />
                                                                }
                                                                <span style={{ fontSize: '14px' }} className="search-trustvardi-assured-text">
                                                                    {value.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        }
                                        <div>
                                            <div style={{ float: 'right' }}>
                                                <button onClick={this.closeModalPopup} className="category-filter-cancel">
                                                    Cancel
                                                </button>
                                                <button onClick={() => {
                                                    if (this.state[this.state.popupType] && this.state[this.state.popupType].length > 0) {
                                                        this.applyFacets(this.state.popupType, this.state[this.state.popupType].toString());
                                                    } else {
                                                        this.removeFacet(this.state.popupType);
                                                        this.closeModalPopup();
                                                    }
                                                }} className="category-filter-apply">
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Modal>

                            <div className="search-page-main-container">
                                <span id="count-div" className="search-page-count">

                                </span>
                                {(this.props.match.params.city) ? this.props.match.params.city &&
                                    <h1 className="show-city-label">Showing Results for {_.find(CITIES_SEARCH, { key: this.props.match.params.city }).name}</h1>
                                    : <p style={{fontWeight:'700',margin:'0px 10px 10px'}}>Show All TrustVardi Brands</p>
                                }
                                <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                                    {/* <div style={{ marginBottom: '20px', position: 'relative' }}></div> */}
                                    <div id="searchfiltermaincontainer" style={{ backgroundColor: '#fafafa', border: 'none' }} className="search-filter-container">
                                        <div style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.1)', transition: 'all 0.2s ease-in 0.2s' }} id="searchfiltercontainer">
                                            {/*<div className="search-price-filter-container">*/}
                                            {/*<span className="search-label-2">Price</span>*/}
                                            {/*<div style={{height: '30px', textAlign: 'center', marginTop: '20px'}}>*/}
                                            {/*<input onKeyUp={(event) => {*/}
                                            {/*if (event.keyCode === 13) {*/}
                                            {/*this.applyPriceFilter();*/}
                                            {/*}*/}
                                            {/*}} placeholder="Min" id="min-price"*/}
                                            {/*defaultValue={this.getQueryVariable('minPrice') ? this.getQueryVariable('minPrice') : ''}*/}
                                            {/*className="search-price-filter-min-max"*/}
                                            {/*maxLength={9} type="number"/>*/}
                                            {/*<input onKeyUp={(event) => {*/}
                                            {/*if (event.keyCode === 13) {*/}
                                            {/*this.applyPriceFilter();*/}
                                            {/*}*/}
                                            {/*}} placeholder="Max" id="max-price"*/}
                                            {/*defaultValue={this.getQueryVariable('maxPrice') ? this.getQueryVariable('maxPrice') : ''}*/}
                                            {/*className="search-price-filter-min-max"*/}
                                            {/*maxLength={9} type="number"/>*/}
                                            {/*<button onClick={this.applyPriceFilter}*/}
                                            {/*className="search-price-filter-button">Go*/}
                                            {/*</button>*/}
                                            {/*</div>*/}
                                            {/*</div>*/}
                                            <div className="search-trustvardi-container">
                                                <span className="search-label-2">Trustvardi Assured</span>
                                                <div style={{ marginTop: '20px', position: 'relative' }}>
                                                    <span>
                                                        <img className="search-trustvardi-filter-icon"
                                                            src="https://res.cloudinary.com/trustvardi/image/upload/v1528888369/icons/assured_icon-02.svg"
                                                            alt="" />
                                                        <span
                                                            className="search-trustvardi-assured-text">TrustVardi assured</span>
                                                    </span>
                                                    {!this.getQueryVariable('trusted') &&
                                                        <MdCheckBoxOutlineBlank onClick={() => this.applyFacets('trusted', true)}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                    {this.getQueryVariable('trusted') &&
                                                        <MdCheckBox onClick={() => this.removeFacet('trusted')}
                                                            style={{ fill: '#ff9f00' }}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                </div>
                                            </div>
                                            <div className="search-trustvardi-container">
                                                <span className="search-label-2">Categories</span>
                                                <div style={{ position: 'relative', height: '70px' }}>
                                                    <button onClick={() => {
                                                        this.setState({
                                                            showPagePopup: true,
                                                            popupType: 'category'
                                                        });
                                                    }} className="reset-filter-desktop-button">
                                                        Choose Category
                                                </button>
                                                </div>
                                            </div>
                                            <div className="search-trustvardi-container">
                                                <span className="search-label-2">Collections</span>
                                                <div style={{ position: 'relative', height: '70px' }}>
                                                    <button onClick={() => {
                                                        this.setState({
                                                            showPagePopup: true,
                                                            popupType: 'collections'
                                                        });
                                                    }} className="reset-filter-desktop-button">
                                                        Choose Collections
                                                </button>
                                                </div>
                                            </div>
                                            <div className="search-trustvardi-container">
                                                <span className="search-label-2">Rating</span>
                                                <div style={{ marginTop: '20px', position: 'relative' }}>
                                                    <span>
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar className="search-rating-star" />
                                                    </span>
                                                    {parseInt(this.getQueryVariable('rating')) !== 5 &&
                                                        <MdCheckBoxOutlineBlank onClick={() => this.applyFacets('rating', 5)}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                    {parseInt(this.getQueryVariable('rating')) === 5 &&
                                                        <MdCheckBox onClick={() => this.removeFacet('rating')}
                                                            style={{ fill: '#ff9f00' }}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                </div>
                                                <div style={{ marginTop: '20px', position: 'relative' }}>
                                                    <span>
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                                            className="search-rating-star" />
                                                    </span>
                                                    {parseInt(this.getQueryVariable('rating')) !== 4 &&
                                                        <MdCheckBoxOutlineBlank onClick={() => this.applyFacets('rating', 4)}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                    {parseInt(this.getQueryVariable('rating')) === 4 &&
                                                        <MdCheckBox onClick={() => this.removeFacet('rating')}
                                                            style={{ fill: '#ff9f00' }}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                </div>
                                                <div style={{ marginTop: '20px', position: 'relative' }}>
                                                    <span>
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                                            className="search-rating-star" />
                                                        <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                                            className="search-rating-star" />
                                                    </span>
                                                    {parseInt(this.getQueryVariable('rating')) !== 3 &&
                                                        <MdCheckBoxOutlineBlank onClick={() => this.applyFacets('rating', 3)}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                    {parseInt(this.getQueryVariable('rating')) === 3 &&
                                                        <MdCheckBox onClick={() => this.removeFacet('rating')}
                                                            style={{ fill: '#ff9f00' }}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                </div>
                                                <div style={{ marginTop: '20px', position: 'relative' }}>
                                                    <span>
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                                            className="search-rating-star" />
                                                        <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                                            className="search-rating-star" />
                                                        <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                                            className="search-rating-star" />
                                                    </span>
                                                    {parseInt(this.getQueryVariable('rating')) !== 2 &&
                                                        <MdCheckBoxOutlineBlank onClick={() => this.applyFacets('rating', 2)}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                    {parseInt(this.getQueryVariable('rating')) === 2 &&
                                                        <MdCheckBox onClick={() => this.removeFacet('rating')}
                                                            style={{ fill: '#ff9f00' }}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                </div>
                                                <div style={{ marginTop: '20px', position: 'relative' }}>
                                                    <span>
                                                        <FaStar className="search-rating-star" />
                                                        <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                                            className="search-rating-star" />
                                                        <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                                            className="search-rating-star" />
                                                        <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                                            className="search-rating-star" />
                                                        <FaStar style={{ fill: '#1e2753', opacity: '0.06' }}
                                                            className="search-rating-star" />
                                                    </span>
                                                    {parseInt(this.getQueryVariable('rating')) !== 1 &&
                                                        <MdCheckBoxOutlineBlank onClick={() => this.applyFacets('rating', 1)}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                    {parseInt(this.getQueryVariable('rating')) === 1 &&
                                                        <MdCheckBox onClick={() => this.removeFacet('rating')}
                                                            style={{ fill: '#ff9f00' }}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                </div>
                                            </div>
                                            {/*<div className="search-trustvardi-container">*/}
                                            {/*<span className="search-label-2">Discount</span>*/}
                                            {/*{discountArray.map(this.renderDiscount)}*/}
                                            {/*</div>*/}
                                            <div className="search-trustvardi-container" style={{ marginBottom: '0' }}>
                                                <span className="search-label-2">Sort</span>
                                                <div style={{ marginTop: '20px' }} className="sort-sortBy">
                                                    Sort by : <span>{selectedSortText[this.getQueryVariable('sort')] ? selectedSortText[this.getQueryVariable('sort')] : 'Rating: High'}</span><span className="myntraweb-sprite sort-downArrow sprites-downArrow" />
                                                    <ul className="sort-list">
                                                        <li>
                                                            <label onClick={() => this.applyFacets('sort', 'ratingLow')} id="ratingLow" className="sort-label">
                                                                <input type="radio" defaultValue="ratingLow" />Rating: Low to high
                                                        </label>
                                                        </li>
                                                        <li>
                                                            <label onClick={() => this.applyFacets('sort', 'ratingHigh')} id="ratingHigh" className="sort-label">
                                                                <input type="radio" defaultValue="ratingHigh" />Rating: High to Low
                                                        </label>
                                                        </li>
                                                        <li>
                                                            <label onClick={() => this.applyFacets('sort', 'newly')} id="newly" className="sort-label">
                                                                <input type="radio" defaultValue="newly" />Newly Added
                                                        </label>
                                                        </li>
                                                        <li>
                                                            <label onClick={() => this.applyFacets('sort', 'priceLow')} id="priceLow" className="sort-label">
                                                                <input type="radio" defaultValue="priceLow" />Price: Low to High
                                                        </label>
                                                        </li>
                                                        <li>
                                                            <label onClick={() => this.applyFacets('sort', 'priceHigh')} id="priceHigh" className="sort-label">
                                                                <input type="radio" defaultValue="priceHow" />Price: High to Low
                                                        </label>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="search-trustvardi-container" style={{ marginBottom: '0' }}>
                                                <span className="search-label-2">Company Type</span>
                                                <div style={{ marginTop: '20px', position: 'relative' }}>
                                                    <span
                                                        className="search-trustvardi-assured-text">Product</span>
                                                    {this.getQueryVariable('vendorType') && this.getQueryVariable('vendorType').includes('product') &&
                                                        <MdCheckBoxOutlineBlank onClick={() => this.addVendorTypeFilter('product')}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                    {!this.getQueryVariable('vendorType') &&
                                                        <MdCheckBoxOutlineBlank onClick={() => this.addVendorTypeFilter('product')}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                    {this.getQueryVariable('vendorType') && this.getQueryVariable('vendorType').indexOf('product') !== -1 &&
                                                        <MdCheckBox onClick={() => this.removeVendorTypeFilter('product')}
                                                            style={{ fill: '#ff9f00' }}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                </div>
                                                <div style={{ marginTop: '20px', position: 'relative' }}>
                                                    <span
                                                        className="search-trustvardi-assured-text">Service</span>
                                                    {this.getQueryVariable('vendorType') && this.getQueryVariable('vendorType').indexOf('service') === -1 &&
                                                        <MdCheckBoxOutlineBlank onClick={() => this.addVendorTypeFilter('service')}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                    {!this.getQueryVariable('vendorType') &&
                                                        <MdCheckBoxOutlineBlank onClick={() => this.addVendorTypeFilter('service')}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                    {this.getQueryVariable('vendorType') && this.getQueryVariable('vendorType').indexOf('service') !== -1 &&
                                                        <MdCheckBox onClick={() => this.removeVendorTypeFilter('service')}
                                                            style={{ fill: '#ff9f00' }}
                                                            className="search-trustvardi-check-button" />
                                                    }
                                                </div>
                                            </div>
                                            <div style={{ height: '100px', position: 'relative' }}>
                                                <button onClick={this.resetFilter} className="reset-filter-desktop-button">RESET
                                                        FILTER
                                            </button>
                                            </div>
                                        </div>
                                    </div>


                                    {this.props.homeReducer.showAllVendors.length > 0 &&
                                        <div className="search-card-container-2">
                                            <InfiniteScroll
                                                dataLength={this.props.homeReducer.showAllVendors.length}
                                                next={() => {
                                                    if (!LOAD_MORE && !this.props.homeReducer.allVendorLoaded) {
                                                        this.loadMore();
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
                                                {this.props.homeReducer.showAllVendors.map(this.renderSearchCards)}
                                               {!this.props.homeReducer.allVendorLoaded && <SearchCardPlaceholder/>}
                                            </InfiniteScroll>
                                        </div>
                                    }
                                </div>
                                {this.props.homeReducer.showAllVendors.length === 0 &&
                                    <div className="vendor-loader-container-desktop">
                                        <span>No Profile to show</span>
                                    </div>
                                }
                            </div>
                        </div>

                    );
                }
            } else if (window.innerWidth < 768) {
                if (!this.props.filterReducer.loading) {
                    this.renderSort();
                    return (
                        <div className="search-page-container">
                            {this.renderMetaTags('Profile')}
                            <Modal
                                isOpen={this.state.showMobileFilter}
                                onRequestClose={this.closeModal}
                                style={customStyles}
                                contentLabel="Example Modal"
                            >
                                {this.mobileFilter()}
                            </Modal>
                            <Modal
                                isOpen={this.state.showSortPopup}
                                onRequestClose={this.closeModalSort}
                                style={customStylesSort}
                                contentLabel="Example Modal"
                            >
                                <div>
                                    <span className="sort-mobile-list-label">SORT BY</span>
                                    <ul className="sort-mobile-list-container">
                                        <li onClick={() => this.sortMobile('ratingLow')} id="ratingLowMob"
                                            className="sort-mobile-list-item">Rating: Low to High
                                        </li>
                                        <li onClick={() => this.sortMobile('ratingHigh')} id="ratingHighMob"
                                            className="sort-mobile-list-item">Rating: High to Low
                                        </li>
                                        <li onClick={() => this.sortMobile('newly')} id="newlyMob"
                                            className="sort-mobile-list-item">Newly Added
                                        </li>
                                        <li onClick={() => this.sortMobile('priceLow')} id="priceLowMob"
                                            className="sort-mobile-list-item">Price: Low to High
                                        </li>
                                        <li onClick={() => this.sortMobile('priceHigh')} id="priceHighMob"
                                            className="sort-mobile-list-item">Price: High to Low
                                        </li>
                                    </ul>
                                </div>
                            </Modal>
                            <div className="search-page-main-container-mobile">
                                {(this.props.match.params.city) ? this.props.match.params.city &&
                                    <h1 className="show-city-label">Showing Results for {_.find(CITIES_SEARCH, { key: this.props.match.params.city }).name}</h1> 
                                    : <p style={{fontWeight:'700',margin:'0px 10px 10px'}}>Show All TrustVardi Brands</p>
                            
                                }
                                {this.props.match.url.includes('category') &&
                                    <div className="search-page-count-mobile">
                                        <span style={{ verticalAlign: 'sub' }}>{this.props.filterReducer.count}
                                            Results {this.props.match.params.filter.indexOf('for') === -1 ? 'for' : ''} {categories[this.props.match.params.filter] ? categories[this.props.match.params.filter].name : categories[this.props.match.params.filter]}</span>
                                        {this.props.location.search.length > 1 &&
                                            <button onClick={this.resetFilter} className="filter-clear-button-near-count">Clear
                                        Filter</button>
                                        }
                                    </div>
                                }
                                {this.props.match.url.includes('collections') &&
                                    <div className="search-page-count-mobile">
                                        <span style={{ verticalAlign: 'sub' }}>{this.props.filterReducer.count}
                                            Results {this.props.match.params.filter.indexOf('for') === -1 ? 'for' : ''} {collectionsObject[this.props.match.params.filter] ? collectionsObject[this.props.match.params.filter].name : collectionsObject[this.props.match.params.filter]}</span>
                                        {this.props.location.search.length > 1 &&
                                            <button onClick={this.resetFilter} className="filter-clear-button-near-count">Clear
                                        Filter</button>
                                        }
                                    </div>
                                }
                                {this.props.homeReducer.showAllVendors.length > 0 &&
                                    <InfiniteScroll
                                        dataLength={this.props.homeReducer.showAllVendors.length}
                                        next={() => {
                                            if (!LOAD_MORE && !this.props.homeReducer.allVendorLoaded) {
                                                this.loadMore();
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
                                        {this.props.homeReducer.showAllVendors.map(this.renderSearchCards)}
                                        {!this.props.homeReducer.allVendorLoaded && <SearchCardPlaceholder/>}
                                    </InfiniteScroll>
                                }
                                {this.props.homeReducer.showAllVendors.length === 0 &&
                                    <div className="vendor-loader-container-desktop">
                                        <span>No Profile to show</span>
                                    </div>
                                }
                                <div className="search-mobile-button-container-mobile">
                                    <button style={{ color: '#ff9f00' }} className="mobile-search-filter-cancel"
                                        onClick={() => {
                                            this.setState({
                                                showSortPopup: true
                                            });
                                            document.body.style.overflow = 'hidden';
                                        }}>Sort
                                    </button>
                                    <button className="mobile-search-filter-apply" onClick={this.showFilter}>Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        } else if (this.props.match.url.includes('/experience') && !_.isEmpty(this.props.homeReducer.showAllVideos) && !this.props.homeReducer.showLoading) {
            return (
                <div className="show-all-container-holder">
                    {this.renderMetaTags('Experience')}
                    <div className="show-all-video-container">
                        <InfiniteScroll
                            dataLength={this.props.homeReducer.showAllVideos.length}
                            next={() => {
                                if (!LOAD_MORE && !this.props.homeReducer.allVideosLoaded) {
                                    this.loadMore();
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
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {this.props.homeReducer.showAllVideos.map(this.renderVideoCard)}
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
            );
        } else if (this.props.match.url.includes('/articles') && !_.isEmpty(this.props.homeReducer.showAllArticles) && !this.props.homeReducer.showLoading) {
            return (
                <div className="show-all-container-holder">
                    {this.renderMetaTags('Articles')}
                    <div className="show-all-articles-container">
                        <InfiniteScroll
                            dataLength={this.props.homeReducer.showAllArticles.length}
                            next={() => {
                                if (!LOAD_MORE && !this.props.homeReducer.allArticlesLoaded) {
                                    this.loadMore();
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
                            {window.innerWidth > 768 &&
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    <div className="all-articles-container">
                                        <span className="show-all-label">Explore more here...</span>
                                        <div style={{ marginTop: '20px' }}>
                                            {this.props.homeReducer.showAllArticles.map(this.renderArticlesCard)}
                                            {!this.props.homeReducer.allArticlesLoaded && <ArticleCardPlaceHolder/>}
                                        </div>
                                    </div>
                                    <div id="top-article-outer-container" className="trending-articles-container">
                                        <div className="top-article-fixed-container" id="top-article-inner-container">
                                            <span className="show-all-label">Popular on TrustVardi</span>
                                            <div style={{ marginTop: '20px' }}>
                                                {this.props.homeReducer.topArticles.map(this.renderTopArticles)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {window.innerWidth <= 768 &&
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    <div className="all-articles-container">
                                        <span className="show-all-label">Explore more here...</span>
                                        <div style={{ marginTop: '20px' }}>
                                            {this.props.homeReducer.showAllArticles.map(this.renderArticlesCard)}
                                            {!this.props.homeReducer.allArticlesLoaded && <ArticleCardPlaceHolder/>}
                                        </div>
                                    </div>
                                    {/* <div className="trending-articles-container">
                                        <div className="top-article-fixed-container">
                                            <span className="show-all-label">Popular on TrustVardi</span>
                                            <div style={{ marginTop: '20px' }}>
                                                {this.props.homeReducer.topArticles.map(this.renderTopArticles)}
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            }
                        </InfiniteScroll>
                    </div>
                </div>
            );
        } else if (this.props.match.url.includes('/products') && !_.isEmpty(this.props.homeReducer.showAllProducts) && !this.props.homeReducer.showLoading) {
            return (
                <div className="show-all-container-holder">
                    {this.renderMetaTags('Products')}
                    <div className="show-all-video-container">
                        <InfiniteScroll
                            dataLength={this.props.homeReducer.showAllProducts.length}
                            next={() => {
                                if (!LOAD_MORE && !this.props.homeReducer.allProductsLoaded) {
                                    this.loadMore();
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
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {this.props.homeReducer.showAllProducts.map(this.renderProductCard)}
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
            );
        } else if (_.isEmpty(this.props.homeReducer.showAllVendors) && !this.props.homeReducer.showLoading) {
            return (
                <div className="vendor-loader-container-desktop">
                    <span>No Vendor to show</span>
                </div>
            );
        } else {
            return (
                <div className="vendor-loader-container-desktop">
                    <img alt="" className="vendor-loader-desktop" src={loader} />
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

export default connect((state) => state, mapDispatchToProps)(ShowAll);