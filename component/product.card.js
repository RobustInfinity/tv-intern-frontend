/* eslint-disable array-callback-return, radix */
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    Link
} from 'react-router-dom';
import _ from 'lodash';
import Rating from '../component/rating';
// import {
//     asyncShareModal
// } from '../action/index';
import {
    addPenIcon
} from '../assets/icons/icons';
// import MdShare from 'react-icons/lib/md/share';
// import FaStar from 'react-icons/lib/fa/star';
import '../assets/css/product.card.css';
import { imageTransformation } from '../util/util';

class ProductCard extends Component {

    goToProduct = () => {
        if (this.props.match.url.indexOf('/admin') === -1) {
            this.props.history.push({
                pathname: `/products/${this.props.card.sku}`
            });
        }
    };

    goToWebsite = () => {
        window.open(this.props.card.link, '_blank');
    };

    render() {
        if (window.innerWidth > 768) {

            let marginBottom = '30px';

            if (this.props.userPage) {
                marginBottom = '0';
            }

            return (
                <div style={{ marginBottom }} className="product-card-container">
                    <div className="product-card-main">
                        <div className="product-card-img">
                            <Link rel="nofollow" to={`/products/${this.props.card.sku}`}>
                                <div className="product-img-overlay-hover">
                                    <span className="product-img-overlay-hover-text">
                                        VIEW {(this.props.card.productType === 'service') ? 'SERVICE' : 'PRODUCT'}
                                    </span>
                                </div>
                                <img className="product-card-image-tag" src={imageTransformation(this.props.card.images[0], 400)} alt="" />
                            </Link>
                            <div className="product-card-img-overlay">
                                <span className="product-card-vendor-rating">
                                    <Rating rating={this.props.card.rating} width={'60px'} fontSize={'14px'} />
                                </span>
                                <span className="product-card-review-count product-card-vertically-center">
                                    <span style={{ color: 'white' }}>{this.props.card.reviewCount} Reviews</span>
                                </span>
                                {/* <MdShare onClick={() => {
                                    this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/products/${this.props.card._id}`))
                                }} className="product-card-vertically-center" style={{
                                    right: '2%',
                                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    padding: '5px'
                                }} /> */}
                            </div>
                        </div>
                        <div className="product-second-row">
                            <Link style={{ textDecoration: 'none' }} to={`/products/${this.props.card.sku}`}>
                                <span style={{ left: '2%', fontSize: '16px', cursor: 'pointer', fontWeight: '500' }}
                                    className="product-title-desktop">{_.truncate(this.props.card.title, {
                                        length: 50
                                    })}</span>
                            </Link>
                            {this.props.match && this.props.match.url.indexOf('/admin') !== -1 &&
                                <div onClick={() => {
                                    this.props.editProduct(this.props.card);
                                }} className='edit-product'>
                                    {addPenIcon()}
                                </div>
                            }
                            {/*<div style={{minHeight: '3rem', position: 'relative', marginTop: '10px'}}>*/}
                            {/*<span onClick={this.goToProduct} style={{left: '2%', fontSize: '16px', cursor: 'pointer', fontWeight: '500'}}*/}
                            {/*className="product-card-vertically-center product-title-desktop">{this.props.card.title}</span>*/}
                            {/*</div>*/}
                            <div style={{ width: '100%' }}>
                                <span>
                                    <span style={{ fontWeight: '500' }}>
                                        ₹{this.props.card.finalPrice}
                                    </span>
                                    {parseInt(this.props.card.discount) > 0 &&
                                        <span style={{
                                            marginLeft: '10px',
                                            color: 'rgba(252, 156, 4, 1)',
                                            fontSize: '12px'
                                        }}>({this.props.card.discount} % off)</span>
                                    }
                                </span>
                            </div>
                        </div>
                        <div
                            style={{
                                flexGrow: '1',
                                display: 'flex',
                                alignItems: 'flex-end'
                            }}>
                            <div className="product-third-row">
                                <button style={{ borderRight: '1px solid rgba(151, 151, 151, 0.4)' }}
                                    className="third-row-buttons-product" onClick={this.goToWebsite}>Buy now
                            </button>
                                <button className="third-row-buttons-product" onClick={this.goToProduct}>View Product
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (window.innerWidth <= 768) {
            return (
                <div className="product-card-container">
                    <div className="product-card-main">
                        <div className="product-card-img">
                            <Link rel="nofollow" to={`/products/${this.props.card.sku}`}>
                                <img src={imageTransformation(this.props.card.images[0], 200)}
                                    className="product-card-image-tag" alt="" />
                            </Link>
                            <div className="product-card-img-overlay">
                                <div style={{ marginLeft: '5px' }}>
                                    <Rating rating={this.props.card.rating} width={'55px'} fontSize={'12px'} />
                                </div>
                                <span
                                    style={{
                                        color: 'white',
                                        fontSize: '10px',
                                        position: 'absolute',
                                        right: '10px'
                                    }}>{this.props.card.reviewCount} Reviews</span>
                                {/* <span className="product-card-vendor-rating">
                                    <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}>
                                        <Rating rating={this.props.card.rating} width={'55px'} fontSize={'12px'} />
                                    </div>
                                </span>
                                <span className="product-card-review-count product-card-vertically-center">
                                    <span style={{ color: 'white' }}>{this.props.card.reviewCount} Reviews</span>
                                </span> */}
                                {/* <MdShare onClick={() => {
                                    this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/products/${this.props.card._id}`))
                                }} className="product-card-vertically-center" style={{
                                    right: '10px',
                                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    padding: '5px',
                                    height: '10px',
                                    width: '10px'
                                }} /> */}
                            </div>
                        </div>
                        <div className="product-second-row">
                            <div style={{ position: 'relative' }}>
                                <Link style={{ textDecoration: 'none', color: 'black' }} to={`/products/${this.props.card.sku}`}>
                                    <div style={{ fontSize: '12px', fontWeight: '600' }}>{this.props.card.title}</div>
                                </Link>
                            </div>
                            <div>
                                <span className="product-card-product-mobile">{this.props.card.product}
                                    <span style={{ fontWeight: '600' }}>₹{this.props.card.finalPrice}</span>
                                    {parseInt(this.props.card.discount) > 0 &&
                                        <span style={{
                                            marginLeft: '10px',
                                            color: 'rgba(252, 156, 4, 1)',
                                            fontSize: '10px'
                                        }}>({this.props.card.discount} % off)</span>
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="product-mobile-button-container">
                            <div className="product-third-row">
                                <button className="third-row-buttons-product" onClick={this.goToWebsite}>Buy now</button>
                                <button className="third-row-buttons-product" onClick={this.goToProduct}>View Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default connect((state) => state)(ProductCard);