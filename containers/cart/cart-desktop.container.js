import React, { Component } from 'react';
import _ from 'lodash';
import '../../assets/css/cart-desktop.css';
import { valueFromElemId, showLoader, validateEmail } from '../../util/util';

class CartDesktop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCustomerSection: true,
            showCustomerDetailsSection: false,
            showPaymentSection: false
        };
    }

    componentWillMount() {
        if (this.props.productReducer.cart.email) {
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
    }

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

    editCustomerInformation = () => {
        this.setState({
            showCustomerSection: true,
            showCustomerDetailsSection: false,
            showPaymentSection: false
        });
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


    removeItem = async (cartItemId) => {
        showLoader(true);
        const data = {
            cartItemId,
            cartId: this.props.productReducer.cart._id
        };
        await this.props.removeItem(data);
        showLoader(false);
    };


    renderDetail = () => {
        const shippingAddress = this.props.productReducer.cart.shippingAddress;
        return (
            <div className="layout-main">
                <div className="layout-main-padding">
                    <div className="checkout-steps">
                        <div className="checkout-step">
                            <div
                                className="stepHeader">
                                <div className="stepHeader-figure">
                                    <div className="stepHeader-counter">1</div>
                                    <div className="stepHeader-title">Customer</div>
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
                                    <div className="checkout-form">
                                        <div className="checkout-form-guest-text"
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
                                                        marginLeft: '10px'
                                                    }}
                                                    type="button">Edit</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            {this.state.showCustomerSection &&
                                <div>
                                    <div className="checkout-form">
                                        {!this.props.meReducer.isLoggedIn &&
                                            <div
                                                className="checkout-form-guest-text"
                                            >
                                                You can checkout as a <span
                                                    style={{
                                                        color: 'rgb(79, 79, 79)',
                                                        fontWeight: '600'
                                                    }}>guest</span> or You can <span style={{
                                                        color: '#ff9f00'
                                                    }}>Login</span>
                                            </div>
                                        }
                                        <div>
                                            <div className="text-label">
                                                Email Address
                                        </div>
                                            <div
                                                style={{
                                                    display: 'flex'
                                                }}>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    defaultValue={
                                                        this.props.productReducer.cart.email
                                                            ?
                                                            this.props.productReducer.cart.email
                                                            :
                                                            ''
                                                    }
                                                    className="form-input"
                                                    type="email"

                                                />
                                                <button
                                                    onClick={this.addContactInformation}
                                                    style={{
                                                        marginLeft: '20px'
                                                    }}
                                                    className="form-button">
                                                    CONTINUE AS GUEST
                                            </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="checkout-steps">
                        <div className="checkout-step">
                            <div
                                className="stepHeader">
                                <div className="stepHeader-figure">
                                    <div className="stepHeader-counter">2</div>
                                    <div className="stepHeader-title">Shipping</div>
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
                                <div>
                                    <form>
                                        <div className="checkout-form">
                                            <div
                                                style={{
                                                    marginBottom: '1rem'
                                                }}>
                                                <div className="text-label">
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
                                                        name="name"
                                                        className="form-input"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    marginBottom: '1rem'
                                                }}>
                                                <div className="text-label">
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
                                                        className="form-input"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    marginBottom: '1rem'
                                                }}>
                                                <div className="text-label">
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
                                                        className="form-input"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    marginBottom: '1rem',
                                                    display: 'flex'
                                                }}>
                                                <div
                                                    style={{
                                                        flex: 1
                                                    }}>
                                                    <div className="text-label">
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
                                                            className="form-input"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        marginLeft: '10px'
                                                    }}>
                                                    <div className="text-label">
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
                                                            className="form-input"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    marginBottom: '1rem',
                                                    display: 'flex'
                                                }}>
                                                <div
                                                    style={{
                                                        flex: 0.7
                                                    }}>
                                                    <div className="text-label">
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
                                                            className="form-input"
                                                            type="number"
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        flex: 1.3,
                                                        marginLeft: '10px'
                                                    }}>
                                                    <div className="text-label">
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
                                                            name="phone"
                                                            className="form-input"
                                                            type="number"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={this.addCustomerDetails}
                                                    style={{
                                                        padding: '0 2.25rem'
                                                    }}
                                                    className="form-button">CONTINUE</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="checkout-steps">
                        <div
                            className="checkout-step"
                            style={{
                                borderBottom: 'none'
                            }}
                        >
                            <div
                                className="stepHeader">
                                <div className="stepHeader-figure">
                                    <div className="stepHeader-counter">3</div>
                                    <div className="stepHeader-title">Pay Now</div>
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
                            className="form-button">
                            PAY NOW
                    </button>
                        <div className="checkout-form-pay-text">
                            *All transactions are secured and encrypted.
                    </div>
                    </div>
                }
            </div>
        );
    };



    renderOrderInCart = (value, index) => {
        const product = _.find(this.props.productReducer.cartProducts, { _id: value.productId });
        if (product) {
            return (
                <div
                    key={index}
                    className="card-item"
                    style={{
                        marginBottom: '1.125rem'
                    }}>
                    <figure
                        className="card-item-figure"
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
                    <div className="card-product-body">
                        <div className="card-product-title">{product.title}</div>
                        <div className="card-product-option">
                            {value.featuresOfProduct && value.featuresOfProduct.map((feature) => {
                                return `${feature.key}: ${feature.value}`
                            }).join(', ')}
                        </div>
                        <div
                            style={{
                                marginTop: '5px'
                            }}>
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
                    <div
                        style={{
                            height: 'auto',
                            alignSelf: 'inherit',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        className="cart-product-actions">
                        <div className="cart-product-price">
                            ₹ {(parseInt(product.finalPrice) * value.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: '1',
                                flexGrow: '1',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end'
                            }}>
                            <button
                                onClick={
                                    () => this.removeItem(value._id)
                                }
                                style={{
                                    color: '#989898',
                                    fontSize: '0.8rem',
                                    border: 'none',
                                    padding: '0',
                                    cursor: 'pointer'
                                }}>
                                Remove
                        </button>
                        </div>
                    </div>
                </div>
            );
        }
    };

    renderCart = () => {
        const cart = this.props.productReducer.cart;
        return (
            <div
                className="layout-cart">
                <div
                    className="cart">
                    <div className="cart-header">
                        <div className="card-header-text">Order Summary</div>
                    </div>
                    <div className="cart-section">
                        <div className="cart-section-heading">{cart.productArrays.length} Items</div>
                        <div>
                            {cart.productArrays.map(this.renderOrderInCart)}
                        </div>
                    </div>
                    <div className="cart-section">
                        <div>
                            <div className="cart-priceItem  cart-priceItem--subtotal">
                                <span className="cart-priceItem-label">SubTotal</span>
                                <span className="cart-priceItem-value">₹ {cart.subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                            </div>
                            <div className="cart-priceItem  cart-priceItem--subtotal">
                                <span className="cart-priceItem-label">Shipping</span>
                                <span className="cart-priceItem-value">₹ {cart.totalShippingCharges.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="cart-section">
                        <div
                            className="cart-priceItem cart-priceItem--total"
                            style={{
                                marginBottom: '0'
                            }}>
                            <span className="cart-priceItem-label">
                                Total
                            </span>
                            <span className="cart-priceItem-value">₹ {cart.grandTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    emptyComponent = () => {
        return (
            <div>
                <p>Your Cart is Empty.</p>
            </div>
        );
    };

    render() {
        return (
            <div
                style={{
                    backgroundColor: '#f3f3f3'
                }}>
                <div
                    style={{
                        height: '5rem'
                    }}>

                </div>
                <div className="layout">
                    {
                        !_.isEmpty(this.props.productReducer.cart)
                        &&
                        this.props.productReducer.cartProducts
                        &&
                        this.props.productReducer.cartProducts.length > 0
                        &&
                        this.renderDetail()
                    }
                    {!_.isEmpty(this.props.productReducer.cart) && this.renderCart()}
                    {_.isEmpty(this.props.productReducer.cart) && this.emptyComponent()}
                </div>
            </div>
        );
    }
}

export default CartDesktop;