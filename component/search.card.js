/* eslint-disable radix */
import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
// import Rating from '../component/rating';
import {
    FaLaptop,
    FaPhone,
    FaStar,
    // FaPencil,
} from 'react-icons/lib/fa';
import {
    MdEmail
} from 'react-icons/lib/md';
import {
    trustvardiCertifiedIcon,
    trustvardiCertifiedIconMobile,
} from '../assets/icons/icons';
import '../assets/css/search.css';
import '../assets/css/vendor.card.css';
import {categories} from "../constant/static";
import { imageTransformation } from '../util/util';

const colorCode = [
    '#ea1b26',
    '#e78a00',
    '#f7bb41',
    '#6ea53e',
    '#4e7b22'
];

class SearchCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ARRAY: []
        };
    }
    componentWillMount() {
        const ARRAY = this.state.ARRAY;
        if (this.props.card.website && this.props.card.website.length > 0) {
            ARRAY.push(this.props.card.website);
        }
        if (this.props.card.email && this.props.card.email.length > 0) {
            ARRAY.push(this.props.card.email);
        }
        if (this.props.card.contactPhoneNumber && this.props.card.contactPhoneNumber.length > 0) {
            ARRAY.push(this.props.card.contactPhoneNumber);
        }
        this.setState({
            ARRAY
        });
    }

    toProfile = () => {
        this.props.history.push({
            pathname: `/profile/${this.props.card.username}`
        });
    };


    goToCategory = (filter) => {
        this.props.history.push({
            pathname: `/category/${filter}`
        });
    };

    render() {
        if (window.innerWidth > 768) {
            return (
                <div onClick={this.toProfile} className="search-card-container">
                    <div className="search-card-desktop-cover"
                         style={{backgroundImage: `url('${imageTransformation(this.props.card.coverPicture, 300)}')`}}>
                        {this.props.card.trusted &&
                            trustvardiCertifiedIcon('search-card-trusted')
                        }
                    </div>
                    <div className="search-card-desktop-content">
                        <div className="search-card-basic-info">
                            <div style={{margin: '20px 10px 0 20px', position: 'relative'}}>
                                <p className="search-card-display-name-desktop"
                                   onClick={this.toProfile}>{this.props.card.displayName}</p>
                                {this.props.card.vendorType === 'product' &&
                                <span className="search-card-product-badge">Product</span>
                                }
                                {this.props.card.vendorType === 'service' &&
                                <span className="search-card-service-badge">Service</span>
                                }
                            </div>
                            <span className="search-card-following-desktop">
                                <span>{this.props.card.reviewCount} Reviews</span>
                                <span style={{marginLeft: '10px'}}>{this.props.card.followerCount} Followers</span>
                                {/*<span style={{marginLeft: '10px'}}>{this.props.card.followingCount} Following</span>*/}
                            </span>
                            <div style={{marginLeft: '20px', marginTop: '20px'}}>
                                {this.props.card.category.map((value, i) => {
                                    return (
                                        <img key={i} onClick={() => this.goToCategory(value)}
                                             className="search-card-category" src={categories[value] ? categories[value].icon : ''} alt=""/>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="search-card-contact-info">
                            <div className="vl-search-card"></div>
                            <span style={{ backgroundColor: colorCode[parseInt(this.props.card.rating) - 1] }} className="search-card-rating-desktop">{this.props.card.rating} <FaStar/></span>
                            <div style={{marginTop: '40px'}}>
                                {this.props.card.website && this.props.card.website.length > 0 &&
                                <div style={{marginLeft: '30px', marginBottom: '10px'}}>
                                    <FaLaptop className="search-card-contact-info-icon"/> <span onClick={() => {
                                    window.open(this.props.card.website, '_blank');
                                }} className="search-card-contact-info-text">Visit Website</span>
                                </div>
                                }
                                {this.props.card.email && this.props.card.email.length > 0 &&
                                <div style={{marginLeft: '30px', marginBottom: '10px'}}>
                                    <MdEmail className="search-card-contact-info-icon"/> <span onClick={() => {
                                    window.open(`mailto:${this.props.card.email}`)
                                }} className="search-card-contact-info-text">Contact via Email</span>
                                </div>
                                }
                                {this.props.card.contactPhoneNumber && this.props.card.contactPhoneNumber.length > 0 &&
                                <div style={{marginLeft: '30px', marginBottom: '10px'}}>
                                    <FaPhone className="search-card-contact-info-icon"/> <span
                                    className="search-card-contact-info-text">{this.props.card.contactPhoneNumber}</span>
                                </div>
                                }
                                <div style={{marginLeft: '50px'}}>
                                    <button className="search-card-view-profile" onClick={this.toProfile}>View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (window.innerWidth < 768) {
            return (
                <div className="search-card-container-mobile">
                    <div onClick={this.toProfile} style={{padding:'10px',backgroundColor:'white',borderRadius:'8px'}}>
                        <div className="search-card-desktop-cover-mobile"
                             style={{backgroundImage: `url('${imageTransformation(this.props.card.coverPicture, 300)}')`}}>
                            {this.props.card.vendorType === 'product' &&
                            <span className="search-card-product-badge-mobile">Product</span>
                            }
                            {this.props.card.vendorType === 'service' &&
                            <span className="search-card-service-badge-mobile">Service</span>
                            }
                            {this.props.card.trusted &&
                            trustvardiCertifiedIconMobile('search-card-trusted')
                            }
                        </div>
                        <div className="search-card-mobile-content">
                            <div className="search-card-basic-info-mobile">
                            <div style={{padding:'0px 20px' , height:'100%'}}>
                                <span style={{ backgroundColor: colorCode[parseInt(this.props.card.rating) - 1] }} 
                                className="search-card-rating-mobile">{this.props.card.rating} <FaStar style={{marginBottom:'3px'}}/></span>
                                    <span onClick={this.toProfile}
                                    className="search-card-display-name-mobile">{this.props.card.displayName}</span>                                          
                                    <div className="search-card-discription-name-mobile">                                    
                                    {(this.props.card.recommendedFor && this.props.card.recommendedFor.length > 0) ? this.props.card.recommendedFor : this.props.card.description.substring(0,40)+"..."}
                                    </div>
                                <span className="search-card-following-mobile">
                                <span>{this.props.card.reviewCount} Reviews</span>
                                <span style={{marginLeft: '10px'}}>{this.props.card.followerCount} Followers</span>
                            </span>
                                <div style={{padding:'6px 0px'}}>
                                    {this.props.card.category.map((value, i) => {
                                        return (
                                            <img key={i} onClick={() => this.goToCategory(value)}
                                            className="search-card-category-mobile" src={categories[value] ? categories[value].icon : ''} alt=""/>  
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    {/* <div className="search-card-contact-info-mobile"> */}
                       {/* {this.props.card.website && this.props.card.website.length &&
                        <div className="search-card-contact-info-divider"
                             style={{float: 'left', width:'50%' }}>
                            <span onClick={this.toProfile}
                                // window.open(this.props.card.website, '_blank');
                            className="search-card-contact-info-text-mobile">
                            <FaPencil className="search-card-contact-info-icon-mobile"/> REVIEW</span>
                        </div>
                        } */}
                        {/* {this.props.card.website && this.props.card.website.length &&
                        <div className="search-card-contact-info-divider"
                             style={{float: 'left', width: `${100 / this.state.ARRAY.length}%`}}>
                            <span onClick={() => {
                                window.open(this.props.card.website, '_blank');
                            }} className="search-card-contact-info-text-mobile"><FaLaptop
                                className="search-card-contact-info-icon-mobile"/> Visit Website</span>
                        </div>
                        } */}
                        {/* {this.props.card.email && this.props.card.email.length &&
                        <div className="search-card-contact-info-divider"
                             style={{width: '50%'}}>
                            <span onClick={() => {
                                // window.open(`mailto:${this.props.card.email}`)
                            }} className="search-card-contact-info-text-mobile"><MdEmail
                                className="search-card-contact-info-icon-mobile"/> Example</span>
                        </div>
                        } */}
                        {/* {this.props.card.contactPhoneNumber && this.props.card.contactPhoneNumber.length &&
                        <div className="search-card-contact-info-divider"
                             style={{float: 'right', width: `${100 / this.state.ARRAY.length}%`}}>
                            <span className="search-card-contact-info-text-mobile"> <FaPhone
                                className="search-card-contact-info-icon-mobile"/>{this.props.card.contactPhoneNumber}</span>
                        </div>
                        } */}
                        {/*<div className="search-card-contact-info">*/}
                        {/*<div className="vl-search-card"></div>*/}
                        {/*<div style={{ marginTop: '40px' }}>*/}
                        {/*<div style={{ marginLeft: '30px', marginBottom: '10px' }}>*/}
                        {/*<FaLaptop className="search-card-contact-info-icon" /> <span className="search-card-contact-info-text">{this.props.card.website}</span>*/}
                        {/*</div>*/}
                        {/*<div style={{ marginLeft: '30px', marginBottom: '10px' }}>*/}
                        {/*<MdEmail className="search-card-contact-info-icon"/> <span className="search-card-contact-info-text">{this.props.card.email}</span>*/}
                        {/*</div>*/}
                        {/*<div style={{ marginLeft: '30px', marginBottom: '10px' }}>*/}
                        {/*<FaPhone className="search-card-contact-info-icon"/> <span className="search-card-contact-info-text">{this.props.card.contactPhoneNumber}</span>*/}
                        {/*</div>*/}
                        {/*<div style={{ marginLeft: '50px' }}>*/}
                        {/*<button className="search-card-view-profile">VIEW PROFILE</button>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                    {/* </div> */}
                </div>
            );
        }
    }
}

export default connect((state) => state)(SearchCard);