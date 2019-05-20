/* eslint-disable radix, array-callback-return*/
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import ReactModal from 'react-modal';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import Rating from '../../component/rating';
import {
    asyncSaveWishlist,
    toggleLoginModal,
    asyncDeleteReview
} from '../../action/index';
import AddReview from '../../component/add.review';
import {
    FaStar,
    FaHeartO,
    FaHeart,
    FaShoppingCart
} from 'react-icons/lib/fa';
import {
    MdEdit,
    MdDelete
} from 'react-icons/lib/md';
import '../../assets/css/product-desktop.css';
import { convertDate } from "../../util/util";
import TrustvardiProductDesktop from '../product-new/trustvardi-product-desktop';


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

class ProductDesktop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 0,
            reviewModal: false,
            title: '',
            content: '',
            rating: 3,
            vendor: '',
            user: '',
            media: [],
            quantity: 1
        };
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

    reviewCard = (card, i) => {
        const users = this.props.productReducer.user;

        return (
            <div key={i} className="review-card-product">
                <div className="review-card-picture-container-product">
                    <img className="review-card-picture-product" src={_.find(users, { username: card.user }) ? _.find(users, { username: card.user }).profilePicture : ''} alt="" />
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

    closeModal = () => {
        this.setState({
            reviewModal: false
        });
        document.body.style.overflow = 'auto';
    };

    toggleReview = () => {
        if (this.props.meReducer.isLoggedIn) {
            this.setState({
                reviewModal: !this.state.reviewModal
            });
            document.body.style.overflow = 'hidden';
        } else {
            this.props.dispatch(toggleLoginModal());
        }
    };

    notSellingOnTrustVardi = (productData, vendor) => {
        return (
            <div className="product-detail-container">
                <span className="product-desktop-vendor-name"><Link style={{ textDecoration: 'none', color: '#594aa5' }} to={{ pathname: `/profile/${this.props.productReducer.vendor.username}` }}>By {vendor.displayName}</Link></span>
                <span className="product-desktop-product-name">{productData.title}</span>
                {productData.warranty && productData.warranty.length > 0 &&
                    <span className="product-desktop-warranty">Warranty: {productData.warranty}</span>
                }
                <span style={{
                    marginTop: '9px',
                    display: 'flex',
                    overflow: 'auto',
                    alignItems: 'center'
                }}>
                    {parseInt(productData.rating) >= 3 &&
                        <div className="product-desktop-rating">
                            <Rating rating={productData.rating} width={'70px'} fontSize={'14px'} />
                        </div>
                    }
                    {parseInt(productData.rating) < 3 &&
                        <div className="product-desktop-rating-poor">
                            <span className="product-desktop-rating-number">{productData.rating}</span>
                            <FaStar className="product-desktop-rating-icon" />
                        </div>
                    }
                    <span className="product-desktop-review-count">{productData.reviewCount} Ratings</span>
                </span>
                <div style={{ display: 'block', position: 'relative', marginTop: '10px', marginBottom: '10px' }}>
                    <span className="product-desktop-discount-price">₹{productData.finalPrice}</span>
                    {parseInt(productData.price) > 0 &&
                        <span className="product-desktop-original-price">
                            ₹{productData.price}
                        </span>
                    }
                    {parseInt(productData.discount) > 0 &&
                        <span className="product-desktop-discount">
                            ({productData.discount}% off)
                                </span>
                    }
                </div>
                {/* <div style={{ overflow: 'auto', padding: '1rem 0' }}>
                            <div style={{ position: 'relative', height: '70px', width: '100px', display: 'inline-block', float: 'left' }}>
                                <span className="product-desktop-category-label">Category</span>
                            </div>
                            <div style={{ position: 'relative', height: '70px', width: '100px', display: 'inline-block', float: 'left' }}>
                                {productData.category.map((value, i) => {
                                    return (
                                        <div key={i} className="product-desktop-category-icon-container tooltip">
                                            <div className="tooltiptext">{categories[value] ? categories[value].name : ''}</div>
                                            <img alt="" className="product-desktop-category-icon" src={categories[value] ? categories[value].icon : ''} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div> */}
                {!productData.isWishListed &&
                    <button onClick={() => this.addToWishList(true)} className="product-desktop-wishlist-button"><FaHeartO /> WISHLIST</button>
                }
                {productData.isWishListed &&
                    <button onClick={() => this.addToWishList(false)} className="product-desktop-wishlist-button"><FaHeart /> WISHLISTED</button>
                }
                <button onClick={() => {
                    window.open(productData.link, '_blank');
                }} className="product-desktop-buy-button"><FaShoppingCart className="shopping-cart-icon" />BUY NOW</button>
            </div>
        );
    }

    sellingOnTrustVardi = (productData, vendor) => {
        return (
            <div className="product-detail-container">
                <span className="product-desktop-vendor-name"><Link style={{ textDecoration: 'none', color: '#594aa5' }} to={{ pathname: `/profile/${this.props.productReducer.vendor.username}` }}>By {vendor.displayName}</Link></span>
                <span className="product-desktop-product-name">{productData.title}</span>
                {productData.warranty && productData.warranty.length > 0 &&
                    <span className="product-desktop-warranty">Warranty: {productData.warranty}</span>
                }
                <span style={{
                    marginTop: '9px',
                    display: 'flex',
                    overflow: 'auto',
                    alignItems: 'center'
                }}>
                    {parseInt(productData.rating) >= 3 &&
                        <div className="product-desktop-rating">
                            <Rating rating={productData.rating} width={'70px'} fontSize={'14px'} />
                        </div>
                    }
                    {parseInt(productData.rating) < 3 &&
                        <div className="product-desktop-rating-poor">
                            <span className="product-desktop-rating-number">{productData.rating}</span>
                            <FaStar className="product-desktop-rating-icon" />
                        </div>
                    }
                    <span className="product-desktop-review-count">{productData.reviewCount} Ratings</span>
                </span>
                <div style={{ display: 'block', position: 'relative', marginTop: '10px' }}>
                    <span className="product-desktop-discount-price">₹{productData.finalPrice}</span>
                    {parseInt(productData.price) > 0 &&
                        <span className="product-desktop-original-price">
                            ₹{productData.price}
                        </span>
                    }
                    {parseInt(productData.discount) > 0 &&
                        <span className="product-desktop-discount">
                            ({productData.discount}% off)
                                </span>
                    }
                </div>
                <div
                    style={{
                        color: '#999',
                        fontSize: '12px',
                        marginBottom: '10px'
                    }}>
                    (Delivery Charges, if applicable, will be charged at checkout.)
                </div>
                {/* {
                    (productData.options && productData.options.length > 0) &&
                    productData.options.map((value, index) => {
                        return (
                            <div key={index}>
                                <div>{value.title}</div>
                                <select
                                    className="reset-this drop-down-product"
                                    name=""
                                    id={value.id}
                                    defaultValue={null}>
                                    {value.values.map((value, i) => {
                                        return (
                                            <option key={i} value={value}>{value}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        )
                    })
                } */}
                <div
                    style={{
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}
                    className="flex-div">
                    <div>
                        Quantity:
                    </div>
                    <div
                        style={{
                            alignItems: 'center',
                            marginLeft: '10px'
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
                {!productData.isWishListed &&
                    <button onClick={() => this.addToWishList(true)} className="product-desktop-wishlist-button"><FaHeartO /> WISHLIST</button>
                }
                {productData.isWishListed &&
                    <button onClick={() => this.addToWishList(false)} className="product-desktop-wishlist-button"><FaHeart /> WISHLISTED</button>
                }
                <div>

                </div>
                <button onClick={() => {
                    window.open(productData.link, '_blank');
                }} className="product-desktop-buy-button"><FaShoppingCart className="shopping-cart-icon" />BUY NOW</button>
            </div>
        );
    }



    render() {
        const productData = this.props.productReducer.product;
        const reviews = this.props.productReducer.reviews;
        const vendor = this.props.productReducer.vendor;
        if (productData.isSoldOnTrustVardi) {
            return (
                <TrustvardiProductDesktop
                    {...this.props}
                />
            )
        } else {
            return (
                <div className="product-desktop-container">
                    <ReactModal
                        isOpen={this.state.reviewModal}
                        onRequestClose={this.closeModal}
                        style={desktopReviewModalStyle}
                    >
                        <AddReview 
                        id={this.props.productReducer.product._id}
                        data={this.state} product={true} match={this.props.match} closeModal={this.closeModal} />
                    </ReactModal>
                    <div className="product-main-container">
                        <div className="product-image-container">
                            <div className="product-desktop-small-image-container">
                                {productData.images.map((value, i) => {
                                    return (
                                        <img onClick={() => {
                                            this.setState({
                                                imageIndex: i
                                            });
                                        }} className="product-desktop-small-image" key={i} src={value} alt="" />
                                    );
                                })}
                            </div>
                            <div className="product-desktop-large-image-container">
                                <img className="product-desktop-large-image" src={productData.images[this.state.imageIndex]} alt="" />
                            </div>
                        </div>
                        {productData.isSoldOnTrustVardi && this.sellingOnTrustVardi(productData, vendor)}
                        {!productData.isSoldOnTrustVardi && this.notSellingOnTrustVardi(productData, vendor)}
                    </div>
                    <div className="product-desktop-description-container">
                        <div className="product-desktop-description-inner-container">
                            <p className="product-desktop-description-label">Product Description</p>
                            <p className="product-desktop-description-text" dangerouslySetInnerHTML={{ __html: productData.description }}></p>
                            {productData.specification && productData.specification.length > 0 &&
                                <p className="product-desktop-specification-label">Product Specification</p>
                            }
                            {productData.specification && productData.specification.length > 0 &&
                                <ul style={{ paddingLeft: '0' }}>
                                    {productData.specification.map((value, i) => {
                                        return (
                                            <li className="product-desktop-specification-container" key={i}>
                                                <span className="product-desktop-specification-key">{Object.keys(value)[0]}</span>
                                                <span className="product-desktop-specification-text">{value[Object.keys(value)[0]]}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            }
                            <p className="product-desktop-rating-label">Rating & Reviews</p>
                            <div className="product-desktop-review-main-count-container">
                                <div style={{ borderLeft: 'solid  0.7px #cfd2d4' }} className="product-desktop-review-count-container">
                                    <span className="product-desktop-main-rating">
                                        <Rating rating={productData.rating} width={'70px'} fontSize={'14px'} />
                                    </span>
                                    <span className="product-desktop-review-count-label">Rating</span>
                                </div>
                                <div className="product-desktop-review-count-container">
                                    <span className="product-desktop-review-count-text">{productData.reviewCount}</span>
                                    <span className="product-desktop-review-count-label">No Of Review</span>
                                </div>
                                <div className="product-desktop-review-count-container">
                                    <span className="product-desktop-write-review-label">Write your own Review</span>
                                    <span className="product-desktop-write-review-button" onClick={this.toggleReview}>Write Review</span>
                                </div>
                            </div>
                            <div style={{ marginTop: '50px' }}>
                                {reviews.map(this.reviewCard)}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default connect((state) => state)(ProductDesktop);