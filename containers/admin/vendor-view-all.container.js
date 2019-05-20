/* eslint-disable array-callback-return, radix */
import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookies from 'universal-cookie';
import Loadable from 'react-loadable';
import Lightbox from 'lightbox-react';
import {
    MdShare,
    MdClose
} from 'react-icons/lib/md';
import {
    FaImage
} from 'react-icons/lib/fa';
import {
    fetchProductsVendor,
    fetchImagesVendor,
    asyncSaveProduct
} from '../../action/index';
import loader from '../../assets/icons/loader.svg';
import '../../assets/css/vendor.viewall.css';
import {CLOUDINARY} from "../../constant/keys";
import {categories} from "../../constant/static";
import ReactModal from "react-modal";
import {asyncDeleteImage} from "../../action/asyncaction/admin.asyncaction";

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

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px 40px',
        maxHeight: '550px'
    },
    overlay: {
        zIndex: '12'
    }
};

let LOAD_MORE = false;

class VendorViewAllAdmin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openLightBox: false,
            photoIndex: 0,
            images: [],
            reviewModal: false,
            showAdminModal: false,
            descriptionPanel: false,
            description: '',
            website: '',
            email: '',
            contactPhoneNumber: '',
            googleUrl: '',
            facebookUrl: '',
            twitterUrl: '',
            instagramUrl: '',
            linkedinUrl: '',
            addressPanel: false,
            productPanel: false,
            category: [],
            count: 1,
            productImages: [],
            title: '',
            price: 0,
            discount: 0,
            link: '',
            warranty: '',
            finalPrice: 0,
            productDescription: '',
            productImageIndex: 0,
            specification: [],
            _id: null
        };
    }


    componentWillMount() {
        window.scrollTo(0, 0);
        if (this.props.match.params.type === 'products') {
            const tempCookie = new Cookies();
            this.props.dispatch(fetchProductsVendor(this.props.match.params.profileId, 0, tempCookie.get('token'), true));
        }  else if (this.props.match.params.type === 'photos') {
            const tempCookie = new Cookies();
            this.props.dispatch(fetchImagesVendor(this.props.match.params.profileId, 0, tempCookie.get('token'), true))
                .then((data) => {
                    const imagesArray = this.props.adminReducer.showAllImages;
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
            <ProductCard card={card} editProduct={this.editProduct} key={i}  history={this.props.history} match={this.props.match}/>
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
            const tempCookie = new Cookies();
            this.props.dispatch(fetchProductsVendor(this.props.match.params.profileId, this.props.adminReducer.showAllProducts.length, tempCookie.get('token'), true))
                .then((data) => {
                    LOAD_MORE = false;
                });
        }  else if (this.props.match.params.type === 'photos') {
            const tempCookie = new Cookies();
            this.props.dispatch(fetchImagesVendor(this.props.match.params.profileId, this.props.adminReducer.showAllImages.length, tempCookie.get('token'), true));
        }
    };

    mapGallery = (card, i) => {
        return (
            <div key={i} style={{
                // backgroundImage: `url('${card.image.link}')`,
                width: '21%',
                backgroundSize: 'cover',
                display: 'inline-block',
                height: '10rem',
                marginRight: '1%',
                position: 'relative',
                borderRadius: '8px'
            }}>
                <img onClick={() => {
                    this.setState({
                        openLightBox: true,
                        photoIndex: i
                    });
                }} style={{ height: '100%', width: '100%', objectFit: 'cover' }} src={card.image.link} alt=""/>
                {card.user === this.props.meReducer.userData.user.username &&
                <button onClick={() => this.deleteImage(card._id)} className="image-remove-button">Remove</button>
                }
                <MdShare className="image-share-button"/>
            </div>
        );
    };

    deleteImage = (id) => {
        const tempCookie = new Cookies();
        this.props.dispatch(asyncDeleteImage(this.props.match.params.profileId, id, tempCookie.get('token')));
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
                <MdShare className="image-share-button"/>
            </div>
        );

    };

    addCategory = (event) => {
        event.preventDefault();
        const category = document.querySelector('#category').value;
        if (category) {
            if (this.state.category.indexOf(category) === -1) {
                const newCategory = this.state.category;
                newCategory.push(category);
                this.setState({
                    category: newCategory
                });
            } else {
                alert('already added');
            }
        }
    };

    openCloudinaryProductImages = (event) => {
        event.preventDefault();
        window.cloudinary.openUploadWidget({
                cloud_name: CLOUDINARY.cloud_name,
                upload_preset: CLOUDINARY.upload_preset,
                api_key: CLOUDINARY.api_key,
                api_secret: CLOUDINARY.api_secret,
                folder: 'vendors',
                sources: ['local', 'url', 'camera', 'facebook'],
                gravity: 'custom',
                quality: 'auto:eco',
                max_file_size: 5000000
            },
            (error, result) => {
                if (!error) {
                    if (result && result.length > 0) {
                        const imageArray = [];
                        for (let i = 0; i < result.length; i++) {
                            imageArray.push(`${result[i].secure_url.split('/upload/')[0]}/upload/q_60/${result[i].secure_url.split('/upload/')[1]}`);
                        }
                        this.setState({
                            productImages: imageArray
                        });
                    }
                }
            });
    };

    removeProductImage = (index) => {
        // let productImages = this.state.productImages;
        // productImages.splice(index, 1);
        // this.setState({
        //     productImages
        // });
        this.setState((prevState) => ({
            productImages: prevState.productImages.filter((_, i) => i !== index)
        }));
    };

    saveProduct = () => {
        const data = {
            category: this.state.category,
            title: this.state.title,
            description: this.state.productDescription,
            price: parseInt(this.state.price),
            link: this.state.link,
            warranty: this.state.warranty,
            finalPrice: parseInt(this.state.finalPrice),
            discount: parseInt(this.state.discount),
            images: this.state.productImages,
            vendor: this.props.adminReducer.vendor.username,
            _id: this.state._id,
            specification: this.state.specification
        };
        if (data.title.length > 0 && data.category.length > 0 && data.finalPrice > 0 && data.images.length > 0) {
            const tempCookie = new Cookies();
            this.props.dispatch(asyncSaveProduct(data, tempCookie.get('token')))
                .then((resData) => {
                    if (resData.success) {
                        this.closeModalAdmin();
                    } else {
                        alert('something went wrong try again later');
                    }
                });
        } else {
            alert('Title, Categories, Final Price, Images are mandatory');
        }
    };

    editProduct = (data) => {
        this.setState({
            showAdminModal: true,
            productPanel: true,
            productImages: data.images,
            title: data.title,
            price: data.price,
            discount: data.discount,
            finalPrice: data.finalPrice,
            warranty: data.warranty,
            link: data.link,
            productDescription: data.description,
            category: data.category,
            _id: data._id,
            specification: data.specification
        });
    };

    productPanelModule = () => {
        return (
            <div className="edit-profile-container-admin">
                <span className="edit-profile-label-admin">Add Product Card</span>
                <div className="edit-profile-product-picture-container">
                    <div className="edit-profile-product-picture">
                        {this.state.productImages.length === 0 &&
                        <FaImage className="edit-profile-product-picture-image"/>
                        }
                        {this.state.productImages.length > 0 &&
                        <img style={{ height: '100%' }} src={this.state.productImages[this.state.productImageIndex]} alt=""/>
                        }
                    </div>
                    <div className="edit-profile-product-upload-image-button">
                        <span className="edit-profile-label-admin">Product Image</span>
                        <button className="view-all-button" onClick={this.openCloudinaryProductImages}>Upload Image</button>
                    </div>
                </div>
                <div className="edit-profile-product-images-container">
                    {_.map(this.state.productImages, (value, index) => {
                        return (
                            <div className="edit-profile-pic-container" key={index}>
                                <MdClose onClick={() => this.removeProductImage(index)} className="edit-profile-product-close"/>
                                <img onClick={() => {
                                    this.setState({
                                        productImageIndex: index
                                    });
                                }} className="edit-profile-product-images" src={value} alt=""/>
                            </div>
                        )
                    })}
                </div>
                <div style={{display: 'inline-block'}}>
                    <span className="edit-profile-input-label">Product Name</span>
                    <input id="edit-product-name" onChange={(event) => {
                        this.setState({
                            title: event.target.value
                        });
                    }} className="edit-profile-input-text" type="text" defaultValue={this.state.title}/>
                </div>
                <div style={{display: 'inline-block', marginLeft: '40px'}}>
                    <span className="edit-profile-input-label">Price</span>
                    <input id="edit-price" onChange={(event) => {
                        if (this.state.discount > 0) {
                            this.setState({
                                price: event.target.value,
                                finalPrice: event.target.value - (parseInt(event.target.value)/100) * this.state.discount
                            });
                        } else {
                            this.setState({
                                price: event.target.value,
                                finalPrice: event.target.value
                            });
                        }
                    }} className="edit-profile-input-text" type="number" value={this.state.price}/>
                </div>
                <div style={{display: 'inline-block'}}>
                    <span className="edit-profile-input-label">Discount in %</span>
                    <input id="edit-product-name" onChange={(event) => {
                        if (this.state.price && this.state.finalPrice && parseInt(event.target.value) > 0) {
                            this.setState({
                                discount: event.target.value,
                                finalPrice: this.state.price - (parseInt(this.state.price)/100) * event.target.value
                            });
                        } else {
                            this.setState({
                                discount: event.target.value,
                                finalPrice: this.state.price
                            });
                        }
                    }} className="edit-profile-input-text" type="number" value={this.state.discount}/>
                </div>
                <div style={{display: 'inline-block', marginLeft: '40px'}}>
                    <span className="edit-profile-input-label">Final Price</span>
                    <input id="edit-price" onChange={(event) => {
                        if (this.state.discount > 0) {
                            this.setState({
                                finalPrice: event.target.value,
                                price: parseInt(event.target.value)/((100 - this.state.discount)/100)
                            });
                        } else {
                            this.setState({
                                finalPrice: event.target.value,
                                price: event.target.value
                            });
                        }
                    }} className="edit-profile-input-text" type="number" value={this.state.finalPrice}/>
                </div>
                <div style={{display: 'inline-block'}}>
                    <span className="edit-profile-input-label">Warranty</span>
                    <input id="edit-price" onChange={(event) => {
                        this.setState({
                            warranty: event.target.value
                        });
                    }} className="edit-profile-input-text" type="text" defaultValue={this.state.warranty}/>
                </div>
                <div style={{display: 'inline-block', marginLeft: '40px'}}>
                    <span className="edit-profile-input-label">Product Link</span>
                    <input id="edit-price" onChange={(event) => {
                        this.setState({
                            link: event.target.value
                        });
                    }} className="edit-profile-input-text" type="text" defaultValue={this.state.link}/>
                </div>
                <div>
                    <span className="edit-profile-description-label">Description</span>
                    <textarea id="edit-description" onChange={(event) => {
                        this.setState({
                            productDescription: event.target.value
                        });
                    }} className="edit-profile-description-text" defaultValue={this.state.productDescription}/>
                </div>
                <div>
                    <span className="edit-profile-description-label">Select category</span>
                    <div>
                        <select className="edit-profile-category" id="category">
                            {_.map(categories, (value) => {
                                return (
                                    <option key={value.key} value={value.key}>{value.name}</option>
                                )
                            })}
                        </select>
                        <button className="edit-profile-add-category-button" onClick={this.addCategory}>Add Category
                        </button>
                    </div>
                    <div className="tabs-holder">
                        {this.state.category.length > 0 &&
                        this.state.category.map((value) => {
                            return (
                                <div key={value} className="edit-profile-tabs">
                                    <img className="edit-profile-tabs-icon" src={categories[value] ? categories[value].icon : ''} alt=""/>
                                    <span className="">{categories[value] ? categories[value].name : ''}</span>
                                    <MdClose alt="" style={{width: 20, height: 20, marginLeft: '5px'}} onClick={() => {
                                        const categories = this.state.category;
                                        this.setState((prevState) => ({
                                            category: prevState.category.filter((_, i) => i !== categories.indexOf(value))
                                        }));
                                    }} src="https://png.icons8.com/metro/32/ffffff/delete-sign.png"/>
                                </div>
                            )
                        })
                        }
                    </div>
                    <div className="edit-profile-specification">
                        <span className="edit-profile-description-label">Add Specification</span>
                        <div style={{ textAlign: 'center' }}>
                            <div>
                                {this.state.specification.map((value, index) => {
                                    return (
                                        <div className="edit-profile-specification-tabs" key={index}>
                                            <span className="edit-profile-specification-text">{value}</span>
                                            <button className="edit-profile-remove-specification-button" onClick={() => {
                                                this.setState((prevState) => ({
                                                    specification: prevState.specification.filter((_, i) => i !== index)
                                                }));
                                            }}>
                                                x
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                <input className="edit-profile-add-specification-input" onKeyUp={(event) => {
                                    if (event.keyCode === 13) {
                                        this.addSpecification();
                                    }
                                }} id="specification" type="text"/>
                                <button className="edit-profile-add-specification-button" onClick={this.addSpecification}>Add More Specification</button>
                            </div>
                        </div>
                    </div>
                    <div className="button-container-admin-description">
                        <button onClick={this.closeModalAdmin} className="discard-change-button">Discard Changes</button>
                        <button className="save-change-button" onClick={this.saveProduct}>Save Changes</button>
                    </div>
                </div>
            </div>
        );
    };

    closeModalAdmin = () => {
        this.setState({
            showAdminModal: false,
            descriptionPanel: false,
            addressPanel: false,
            productPanel: false
        });
        document.body.style.overflow = 'auto';
    };


    addSpecification = () => {
        const specification = document.getElementById('specification').value;
        if (this.state.specification.indexOf(specification) === -1 && specification.length > 0) {
            const array = this.state.specification;
            array.push(specification);
            this.setState({
                specification: array
            });
            document.getElementById('specification').value = '';
        }
    };


    render() {
        if (this.props.homeReducer.showAllPageLoading) {
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
                    <ReactModal
                        isOpen={this.state.showAdminModal}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModalAdmin}
                        style={customStyles}
                        contentLabel="Example Modal">
                        {this.state.productPanel &&
                        this.productPanelModule()
                        }
                    </ReactModal>
                    {this.props.match.params.type === 'products' &&
                    <div className="main-container-view-all-vendor">
                        {this.props.adminReducer.showAllProducts.length > 0 &&
                        <InfiniteScroll
                            next={() => {
                                if (!LOAD_MORE && !this.props.adminReducer.allProductsLoaded) {
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
                            {this.props.adminReducer.showAllProducts.map(this.mapProducts)}
                        </InfiniteScroll>
                        }
                        {this.props.adminReducer.showAllProducts.length === 0 &&
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
                    {this.props.match.params.type === 'photos' &&
                    <div className="main-container-view-all-vendor-photos">
                        {this.props.adminReducer.showAllImages.length > 0 &&
                        <InfiniteScroll
                            next={() => {
                                if (!LOAD_MORE && !this.props.adminReducer.allImagesLoaded) {
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
                                {window.innerWidth > 768 && this.props.adminReducer.showAllImages.map(this.mapGallery)}
                            </div>
                            {window.innerWidth < 768 && this.props.adminReducer.showAllImages.map(this.mapGalleryMobile)}
                        </InfiniteScroll>
                        }
                        {this.props.match.params.type === 'photos' && this.props.adminReducer.showAllImages.length === 0 &&
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

export default connect((state) => state, mapDispatchToProps)(VendorViewAllAdmin);