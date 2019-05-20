import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const order = (this.props.location && this.props.location.state) ? this.props.location.state.order : null;
        if (order) {
            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        backgroundColor: 'white',
                        flexDirection: 'column'
                    }}>
                    <img
                        alt=""
                        style={{
                            height: '5rem'
                        }}
                        src="https://res.cloudinary.com/trustvardi/image/upload/v1545123808/icons/cart.svg"
                    />
                    <p
                        style={{
                            textAlign: 'center',
                            marginBottom: 0,
                            fontSize: '1.7rem'
                        }}>Thank you for placing your order</p>
                    <p
                        style={{
                            textAlign: 'center',
                            fontSize: '1rem'
                        }}>Your Order ID is: <strong>{order._id}</strong>
                    </p>
                    <Link
                        style={{
                            color: '#fc9c04',
                            textDecoration: 'none'
                        }}
                        to={{
                            pathname: '/'
                        }}>
                        GO BACK
                    </Link>
                </div>
            );
        } else {
            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        backgroundColor: 'white',
                        flexDirection: 'column'
                    }}>
                    <p
                        style={{
                            textAlign: 'center',
                            marginBottom: 0,
                            fontSize: '1.7rem'
                        }}>Session Expired</p>
                    <Link
                        style={{
                            color: '#fc9c04',
                            textDecoration: 'none'
                        }}
                        to={{
                            pathname: '/'
                        }}>
                        GO BACK
                    </Link>
                </div>
            );
        }
    }
}

export default Order;