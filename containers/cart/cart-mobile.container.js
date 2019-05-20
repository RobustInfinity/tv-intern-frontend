import React, { Component } from 'react';
import _ from 'lodash';
import '../../assets/css/cart-mobile.css';
import { showLoader, valueFromElemId, validateEmail } from '../../util/util';

class CartMobile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCustomerSection: true,
            showCustomerDetailsSection: false,
            showPaymentSection: false
        };
    }

    componentWillMount() {
        if (this.props.productReducer.cart.email && this.props.productReducer.cart.email.length > 4) {
            this.setState({
                showCustomerSection: false,
                showCustomerDetailsSection: true
            });
        }
    }


    addContactInformation = async () => {
        const email = valueFromElemId('email');
        if (!validateEmail(email)) {
            return alert('Please fill a valid e-mail ID');
        }
        showLoader(true);
        await this.props.updateEmail(email, this.props.productReducer.cart._id);
        this.setState({
            showCustomerSection: false,
            showCustomerDetailsSection: true
        }, () => {
            showLoader(false);
        });
    };

    editCustomerInformation = () => {
        this.setState({
            showCustomerSection: true,
            showCustomerDetailsSection: false,
            showPaymentSection: false
        });
    };

    addCustomerDetails = async (event) => {
        event.preventDefault();
        let isError = false;
        const fields = [
            'fullName',
            'address',
            'city',
            'state',
            'pinCode',
            'phoneNumber'
        ];
        const errorFields = [];
        const error = 'You are missing ';
        const fullName = valueFromElemId('fullname');
        const address = valueFromElemId('address');
        const landmark = valueFromElemId('landmark');
        const city = valueFromElemId('city');
        const state = valueFromElemId('state');
        const pinCode = valueFromElemId('pincode');
        const phoneNumber = valueFromElemId('phoneNumber');
        const data = {
            shippingAddress: {
                fullName,
                address,
                landmark,
                city,
                state,
                pinCode,
                phoneNumber
            },
            cartId: this.props.productReducer.cart._id
        };
        for (let i = 0; i < fields.length; i++) {
            if (data.shippingAddress[fields[i]] && data.shippingAddress[fields[i]].length > 3) {

            } else {
                errorFields.push(fields[i]);
                isError = true;
            }
        }
        if (isError) {
            alert(error.concat(errorFields.join(', ')));
        } else {
            showLoader(true);
            await this.props.updateShippingAddress(data);
            this.setState({
                showCustomerDetailsSection: false,
                showCustomerSection: false,
                showPaymentSection: true
            }, () => {
                showLoader(false);
            });
        }
    };

    renderDetail = () => {
        const shippingAddress = this.props.productReducer.cart.shippingAddress;
        return (
            <div className="layout-main-mobile">
                <div className="layout-main-padding-mobile">
                    <div className="checkout-steps-mobile">
                        <div className="checkout-step-mobile">
                            <div
                                className="stepHeader-mobile">
                                <div className="stepHeader-figure-mobile">
                                    <div className="stepHeader-counter-mobile">1</div>
                                    <div className="stepHeader-title-mobile">Customer</div>
                                </div>
                            </div>
                            {!this.state.showCustomerSection
                                &&
                                this.props.productReducer.cart
                                &&
                                this.props.productReducer.cart.email
                                &&
                                this.props.productReducer.cart.email.length > 4
                                &&
                                <div>
                                    <div className="checkout-form-mobile">
                                        <div className="checkout-form-guest-text-mobile"
                                            style={{
                                                marginBottom: '0'
                                            }}>
                                            <strong>Email: </strong>
                                            {this.props.productReducer.cart.email}
                                            {!this.props.meReducer.isLoggedIn &&
                                                <button
                                                    onClick={this.editCustomerInformation}
                                                    style={{
                                                        border: '1px solid #d4d5d9',
                                                        marginLeft: '10px',
                                                        backgroundColor: 'white'
                                                    }}
                                                    type="button">Edit</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            {this.state.showCustomerSection &&
                                <div>
                                    <div className="checkout-form-mobile">
                                        <div className="checkout-form-guest-text-mobile">
                                            You can checkout as a <span
                                                style={{
                                                    color: 'rgb(79, 79, 79)',
                                                    fontWeight: '600'
                                                }}>guest</span> or You can <span style={{
                                                    color: '#ff9f00'
                                                }}>Login</span>
                                        </div>
                                        <div>
                                            <div className="text-label-mobile">
                                                Email Address
                                        </div>
                                            <div>
                                                <input
                                                    defaultValue={
                                                        this.props.productReducer.cart.email
                                                            ?
                                                            this.props.productReducer.cart.email
                                                            :
                                                            ''
                                                    }
                                                    id="email"
                                                    className="form-input-mobile"
                                                    type="email"
                                                />
                                                <button
                                                    onClick={this.addContactInformation}
                                                    style={{
                                                        marginTop: '20px',
                                                        width: '100%'
                                                    }}
                                                    className="form-button-mobile">
                                                    CONTINUE AS GUEST
                                            </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="checkout-steps-mobile">
                        <div className="checkout-step-mobile">
                            <div
                                className="stepHeader-mobile">
                                <div className="stepHeader-figure-mobile">
                                    <div className="stepHeader-counter-mobile">2</div>
                                    <div className="stepHeader-title-mobile">Shipping</div>
                                    {!this.state.showCustomerDetailsSection &&
                                        validateEmail(this.props.productReducer.cart.email) &&
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    showCustomerDetailsSection: true,
                                                    showCustomerSection: false,
                                                    showPaymentSection: false
                                                });
                                            }}
                                            style={{
                                                border: '1px solid rgb(212, 213, 217)',
                                                marginLeft: '10px',
                                                fontSize: '0.7rem',
                                                padding: '2px 5px',
                                                cursor: 'pointer'
                                            }}>Edit</div>
                                    }
                                </div>
                            </div>
                            {this.state.showCustomerDetailsSection &&
                                <form>
                                    <div className="checkout-form-mobile">
                                        <div
                                            style={{
                                                marginBottom: '1rem'
                                            }}>
                                            <div className="text-label-mobile">
                                                Full name
                                        </div>
                                            <div
                                                style={{
                                                    display: 'flex'
                                                }}>
                                                <input
                                                    defaultValue={
                                                        (
                                                            shippingAddress
                                                            &&
                                                            shippingAddress.fullName
                                                        )
                                                            ?
                                                            shippingAddress.fullName
                                                            :
                                                            ''
                                                    }
                                                    id="fullname"
                                                    className="form-input-mobile"
                                                    type="text"
                                                    name="name"
                                                />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                marginBottom: '1rem'
                                            }}>
                                            <div className="text-label-mobile">
                                                Address
                                        </div>
                                            <div
                                                style={{
                                                    display: 'flex'
                                                }}>
                                                <input
                                                    defaultValue={
                                                        (
                                                            shippingAddress
                                                            &&
                                                            shippingAddress.address
                                                        )
                                                            ?
                                                            shippingAddress.address
                                                            :
                                                            ''
                                                    }
                                                    id="address"
                                                    name="address1"
                                                    className="form-input-mobile"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                marginBottom: '1rem'
                                            }}>
                                            <div className="text-label-mobile">
                                                Landmark (Optional)
                                        </div>
                                            <div
                                                style={{
                                                    display: 'flex'
                                                }}>
                                                <input
                                                    defaultValue={
                                                        (
                                                            shippingAddress
                                                            &&
                                                            shippingAddress.landmark
                                                        )
                                                            ?
                                                            shippingAddress.landmark
                                                            :
                                                            ''
                                                    }
                                                    id="landmark"
                                                    name="address2"
                                                    className="form-input-mobile"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                marginBottom: '1rem'
                                            }}>
                                            <div className="text-label-mobile">
                                                City
                                    </div>
                                            <div
                                                style={{
                                                    display: 'flex'
                                                }}>
                                                <input
                                                    defaultValue={
                                                        (
                                                            shippingAddress
                                                            &&
                                                            shippingAddress.city
                                                        )
                                                            ?
                                                            shippingAddress.city
                                                            :
                                                            ''
                                                    }
                                                    id="city"
                                                    name="city"
                                                    className="form-input-mobile"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                marginBottom: '1rem'
                                            }}>
                                            <div className="text-label-mobile">
                                                State
                                    </div>
                                            <div
                                                style={{
                                                    display: 'flex'
                                                }}>
                                                <input
                                                    defaultValue={
                                                        (
                                                            shippingAddress
                                                            &&
                                                            shippingAddress.state
                                                        )
                                                            ?
                                                            shippingAddress.state
                                                            :
                                                            ''
                                                    }
                                                    id="state"
                                                    name="state"
                                                    className="form-input-mobile"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                marginBottom: '1rem'
                                            }}>
                                            <div className="text-label-mobile">
                                                Pin Code
                                    </div>
                                            <div
                                                style={{
                                                    display: 'flex'
                                                }}>
                                                <input
                                                    defaultValue={
                                                        (
                                                            shippingAddress
                                                            &&
                                                            shippingAddress.pinCode
                                                        )
                                                            ?
                                                            shippingAddress.pinCode
                                                            :
                                                            ''
                                                    }
                                                    id="pincode"
                                                    name="pincode"
                                                    className="form-input-mobile"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                marginBottom: '1rem'
                                            }}>
                                            <div className="text-label-mobile">
                                                Phone Number
                                    </div>
                                            <div
                                                style={{
                                                    display: 'flex'
                                                }}>
                                                <input
                                                    defaultValue={
                                                        (
                                                            shippingAddress
                                                            &&
                                                            shippingAddress.phoneNumber
                                                        )
                                                            ?
                                                            shippingAddress.phoneNumber
                                                            :
                                                            ''
                                                    }
                                                    id="phoneNumber"
                                                    className="form-input-mobile"
                                                    type="number"
                                                    name="phone"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                onClick={this.addCustomerDetails}
                                                style={{
                                                    padding: '0 2.25rem',
                                                    width: '100%'
                                                }}
                                                className="form-button-mobile">CONTINUE</button>
                                        </div>
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                    <div className="checkout-steps-mobile">
                        <div
                            className="checkout-step-mobile"
                            style={{
                                borderBottom: 'none'
                            }}
                        >
                            <div
                                className="stepHeader-mobile"
                                style={{
                                    marginBottom: '0'
                                }}>
                                <div className="stepHeader-figure-mobile">
                                    <div className="stepHeader-counter-mobile">3</div>
                                    <div className="stepHeader-title-mobile">Pay Now</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showPaymentSection &&
                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: '1rem'
                        }}>
                        <button
                            onClick={() => {
                                this.props.payNow();
                            }}
                            style={{
                                padding: '0 3.25rem',
                                width: '70%',
                                fontSize: '14px'
                            }}
                            className="form-button-mobile">
                            PAY NOW
                        </button>
                        <div className="checkout-form-pay-text-mobile">
                            *All transactions are secured and encrypted.
                    </div>
                    </div>
                }
            </div>
        );
    };

    updateItemQuantity = async (cartItemId, productId, value) => {
        showLoader(true);
        const cartItem = _.find(this.props.productReducer.cart.productArrays, { _id: cartItemId });
        if (cartItem && cartItem.quantity + value > 0) {
            const totalQuantity = cartItem ? cartItem.quantity + value : 1;
            const cartId = this.props.productReducer.cart._id;
            const data = {
                cartItemId,
                productId,
                totalQuantity,
                cartId
            };
            await this.props.updateItemQuantity(data);
        } else {

        }
        showLoader(false);
    };



    renderOrderInCart = (value, index) => {
        const product = _.find(this.props.productReducer.cartProducts, { _id: value.productId });
        return (
            <div
                key={index}
                className="card-item-mobile"
                style={{
                    marginBottom: '1.125rem'
                }}>
                <figure
                    className="card-item-figure-mobile"
                >
                    <img
                        alt=""
                        src={
                            (product.images && product.images.length > 0)
                                ?
                                product.images[0]
                                :
                                ''
                        }
                    />
                </figure>
                <div>

                </div>
                <div className="card-product-body-mobile">
                    <div className="card-product-title-mobile">{product.title}</div>
                    <div className="card-product-option-mobile">
                        {value.featuresOfProduct && value.featuresOfProduct.map((feature) => {
                            return `${feature.key}: ${feature.value}`
                        }).join(', ')}
                    </div>
                    <div
                        className="cart-mobile-counter-container">
                        <div className="_29ugw _3L1X9">
                            <div
                                onClick={() => this.updateItemQuantity(value._id, value.productId, 1)}
                                className="_1ds9T">+</div>
                            <div
                                onClick={() => this.updateItemQuantity(value._id, value.productId, -1)}
                                className="_29Y5Z"></div>
                            <div className="_2zAXs">{value.quantity}</div>
                        </div>
                    </div>
                </div>
                <div className="cart-product-actions-mobile">
                    <div className="cart-product-price-mobile">
                        ₹ {(parseInt(product.finalPrice) * value.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </div>
                </div>
                <button onClick={
                    () => this.removeItem(value._id)
                } className="cart-mobile-remove-cart">Remove</button>
            </div>
        );
    };

    removeItem = async (cartItemId) => {
        showLoader(true);
        const data = {
            cartItemId,
            cartId: this.props.productReducer.cart._id
        };
        await this.props.removeItem(data);
        showLoader(false);
    };


    renderCart = () => {
        const cart = this.props.productReducer.cart;
        return (
            <div
                className="layout-cart-mobile">
                <div
                    className="cart-mobile">
                    <div className="cart-header-mobile">
                        <div className="card-header-text-mobile">Order Summary</div>
                    </div>
                    <div className="cart-section-mobile">
                        <div className="cart-section-heading-mobile">{cart.productArrays.length} Items</div>
                        <div>
                            {cart.productArrays.map(this.renderOrderInCart)}
                        </div>
                    </div>
                    <div className="cart-section-mobile">
                        <div>
                            <div className="cart-priceItem-mobile  cart-priceItem--subtotal-mobile">
                                <span className="cart-priceItem-label-mobile">SubTotal</span>
                                <span className="cart-priceItem-value-mobile">₹ {cart.subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                            </div>
                            <div className="cart-priceItem-mobile  cart-priceItem--subtotal">
                                <span className="cart-priceItem-label-mobile">Shipping</span>
                                <span className="cart-priceItem-value-mobile">₹ {cart.totalShippingCharges.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="cart-section-mobile">
                        <div
                            className="cart-priceItem-mobile cart-priceItem--total-mobile"
                            style={{
                                marginBottom: '0'
                            }}>
                            <span className="cart-priceItem-label-mobile">
                                Total
                            </span>
                            <span className="cart-priceItem-value-mobile">₹ {cart.grandTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div
                style={{
                    backgroundColor: '#f3f3f3'
                }}>
                <div
                    style={{
                        height: '3.5rem'
                    }}>

                </div>
                <div className="layout-mobile">
                    {!_.isEmpty(this.props.productReducer.cart) && this.renderCart()}
                    {
                        this.props.productReducer.cartProducts
                        &&
                        this.props.productReducer.cartProducts.length > 0
                        &&
                        this.renderDetail()
                    }
                </div>
            </div>
        );
    }
}

export default CartMobile;