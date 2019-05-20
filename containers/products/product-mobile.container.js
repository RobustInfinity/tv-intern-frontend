/* eslint-disable radix*/
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import ReactModal from 'react-modal';
import AddReview from '../../component/add.review';
import {
    asyncSaveWishlist,
    toggleLoginModal,
    asyncDeleteReview
} from '../../action/index';
import {
    categories
} from '../../constant/static';
import {
    // FaStar,
    FaHeartO,
    FaHeart,
    FaShoppingCart,
    // FaAngleDown
} from 'react-icons/lib/fa';
import {
    MdEdit,
    MdDelete
} from 'react-icons/lib/md';
import Rating from '../../component/rating';
import {
    convertDate
} from "../../util/util";
import '../../assets/css/product-mobile.css';
import { Link } from 'react-router-dom';
import TrustvardiProductMobile from '../product-new/trustvardi-product-mobile';

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

class ProductMobile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 0,
            reviewModal: false,
            title: '',
            content: '',
            rating: 3,
            vendor: '',
            user: ''
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
                    <div style={{ float: 'none', marginTop: '10px' }} className="product-mobile-rating">
                        <Rating rating={card.rating} fontSize={'10px'} width={'70px'} />
                    </div>
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
                    <div>
                        <span className="product-mobile-review-card-author" style={{}}>
                            By {_.find(users, { username: card.user }) ? _.find(users, { username: card.user }).displayName.split(" ")[0] : ''} On {convertDate(card.time)}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

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

    render() {

        const productData = this.props.productReducer.product;
        const reviews = this.props.productReducer.reviews;
        const vendor = this.props.productReducer.vendor;
        if (productData.isSoldOnTrustVardi) {
            return (
                <TrustvardiProductMobile {...this.props} />
            )
        } else {
            return (
                <div className="product-mobile-container">
                    <div className="product-main-container">
                        <ReactModal
                            isOpen={this.state.reviewModal}
                            style={mobileReviewModalStyle}
                            onRequestClose={this.closeModal}
                        >
                            <AddReview
                                id={this.props.productReducer.product._id}
                                data={this.state}
                                product={true}
                                match={this.props.match}
                                closeModal={this.closeModal} />
                        </ReactModal>
                        <div className="product-image-container">
                            <div className="product-mobile-large-image-container">
                                <img className="product-mobile-large-image" src={productData.images[this.state.imageIndex]} alt="" />
                            </div>
                            <div className="product-mobile-small-image-container">
                                {productData.images.map((value, i) => {
                                    if (this.state.imageIndex === i) {
                                        return (
                                            <div className="product-mobile-small-image-container-inner-active" key={i} onClick={() => {
                                                this.setState({
                                                    imageIndex: i
                                                });
                                            }}>
                                                <img className="product-mobile-small-image" src={value} alt="" />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className="product-mobile-small-image-container-inner" key={i} onClick={() => {
                                                this.setState({
                                                    imageIndex: i
                                                });
                                            }}>
                                                <img className="product-mobile-small-image" src={value} alt="" />
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                        <div className="product-detail-container">
                            <span className="product-mobile-vendor-name"><Link style={{ textDecoration: 'none' }} to={{ pathname: `/profile/${this.props.productReducer.vendor.username}` }}>By {vendor.displayName}</Link></span>
                            <span className="product-mobile-product-name">{productData.title}</span>
                            {productData.warranty && productData.warranty.length > 0 &&
                                <span className="product-mobile-warranty">Warranty: {productData.warranty}</span>
                            }
                            <span style={{ marginTop: '9px', display: 'block', overflow: 'auto' }}>
                                <div className="product-mobile-rating">
                                    <Rating rating={productData.rating} width={'70px'} fontSize={'10px'} />
                                </div>
                                <span className="product-mobile-review-count">{productData.reviewCount} Ratings</span>
                            </span>
                            <div style={{ display: 'block', position: 'relative', marginTop: '9px' }}>
                                <span className="product-mobile-discount-price">₹{productData.finalPrice}</span>
                                {parseInt(productData.price) > 0 &&
                                    <span className="product-mobile-original-price">₹{productData.price}</span>
                                }
                                {parseInt(productData.discount) > 0 &&
                                    <span className="product-mobile-discount">({productData.discount}% off)</span>
                                }
                            </div>
                            <hr className="product-mobile-line" />
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <div style={{ position: 'relative', width: '30%', display: 'inline-block', float: 'left' }}>
                                    <span className="product-mobile-category-label">Category</span>
                                </div>
                                <div style={{ position: 'relative', width: '70%', display: 'inline-block', float: 'left' }}>
                                    {productData.category.map((value, i) => {
                                        return (
                                            <div key={i} className="product-mobile-category-icon-container">
                                                <img alt="" className="product-mobile-category-icon" src={categories[value] ? categories[value].icon : ''} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="product-mobile-description-container">
                        <div className="product-mobile-description-inner-container">
                            <div className="product-mobile-description-border">
                                <p className="product-mobile-description-label">Product Description</p>
                                <p className="product-mobile-description-text" dangerouslySetInnerHTML={{ __html: productData.description }}></p>
                            </div>
                            {productData.specification && productData.specification.length > 0 &&
                                <div className="product-mobile-specification-border">
                                    <p className="product-mobile-specification-label">Product Specification</p>
                                    <ul style={{ paddingLeft: '0', marginBottom: '0' }}>
                                        {productData.specification.map((value, i) => {
                                            return (
                                                <li className="product-mobile-specification-container" key={i}>
                                                    <span className="product-mobile-specification-key">{Object.keys(value)[0]}</span>
                                                    <span className="product-mobile-specification-text">{value[Object.keys(value)[0]]}</span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            }
                            <div className="product-review-mobile-border">
                                <span className="product-mobile-rating-label">Rating & Reviews</span>
                                <span className="product-mobile-write-review-button" onClick={this.toggleReview}>Write Review</span>
                                <div className="product-mobile-review-main-count-container">
                                    <div style={{ borderLeft: 'solid  0.7px #cfd2d4' }} className="product-mobile-review-count-container">
                                        <span className="product-mobile-main-rating">
                                            <Rating rating={productData.rating} width={'70px'} fontSize={'10px'} />
                                        </span>
                                        <span className="product-mobile-review-count-label">Rating</span>
                                    </div>
                                    <div className="product-mobile-review-count-container">
                                        <span className="product-mobile-review-count-text">{productData.reviewCount}</span>
                                        <span className="product-mobile-review-count-label">No Of Review</span>
                                    </div>
                                </div>
                                <div style={{ margin: '0px 20px 0 20px' }}>
                                    {reviews.map(this.reviewCard)}
                                </div>
                                {/*<div className="product-desktop-review-mobile-all-container">*/}
                                {/*<span className="product-desktop-review-mobile-all-text">View All Reviews</span>*/}
                                {/*<FaAngleDown className="product-desktop-review-mobile-all-icon" />*/}
                                {/*</div>*/}
                            </div>
                            <div className="product-mobile-buy-button-container">
                                {!productData.isWishListed &&
                                    <button onClick={() => this.addToWishList(true)} className="product-mobile-wishlist-button"><FaHeartO /> WISHLIST</button>
                                }
                                {productData.isWishListed &&
                                    <button onClick={() => this.addToWishList(false)} className="product-mobile-wishlist-button-active"><FaHeart /> WISHLISTED</button>
                                }
                                <button onClick={() => {
                                    window.open(productData.link, '_blank');
                                }} className="product-mobile-buy-button"><FaShoppingCart className="shopping-cart-icon" />BUY NOW</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default connect((state) => state)(ProductMobile);