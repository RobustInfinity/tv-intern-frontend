import React, { Component } from 'react';
import MdShare from 'react-icons/lib/md/share';
import {
    connect
} from 'react-redux';
import '../assets/css/service-card.css';
import Rating from './rating';
import { asyncShareModal } from '../action/index';
import { imageTransformation } from '../util/util';

class ServiceCard extends Component {
    goToPage = () => {
        this.props.history.push({
            pathname: `/products/${this.props.card.sku}`
        });
    }

    render() {
        return (
            <div
                className="service-card-container">
                <div>
                    <div
                        onClick={this.goToPage}
                        className="service-card-img-container">
                        <img
                            className="service-card-img"
                            src={
                                imageTransformation(this.props.card.images[0])
                            } alt={this.props.card.title} />
                        <div className='service-card-rating-container'>
                            <Rating rating={this.props.card.rating} width={100} fontSize={14}></Rating>
                        </div>
                    </div>
                    <div className='service-card-info'>
                        <div className='service-card-header'>
                            <div className='service-card-title-container'>
                                <h4 className='service-card-title'>{this.props.card.title}</h4>
                            </div>
                        </div>
                        <div className='service-card-description'>
                            <p
                                className='service-card-description line-clamp line-clamp-3'>
                                {this.props.card.description
                                    ?
                                    this.props.card.description.replace(/<[^>]+>/g, " ").replace("\\s+", " ").trim()
                                    :
                                    ''
                                }
                            </p>
                        </div>
                        <div className='service-card-bottom'>
                            <div className='service-card-price'>
                            <p
                                    className="service-card-price-text"
                                    style={{fontSize : "0.9em", display : "inline", color: 'rgba(0,0,0,0.6)'}}>
                                    Price starts at: </p>
                                    <strong
                                        style={{
                                            color: 'rgba(0,0,0,0.6)',
                                            fontSize : "0.9em"
                                        }}>
                                        ₹ {
                                            this.props.card.priceRange
                                                ?
                                                this.props.card.priceRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                :
                                                0
                                        }
                                    </strong>
                                
                            </div>
                            {window.innerWidth > 480 &&
                                <div className='service-card-share'>
                                    <div
                                        onClick={() => {
                                            this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/products/${this.props.card._id}`))
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            cursor: 'pointer'
                                        }}>
                                        <MdShare
                                            style={{
                                                height: '0.8rem'
                                            }}
                                        />
                                        <p style={{
                                            marginTop: '0px',
                                            marginBottom: '0px',
                                            fontWeight: '400',
                                            fontSize: '0.8rem',
                                            marginLeft: '5px'
                                        }}>Share </p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state) => state)(ServiceCard);