import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
import '../assets/css/vendor.card.css';
import MdThumbUp from 'react-icons/lib/md/thumb-up';
import MdThumbDown from 'react-icons/lib/md/thumb-down';
import MdShare from 'react-icons/lib/md/share';
import FaStar from 'react-icons/lib/fa/star';
import _ from 'lodash';
import { imageTransformation } from '../util/util';

class VendorCard extends Component {
    render() {
        if(window.innerWidth > 768) {
            return (
                <div className="card-card-container">
                    <div className="tending-card-main">
                        <div className="card-card-img" style={{backgroundImage: `url(${imageTransformation(this.props.card.image)})`}}>
                            {this.props.card.type === 'product' &&
                            <span className="product-badge">Product</span>
                            }
                            {this.props.card.type === 'service' &&
                            <span className="service-badge">Service</span>
                            }
                            <div className="card-card-img-overlay">
                                <p className="card-card-img-overlay-title">{this.props.card.title}</p>
                                <p className="card-card-img-overlay-address">{this.props.card.address}</p>
                            </div>
                        </div>
                        <div className="card-second-row">
                        <span className="card-card-vendor-rating card-card-vertically-center">
                                <span className="card-card-rating-holder">{this.props.card.rating}
                                    <FaStar className="card-card-vertically-center" style={{marginLeft: '5px'}}/>
                                </span>
                        </span>
                            <span className="card-card-vertically-center card-card-review-count">
                            <span className="card-card-review-count-number">{this.props.card.reviews} Reviews</span>
                        </span>
                            <MdThumbUp className="card-card-vertically-center like-card-icon" style={{ left: '65%' }}/>
                            <span className="card-card-vertically-center like-card-count" style={{ left: '74%', color:'#2c3249', fontSize: '12px' }}>{this.props.card.like}</span>
                            <MdThumbDown className="card-card-vertically-center dislike-card-icon" style={{ left: '82%' }}/>
                            <span className="card-card-vertically-center dislike-card-count" style={{ left: '89%', color:'#2c3249', fontSize: '12px' }}>{this.props.card.dislikes}</span>
                        </div>
                        <div className="card-third-row">
                        <span
                            className="card-card-vertically-center card-card-description">{this.props.card.description}</span>
                        </div>
                        <div className="card-fourth-row">
                            <MdShare className="card-card-vertically-center share-icon-card" style={{ right: '22%' }}/>
                            <span className="card-card-vertically-center" style={{ right: '7%', fontSize: '12px' }}>Share</span>
                        </div>
                    </div>
                </div>
            );
        } else if (window.innerWidth <= 768) {
            return (
                <div className="card-card-container">
                    <div className="tending-card-main">
                        <div className="card-card-img" style={{backgroundImage: `url(${imageTransformation(this.props.card.image)})`}}>
                            {this.props.card.type === 'product' &&
                            <span className="product-badge">Product</span>
                            }
                            {this.props.card.type === 'service' &&
                            <span className="service-badge">Service</span>
                            }
                            <div className="card-card-img-overlay">
                                <p className="card-card-img-overlay-title">{this.props.card.title}</p>
                                <p className="card-card-img-overlay-address">{this.props.card.address}</p>
                            </div>
                        </div>
                        <div className="card-second-row">
                        <span className="card-card-vendor-rating card-card-vertically-center">
                                <span className="card-card-rating-holder">{this.props.card.rating}
                                    <FaStar className="card-card-vertically-center" style={{marginLeft: '5px'}}/>
                                </span>
                        </span>
                            <span className="card-card-vertically-center card-card-review-count">
                            <span className="card-card-review-count-number">{this.props.card.reviews} Reviews</span>
                        </span>
                            <MdThumbUp className="card-card-vertically-center like-card-icon" style={{ left: '75%' }}/>
                            <span className="card-card-vertically-center like-card-count" style={{ left: '81%', color:'#2c3249', fontSize: '12px' }}>{this.props.card.like}</span>
                            <MdThumbDown className="card-card-vertically-center dislike-card-icon" style={{ left: '87%' }}/>
                            <span className="card-card-vertically-center dislike-card-count" style={{ left: '93%', color:'#2c3249', fontSize: '12px' }}>{this.props.card.dislikes}</span>
                        </div>
                        <div className="card-third-row">
                        <span
                            className="card-card-vertically-center card-card-description">{_.truncate(this.props.card.description, {
                            length: 30
                        })}</span>
                        </div>
                        <div className="card-fourth-row">
                            <MdShare className="card-card-vertically-center share-icon-card" style={{ right: '17%' }}/>
                            <span className="card-card-vertically-center" style={{ right: '7%', fontSize: '12px' }}>Share</span>
                        </div>
                    </div>
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

export default connect((state) => state, mapDispatchToProps)(VendorCard);