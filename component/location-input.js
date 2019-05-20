/* eslint-disable array-callback-return, radix */
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import {
    MdLocationOn,
    MdArrowDropDown
} from 'react-icons/lib/md';
// import Cookies from 'universal-cookie';
import {
    CITIES_SEARCH, TOP_CITIES
} from '../constant/static';
import '../assets/css/locationinput.css';

class LocationInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showSearchInput: false,
            regions: [],
            originalRegion: [],
            otherCities: [],
            topCities: [],
            listCities: []
        };
    }

    componentWillMount() {
        const array = [];
        const topCities = [];
        for (let i = 0; i < CITIES_SEARCH.length; i++) {
            array.push(CITIES_SEARCH[i].name);
        }
        for (let i = 0; i < TOP_CITIES.length; i++) {
            topCities.push(TOP_CITIES[i].name);
        }
        this.setState({
            listCities: array,
            originalRegion: array,
            topCities
        });
    }

    componentDidMount() {
        window.addEventListener('click', (event) => {
            if (event.target.parentElement && event.target.parentElement.id !== "loc-inp") {
                this.setState({
                    showSearchInput: false
                });
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener('click', (event) => {
            console.log('removed');
        });
    }
    searchLocation = (event) => {
        const filteredArray = [];
        if (event.target.value.length > 2) {
            this.state.originalRegion.map((value) => {
                if (value.toLowerCase().search(event.target.value) > -1) {
                    filteredArray.push(value);
                }
            });
            this.setState({
                regions: filteredArray
            });
        } else {
            this.setState({
                regions: []
            });
        }
    };

    goToLocPage = (value) => {
        // const tempCookie = new Cookies();
        // tempCookie.set('city', _.find(CITIES_SEARCH, { name: value }) ? _.find(CITIES_SEARCH, { name: value }).key : 'delhincr');
        this.props.history.push({ pathname: `/${_.find(CITIES_SEARCH, { name: value }) ? _.find(CITIES_SEARCH, { name: value }).key : ''}/profile` });
        // window.location.reload();
    }

    render() {
        if (this.state.showSearchInput) {
            setTimeout(() => {
                if (document.getElementById("location-search-focus")) {
                    document.getElementById("location-search-focus").focus();
                }
            }, 400);
        }
        if (window.innerWidth > 768) {
            return (
                <div className="full-height full-weight location-search-container">
                    <div className="full-height full-weight">
                        {!this.state.showSearchInput &&
                            <div id="loc-inp" onClick={() => {
                                this.setState({
                                    showSearchInput: true
                                });
                            }} className="full-height full-weight location-toggle-button" style={{ cursor: 'pointer' }}>
                                {/* <div id="loc-inp" className="location-toggle-icon-container">
                                    <MdLocationOn className="location-toggle-icon" />
                                </div> */}
                                <div id="loc-inp" className="location-text-container-not-active">
                                    <div className="not-active-icon-container">
                                        <MdLocationOn className="location-toggle-icon-not-active" />
                                    </div>
                                    {/* <span className="location-text-not-active">{_.find(CITIES_SEARCH, { key: this.props.city }).name}</span> */}
                                    <span className="location-text-not-active">Choose City</span>
                                </div>
                                <div id="loc-inp" className="location-text-dropdown-icon-container">
                                    <MdArrowDropDown className="location-text-dropdown-icon" />
                                </div>
                            </div>
                        }
                        {this.state.showSearchInput &&
                            <div id="loc-inp" className="full-height full-weight location-toggle-button">
                                <div id="loc-inp" className="location-toggle-icon-container">
                                    <MdLocationOn className="location-toggle-icon" />
                                </div>
                                <div id="loc-inp" className="location-input-container">
                                    <input id="location-search-focus" onChange={this.searchLocation} type="text" className="location-input" placeholder="Type your location" />
                                </div>
                                <div>
                                    {this.state.regions.length === 0 &&
                                        <ul className="location-search-ul">
                                        <li className="location-list-label">Top Cities</li>
                                        {this.state.topCities.map((value, index) => {
                                            return (
                                                <li onClick={() => this.goToLocPage(value)} key={index} tabIndex={index}>
                                                    {value}
                                                </li>
                                            )
                                        })
                                        }
                                        <li className="location-list-label">Other Cities</li>
                                        {this.state.listCities.map((value, index) => {
                                            if (this.state.topCities.indexOf(value) === -1) {
                                                return (
                                                    <li onClick={() => this.goToLocPage(value)} key={index} tabIndex={index}>
                                                        {value}
                                                    </li>
                                                )
                                            }
                                        })
                                        }
                                    </ul>
                                    }
                                    {this.state.regions.length > 0 &&
                                        <ul className="location-search-ul">
                                        {this.state.regions.map((value, index) => {
                                            return (
                                                <li onClick={() => this.goToLocPage(value)} key={index} tabIndex={index}>
                                                    {value}
                                                </li>
                                            )
                                        })
                                        }
                                    </ul>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            );
        } else {
            return (
                <div className="full-height full-weight location-search-container">
                    <div className="full-height full-weight">
                        {!this.state.showSearchInput &&
                            <div id="loc-inp" onClick={() => {
                                this.setState({
                                    showSearchInput: true
                                });
                            }} className="full-height full-weight location-toggle-button" style={{ cursor: 'pointer' }}>
                                <div id="loc-inp" className="location-toggle-icon-container">
                                    <MdLocationOn className="location-toggle-icon" />
                                </div>
                                <div id="loc-inp" className="location-text-container">
                                    <div className="location-text">Choose City</div>
                                </div>
                                <div id="loc-inp" className="location-text-dropdown-icon-container">
                                    <MdArrowDropDown className="location-text-dropdown-icon" />
                                </div>
                            </div>
                        }
                        {this.state.showSearchInput &&
                            <div id="loc-inp" className="full-height full-weight location-toggle-button">
                                <div id="loc-inp" className="location-toggle-icon-container">
                                    <MdLocationOn className="location-toggle-icon" />
                                </div>
                                <div id="loc-inp" className="location-input-container">
                                    <input id="location-search-focus" onChange={this.searchLocation} type="text" className="location-input" placeholder="Type your location" />
                                </div>
                                <div>
                                {this.state.regions.length === 0 &&
                                        <ul className="location-search-ul">
                                        <li className="location-list-label">Top Cities</li>
                                        {this.state.topCities.map((value, index) => {
                                            return (
                                                <li onClick={() => this.goToLocPage(value)} key={index} tabIndex={index}>
                                                    {value}
                                                </li>
                                            )
                                        })
                                        }
                                        <li className="location-list-label">Other Cities</li>
                                        {this.state.listCities.map((value, index) => {
                                            if (this.state.topCities.indexOf(value) === -1) {
                                                return (
                                                    <li onClick={() => this.goToLocPage(value)} key={index} tabIndex={index}>
                                                        {value}
                                                    </li>
                                                )
                                            }
                                        })
                                        }
                                    </ul>
                                    }
                                    {this.state.regions.length > 0 &&
                                        <ul className="location-search-ul">
                                        {this.state.regions.map((value, index) => {
                                            return (
                                                <li onClick={() => this.goToLocPage(value)} key={index} tabIndex={index}>
                                                    {value}
                                                </li>
                                            )
                                        })
                                        }
                                    </ul>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            );
        }
    }
}

export default connect((state) => state)(LocationInput);