import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import {
    fetchCartDetails, updateEmailCart, updateShippingAddress, updateItemQuantity
} from '../../action/index';
import loader from '../../assets/icons/loader.svg';
import CartDesktop from './cart-desktop.container';
import CartMobile from './cart-mobile.container';
import { removeItemCart, clearCart } from '../../action/asyncaction/product.asyncaction';
import { rzr_key_id } from '../../constant/keys';
import { showLoader, getCallApi, postCallApi } from '../../util/util';
import { FETCH_UPDATED_CART_API, VERIFY_ORDER_API } from '../../constant/api';
import EmptyCart from '../../component/empty-cart.component';

class Cart extends Component {

    componentWillMount() {
        const tempCookies = new Cookies();
        const cartId = tempCookies.get('c_id');
        const token = tempCookies.get('token');
        this.props.dispatch(fetchCartDetails(cartId, token));
    }

    updateEmail = async (email, cartId) => {
        const data = {
            email,
            cartId
        };
        await this.props.dispatch(updateEmailCart(data));
    };

    updateShippingAddress = async (data) => {
        await this.props.dispatch(updateShippingAddress(data));
    };

    updateItemQuantity = async (data) => {
        await this.props.dispatch(updateItemQuantity(data));
    };

    removeItem = async (data) => {
        await this.props.dispatch(removeItemCart(data));
    };

    payNow = async () => {
        showLoader(true)
        const data = await getCallApi(FETCH_UPDATED_CART_API(this.props.productReducer.cart._id));
        showLoader(false);
        const cart = this.props.productReducer.cart;
        if (data.success && !data.data.outOfStock) {
            const options = {
                "key": rzr_key_id,
                "amount": data.data.cart.grandTotal * 100,
                "name": "TrustVardi",
                "description": "Purchase Description",
                "handler": async (response) => {
                    showLoader(true);
                    const cart = { ...this.props.productReducer.cart };
                    const productArray = [];
                    cart.productArrays.map((value, index) => {
                        const product = _.find(this.props.productReducer.cartProducts, { _id: value.productId });
                        if (product) {
                            productArray.push(value);
                            productArray[index].title = product.title;
                            productArray[index].image = product.images[0];
                            productArray[index].price = product.finalPrice;
                            productArray[index].status = [{
                                status: "Order Confirmed",
                                comment: "Brand Confirmed your order",
                                isDone: false,
                                created: Date.now()
                            }, {
                                status: "Processing",
                                comment: "Preparing your order",
                                isDone: false,
                                created: Date.now()
                            }, {
                                status: "Order Shipped",
                                comment: "Your order has been Shipped",
                                isDone: false,
                                created: Date.now()
                            }, {
                                status: "Order Delivered",
                                comment: "Your order has been Delivered",
                                isDone: false,
                                created: Date.now()
                            }];
                            productArray[index].vendor = product.vendor;
                        }
                        return productArray;
                    });
                    delete cart._id;
                    cart.productArrays = productArray;
                    const data = await postCallApi(VERIFY_ORDER_API, {
                        paymentId: response.razorpay_payment_id,
                        cart,
                        cartId: this.props.productReducer.cart._id
                    });
                    if (data.success && !data.data.outOfStock) {
                        const tempCookies = new Cookies();
                        tempCookies.remove('c_id');
                        this.props.dispatch(clearCart());
                        this.props.history.push({
                            pathname: '/order',
                            state: {
                                order: data.data
                            }
                        });
                    } else if(data.data.outOfStock) {
                        alert(`Some of the Products in your cart are out of stock\n ${data.data.outofStockProducts.join(', ')}`);
                    } else {
                        alert('Something went wrong, If money is deducted from your bank it will be refunded to your bank account in 2/4 days');
                    }
                    showLoader(false);
                },
                "prefill": {
                    "name": cart.shippingAddress.fullName,
                    "email": cart.email,
                    "contact": cart.shippingAddress.phoneNumber
                },
                "theme": {
                    "color": "#fc9c04"
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } else if (data.data.outOfStock) {
            alert(`Some of the Products in your cart are out of stock\n ${data.data.outofStockProducts.join(', ')}`); 
        }
        showLoader(false);
    };

    render() {
        if (this.props.productReducer.cartLoading) {
            return (
                <div className="vendor-loader-container-desktop">
                    <img alt="" className="vendor-loader-desktop" src={loader} />
                </div>
            )
        } else if (!_.isEmpty(this.props.productReducer.cart)
            &&
            (
                this.props.productReducer.cart.productArrays
                &&
                this.props.productReducer.cart.productArrays.length > 0
            )
        ) {
            if (window.innerWidth > 768) {
                return (
                    <CartDesktop
                        updateEmail={this.updateEmail}
                        updateShippingAddress={this.updateShippingAddress}
                        updateItemQuantity={this.updateItemQuantity}
                        removeItem={this.removeItem}
                        payNow={this.payNow}
                        {...this.props}
                    />
                );
            } else {
                return (
                    <CartMobile
                        updateEmail={this.updateEmail}
                        updateShippingAddress={this.updateShippingAddress}
                        updateItemQuantity={this.updateItemQuantity}
                        removeItem={this.removeItem}
                        payNow={this.payNow}
                        {...this.props} />
                );
            }
        } else {
            return (
                <EmptyCart />
            );
        }
    }
}

export default connect((state) => state)(Cart);