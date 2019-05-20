/* eslint-disable radix */
import React, { Component } from 'react';
import {
    FaStar
} from 'react-icons/lib/fa';
import '../assets/css/rating.css';
const colorCode = [
    '#ea1b26',
    '#e78a00',
    '#f7bb41',
    '#6ea53e',
    '#4e7b22'
];

/**
 * To be used to show users Rating
 * Trending card, product card, experience page, reviews
 */

export default class Rating extends Component {
    render() {
        return (
            <div className="rating-container" style={{
                backgroundColor: colorCode[Math.ceil(this.props.rating) - 1],
                color: 'white',
                fontSize: `${this.props.fontSize}px`,
                padding: `${
                    this.props.paddingVer
                        ?
                        this.props.paddingVer
                        :
                        3}px 
                        ${
                    this.props.paddingHor
                        ?
                        this.props.paddingHor
                        :
                        5
                    }px`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <FaStar style={{ size: `${this.props.fontSize}px` }} className="rating-container-star-icon" />
                <div style={{ whiteSpace: 'nowrap' }} className="rating-container-star-rating">
                    <strong style={{ color: '#f3f3f3' }}>{this.props.rating}</strong>
                </div>
            </div>
        );
    }
}