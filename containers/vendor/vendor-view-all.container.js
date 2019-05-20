/* eslint-disable array-callback-return, radix */
import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookies from 'universal-cookie';
import Loadable from 'react-loadable';
import Lightbox from 'lightbox-react';
// import {
//     MdShare
// } from 'react-icons/lib/md';
import {
    fetchProductsVendor,
    fetchArticlesVendor,
    fetchVideosVendor,
    fetchImagesVendor
} from '../../action/index';
import loader from '../../assets/icons/loader.svg';
import '../../assets/css/vendor.viewall.css';

const ProductCard = Loadable({
    loader: () => import('../../component/product.card'),
    loading: () => <div>Loading...</div>,
});

const BlogCard = Loadable({
    loader: () => import('../../component/blog.card'),
    loading: () => <div>Loading...</div>,
});

const ExperienceCard = Loadable({
    loader: () => import('../../component/experience.card'),
    loading: () => <div>Loading...</div>,
});


let LOAD_MORE = false;

class VendorViewAll extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openLightBox: false,
            photoIndex: 0,
            images: [],
            reviewModal: false
        };
    }


    componentWillMount() {
        window.scrollTo(0, 0);
        if (this.props.match.params.type === 'products') {
            this.props.dispatch(fetchProductsVendor(this.props.match.params.profileId, 0));
        } else if (this.props.match.params.type === 'articles') {
            this.props.dispatch(fetchArticlesVendor(this.props.match.params.profileId, 0));
        } else if (this.props.match.params.type === 'experiences') {
            const tempCookie = new Cookies();
            this.props.dispatch(fetchVideosVendor(this.props.match.params.profileId, 0, tempCookie.get('token')));
        } else if (this.props.match.params.type === 'photos') {
            const tempCookie = new Cookies();
            this.props.dispatch(fetchImagesVendor(this.props.match.params.profileId, 0, tempCookie.get('token')))
                .then((data) => {
                    const imagesArray = this.props.vendorReducer.showAllImages;
                    const imageLinkArray = [];
                    if (imagesArray.length > 0) {
                        imagesArray.map((value) => {
                            imageLinkArray.push(value.image.link);
                        });
                        this.setState({
                            images: imageLinkArray
                        });
                    }
                });
        }
    }

    mapProducts = (card, i) => {
        return (
            <ProductCard card={card} key={i} history={this.props.history} match={this.props.match}/>
        )
    };


    mapArticles = (card, i) => {
        return (
            <BlogCard card={card} key={i} history={this.props.history} match={this.props.match}/>
        )
    };

    mapVideos = (card, i) => {
        return (
            <ExperienceCard card={card} key={i} history={this.props.history} match={this.props.match}/>
        )
    };

    loadMoreProducts = () => {
        LOAD_MORE = true;
        if (this.props.match.params.type === 'products') {
            this.props.dispatch(fetchProductsVendor(this.props.match.params.profileId, this.props.vendorReducer.showAllProducts.length))
                .then((data) => {
                    LOAD_MORE = false;
                });
        } else if (this.props.match.params.type === 'articles') {
            this.props.dispatch(fetchArticlesVendor(this.props.match.params.profileId, this.props.vendorReducer.showAllArticles.length))
                .then((data) => {
                    LOAD_MORE = false;
                });
        } else if (this.props.match.params.type === 'experiences') {
            const tempCookie = new Cookies();
            this.props.dispatch(fetchVideosVendor(this.props.match.params.profileId, this.props.vendorReducer.showAllVideos.length, tempCookie.get('token')))
                .then((data) => {
                    LOAD_MORE = false;
                });
        } else if (this.props.match.params.type === 'photos') {
            const tempCookie = new Cookies();
            this.props.dispatch(fetchImagesVendor(this.props.match.params.profileId, this.props.vendorReducer.showAllImages.length, tempCookie.get('token')));
        }
    };

    mapGallery = (card, i) => {
        return (
            <div className="image-gallery-desktop" key={i} style={{
                backgroundImage: `url('${card.image.link}')`
            }} onClick={() => {
                this.setState({
                    openLightBox: true,
                    photoIndex: i
                });
            }}>
                {/* <MdShare className="image-share-button"/> */}
            </div>
        );
    };


    mapGalleryMobile = (card, i) => {
        return (
            <div key={i} style={{
                backgroundImage: `url('${card.image.link}')`,
                width: '32%',
                backgroundSize: 'cover',
                display: 'inline-block',
                height: '5rem',
                marginRight: '1%',
                position: 'relative',
                borderRadius: '8px',
                backgroundPosition: 'center'
            }} onClick={() => {
                this.setState({
                    openLightBox: true,
                    photoIndex: i
                });
            }}>
                {/* <MdShare className="image-share-button"/> */}
            </div>
        );

    };

    render() {
        if (this.props.vendorReducer.showAllPageLoading) {
            return (
                <div className="vendor-loader-container-desktop">
                    <img alt="" className="vendor-loader-desktop" src={loader}/>
                </div>
            )
        } else {
            return (
                <div style={{overflow: 'auto'}}>
                    {this.state.openLightBox && (
                        <Lightbox
                            mainSrc={this.state.images[this.state.photoIndex]}
                            nextSrc={this.state.images[(this.state.photoIndex + 1) % this.state.images.length]}
                            prevSrc={this.state.images[(this.state.photoIndex + this.state.images.length - 1) % this.state.images.length]}
                            onCloseRequest={() => this.setState({openLightBox: false})}
                            onMovePrevRequest={() =>
                                this.setState({
                                    photoIndex: (this.state.photoIndex + this.state.images.length - 1) % this.state.images.length,
                                })
                            }
                            onMoveNextRequest={() =>
                                this.setState({
                                    photoIndex: (this.state.photoIndex + 1) % this.state.images.length,
                                })
                            }
                        />
                    )} 
                    {this.props.match.params.type === 'products' &&
                    <div className="main-container-view-all-vendor">
                        {this.props.vendorReducer.showAllProducts.length > 0 &&
                        <InfiniteScroll
                        dataLength={this.props.vendorReducer.showAllProducts.length}
                            next={() => {
                                if (!LOAD_MORE && !this.props.vendorReducer.allProductsLoaded) {
                                    this.loadMoreProducts();
                                } else {
                                    return;
                                }
                            }}
                            hasMore={true}
                            endMessage={
                                <p style={{textAlign: 'center'}}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {this.props.vendorReducer.showAllProducts.map(this.mapProducts)}
                            </div>
                        </InfiniteScroll>
                        }
                        {this.props.vendorReducer.showAllProducts.length === 0 &&
                        <div style={{position: 'relative', height: '80vh'}}>
                            <span style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}>There are no products available for this Profile.</span>
                        </div>
                        }
                    </div>
                    }
                    {this.props.match.params.type === 'articles' &&
                    <div className="main-container-view-all-vendor" >
                        {this.props.vendorReducer.showAllArticles.length > 0 &&
                        <InfiniteScroll
                        dataLength={this.props.vendorReducer.showAllArticles.length}
                            next={() => {
                                if (!LOAD_MORE && !this.props.vendorReducer.allArticlesLoaded) {
                                    this.loadMoreProducts();
                                } else {
                                    return;
                                }
                            }}
                            hasMore={true}
                            endMessage={
                                <p style={{textAlign: 'center'}}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {this.props.vendorReducer.showAllArticles.map(this.mapArticles)}
                            </div>
                        </InfiniteScroll>
                        }
                        {this.props.match.params.type === 'articles' && this.props.vendorReducer.showAllArticles.length === 0 &&
                        <div style={{position: 'relative', height: '80vh'}}>
                            <span style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}>There are no articles available for this Profile.</span>
                        </div>
                        }
                    </div>
                    }
                    {this.props.match.params.type === 'experiences' &&
                    <div className="main-container-view-all-vendor">
                        {this.props.vendorReducer.showAllVideos.length > 0 &&
                        <InfiniteScroll
                        dataLength={this.props.vendorReducer.showAllVideos.length}
                            next={() => {
                                if (!LOAD_MORE && !this.props.homeReducer.allVideosLoaded) {
                                    this.loadMoreProducts();
                                } else {
                                    return;
                                }
                            }}
                            hasMore={true}
                            endMessage={
                                <p style={{textAlign: 'center'}}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {this.props.vendorReducer.showAllVideos.map(this.mapVideos)}
                            </div>
                        </InfiniteScroll>
                        }
                        {this.props.match.params.type === 'experiences' && this.props.vendorReducer.showAllVideos.length === 0 &&
                        <div style={{position: 'relative', height: '80vh'}}>
                            <span style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}>There are no experiences available for this Profile.</span>
                        </div>
                        }
                    </div>
                    }
                    {this.props.match.params.type === 'photos' &&
                    <div className="main-container-view-all-vendor-photos">
                        {this.props.vendorReducer.showAllImages.length > 0 &&
                        <InfiniteScroll
                        dataLength={this.props.vendorReducer.showAllImages.length}
                            next={() => {
                                if (!LOAD_MORE && !this.props.vendorReducer.allImagesLoaded) {
                                    this.loadMoreProducts();
                                } else {
                                    return;
                                }
                            }}
                            hasMore={true}
                            endMessage={
                                <p style={{textAlign: 'center'}}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >
                            <div style={{ textAlign: 'center' }}>
                                {window.innerWidth > 768 && this.props.vendorReducer.showAllImages.map(this.mapGallery)}
                            </div>
                            {window.innerWidth < 768 && this.props.vendorReducer.showAllImages.map(this.mapGalleryMobile)}
                        </InfiniteScroll>
                        }
                        {this.props.match.params.type === 'photos' && this.props.vendorReducer.showAllImages.length === 0 &&
                        <div style={{position: 'relative', height: '80vh'}}>
                            <span style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}>There are no photos available for this Profile.</span>
                        </div>
                        }
                    </div>
                    }
                    {this.props.match.params.type !== 'products' && this.props.match.params.type !== 'articles' && this.props.match.params.type !== 'experiences' && this.props.match.params.type !== 'photos' &&
                    <div className="main-container-view-all-vendor">
                        {this.props.history.push({
                            pathname: `/profile/${this.props.match.params.profileId}`
                        })}
                    </div>
                    }
                </div>
            );
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
};

export default connect((state) => state, mapDispatchToProps)(VendorViewAll);