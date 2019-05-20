import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import {
    Link
} from 'react-router-dom';
// import Dotdotdot from 'react-clamp'
import LineEllipsis from 'react-lines-ellipsis'

import '../assets/css/product-card-basic.css';

class ProductCardBasic extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        if (window.innerWidth > 768) {
            return (
                <div
                    className="product-card-container-new">
                    <Link
                        style={{
                            textDecoration: 'none'
                        }}
                        to={{
                            pathname: `/products/${this.props.card.sku}`
                        }}>
                        <div>
                            <img
                                className="product-card-image-new"
                                alt={this.props.card.title}
                                src={this.props.card.images[0]}
                            />
                            <div
                                className="product-card-title-new">
                                <LineEllipsis text={this.props.card.title} maxLine='2'></LineEllipsis>
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: '14px',
                                        color: '#4f4f4f'
                                    }}>₹  {this.props.card.productType === 'product'
                                        ?
                                        this.props.card.finalPrice
                                            ?
                                            this.props.card.finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            :
                                            0
                                        :
                                        this.props.card.priceRange
                                            ?
                                            this.props.card.priceRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            :
                                            0

                                    }</div>
                            </div>
                        </div>
                    </Link>
                </div>
            );
        } else {
            return (
                <div
                    className="product-card-container-new">
                    <Link
                        style={{
                            textDecoration: 'none'
                        }}
                        to={{
                            pathname: `/products/${this.props.card.sku}`
                        }}>
                        <div>
                            <img
                                className="product-card-image-new"
                                alt={this.props.card.title}
                                src={this.props.card.images[0]}
                            />
                            <div
                                className="product-card-title-new">
                                <LineEllipsis text={this.props.card.title} maxLine='2'></LineEllipsis>
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: '14px',
                                        color: '#4f4f4f',
                                    }}>₹
                                    {this.props.card.productType === 'product'
                                        ?
                                        this.props.card.finalPrice
                                            ?
                                            this.props.card.finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            :
                                            0
                                        :
                                        this.props.card.priceRange
                                            ?
                                            this.props.card.priceRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            :
                                            0

                                    }</div>
                            </div>
                        </div>
                    </Link>
                </div>
            );
        }
    }
}

export default connect((state) => state)(ProductCardBasic);