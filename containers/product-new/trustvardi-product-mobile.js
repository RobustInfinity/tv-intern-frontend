import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    Link
} from 'react-router-dom';
import ReactModal from 'react-modal';
import Cookies from 'universal-cookie';
import Lightbox from 'lightbox-react';
import {
    MdEdit,
    MdDelete,
    MdThumbUp,
    MdNavigateNext
} from 'react-icons/lib/md';
import _ from 'lodash';
import {
    asyncDeleteReview,
    toggleLoginModal,
    asyncSaveWishlist,
    addToCart,
    asyncLikeProductReview,
    loadMoreReviews
} from '../../action/index';
import AddReview from '../../component/add.review';
import '../../assets/css/trustvardi-product-mobile.css';
import Rating from '../../component/rating';
import loader from '../../assets/icons/loader.svg'
import Slider from 'react-slick'
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
import { convertDate, imageTransformation } from '../../util/util';
import ProductCardBasic from '../../component/product-card-basic';
import QueryFormModal from '../../component/query-form-modal';
import { CITIES_SEARCH } from '../../constant/static';
import { trustvardiCertifiedIcon } from '../../assets/icons/icons'
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

const showChar = 90;
const ellipsestext = '...';
const moreText = "View More";
const lessText = "View Less";

class TrustVardiProductMobile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 0,
            thumbnailIndex : 0,
            quantity: 1,
            reviewModal: false,
            title: '',
            content: '',
            rating: 3,
            vendor: '',
            user: '',
            media: [],
            openLightBox: false,
            photoIndex: 0,
            showContactModal: false
        };
    }

    

    /**
     * Function to render thumbnails.
     */
    renderThumbnail = (value, index) => {
        console.log('thumb')
        return (
            <div
                onClick={() => {
                    this.setState({
                        imageIndex: index,
                        thumbnailIndex : index
                    },()=>{
                        this.slider.slickGoTo(this.state.imageIndex)
                    });
                }}
                className="t-v-thumbnail-container"
                key={index}>
                <div
                    className={`tv-productView-thumbnail-link ${this.state.imageIndex === index
                        ?
                        'tv-productView-thumbnail-link-isActive'
                        :
                        ''
                        }`}
                        // className={`tv-productView-thumbnail-link tv-productView-thumbnail-link-isActive`}
                        >
                    <img
                        alt=""
                        className="t-v-thumbnail-image"
                        src={imageTransformation(value, 100)}
                        style={{ height: "45px", width: "80px", display: 'flex' }}
                    />
                </div>
            </div>
        );
    }

    renderImageSection = (productData) => {

        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite : false,
            variableWidth : true,
            arrows : false,
            afterChange : (index)=>{
                this.setState({
                    imageIndex :  index,
                    thumbnailIndex : index
                },()=>{
                    console.log('after')
                    productData.images.map(this.renderThumbnail)
                })
            }
        }
        if(document.querySelector('.slick-slide')){
            console.log(window.innerWidth)
           var slickSlides = document.getElementsByClassName('slick-slide').
           console.log(slickSlides.length)
           for(var i = 0 ; i < slickSlides.length; i++){
               console.log(slickSlides[i].style)
                slickSlides[i].style.width = `${window.innerWidth}px!important`;
                console.log(slickSlides[i].style.width);
            }
            
            
        }
       
        console.log('render')
        return (

            <div style={{ marginBottom: '0.1rem' }} >
                {
                    <div
                        className={''
                            // "t-v-product-image-container"
                        }>
                        {
                            <Slider ref={slider => (this.slider = slider)} {...settings} >
                                {
                                    productData.images.map((image) => {
                                        return (
                                            <div
                                                style={{
                                                    // display: 'flex',
                                                    // justifyContent: 'center'
                                                }}>
                                                <img
                                                    onClick={() => {
                                                        this.setState({
                                                            openLightBox: true
                                                        });
                                                    }}
                                                    alt=""
                                                    src={
                                                        imageTransformation(image, 400)
                                                    }
                                                    style={{
                                                        width: '100%',
                                                        minHeight: '300px',
                                                        maxHeight : '300px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </Slider>
                        }
                        {
                            //  <div
                            //     style={{
                            //         display: 'flex',
                            //         justifyContent: 'center'
                            //     }}>
                            //     <img
                            //         onClick={() => {
                            //             this.setState({
                            //                 openLightBox: true
                            //             });
                            //         }}
                            //         alt=""
                            //         src={   
                            //             imageTransformation(productData.images[this.state.imageIndex], 400)
                            //         }
                            //         style={{
                            //             width: '100%',
                            //             maxHeight: '300px',
                            //             objectFit: 'cover'
                            //          }}
                            //      />
                            //  </div>
                        }
                    </div>
                }
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '.2rem'
                    }}>
                    {productData.images.map(this.renderThumbnail)}
                </div>

            </div>

        )
    }

    renderPrice = (price) => {
        if (price && parseInt(price) > 0) {
            return (
                <div
                    className="t-v-price-op">
                    ₹{price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
            )
        }
    }

    renderDiscount = (discount) => {
        if (discount && parseInt(discount) > 0) {
            return (
                <div
                    className="t-v-price-discount">
                    {discount} %
                </div>
            )
        }
    }

    deleteReview = (_id) => {
        const tempCookies = new Cookies();
        const token = tempCookies.get('token');
        if (token) {
            this.props.dispatch(asyncDeleteReview({
                token,
                product: this.props.productReducer.product._id,
                reviewId: _id
            }, true));
        }
    };

    viewAllReviews = () => {
        if (document.querySelector('#reviewContainer')) {
            var reviewCount = document.querySelector('#reviewContainer').childElementCount;
            for (var i = 2; i < reviewCount - 1; i++) {
                document.getElementsByClassName('review-card-product')[i].style.display = 'none'
            }
        }
    }

    likeReview = (review, status) => {
        const tempCookie = new Cookies();
        if (tempCookie.get('token')) {
            const actionData = {
                review,
                status,
                token: tempCookie.get('token')
            };
            this.props.dispatch(asyncLikeProductReview(actionData));
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    }

    reviewCard = (card, i) => {
        const users = this.props.productReducer.user;

        return (
            <div key={i} className="review-card-product">
                <div className="product-mobile-rating">
                    <Rating rating={card.rating} fontSize={'10px'} width={'70px'} />
                </div>
                <div className="review-card-content-product">
                    <div>
                        <span className="product-mobile-review-card-title">{card.title}</span>
                        {this.props.meReducer.isLoggedIn && this.props.meReducer.userData.user.username === card.user &&
                            <span style={{ float: 'right' }}>
                                <MdEdit onClick={() => {
                                    this.setState({
                                        reviewModal: true,
                                        title: card.title,
                                        content: card.content,
                                        rating: card.rating,
                                        vendor: card.vendor,
                                        user: card.user,
                                        media: card.media || []
                                    });
                                }} className="review-edit-del-btn" />
                                <MdDelete onClick={() => {
                                    if (window.confirm("Are you sure you want to delete your Review?")) {
                                        this.deleteReview(card._id)
                                    }
                                }} className="review-edit-del-btn" />
                            </span>
                        }
                    </div>
                    {
                        // <div style={{ float: 'none', marginTop: '10px' }} className="review-card-picture-container-product">
                        //     <img className="review-card-picture-product" src={_.find(users, { username: card.user }) ? _.find(users, { username: card.user }).profilePicture : ''} alt="" />
                        // </div>
                    }
                    <div dangerouslySetInnerHTML={{ __html: card.content }} className="product-mobile-review-card-comment">
                    </div>
                    {card.media && card.media.length > 0 &&
                        card.media.map((value, index) => {
                            return (
                                <div style={{ width: '23%', display: 'inline-block', margin: '0 1%' }}>
                                    <img style={{ width: '100%', borderRadius: '3px', cursor: 'pointer' }} src={value.link} alt="" />
                                </div>
                            );
                        })
                    }
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '15px'
                        }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <div style={{ marginTop: '10px' }} className="review-card-picture-container-product">
                                <img className="review-card-picture-product" src={_.find(users, { username: card.user }) ? _.find(users, { username: card.user }).profilePicture : ''} alt="" />
                            </div>
                            <span style={{ marginLeft: '5px', color: '#969696', fontSize: '11px' }} className="product-mobile-review-card-author">
                                By {_.find(users, { username: card.user }) ? _.find(users, { username: card.user }).displayName : ''} . {convertDate(card.time)}
                            </span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '0.5rem'
                            }}>
                            <MdThumbUp
                                onClick={() => this.likeReview(card._id, !card.isLiked)}
                                color={card.isLiked ? '#fc9c04' : 'rgb(165, 164, 164)'}
                            />
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: `${card.isLiked ? '#fc9c04' : 'rgb(165, 164, 164)'}`,
                                    marginLeft: '10px'
                                }}>
                                {card.likeCount ? card.likeCount : 0}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    addToWishList = (status) => {
        if (this.props.meReducer.isLoggedIn) {
            const tempCookie = new Cookies();
            this.props.dispatch(asyncSaveWishlist(tempCookie.get('token'), this.props.productReducer.product._id, status));
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };

    renderOptions = (value, index) => {
        return (
            <div
                style={{
                    marginBottom: '.78571rem'
                }}
                key={index}>
                <div style={{
                    color: '#666',
                    fontSize: '14px',
                    marginBottom: '0.3rem',
                }}>{value.title}</div>
                <div>
                    <select id={value.id} className="dropdown minimal">
                        {value.values.map((value, i) => {
                            return (
                                <option
                                    key={i}>
                                    {value.value}
                                </option>
                            )
                        })}
                    </select>
                </div>
            </div>
        );
    };

    buyProduct = async () => {
        const tempCookie = new Cookies();
        const cId = tempCookie.get('c_id');
        document.body.style.position = 'relative';
        document.getElementById('main-loading-overlay').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        const productData = this.props.productReducer.product;
        const cartData = {
            numberOfProducts: this.state.quantity,
            cartProductObject: {
                productId: productData._id,
                quantity: this.state.quantity
            },
            grandTotal: parseInt(productData.finalPrice),
            shippingCharges: parseInt(productData.shippingCharges),
            productIds: [productData._id],
            productId: productData._id
        };
        if (cId) {
            cartData.cartId = cId;
        }
        if (this.props.meReducer.isLoggedIn) {
            cartData.email = this.props.meReducer.userData.user.email;
        }
        if (productData.options && productData.options.length > 0) {
            const featuresOfProduct = [];
            productData.options.map(value => {
                return featuresOfProduct.push({
                    key: value.key,
                    value: document.getElementById(value.id) ? document.getElementById(value.id).value : ''
                });
            });
            cartData.cartProductObject.featuresOfProduct = featuresOfProduct;
        }
        const data = await this.props.dispatch(addToCart(cartData));
        if (data.success && !this.props.meReducer.isLoggedIn) {
            tempCookie.set('c_id', data.data._id);
        } else if (!data.success) {
            alert(data.data.message);
        }
        document.getElementById('main-loading-overlay').style.display = 'none';
        document.body.style.overflow = 'scroll';
        document.body.style.position = null;
        this.props.history.push({
            pathname: '/cart'
        });
    };

    componentDidMount = () => {
        this.toggleViewMore();
        this.animateQueryButton();
        this.animateHeader();
    }

    animateHeader = () => {
        var lastScrollTop = 500
        window.addEventListener('scroll', () => {
            if (document.querySelector('.header-container')) {

                var scrollTop = window.pageYOffset
                if (scrollTop > lastScrollTop) {
                    document.querySelector('.header-container').classList.remove('slideInDown')
                    document.querySelector('.header-container').classList.add('animated', 'slideOutUp')
                }
                if (!(scrollTop > lastScrollTop) && scrollTop > 0) {
                    document.querySelector('.header-container').classList.remove('slideOutUp')
                    document.querySelector('.header-container').classList.add('animated', 'slideInDown')
                }
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            }
        })
    }
    animateQueryButton = () => {
        window.addEventListener('scroll', () => {
            if (document.querySelector('#query-button')) {
                var queryButton = document.querySelector('#query-button')
                var queryButtonContainer = document.querySelector('#query-button-container')
                queryButtonContainer.style.display = 'flex'
                queryButtonContainer.style.justifyContent = 'center'
                queryButtonContainer.style.position = 'fixed'
                queryButtonContainer.style.bottom = '0px'
                queryButtonContainer.style.width = '100%'
                queryButtonContainer.style.left = '0px'
                queryButton.style.width = '100%'
                if (document.querySelector('#query-form-section')) {
                    if (document.querySelector('#query-form-section').getBoundingClientRect().bottom <= 600) {
                        queryButtonContainer.style.position = 'sticky'
                    } else {
                        queryButton.classList.remove('slideOutDown')
                        queryButton.classList.add('animated', 'slideInUp')
                    }
                }
            }
        })
    }

    setTruncatedHtml = (content) => {
        if (content) {

            if (content.length > showChar) {
                var c = content.substr(0, showChar)
                var h = content.substr(showChar, content.length - showChar)
                var html = c + '<span class="moreellipses">&nbsp;&nbsp;'
                    + ellipsestext + '</span><span class="morecontent"><span>'
                    + h + '</span><button class="morelink">' + moreText +
                    '</button></span>'
                return html;
            }
        }
    }

    toggleViewMore = () => {
        if (document.querySelector('.morelink')) {
            document.querySelector('.morelink').addEventListener('click', () => {
                var btnText = document.querySelector('.morelink').innerHTML
                if (btnText === moreText) {
                    if (document.querySelector('.moreellipses')) {
                        document.querySelector('.moreellipses').style.display = 'none'
                        document.querySelector('.morecontent').firstChild.style.display = 'inline'
                        document.querySelector('.morelink').innerHTML = lessText
                        document.querySelector('.morelink').style.paddingLeft = '5%'
                    }
                } else {
                    document.querySelector('.moreellipses').style.display = 'inline'
                    document.querySelector('.morecontent').firstChild.style.display = 'none'
                    document.querySelector('.morelink').innerHTML = moreText
                    document.querySelector('.morelink').style.paddingLeft = '0%'
                }
            })
        }
    }

    renderProductMainData = (productData, vendor, reviews) => {
        return (
            <div className="t-v-product-main-data">
                <div className="t-v-productView-product" style={{ paddingBottom: "0px" }}>
                    {productData.productType === 'product' &&
                        <Link
                            style={{
                                textDecoration: 'none'
                            }}
                            to={{
                                pathname: `/profile/${vendor.username}`
                            }}>
                            <p
                                style={{
                                    color: '#666',
                                    margin: '0'
                                }}>{vendor.displayName}</p>
                        </Link>
                    }
                    <h1
                        className="t-v-productView-title"
                        style={{ fontWeight: "700", fontSize: '22px', lineHeight: '1.1', marginTop: "0.5em" }}>
                        {productData.title}
                    </h1>
                    {productData.productType === 'product' &&
                        <div
                            className="t-v-price" >
                            <div
                                className="t-v-price-finalPrice">₹{productData.finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                            {this.renderPrice(productData.price)}
                            {this.renderDiscount(productData.discount)}
                        </div>
                    }
                    <div style={{ display: 'flex', alignItems: 'center', margin: '0.8rem 0px' }}>
                        <span style={{ display: "inline-block" }}>
                            <Rating
                                fontSize="14"
                                paddingVer="1"
                                paddingHor="7"
                                rating={productData.rating}
                            />
                        </span>
                        <span style={{ display: 'inline-block', marginLeft: '0.5rem', color: '#a5a4a4', fontWeight: 'bold' }}>
                            <p style={{ margin: '0rem', fontSize: '12px' }}>{`${this.props.productReducer.product.reviewCount} ratings`}</p></span>
                        {
                            // <span style={{display : 'inline-block', marginLeft : '0.5rem'}} >
                            // {trustvardiCertifiedIcon('trustvardiCertifiedIconMobile', true)}</span>
                        }

                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>


                    </div>
                    {productData.productType === 'service' &&
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: "0em"
                            }}>
                            <div
                                style={{
                                    fontSize: '14px',
                                    color: '#a5a4a4',
                                    // fontWeight: '700'
                                }}>Price starts from:</div>
                            <div
                                style={{
                                    // color: '#4f4f4f',
                                    fontSize: '16px',
                                    marginLeft: '10px',
                                    fontWeight: 'bold'
                                }}>₹ {
                                    (
                                        productData.priceString
                                        &&
                                        productData.priceString.length > 0
                                    )
                                        ?
                                        productData.priceString
                                        :
                                        productData.priceRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }</div>
                        </div>
                    }
                </div>

                {productData.productType === 'product' &&
                    <div>
                        {productData.options && productData.options.map(this.renderOptions)}
                        <div
                            className="t-v-quantity-label">Quantity</div>
                        <div
                            style={{
                                alignItems: 'center'
                            }}
                            className="flex-div">
                            <div
                                onClick={() => {
                                    if (this.state.quantity > 1) {
                                        this.setState({
                                            quantity: this.state.quantity - 1
                                        })
                                    }
                                }}
                                className="counter-button">−</div>
                            <div
                                style={{
                                    margin: '0 10px'
                                }}>
                                {this.state.quantity}
                            </div>
                            <div
                                onClick={() => {
                                    if (this.state.quantity < productData.totalCountInInventory) {
                                        this.setState({
                                            quantity: this.state.quantity + 1
                                        });
                                    }
                                }}
                                className="counter-button">+</div>
                        </div>
                    </div>
                }
                {productData.productType === 'service' && productData.region && productData.region.length > 0 &&
                    <div
                        style={{

                        }}>
                        <p style={{ fontSize: "14px", display: "inline", color: '#a5a4a4' }}>Available In:</p> <p style={{ display: "inline", color: 'rgb(100, 100, 100)', fontWeight: 'bold', fontSize: '14px' }}> {productData.region.map((value) => {
                            return _.find(CITIES_SEARCH, { key: value }) ? _.find(CITIES_SEARCH, { key: value }).name : ''
                        }).join(', ')}</p>
                    </div>
                }
                <div
                    style={{
                        marginBottom: '0rem'
                    }}>
                    <div
                        className="t-v-label-more-info"
                        style={{ paddingBottom: '0.5rem' }}
                    >
                        Description
                    </div>
                    <div
                        className="tv-content-more-info"
                        dangerouslySetInnerHTML={{
                            __html: this.setTruncatedHtml(productData.description).replace(/\n/g, '<br />')
                        }}
                    >

                    </div>
                </div>
                {

                }
                {reviews.length > 0 &&
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: '0rem'
                            }}
                            className="t-v-label-more-info"
                        >
                            <div>Reviews</div>
                            <div style={{}}
                                onClick={() => {
                                    if (this.props.meReducer.isLoggedIn) {
                                        this.setState({
                                            reviewModal: true
                                        });
                                        document.body.style.overflow = 'hidden';
                                    } else {
                                        this.props.dispatch(toggleLoginModal());
                                    }
                                }}
                                className="t-v-review-button">
                                Write a Review
                    </div>
                        </div>
                        <div id='reviewContainer'>
                            {reviews.map(this.reviewCard)}
                            {
                                this.props.productReducer.reviews.length >= 5
                                &&
                                !this.props.productReducer.allReviewsLoaded &&
                                <span
                                    onClick={() => {
                                        const tempCookie = new Cookies();
                                        this.props.dispatch(
                                            loadMoreReviews(
                                                productData._id,
                                                this.props.productReducer.reviews.length,
                                                tempCookie.get('token')
                                            )
                                        );
                                    }}
                                    style={{
                                        display: 'block',
                                        // justifyContent : 'center'
                                        // borderTop: '1px solid black',
                                        // borderBottom: '1px solid black',
                                        // padding: '2px 0px',
                                        // textAlign: 'center'
                                    }}>
                                    {this.props.productReducer.reviewLoading ?
                                        <span style={{ display: 'flex', justifyContent: 'center' }}>
                                            <img src={loader} alt='Loading...' width='150px'
                                                height='30px' />
                                        </span>
                                        :
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            borderBottom: '1px solid #f2f2f2',
                                            paddingBottom: '7px',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ display: 'inline-block' }}>
                                                <p style={{ margin: '0px', fontSize: '13px', fontWeight: 'bold' }}>
                                                    All {this.props.productReducer.product.reviewCount} Reviews
                                                </p>
                                            </span>
                                            <span style={{ display: 'inline-block' }}>
                                                <MdNavigateNext />
                                            </span>
                                        </div>
                                    }
                                </span>
                            }
                        </div>
                    </div>
                }
                {productData.productType === 'service' &&
                    <div
                        id="query-form-section"
                        style={{
                            marginBottom: '2rem'
                        }}>
                        <QueryFormModal
                            sku={productData.sku}
                            serviceId={productData._id}
                            service={productData}
                            history={this.props.history}
                        />
                    </div>
                }
                {productData.specification && productData.specification.length > 0 &&
                    <div>
                        <div
                            className="t-v-label-more-info">
                            Specifications
                        </div>
                        <div
                            className="tv-content-more-info">
                            {productData.specification && productData.specification.length > 0 &&
                                <ul style={{ paddingLeft: '0' }}>
                                    {productData.specification.map((value, i) => {
                                        return (
                                            <li
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingBottom: '10px'
                                                }}
                                                key={i}>
                                                <span
                                                    style={{
                                                        width: '50%',
                                                        fontWeight: '700'
                                                    }}>{Object.keys(value)[0]}</span>
                                                <span
                                                    style={{
                                                        width: '50%'
                                                    }}>{value[Object.keys(value)[0]]}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            }
                        </div>
                    </div>
                }
                {
                    // reviews.length > 0 &&
                    // <div>
                    //     <div
                    //         className="t-v-label-more-info"
                    //     >
                    //         Reviews
                    //     </div>
                    //     <div>
                    //         {reviews.map(this.reviewCard)}
                    //     </div>
                    // </div>
                }
            </div>
        )
    };

    mapProductCard = (card, i) => {
        return (
            <ProductCardBasic
                key={i}
                card={card}
            />
        );
    }

    renderSimilarProduct = () => {
        if (this.props.productReducer.similarProductLoading) {
            return (
                <div>

                </div>
            );
        } else {
            return (
                <div
                    style={{
                        marginBottom: '50px'
                    }}>
                    <div
                        style={{
                            marginLeft: '1rem',
                            marginRight: '1rem'
                        }}
                        className="t-v-label-more-info">
                        Similar {
                            this.props.productReducer.product.productType === 'product'
                                ?
                                'Products'
                                :
                                'Services'
                        }
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            paddingBottom: '2rem',
                            flexWrap: 'wrap',
                        }}>
                        {this.props.productReducer.similarProduct.map(this.mapProductCard)}
                    </div>
                </div>
            );
        }
    }

    closeModal = () => {
        this.setState({
            reviewModal: false,
            showContactModal: false
        });
        document.body.style.overflow = 'auto';
    };

    openContactModal = () => {
        this.props.history.push({
            pathname: `/service/${this.props.productReducer.product._id}`
        });
    };


    render() {
        const productData = this.props.productReducer.product;
        const reviews = this.props.productReducer.reviews;
        const vendor = this.props.productReducer.vendor;
        return (
            <div
                style={{
                    overflow: 'auto',
                    background: 'white'
                }}>
                <ReactModal
                    isOpen={this.state.reviewModal}
                    onRequestClose={this.closeModal}
                    style={mobileReviewModalStyle}
                >
                    <AddReview
                        id={this.props.productReducer.product._id}
                        data={this.state} product={true} match={this.props.match} closeModal={this.closeModal} />
                </ReactModal>
                <ReactModal
                    isOpen={this.state.showContactModal}
                    onRequestClose={this.closeModal}
                    style={mobileReviewModalStyle}
                >
                    <QueryFormModal closeModal={this.closeModal} />
                </ReactModal>
                {this.state.openLightBox && (
                    <Lightbox
                        imageCaption={`${this.state.imageIndex + 1} / ${productData.images.length}`}
                        mainSrc={productData.images[this.state.imageIndex]}
                        nextSrc={productData.images[(this.state.imageIndex + 1) % productData.images.length]}
                        prevSrc={productData.images[(this.state.imageIndex + productData.images.length - 1) % productData.images.length]}
                        onCloseRequest={() => this.setState({ openLightBox: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                imageIndex: (this.state.imageIndex + productData.images.length - 1) % productData.images.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                imageIndex: (this.state.imageIndex + 1) % productData.images.length,
                            })
                        }
                    />
                )}
                {
                    // <div id='query-button' style={{
                    //     display : 'none',
                    //     position : "fixed",
                    //     bottom : '-1px',
                    //     width : '100%',
                    //     zIndex : '11111',
                    //     animationDuration: '.3s',
                    //     animationDelay: '0s',
                    // }}>
                    //         <button style={{
                    //             color : 'white',
                    //             background : 'black',
                    //             border : 'none',
                    //             padding : '10px 10px',
                    //             fontSize : '0.8rem',
                    //             width : '100%',
                    //             letterSpacing : '1px',
                    //             backgroundColor : '#594AA5'
                    //         }} onClick={
                    //                 ()=> scrollToComponent(this.queryForm, {offSet : 0, align : 'top', duration : 300})}> 
                    //             ENROLL NOW </button>
                    // </div>
                }
                <div
                    className="t-v-product-container">
                    <div style={{ height: "55px" }}></div>
                    {this.renderImageSection(productData)}
                    {this.renderProductMainData(productData, vendor, reviews)}
                </div>
                {this.renderSimilarProduct()}
                <div>
                    {productData.productType === 'product' &&
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                position: 'fixed',
                                width: '100%',
                                height: '50px',
                                bottom: 0
                            }}>
                            {!productData.isWishListed &&
                                <button
                                    onClick={() => this.addToWishList(true)}
                                    className="t-v-wish-list">Add to Wish list</button>
                            }
                            {productData.isWishListed &&
                                <button
                                    onClick={() => this.addToWishList(false)}
                                    className="t-v-wish-list">Wishlisted</button>
                            }
                            <button
                                onClick={this.buyProduct}
                                className="t-v-buy-btn">Buy Now</button>
                        </div>
                    }

                </div>
            </div>
        );
    }
}

export default connect((state) => state)(TrustVardiProductMobile);