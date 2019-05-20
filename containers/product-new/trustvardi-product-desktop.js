import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    Link
} from 'react-router-dom';
import ReactModal from 'react-modal';
import Cookies from 'universal-cookie';
import {
    MdEdit,
    MdDelete,
    MdThumbUp
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
import ReactImageMagnify from 'react-image-magnify';
import '../../assets/css/trustvardi-product-desktop.css';
import Rating from '../../component/rating';
import { convertDate, imageTransformation } from '../../util/util';
import ProductCardBasic from '../../component/product-card-basic';
import QueryFormModal from '../../component/query-form-modal';
import { CITIES_SEARCH } from '../../constant/static';

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

class TrustVardiProductDesktop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 0,
            quantity: 1,
            reviewModal: false,
            title: '',
            content: '',
            rating: 3,
            vendor: '',
            user: '',
            media: [],
            showContactModal: false,
            enableZoom: false

        };
    }

    /**
     * Function to render thumbnails.
     */
    renderThumbnail = (value, index) => {
        return (
            <div
                onClick={() => {
                    this.setState({
                        imageIndex: index
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
                        }`}>
                    <img
                        alt=""
                        className="t-v-thumbnail-image"
                        style={{ height: "55px", width: "80px" }}
                        src={imageTransformation(value, 600)}
                    />
                </div>
            </div>
        );
    }

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
    }

    renderImageSection = (productData) => {

        return (
            // <div style={{height : "100%"}}>
            <div
                className="t-v-product-image-container" >
                <div id="product-image-container" >

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }} onClick={() => { this.setState({ enableZoom: !this.state.enableZoom }) }}>
                        {this.state.enableZoom ?
                            <ReactImageMagnify {...{
                                smallImage: {
                                    isFluidWidth: true,
                                    src: imageTransformation(productData.images[this.state.imageIndex], 600)
                                },
                                largeImage: {
                                    src: productData.images[this.state.imageIndex],
                                    width: 800,
                                    height: 600
                                },
                                enlargedImageStyle: {
                                    objectFit: 'cover',
                                    zIndex: '10000000'
                                },
                                imageStyle: {
                                    objectFit: "cover",
                                    paddingLeft: "0",
                                    alignContent: "center",
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    minHeight: '400px',
                                    maxHeight: '400px',
                                }
                            }} /> :
                            <div style={{ position: "relative", overflow: "hidden" }}>
                                {
                                    <img
                                        alt=""
                                        style={{
                                            objectFit: "cover",
                                            paddingLeft: "0",
                                            alignContent: "center",
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            minHeight: '400px',
                                            maxHeight: '400px',
                                        }}
                                        src={
                                            imageTransformation(productData.images[this.state.imageIndex], 600)
                                        }
                                    />
                                }
                            </div>
                        }
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            marginTop: '.78571rem'
                        }}>
                        {productData.images && productData.images.map(this.renderThumbnail)}
                    </div>
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
            <div key={i} className="new-product-review">
                <div className="review-card-picture-container-product">
                    <img className="new-review-card-picture-product" src={_.find(users, { username: card.user }) ? _.find(users, { username: card.user }).profilePicture : ''} alt="" />
                </div>
                <div className="review-card-content-product">
                    <div>
                        <div style={{ display: 'inline-block' }}>
                            <Rating rating={card.rating} width={'70px'} fontSize={'14px'} />
                        </div>
                        {/*{parseInt(card.rating) >= 3 &&*/}
                        {/*<div className="product-desktop-rating">*/}
                        {/*<span className="product-desktop-rating-number">{card.rating}</span>*/}
                        {/*<FaStar className="product-desktop-rating-icon"/>*/}
                        {/*</div>*/}
                        {/*}*/}
                        {/*{parseInt(card.rating) < 3 &&*/}
                        {/*<div className="product-desktop-rating-poor">*/}
                        {/*<span className="product-desktop-rating-number">{card.rating}</span>*/}
                        {/*<FaStar className="product-desktop-rating-icon"/>*/}
                        {/*</div>*/}
                        {/*}*/}
                        {card.title && card.title.length > 0 &&
                            <span className="product-desktop-review-card-title">{card.title}</span>
                        }
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
                    {card.content !== '<p><br></p>' &&
                        <div dangerouslySetInnerHTML={{ __html: card.content }} className="product-desktop-review-card-comment">

                        </div>
                    }
                    <div
                        onClick={() => this.likeReview(card._id, !card.isLiked)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                            maxWidth: '70px',
                            cursor: 'pointer'
                        }}>
                        <MdThumbUp
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
                    <div style={{ display: 'block' }}>
                        <span className="product-desktop-review-card-author">
                            By {_.find(users, { username: card.user }) ? _.find(users, { username: card.user }).displayName : ''} On {convertDate(card.time)}
                        </span>
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
            tempCookie.set('c_id', data.data._id, {
                path: '/'
            });
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

    openContactModal = () => {
        const queryForm = document.getElementById('query-form-section');
        if (queryForm) {
            queryForm.style.height = '100%'
        }
    };

    renderProductMainData = (productData, vendor, reviews) => {
        return (
            <div className="t-v-product-main-data" id="product-main-data">
                <div className="t-v-productView-product">
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: "0.5em"
                        }}>
                        <h1
                            className="t-v-productView-title"
                            style={{ fontWeight: "bold" }}>
                            {productData.title}
                        </h1>
                    </div>
                    <div style={{ display: "flex", marginBottom: "0.7em" }}>
                        <Rating
                            fontSize="14"
                            paddingVer="0.5"
                            paddingHor="3"
                            rating={productData.rating}
                        />
                    </div>
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
                                    margin: '0 0 1rem 0'
                                }}>By {vendor.displayName}</p>
                        </Link>
                    }
                    {productData.productType === 'product' &&
                        <div
                            className="t-v-price">
                            <div
                                className="t-v-price-finalPrice">₹{productData.finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                            {this.renderPrice(productData.price)}
                            {this.renderDiscount(productData.discount)}
                        </div>
                    }
                    {productData.productType === 'service' &&
                        <div
                            className="t-v-price">
                            <div
                                className="t-v-price-finalPrice"
                                style={{ fontSize: "14px" }} >Price starts from: ₹ {
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

                    {productData.productType === 'service' && productData.region && productData.region.length > 0 &&
                        <div
                            style={{
                                marginBottom: '0.7rem'
                            }}>
                            <p style={{ fontWeight: "700", fontSize: "16px", display: "inline" }}>Available In:</p> <p style={{ display: "inline" }}> {productData.region.map((value) => {
                                return _.find(CITIES_SEARCH, { key: value }) ? _.find(CITIES_SEARCH, { key: value }).name : ''
                            }).join(', ')}</p>
                        </div>
                    }
                    <div>
                        <div
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
                </div>
                {productData.productType === 'product' &&
                    <div
                        style={{
                            marginBottom: '2rem'
                        }}>
                        {productData.options && productData.options.map(this.renderOptions)}
                        <div
                            className="t-v-quantity-label">Quantity</div>
                        <div
                            style={{
                                alignItems: 'center',
                                marginBottom: '2rem'
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
                        <div>
                            <button onClick={this.buyProduct} className="t-v-buy-btn">Buy Now</button>
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
                        </div>
                    </div>
                }
                <div
                    style={{
                        marginBottom: '1rem'
                    }}>
                    <div
                        className="t-v-label-more-info"
                    >
                        Description
                    </div>
                    <div
                        className="tv-content-more-info"
                        dangerouslySetInnerHTML={{
                            __html: productData.description.replace(/\n/g, '<br />')
                        }}>

                    </div>
                </div>

                {productData.productType === 'service' &&
                    <div
                        id="query-form-section"
                        style={{
                            marginBottom: '1rem'
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
                {reviews.length > 0 &&
                    <div>
                        <div
                            className="t-v-label-more-info"
                        >
                            Reviews
                        </div>
                        <div>
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
                                        borderTop: '1px solid black',
                                        borderBottom: '1px solid black',
                                        padding: '2px 0px',
                                        textAlign: 'center',
                                        cursor: 'pointer'
                                    }}>
                                    {this.props.productReducer.reviewLoading ? 'Loading...' : 'View More'}
                                </span>
                            }
                        </div>
                    </div>
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
                <div id="similar-product"
                    style={{
                        padding: '0 100px 0 100px'
                    }}>
                    <div
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
                            paddingBottom: '2rem'
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


    render() {
        const productData = this.props.productReducer.product;
        const reviews = this.props.productReducer.reviews;
        const vendor = this.props.productReducer.vendor;

        return (
            <div
                style={{
                    background: 'white',
                    minWidth: '1000px'
                }}>
                <ReactModal
                    isOpen={this.state.reviewModal}
                    onRequestClose={this.closeModal}
                    style={desktopReviewModalStyle}
                >
                    <AddReview
                        id={this.props.productReducer.product._id}
                        data={this.state} product={true} match={this.props.match} closeModal={this.closeModal} />
                </ReactModal>
                <ReactModal
                    isOpen={this.state.showContactModal}
                    onRequestClose={this.closeModal}
                    style={desktopReviewModalStyle}
                >
                    <QueryFormModal closeModal={this.closeModal} />
                </ReactModal>
                <div
                    style={{
                        height: '8rem'
                    }}>

                </div>
                <div
                    className="t-v-product-container" >
                    {this.renderImageSection(productData)}
                    {this.renderProductMainData(productData, vendor, reviews)}
                </div>
                {this.renderSimilarProduct()}
            </div>
        );
    }
}

export default connect((state) => state)(TrustVardiProductDesktop);