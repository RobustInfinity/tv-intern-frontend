import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
import '../assets/css/deals.card.css';
import MdShare from 'react-icons/lib/md/share';
import FaStar from 'react-icons/lib/fa/star';

class DealsCard extends Component {
    render() {
        if(window.innerWidth > 768) {
            return (
                <div className="deals-card-container">
                    <div className="deals-card-main">
                        <div className="deals-card-img" style={{backgroundImage: `url(${this.props.card.image})`}}>
                            <span className="deals-discount-button">Flat {this.props.card.discount} off</span>
                            <span className="deals-original-price"><s>₹{this.props.card.originalPrice}</s></span>
                            <div className="deals-card-img-overlay">
                            <span className="deals-card-vendor-rating">
                                <span className="deals-card-rating-holder">{this.props.card.rating}
                                    <FaStar className="deals-card-vertically-center" style={{marginLeft: '5px'}}/>
                                </span>
                        </span>
                                <span className="deals-card-review-count deals-card-vertically-center">
                            <span style={{color: 'white'}}>{this.props.card.reviews} Reviews</span>
                        </span>
                                <MdShare className="deals-card-vertically-center" style={{right: '17%', fill: '#ffffff'}}/>
                                <span className="deals-card-vertically-center"
                                      style={{right: '7%', fontSize: '12px', color: '#ffffff'}}>Share</span>
                            </div>
                        </div>
                        <div className="deals-second-row">
                            <div style={{height: '3rem', position: 'relative'}}>
                                <img src={this.props.card.userPicture}
                                     className="deals-card-vendor-image deals-card-vertically-center" alt=""/>
                                <span style={{left: '12%', fontSize: '12px'}}
                                      className="deals-card-vertically-center">{this.props.card.vendor}</span>
                            </div>
                            <div style={{height: '2rem', position: 'relative'}}>
                            <span style={{left: '12%', position: 'absolute'}}>{this.props.card.product}
                                <span style={{marginLeft: '5px'}}>₹{this.props.card.finalPrice}
                            </span>
                            </span>
                            </div>
                        </div>
                        <div className="deals-third-row">
                            <button className="third-row-buttons">Buy now</button>
                            <button className="third-row-buttons">Wishlist</button>
                        </div>
                    </div>
                </div>
            );
        } else if(window.innerWidth <= 768) {
            return (
                <div className="deals-card-container">
                    <div className="deals-card-main">
                        <div className="deals-card-img" style={{backgroundImage: `url(${this.props.card.image})`}}>
                            <span className="deals-discount-button">Flat {this.props.card.discount} off</span>
                            <span className="deals-original-price"><s>₹{this.props.card.originalPrice}</s></span>
                            <div className="deals-card-img-overlay">
                            <span className="deals-card-vendor-rating">
                                <span className="deals-card-rating-holder">{this.props.card.rating}
                                    <FaStar className="deals-card-vertically-center" style={{marginLeft: '5px'}}/>
                                </span>
                        </span>
                                <span className="deals-card-review-count deals-card-vertically-center">
                            <span style={{color: 'white'}}>{this.props.card.reviews} Reviews</span>
                        </span>
                                <MdShare className="deals-card-vertically-center share-deals-card-mobile" style={{right: '17%', fill: '#ffffff'}}/>
                                <span className="deals-card-vertically-center"
                                      style={{right: '7%', fontSize: '12px', color: '#ffffff'}}>Share</span>
                            </div>
                        </div>
                        <div className="deals-second-row">
                            <div style={{height: '3rem', position: 'relative'}}>
                                <img src={this.props.card.userPicture}
                                     className="deals-card-vendor-image deals-card-vertically-center" alt=""/>
                                <span style={{left: '12%', fontSize: '12px'}}
                                      className="deals-card-vertically-center deal-vendor-name-mobile">{this.props.card.vendor}</span>
                            </div>
                            <div style={{height: '2rem', position: 'relative'}}>
                            <span className="deals-card-product-mobile" style={{left: '12%', position: 'absolute'}}>{this.props.card.product}
                                <span style={{marginLeft: '5px'}}>₹{this.props.card.finalPrice}
                            </span>
                            </span>
                            </div>
                        </div>
                        <div className="deals-third-row">
                            <button className="third-row-buttons">Buy now</button>
                            <button className="third-row-buttons">Wishlist</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default connect((state) => state)(DealsCard);