import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';

/**
 * Component for Empty Cart.
 */
class EmptyCart extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div
                style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    flexDirection: 'column'
                }}>
                <img
                    style={{
                        height: '5rem'
                    }}
                    alt=""
                    src="https://res.cloudinary.com/trustvardi/image/upload/v1545126353/icons/bag.svg"
                />
                <p
                    style={{
                        color: '#4f4f4f',
                        fontSize: '1.7rem',
                        fontWeight: '400'
                }}>You don't have anything in your cart</p>
            <Link
                style={{
                    color: '#fc9c04',
                    textDecoration: 'none',
                    fontSize: '1rem'
                }}
                to={{
                    pathname: '/products'
                }}>SHOP NOW</Link>
            </div >
        );
    }
}

export default EmptyCart;