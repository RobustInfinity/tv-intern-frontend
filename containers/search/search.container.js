/* eslint-disable array-callback-return, radix */
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import Modal from 'react-modal';
import {
    Helmet
} from 'react-helmet';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    MdCheckBoxOutlineBlank,
    MdCheckBox,
    MdArrowDropDown,
    MdClose
} from 'react-icons/lib/md';
import {
    FaStar
} from 'react-icons/lib/fa';
import {
    fetchFilteredVendors
} from '../../action/index';
import loader from '../../assets/icons/loader.svg';
import SearchCard from '../../component/search.card';
import {
    categories,
    collectionsObject
} from '../../constant/static';
import '../../assets/css/search.css';
import '../../assets/css/home.css';
import SearchCardPlaceholder from '../../component/SearchCardPlaceholder';

let LOAD_MORE = false;

// const discountArray = [5, 10, 30, 50, 70];

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
        maxHeight: '40rem',
        backgroundColor: '#fafafa'
    },
    overlay: {
        zIndex: '12'
    }
};

let isScrollingDown = false;

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showMobileFilter: false,
            minPrice: '',
            maxPrice: '',
            trusted: false,
            rating: '',
            discount: '',
            vendorType: [],
            showPagePopup: false,
            showSortPopup: false,
            resultForGift: false,
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
    }

    distanceBetweenElems = (elem1, elem2) => {
        var e1Rect = elem1.getBoundingClientRect();
        var e2Rect = elem2.getBoundingClientRect();
        var dx = (e1Rect.left + (e1Rect.right - e1Rect.left) / 2) - (e2Rect.left + (e2Rect.right - e2Rect.left) / 2);
        var dy = (e1Rect.top + (e1Rect.bottom - e1Rect.top) / 2) - (e2Rect.top + (e2Rect.bottom - e2Rect.top) / 2);
        var dist = Math.sqrt(dx * dx + dy * dy);
        return dist;
    }

    componentWillMount() {
        window.scrollTo(0, 0);
        const filter = this.props.match.params.filter;
        const facets = this.props.location.search;
        let type = '';
        if (this.props.match.url.includes('category')) {
            type = 'category';
        }
        if (this.props.match.url.includes('collections')) {
            type = 'collections';
        }
        this.props.dispatch(fetchFilteredVendors(filter, 0, type, facets));
        this.checkFilterForMobile();
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.match.url !== nextProps.match.url) {
            const filter = nextProps.match.params.filter;
            let type = '';
            const facets = nextProps.location.search;
            if (nextProps.match.url.includes('category')) {
                type = 'category';
            }
            if (nextProps.match.url.includes('collections')) {
                type = 'collections';
            }
            nextProps.dispatch(fetchFilteredVendors(filter, 0, type, facets));
        } else if (this.props.location.search !== nextProps.location.search) {
            window.scrollTo(0, 0);
            const filter = nextProps.match.params.filter;
            let type = '';
            const facets = nextProps.location.search;
            if (nextProps.match.url.includes('category')) {
                type = 'category';
            }
            if (nextProps.match.url.includes('collections')) {
                type = 'collections';
            }
            nextProps.dispatch(fetchFilteredVendors(filter, 0, type, facets));
        }
    }

    checkFilterForMobile = () => {
        const trusted = this.getQueryVariable('trusted');
        const minPrice = this.getQueryVariable('minPrice');
        const maxPrice = this.getQueryVariable('maxPrice');
        const rating = this.getQueryVariable('rating');
        const discount = this.getQueryVariable('discount');
        const vendorType = this.getQueryVariable('vendorType');
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
        if (vendorType) {
            data.vendorType = vendorType.split(',');
        }
        this.setState(data);
    };

    loadMoreProducts = () => {
        LOAD_MORE = true;
        const filter = this.props.match.params.filter;
        const facets = this.props.location.search;
        let type = '';
        if (this.props.match.url.includes('category')) {
            type = 'category';
        }
        if (this.props.match.url.includes('collections')) {
            type = 'collections';
        }
        const position = window.pageYOffset;
        this.props.dispatch(fetchFilteredVendors(filter, this.props.filterReducer.vendor.length, type, facets))
            .then((data) => {
                LOAD_MORE = false;
                window.scrollTo(0, position);
                this.scrollCheck();
            });
    };

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
        let type = '';
        if (this.props.match.url.includes('category')) {
            type = 'category';
        }
        if (this.props.match.url.includes('collections')) {
            type = 'collections';
        }
        this.props.history.push({
            pathname: `/${type}/${this.props.match.params.filter}`,
            search: facetQuery
        });
        this.setState({
            showSortPopup: false
        });
        document.body.style.overflow = 'auto';
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
        let type = '';
        if (this.props.match.url.includes('category')) {
            type = 'category';
        }
        if (this.props.match.url.includes('collections')) {
            type = 'collections';
        }
        this.props.history.push({
            pathname: `/${type}/${this.props.match.params.filter}`,
            search: facetQuery
        });
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
        let type = '';
        if (this.props.match.url.includes('category')) {
            type = 'category';
        }
        if (this.props.match.url.includes('collections')) {
            type = 'collections';
        }
        this.props.history.push({
            pathname: `/${type}/${this.props.match.params.filter}`
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
            showPagePopup: false
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
            trusted
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
        if (vendorType && vendorType.length > 0) {
            if (q.length > 1) {
                q = q.concat(`&vendorType=${vendorType.toString()}`);
            } else {
                q = q.concat(`vendorType=${vendorType.toString()}`);
            }
        }
        if (q.length === 1) {
            q = '';
        }
        this.closeModal();
        let type = '';
        if (this.props.match.url.includes('category')) {
            type = 'category';
        }
        if (this.props.match.url.includes('collections')) {
            type = 'collections';
        }
        this.props.history.push({
            pathname: `/${type}/${this.props.match.params.filter}`,
            search: q
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
                            vendorType: []
                        });
                    }}>Reset</span>
                </div>
                <div>
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
            </div>
        );
    };

    showFilter = () => {
        this.setState({
            showMobileFilter: true
        });
        document.body.style.overflow = 'hidden';
    };


    changeCategoryCollection = (value) => {
        const search = this.props.location.search;
        const category = value;
        let type = '';
        if (this.props.match.url.includes('category')) {
            type = 'category';
        }
        if (this.props.match.url.includes('collections')) {
            type = 'collections';
        }
        this.props.history.push({
            pathname: `/${type}/${category}`,
            search: search
        });
        this.setState({
            showPagePopup: false
        });
        document.body.style.overflow = 'auto';
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

    renderMetaTags = (key, type) => {
        return (
            <Helmet>
                {key === 'Category' &&
                    <title>{(categories[type] && categories[type].metaTitle) ? categories[type].metaTitle : 'TrustVardi | Tried by Us, Trusted by You!'} | TrustVardi</title>
                }
                {key === 'Collections' &&
                    <title>{collectionsObject[type] ? collectionsObject[type].name : ''} | TrustVardi</title>
                }
                <meta name="fragment" content="!" />
                <link rel="canonical" href={`https://www.trustvardi.com/${key.toLowerCase()}/${type.toLowerCase()}`} />
                {key === 'Category' &&
                    <meta name="description" content={(categories[type] && categories[type].metaDescription) ? categories[type].metaDescription : 'Trustvardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories.'} />
                }
                {key === 'Collections' &&
                    <meta name="description" content='Trustvardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories.' />
                }
                <meta name="robots" content="index, follow" />
                <link rel="alternate" hreflang="en" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta name="keywords" content={`${type}, trustvardi`} />
                <meta name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name='HandheldFriendly' content='True' />
                {key === 'Category' &&
                    <meta property="og:title" content={(categories[type] && categories[type].metaTitle) ? categories[type].metaTitle : 'TrustVardi | Tried by Us, Trusted by You! | TrustVardi'} />
                }
                {key === 'Collections' &&
                    <meta property="og:title" content={`${key} | Trustvardi`} />
                }
                {key === 'Category' &&
                    <meta property="og:description" content={(categories[type] && categories[type].metaDescription) ? categories[type].metaDescription : 'Trustvardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories.'} />
                }
                {key === 'Collections' &&
                    <meta property="og:description" content={`Trustvardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories.`} />
                }
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={`https://www.trustvardi.com/${key.toLowerCase()}/${type.toLowerCase()}`} />
                <meta property="og:site_name" content="trustvardi" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@trustvardi" />
                <meta name="twitter:creator" content="trustvardi.com" />
                {key === 'Category' &&
                    <meta property="twitter:title" content={(categories[type] && categories[type].metaTitle) ? categories[type].metaTitle : 'TrustVardi | Tried by Us, Trusted by You! | TrustVardi'} />
                }
                {key === 'Collections' &&
                    <meta property="twitter:title" content={`"${key} | Trustvardi"`} />
                }
                {key === 'Category' &&
                    <meta property="twitter:description" content={(categories[type] && categories[type].metaDescription) ? categories[type].metaDescription : 'Trustvardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories.'} />
                }
                {key === 'Collections' &&
                    <meta property="twitter:description" content={`"Trustvardi is a "Search & Discovery" platform that enables you to browse through multiple brands, read reviews, experience and share your own stories."`} />
                }
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
                                    "@id": "https://www.trustvardi.com/${key.toLowerCase()}",
                                    "name": "${key.toUpperCase()}",
                                    "description": "${key}"
                                }
                            }, {
                                "@type": "ListItem",
                                "position": 3,
                                "item": {
                                    "@id": "https://www.trustvardi.com/${key.toLowerCase()}/${type.toLowerCase()}",
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

    render() {
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
                        {this.props.match.url.includes('/category') ? this.renderMetaTags('Category', this.props.match.params.filter) : this.renderMetaTags('Collections', this.props.match.params.filter)}
                        <Modal
                            isOpen={this.state.showPagePopup}
                            onRequestClose={this.closeModalPopup}
                            style={popupStyles}
                            contentLabel="Example Modal"
                        >
                            <div className="input-search-quick-search-container-search">
                                <div className="input-quick-search-holder">
                                    <span className="label-quick-search-page">Choose any one {this.props.match.url.includes('/category') ? 'Category' : 'Collections'}</span>
                                    <MdClose onClick={this.closeModalPopup} className="label-close-button" />
                                    {this.props.match.url.includes('/category') &&
                                        <div style={{ overflow: 'auto' }}>
                                            {_.map(categories, (value, i) => {
                                                return (
                                                    <div className="trending-tab-quick-search" key={i}>
                                                        <div
                                                            onClick={() => this.changeCategoryCollection(value.key)}
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
                                    }
                                    {this.props.match.url.includes('/collection') &&
                                        <div style={{ overflow: 'auto' }}>
                                            {_.map(collectionsObject, (value, i) => {
                                                return (
                                                    <div className="trending-tab-quick-search" key={i}>
                                                        <div
                                                            onClick={() => this.changeCategoryCollection(value.key)}
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
                                    }
                                </div>
                            </div>
                        </Modal>
                        <div className="search-page-main-container">
                            {this.props.match.url.includes('/category') &&
                                <span id="count-div" className="search-page-count">
                                  Showing Results for {categories[this.props.match.params.filter] ? categories[this.props.match.params.filter].name : ''}
                                </span>
                            }

                            {this.props.match.url.includes('/collections') &&
                                <span id="count-div" className="search-page-count">
                                    Showing Results for {collectionsObject[this.props.match.params.filter] ? collectionsObject[this.props.match.params.filter].name : ''}
                                </span>
                            }
                            <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
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
                                            {this.props.match.url.includes('/category') &&
                                                <span className="search-page-change-button">
                                                    <button onClick={() => {
                                                        this.setState({
                                                            showPagePopup: true
                                                        });
                                                        document.body.style.overflow = 'hidden';
                                                    }} className="search-dropdown">{categories[this.props.match.params.filter] ? categories[this.props.match.params.filter].name : ''} <MdArrowDropDown className="dropdown-icon" /></button>
                                                    <div style={{ display: 'inline-block', float: 'right' }}>

                                                    </div>
                                                    {/*<select onChange={this.changeCategoryCollection} className="search-dropdown" defaultValue={this.props.match.params.filter}>*/}
                                                    {/*{_.map(categories, (value) => {*/}
                                                    {/*return (*/}
                                                    {/*<option key={value.key} value={value.key}>{value.name}</option>*/}
                                                    {/*);*/}
                                                    {/*})*/}
                                                    {/*}*/}
                                                    {/*</select>*/}
                                                </span>
                                            }

                                            {this.props.match.url.includes('/collections') &&
                                                <div className="search-page-change-button">
                                                    <button onClick={() => {
                                                        this.setState({
                                                            showPagePopup: true
                                                        });
                                                    }} className="search-dropdown">{collectionsObject[this.props.match.params.filter] ? collectionsObject[this.props.match.params.filter].name : ''} <MdArrowDropDown className="dropdown-icon" /></button>
                                                    {this.props.location.search.length > 1 &&
                                                        <button onClick={this.resetFilter} className="filter-clear-button-near-count-desktop">Clear Filter</button>
                                                    }
                                                    {/*<select onChange={this.changeCategoryCollection} className="search-dropdown" defaultValue={this.props.match.params.filter}>*/}
                                                    {/*{_.map(collectionsObject, (value) => {*/}
                                                    {/*return (*/}
                                                    {/*<option key={value.key} value={value.key}>{value.name}</option>*/}
                                                    {/*);*/}
                                                    {/*})*/}
                                                    {/*}*/}
                                                    {/*</select>*/}
                                                </div>
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
                                            <div style={{ marginTop: '20px', position: 'relative' }}>

                                            </div>
                                            <div style={{ marginTop: '20px', position: 'relative' }}>
                                                <div className="sort-sortBy">
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

                                {this.props.filterReducer.vendor.length > 0 &&
                                    <div className="search-card-container-2">
                                        <InfiniteScroll
                                            next={() => {
                                                if (!LOAD_MORE && !this.props.filterReducer.allImagesLoaded) {
                                                    this.loadMoreProducts();
                                                } else {
                                                    return;
                                                }
                                            }}
                                            dataLength={this.props.filterReducer.vendor.length}
                                            hasMore={true}
                                            endMessage={
                                                <p style={{ textAlign: 'center' }}>
                                                    <b>Yay! You have seen it all</b>
                                                </p>
                                            }
                                        >
                                            {this.props.filterReducer.vendor.map((value, i) => {
                                                return (
                                                    <SearchCard history={this.props.history} key={i} card={value} />
                                                );
                                            })}
                                            {!this.props.filterReducer.loaded && <SearchCardPlaceholder/>}
                                        </InfiniteScroll>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="vendor-loader-container-desktop">
                        <img alt="" className="vendor-loader-desktop" src={loader} />
                    </div>
                )
            }
        } else if (window.innerWidth < 768) {
            if (!this.props.filterReducer.loading) {
                this.renderSort();
                return (
                    <div id="searchpagecontainer" className="search-page-container">
                        {this.props.match.url.includes('/category') ? this.renderMetaTags('Category', this.props.match.params.filter) : this.renderMetaTags('Collections', this.props.match.params.filter)}
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
                                    <li onClick={() => this.applyFacets('sort', 'ratingLow')} id="ratingLowMob" className="sort-mobile-list-item">Rating: Low to High</li>
                                    <li onClick={() => this.applyFacets('sort', 'ratingHigh')} id="ratingHighMob" className="sort-mobile-list-item">Rating: High to Low</li>
                                    <li onClick={() => this.applyFacets('sort', 'newly')} id="newlyMob" className="sort-mobile-list-item">Newly Added</li>
                                    <li onClick={() => this.applyFacets('sort', 'priceLow')} id="priceLowMob" className="sort-mobile-list-item">Price: Low to High</li>
                                    <li onClick={() => this.applyFacets('sort', 'priceHigh')} id="priceHighMob" className="sort-mobile-list-item">Price: Low to High</li>
                                </ul>
                            </div>
                        </Modal>
                        <div style={{marginTop:'3.3rem'}} className="search-page-main-container-mobile">
                            
                            {this.props.match.url.includes('category') &&
                                <div className="search-page-count-mobile">
                                    {this.props.location.search.length > 1 &&
                                        <button onClick={this.resetFilter} className="filter-clear-button-near-count">Clear Filter</button>
                                    }
                                </div>
                            }
                            {this.props.match.url.includes('collections') &&
                                <div className="search-page-count-mobile">
                                    {this.props.location.search.length > 1 &&
                                        <button onClick={this.resetFilter} className="filter-clear-button-near-count">Clear Filter</button>
                                    }
                                </div>
                            }

                            {this.props.match.url.includes('/category') &&
                                <span style={{marginBottom:'0.6rem',marginLeft:'10px'}} id="count-div" className="search-page-count-mobile">
                                  Showing Results for {categories[this.props.match.params.filter] ? categories[this.props.match.params.filter].name : ''}
                                </span>
                            }
                            {this.props.match.url.includes('/collections') &&
                                <span style={{marginBottom:'0.6rem',marginLeft:'10px'}} id="count-div" className="search-page-count-mobile">
                                    Showing Results for {collectionsObject[this.props.match.params.filter] ? collectionsObject[this.props.match.params.filter].name : ''}
                                </span>
                            }

                            {this.props.filterReducer.vendor.length > 0 &&
                                <InfiniteScroll
                                    next={() => {
                                        if (!LOAD_MORE && !this.props.filterReducer.allImagesLoaded) {
                                            this.loadMoreProducts();
                                        } else {
                                            return;
                                        }
                                    }}
                                    dataLength={this.props.filterReducer.vendor.length}
                                    hasMore={true}
                                    endMessage={
                                        <p style={{ textAlign: 'center' }}>
                                            <b>Yay! You have seen it all</b>
                                        </p>
                                    }
                                >
                                    {this.props.filterReducer.vendor.map((value, i) => {
                                        return (
                                            <SearchCard history={this.props.history} key={i} card={value} />
                                        );
                                    })}
                                    {!this.props.filterReducer.loaded && <SearchCardPlaceholder/>}
                                </InfiniteScroll>
                            }
                            <div className="search-mobile-button-container-mobile">
                                <button className="mobile-search-filter-cancel" onClick={() => {
                                    this.setState({
                                        showSortPopup: true
                                    });
                                    document.body.style.overflow = 'hidden';
                                }}>Sort
                                </button>
                                <button className="mobile-search-filter-apply" onClick={this.showFilter}>                                      
                                Filter</button>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="vendor-loader-container-desktop">
                        <img alt="" className="vendor-loader-desktop" src={loader} />
                    </div>
                )
            }
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
};

export default connect((state) => state, mapDispatchToProps)(Search);