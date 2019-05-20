import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import MdSearch from 'react-icons/lib/md/search';
import '../assets/css/mobile.search.modal.css';
import {
    searchVendor
} from '../action/index';
import {categoriesHome} from "../constant/static";

let timeOut = null;

class MobileSearchModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCategory: true,
            showNoResult: false
        };
    }

    goToCategory = (key) => {
        this.props.history.push({
            pathname: `/category/${key}`
        });
        this.props.closeSearchMobileModal();
        document.body.style.overflow = 'auto';
    };

    searchVendorHome = (value) => {
        clearTimeout(timeOut);

        if(value && value.length > 0) {
            timeOut = setTimeout(() => {
                this.props.dispatch(searchVendor(value))
                    .then((data) => {
                        if(this.props.homeReducer.searchResults.length > 0) {
                            this.setState({
                                showCategory: false,
                                showNoResult: false
                            });
                        } else {
                            this.setState({
                                showCategory: true,
                                showNoResult: true
                            });
                        }
                    });
            }, 500);
        } else {
            this.setState({
                showCategory: true,
                showNoResult: false
            });
        }
    };

    goToProfile = (username) => {
        this.props.history.push({
            pathname: `/profile/${username}`
        });
        this.props.closeSearchMobileModal()
        document.body.style.overflow = 'auto';
    };

    render() {
        return (
            <div style={{ overflow: 'auto' }}>
                <div className="mobile-search-main-container">
                    <div className="mobile-search-input-container">
                        <div className="mobile-search-input-icon-container">
                            <MdSearch className="mobile-search-input-icon"/>
                        </div>
                        <span className="mobile-search-input-text">
                        <input onKeyUp={(event) => this.searchVendorHome(event.target.value)}  type="text" className="mobile-search-input-main" placeholder="What are you looking for?"/>
                    </span>
                    </div>
                    <div className="mobile-search-cancel">
                        <span onClick={(event) => {
                            event.preventDefault();
                            this.props.closeSearchMobileModal()
                        }} className="mobile-search-cancel-button">Cancel</span>
                    </div>
                </div>
                {this.state.showNoResult &&
                <div>
                    <span className="trending-label-mobile-quick-search">SEARCH RESULTS</span>
                    <div>
                        <div className="trending-rows-quick-container">
                            <span className="trending-rows-quick-name">No Results Found</span>
                        </div>
                    </div>
                </div>
                }
                {this.state.showCategory &&
                    <div>
                        <span className="trending-label-mobile-quick-search">TRENDING SEARCHES</span>
                        <div>
                            {_.map(categoriesHome, (value, i) => {
                                return (
                                    <div className="trending-rows-quick-container" onClick={() => this.goToCategory(value.key)} key={i}>
                                        <img className="trending-rows-quick-icon" src={value.icon} alt=""/>
                                        <span className="trending-rows-quick-name">{value.name}</span>
                                    </div>
                                )
                            })}
                            <div className="trending-rows-quick-container" onClick={() => {
                                this.props.history.push({
                                    pathname: `/category`
                                });
                                document.body.style.overflow = 'auto';
                            }}>
                                <span className="trending-rows-quick-view-all">VIEW ALL CATEGORY</span>
                            </div>
                        </div>
                    </div>
                }
                {!this.state.showCategory &&
                <div>
                    <span className="trending-label-mobile-quick-search">SEARCH RESULTS</span>
                    <div>
                        {_.map(this.props.homeReducer.searchResults, (value, i) => {
                            return (
                                <div className="trending-rows-quick-container" onClick={() => this.goToProfile(value._source.username)} key={i}>
                                    <img style={{ borderRadius: '50%' }} className="trending-rows-quick-icon" src={value._source.profilePicture} alt=""/>
                                    <span className="trending-rows-quick-name">{value._source.displayName}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                }
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
};

export default connect((state) => state, mapDispatchToProps)(MobileSearchModal);