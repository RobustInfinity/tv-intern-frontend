import React, { Component } from 'react';
import '../../assets/css/view-all-service.css'
import {
    connect
} from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { asyncFetchServices } from '../../action/index';
import ServiceCard from '../../component/service-card';
import ServiceCardPlaceholder from '../../component/ServiceCardPlaceholder'

class ViewAllService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadMore(true);
    }

    loadMore = (zero) => {
        this.setState({
            loading: true
        }, async () => {
            await this.props.dispatch(asyncFetchServices(
                zero
                    ?
                    0
                    :
                    this.props.productReducer.services.length
            ));
            this.setState({
                loading: false
            });
        })
    }

    mapCards = (value, index) => {
        return (

            <ServiceCard
                card={value}
                key={index}
                history={this.props.history}
            />
        )

    };

    render() {
        if (window.innerWidth > 768) {
            return (
                <div
                    className="main-service-all-container"
                    style={{
                        // padding : "30px 6px"
                        // marginTop : '2rem',
                        // marginBottom : '2rem'
                    }}>
                    <div className='service-content'>
                    </div>
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '1rem',
                            padding: '0 96px'
                        }}>
                        <img
                            alt=""
                            style={{
                                objectFit: 'contain',
                                width: '100%'
                            }}
                            src="https://res.cloudinary.com/trustvardi/image/upload/f_auto,fl_lossy/v1548674596/Let_TrustVardi_service_you_now._cv7vcp.png"
                        />
                    </div>
                    <div className='service-page-title'>
                        <h2 style={{ margin: '0px', paddingLeft: "96px" }}>HIRE TRUSTVARDI SERVICES</h2>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            marginLeft: '0.5%',
                            marginRight: '0.5%'
                            // justifyContent : 'space-evenly'
                            // paddingLeft : '2%'
                        }}>
                        {window.innerWidth > 480 && this.props.productReducer.serviceLoading && [1, 2, 3].map((value, index) => {
                            return (
                                <ServiceCardPlaceholder key={index} />
                            );
                        })
                        }
                        {window.innerWidth < 480 && this.props.productReducer.serviceLoading && [1, 2, 3, 4].map((value, index) => {
                            return (
                                <ServiceCardPlaceholder key={index} />
                            );
                        })
                        }
                    </div>
                    {!this.props.productReducer.serviceLoading &&
                        <InfiniteScroll
                            dataLength={this.props.productReducer.services.length}
                            next={() => {
                                if (!this.props.productReducer.allServiceLoaded) {
                                    this.loadMore();
                                } else {
                                    return;
                                }
                            }}
                            hasMore={true}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    padding: "6px 96px"
                                    // marginLeft: '0.5%',
                                    // marginRight: '0.5%'
                                    // justifyContent : 'space-evenly'
                                    // paddingLeft : '2%'
                                }}>
                                {this.props.productReducer.services.map(this.mapCards)}
                                {this.state.loading && [1, 2, 3].map((value, index) => {
                                    return (
                                        <ServiceCardPlaceholder key={index} />
                                    );
                                })}
                            </div>
                        </InfiniteScroll>
                    }
                    {/* <InfiniteScroll>
                        {this.props.productReducer.services.map(this.mapCards)}
                    </InfiniteScroll> */}
                </div>
            );
        } else {
            return (
                <div
                    className="main-service-all-container"
                    style={{
                        // padding : "30px 6px"
                        // marginTop : '2rem',
                        // marginBottom : '2rem'
                    }}>
                    <div className='service-content'>
                    </div>
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '20px'
                        }}>
                        <img
                            alt=""
                            style={{
                                height: '200px',
                                objectFit: 'contain',
                                width: '100%'
                            }}
                            src="https://res.cloudinary.com/trustvardi/image/upload/f_auto,fl_lossy,q_70/v1548671935/IMG_1800_m4kxz5.png"
                        />
                    </div>
                    <div className='service-page-title'>
                        <h2 style={{ margin: '0px', fontSize: '18px' }}>HIRE TRUSTVARDI SERVICES</h2>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            marginLeft: '0.5%',
                            marginRight: '0.5%'
                            // justifyContent : 'space-evenly'
                            // paddingLeft : '2%'
                        }}>
                        {window.innerWidth > 480 && this.props.productReducer.serviceLoading && [1, 2, 3].map((value, index) => {
                            return (
                                <ServiceCardPlaceholder key={index} />
                            );
                        })
                        }
                        {window.innerWidth < 480 && this.props.productReducer.serviceLoading && [1, 2, 3, 4].map((value, index) => {
                            return (
                                <ServiceCardPlaceholder key={index} />
                            );
                        })
                        }
                    </div>
                    {!this.props.productReducer.serviceLoading &&
                        <InfiniteScroll
                            dataLength={this.props.productReducer.services.length}
                            next={() => {
                                if (!this.props.productReducer.allServiceLoaded) {
                                    this.loadMore();
                                } else {
                                    return;
                                }
                            }}
                            hasMore={true}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    // marginLeft: '0.5%',
                                    // marginRight: '0.5%'
                                    // justifyContent : 'space-evenly'
                                    // paddingLeft : '2%'
                                }}>
                                {this.props.productReducer.services.map(this.mapCards)}
                                {this.state.loading && [1, 2, 3].map((value, index) => {
                                    return (
                                        <ServiceCardPlaceholder key={index} />
                                    );
                                })}
                            </div>
                        </InfiniteScroll>
                    }
                    {/* <InfiniteScroll>
                        {this.props.productReducer.services.map(this.mapCards)}
                    </InfiniteScroll> */}
                </div>
            );
        }
    }
}

export default connect((state) => state)(ViewAllService);