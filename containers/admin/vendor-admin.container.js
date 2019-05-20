/* eslint-disable array-callback-return, radix */
import React, {Component} from 'react';
import {
    connect
} from 'react-redux';
import Cookies from 'universal-cookie';
import ReactModal from 'react-modal';
import ReactQuill from 'react-quill';
import Login from '../../component/login';
import 'react-quill/dist/quill.snow.css';
import {CLOUDINARY} from "../../constant/keys";
import {
    FaLinkedin,
    FaTwitter,
    FaFacebook,
    FaStar,
    FaLaptop,
    FaPhone,
    FaInstagram,
    FaCamera,
    FaGlobe,
    // FaGooglePlus,
    FaFacebookOfficial,
    FaImage
} from 'react-icons/lib/fa';
import {
    MdEmail,
    // MdThumbUp,
    MdCheckCircle,
    MdShare,
    MdAddCircle,
    MdClose
} from 'react-icons/lib/md';
import {
    addPenIcon
} from '../../assets/icons/icons';
import _ from 'lodash';
// import ProductCard from '../../component/product.card';
import Loadable from 'react-loadable';
import loader from '../../assets/icons/loader.svg';
import {
    Helmet
} from 'react-helmet';
import {
    fetchVendorForAdmin,
    toggleLoginModal,
    asyncShareModal,
    asyncTogglePicture,
    asyncUpdateVendorData,
    asyncSaveImages,
    asyncSaveProduct,
    asyncDeleteImage,
    asyncFacebookLogin,
    asyncGoogleSignin,
    asyncSignUp,
    asyncLogin
} from '../../action/index';
import Lightbox from 'lightbox-react';
import {
    trustvardiCertifiedIcon
} from '../../assets/icons/icons';
import '../../assets/css/vendor.css';
import '../../assets/css/circle.css';
import {categories, collectionsObject} from "../../constant/static";


const ExperienceCard = Loadable({
    loader: () => import('../../component/experience.card'),
    loading: () => <div>Loading...</div>,
});

// const TrendingCard = Loadable({
//     loader: () => import('../../component/trending.card'),
//     loading: () => <div>Loading...</div>,
// });

const BlogCard = Loadable({
    loader: () => import('../../component/blog.card'),
    loading: () => <div>Loading...</div>,
});


const ProductCard = Loadable({
    loader: () => import('../../component/product.card'),
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


let imageUploadingDialogOpen = false;

class VendorAdmin extends Component {


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
        const username = this.props.match.params.profileId;
        const tempCookie = new Cookies();
        this.props.dispatch(fetchVendorForAdmin(username, tempCookie.get('token')))
            .then(data => {
                if (data.success && data.vendorData) {
                    if (!_.isEmpty(data.vendorData.vendor)) {
                        const imagesArray = this.props.adminReducer.images;
                        const imageLinkArray = [];
                        if (imagesArray.length > 0) {
                            imagesArray.map((value) => {
                                imageLinkArray.push(value.image.link);
                            });
                        }
                        this.setState({
                            images: imageLinkArray,
                            description: data.vendorData.vendor.description
                        });
                        this.renderMapAndProgressBar();
                    }
                }
            });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps.meReducer.userData)) {
            if (this.props.meReducer.userData !== nextProps.meReducer.userData) {
                window.scrollTo(0, 0);
                const username = nextProps.match.params.profileId;
                nextProps.dispatch(fetchVendorForAdmin(username, nextProps.meReducer.userData.accessToken))
                    .then(data => {
                        if (data.success && data.vendorData) {
                            if (!_.isEmpty(data.vendorData.vendor)) {
                                const imagesArray = nextProps.adminReducer.images;
                                const imageLinkArray = [];
                                if (imagesArray.length > 0) {
                                    imagesArray.map((value) => {
                                        imageLinkArray.push(value.image.link);
                                    });
                                }
                                this.setState({
                                    images: imageLinkArray,
                                    description: data.vendorData.vendor.description
                                });
                                this.renderMapAndProgressBar();
                            }
                        }
                    });
            }
        }
        if (nextProps.match.url !== this.props.match.url) {
            window.scrollTo(0, 0);
            const username = nextProps.match.params.profileId;
            const tempCookie = new Cookies();
            nextProps.dispatch(fetchVendorForAdmin(username, tempCookie.get('token')))
                .then(data => {
                    if (data.success && data.vendorData) {
                        if (!_.isEmpty(data.vendorData.vendor)) {
                            const imagesArray = nextProps.adminReducer.images;
                            const imageLinkArray = [];
                            if (imagesArray.length > 0) {
                                imagesArray.map((value) => {
                                    imageLinkArray.push(value.image.link);
                                });
                            }
                            this.setState({
                                images: imageLinkArray,
                                description: data.vendorData.vendor.description
                            });
                            this.renderMapAndProgressBar();
                        }
                    }
                });
        }
    }

    componentDidMount() {
        document.addEventListener('click', (event) => {
            if (event.target.id === 'cover-pic-vendor') {
                this.props.dispatch(asyncTogglePicture(this.props.adminReducer.vendor.coverPicture))
            }
        });
    }


    mapExperience = (card, i) => {
        return (
            <ExperienceCard key={i} match={this.props.match} card={card}/>
        );
    };

    mapGallery = (card, i) => {
        if (this.props.adminReducer.imageCount > 4 && i === 3) {
            return (
                <div key={i} style={{
                    backgroundImage: `url('${card.image.link}')`,
                    width: '21%',
                    backgroundSize: 'cover',
                    display: 'inline-block',
                    height: '10rem',
                    marginRight: '1%',
                    position: 'relative',
                    borderRadius: '8px'
                }} onClick={() => {
                    this.setState({
                        openLightBox: true,
                        photoIndex: i
                    });
                }}>
                    <span className="four-image-gallery">
                        <span className="four-image-gallery-image">+{parseInt(this.props.adminReducer.imageCount) - 4}
                            photos</span>
                    </span>
                    <MdShare className="image-share-button"/>
                </div>
            );
        } else {
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
        }
    };

    deleteImage = (id) => {
        const tempCookie = new Cookies();
        this.props.dispatch(asyncDeleteImage(this.props.adminReducer.vendor.username, id, tempCookie.get('token')));
    };


    mapGalleryMobile = (card, i) => {
        if (this.props.adminReducer.imageCount > 4 && i === 3) {
            return (
                <div key={i} style={{
                    backgroundImage: `url('${card.image.link}')`,
                    width: '21%',
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
                    <span className="four-image-gallery">
                        <span className="four-image-gallery-image">+{parseInt(this.props.adminReducer.imageCount) - 4}
                            More</span>
                    </span>
                    <MdShare className="image-share-button"/>
                </div>
            );
        } else {
            return (
                <div key={i} style={{
                    backgroundImage: `url('${card.image.link}')`,
                    width: '21%',
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
        }
    };

    renderMapAndProgressBar = () => {
        if (document.getElementById('map')) {
            const uluru = {
                lat: this.props.adminReducer.vendor.address.coordinates.coordinates[0],
                lng: this.props.adminReducer.vendor.address.coordinates.coordinates[1]
            };
            const map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: uluru
            });
            new window.google.maps.Marker({
                position: uluru,
                map: map
            });

        }

    };


    closeModal = () => {
        this.setState({
            reviewModal: false
        })
    };

    renderMetaTags = () => {
        const vendorData = this.props.adminReducer.vendor;
        return (
            <Helmet
                titleTemplate="%s">
                <title>{vendorData.displayName}</title>
                <meta name="fragment" content="!"/>
                <meta name="description" content={vendorData.description}/>
                <link rel="canonical" href={`https://www.trustvardi.com${this.props.location.pathname}`}/>
                <meta name="robots" content="index, follow"/>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
                <meta property="og:title" content={vendorData.displayName}/>
                <meta property="og:description" content={vendorData.description}/>
                <meta property="og:locale" content="en_US"/>
                <meta property="og:url" content={`https://www.trustvardi.com${this.props.location.pathname}`}/>
                <meta property="og:type" content="article"/>
                <meta property="og:image" content={vendorData.coverPicture}/>
                <meta property="og:site_name" content="trustvardi.com"/>
                <meta property="article:section" content="Lifestyle"/>
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:site" content="@sodelhi"/>
                <meta name="twitter:creator" content="@sodelhi"/>
                <meta name="twitter:title" content={vendorData.displayName}/>
                <meta name="twitter:description" content={vendorData.description}/>
                <meta name="twitter:image" content={vendorData.coverPicture}/>
            </Helmet>
        );
    };



    goToAllProductsPage = () => {
        this.props.history.push({
            pathname: `/admin/profile/${this.props.adminReducer.vendor.username}/products`
        });
    };


    openCloudinaryUploader = (event, type, aRatio) => {
        event.preventDefault();
        if (!imageUploadingDialogOpen) {
            imageUploadingDialogOpen = true;
            const tempCookie = new Cookies();
            if (tempCookie.get('token')) {
                window.cloudinary.openUploadWidget({
                        cloud_name: CLOUDINARY.cloud_name,
                        upload_preset: CLOUDINARY.upload_preset,
                        api_key: CLOUDINARY.api_key,
                        api_secret: CLOUDINARY.api_secret,
                        cropping: 'server',
                        folder: 'vendors',
                        sources: ['local', 'url', 'camera', 'facebook'],
                        gravity: 'custom',
                        quality: 'auto:eco',
                        cropping_aspect_ratio: aRatio,
                        max_file_size: 5000000
                    },
                    (error, result) => {
                        imageUploadingDialogOpen = false;
                        if (!error) {
                            if (result) {
                                if (result[0]) {
                                    const vendor = this.props.adminReducer.vendor.username;
                                    if (type === 'cover') {

                                        const data = {
                                            coverPicture: `${result[0].secure_url.split('/upload/')[0]}/upload/q_50,c_crop,g_custom:face/${result[0].secure_url.split('/upload/')[1]}`,
                                        };

                                        this.props.dispatch(asyncUpdateVendorData(tempCookie.get('token'), data, vendor));
                                    } else if (type === 'profile') {
                                        const data = {
                                            profilePicture: `${result[0].secure_url.split('/upload/')[0]}/upload/q_50,c_crop,g_custom:face/${result[0].secure_url.split('/upload/')[1]}`
                                        };
                                        this.props.dispatch(asyncUpdateVendorData(tempCookie.get('token'), data, vendor));
                                    }
                                }
                            }
                        }
                    });
            } else {
                this.props.dispatch(toggleLoginModal());
                imageUploadingDialogOpen = false;
            }
        }
    };

    openCloudinaryMultipleImages = (event) => {
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
                            imageArray.push({
                                vendor: this.props.adminReducer.vendor.username,
                                image: {
                                    link: `${result[i].secure_url.split('/upload/')[0]}/upload/q_60/${result[i].secure_url.split('/upload/')[1]}`,
                                    description: ''
                                },
                                experienceType: 'image',
                                isPublished: true,
                                publishedDate: Date.now(),
                                creationDate: Date.now(),
                                articleId: `${Date.now()}-${Math.random()}`,
                                user: this.props.meReducer.userData.user.username
                            });
                        }
                        const tempCookies = new Cookies();
                        this.props.dispatch(asyncSaveImages(tempCookies.get('token'), imageArray, this.props.adminReducer.vendor.username))
                            .then((data) => {
                                if (data.success) {
                                    const imageLinkArray = [];
                                    if (this.props.adminReducer.images.length > 0) {
                                        this.props.adminReducer.images.map((value) => {
                                            imageLinkArray.push(value.image.link);
                                        });
                                        this.setState({
                                            images: imageLinkArray
                                        });
                                    }
                                }
                            });
                    }
                }
            });
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

    descriptionPanelModule = () => {

        const vendorData = this.props.adminReducer.vendor;

        return (
            <div className="edit-profile-container-admin">
                <span className="edit-profile-label-admin">Edit Profile</span>
                <span className="edit-profile-name-label">Product Name</span>
                <span className="edit-profile-name-text">{vendorData.displayName}</span>
                <span className="edit-profile-name-warning">This cannot be changed</span>
                <span className="edit-profile-description-label">Company Description</span>
                <textarea onKeyDown={(event) => {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                    }
                }} maxLength={320} id="edit-description" onChange={(event) => {
                    this.setState({
                        description: event.target.value
                    });
                }} className="edit-profile-description-text" defaultValue={vendorData.description}/>
                <span>{this.state.description.length}/320</span>
                <span className="edit-profile-input-label">Website</span>
                <input id="edit-website" onChange={(event) => {
                    this.setState({
                        website: event.target.value
                    });
                }} className="edit-profile-input-text" type="text" defaultValue={vendorData.website}/>
                <div style={{display: 'inline-block'}}>
                    <span className="edit-profile-input-label">Email Id</span>
                    <input id="edit-email" onChange={(event) => {
                        this.setState({
                            email: event.target.value
                        });
                    }} className="edit-profile-input-text" type="text" defaultValue={vendorData.email}/>
                </div>
                <div style={{display: 'inline-block', marginLeft: '40px'}}>
                    <span className="edit-profile-input-label">Phone No.</span>
                    <input id="edit-phonenumber" onChange={(event) => {
                        this.setState({
                            customerContactPhoneNumber: event.target.value
                        });
                    }} className="edit-profile-input-text" type="text"
                           defaultValue={vendorData.customerContactPhoneNumber}/>
                </div>
                <div style={{marginTop: '40px'}}>
                    <span className="edit-profile-input-label">Social Media Pages</span>
                    <div>
                        <div style={{display: 'inline-block'}}>
                            <div className="social-input-container">
                                <div className="edit-profile-social-icon-input">
                                    <FaInstagram className="edit-profile-social-icon-input-container"
                                                 style={{fill: '#2a5b83'}}/>
                                </div>
                                <input id="edit-instagram" onChange={(event) => {
                                    this.setState({
                                        instagramUrl: event.target.value
                                    });
                                }} placeholder="Enter Instagram link" className="edit-profile-input-text-social"
                                       type="text" defaultValue={vendorData.instagramUrl}/>
                            </div>
                        </div>
                        <div style={{display: 'inline-block', marginLeft: '40px'}}>
                            <div className="social-input-container">
                                <div className="edit-profile-social-icon-input">
                                    <FaFacebookOfficial style={{fill: '#43619c'}}
                                                        className="edit-profile-social-icon-input-container"/>
                                </div>
                                <input id="edit-facebook" onChange={(event) => {
                                    this.setState({
                                        facebookUrl: event.target.value
                                    });
                                }} placeholder="Enter Facebook link" className="edit-profile-input-text-social"
                                       type="text" defaultValue={vendorData.facebookUrl}/>
                            </div>
                        </div>
                    </div>
                    <div style={{marginTop: '17px'}}>
                        <div style={{display: 'inline-block'}}>
                            <div className="social-input-container">
                                <div className="edit-profile-social-icon-input">
                                    <FaTwitter style={{fill: '#24a9e6'}}
                                               className="edit-profile-social-icon-input-container"/>
                                </div>
                                <input id="edit-twitter" onChange={(event) => {
                                    this.setState({
                                        twitterUrl: event.target.value
                                    });
                                }} placeholder="Enter Twitter link" className="edit-profile-input-text-social"
                                       type="text" defaultValue={vendorData.twitterUrl}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="button-container-admin-description">
                    <button onClick={this.closeModalAdmin} className="discard-change-button">Discard Changes</button>
                    <button className="save-change-button" onClick={this.saveDescription}>Save Changes</button>
                </div>
            </div>
        )
    };

    /**
     * Function to render edit address modal.
     */
    addressPanelModule = () => {
        const vendorData = this.props.adminReducer.vendor;
        return (
            <div className="edit-profile-container-admin">
                <span className="edit-profile-label-admin">Edit Company Address and Phone number</span>
                <span className="edit-profile-description-label">Company Description</span>
                <textarea id="edit-address" className="edit-profile-description-text-address"
                          defaultValue={vendorData.address.address}/>
                <div style={{display: 'inline-block'}}>
                    <span className="edit-profile-input-label">Timings</span>
                    <input id="edit-timings" className="edit-profile-input-text" type="text"
                           defaultValue={vendorData.timings}/>
                </div>
                <div style={{display: 'inline-block', marginLeft: '40px'}}>
                    <span className="edit-profile-input-label">Phone No.</span>
                    <input id="edit-contact-phonenumber" className="edit-profile-input-text" type="text"
                           defaultValue={vendorData.contactPhoneNumber}/>
                </div>
                <div className="button-container-admin-description">
                    <button onClick={this.closeModalAdmin} className="discard-change-button">Discard Changes</button>
                    <button className="save-change-button" onClick={this.saveAddress}>Save Changes</button>
                </div>
            </div>
        );
    };


    getValueFromInput = (id) => {
        return document.getElementById(id) ? document.getElementById(id).value : '';
    };

    saveAddress = () => {
        const tempCookie = new Cookies();
        if (tempCookie.get('token')) {
            const vendor = this.props.adminReducer.vendor.username;
            const address = this.props.adminReducer.vendor.address;
            address.address = this.getValueFromInput('edit-address');
            const data = {
                address,
                timings: this.getValueFromInput('edit-timings'),
                contactPhoneNumber: this.getValueFromInput('edit-contact-phonenumber')
            };
            this.props.dispatch(asyncUpdateVendorData(tempCookie.get('token'), data, vendor))
                .then((data) => {
                    this.closeModalAdmin()
                });
        }
    };

    saveDescription = () => {
        const tempCookie = new Cookies();
        if (tempCookie.get('token')) {
            const vendor = this.props.adminReducer.vendor.username;
            const data = {
                description: this.getValueFromInput('edit-description'),
                website: this.getValueFromInput('edit-website'),
                email: this.getValueFromInput('edit-email'),
                contactPhoneNumber: this.getValueFromInput('edit-phonenumber'),
                facebookUrl: this.getValueFromInput('edit-facebook'),
                instagramUrl: this.getValueFromInput('edit-instagram'),
                twitterUrl: this.getValueFromInput('edit-twitter')
            };
            this.props.dispatch(asyncUpdateVendorData(tempCookie.get('token'), data, vendor))
                .then((data) => {
                    this.closeModalAdmin()
                });
        }
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

    handleChange = (html) => {
        if (html !== '<p><br></p>') {
            this.setState({
                productDescription: html
            });
        } else {
            this.setState({
                productDescription: ''
            });
        }
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
                        <button style={{ width: 'auto' }} className="view-all-button" onClick={this.openCloudinaryProductImages}>Upload Image</button>
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
                <div className="product-desc-container">
                    <span className="edit-profile-description-label">Description</span>
                    {/* <textarea id="edit-description" onChange={(event) => {
                        this.setState({
                            productDescription: event.target.value
                        });
                    }} className="edit-profile-description-text" defaultValue={this.state.productDescription}/> */}
                    <ReactQuill value={this.state.productDescription}
                                    placeholder={'Write Your Description Here...'}
                                    onChange={this.handleChange} />
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
                    {/* <div className="edit-profile-specification">
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
                    </div> */}
                    <div className="button-container-admin-description">
                        <button onClick={this.closeModalAdmin} className="discard-change-button">Discard Changes</button>
                        <button className="save-change-button" onClick={this.saveProduct}>Save Changes</button>
                    </div>
                </div>
            </div>
        );
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


    desktopUI = () => {
        if (!this.props.adminReducer.loading && !_.isEmpty(this.props.adminReducer.vendor)) {
            return (
                <div className="animated fadeIn"
                     style={{minHeight: '100vh', backgroundColor: '#fafafa', overflow: 'auto'}}>
                    <ReactModal
                        isOpen={this.state.showAdminModal}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModalAdmin}
                        style={customStyles}
                        contentLabel="Example Modal">
                        {this.state.descriptionPanel &&
                        this.descriptionPanelModule()
                        }
                        {this.state.addressPanel &&
                        this.addressPanelModule()
                        }
                        {this.state.productPanel &&
                        this.productPanelModule()
                        }
                    </ReactModal>
                    {this.renderMetaTags()}
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
                    <div className="vendor-desktop-xyz-container">
                        <div id="cover-pic-vendor" style={{
                            backgroundImage: `linear-gradient(0deg,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(${this.props.adminReducer.vendor.coverPicture})`,
                            height: '15rem',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            position: 'relative'
                        }}>
                            {this.props.adminReducer.vendor.trusted && trustvardiCertifiedIcon('assured-icon')}
                            {this.props.adminReducer.vendor.vendorType === 'product' &&
                            <span className="product-badge-vendor">Product Based</span>
                            }
                            {this.props.adminReducer.vendor.vendorType === 'service' &&
                            <span className="service-badge-vendor">Service Based</span>
                            }
                            <div className="social-icons-vendor-desktop-admin">
                                {this.props.adminReducer.vendor.facebookUrl &&
                                <FaFacebook onClick={() => {
                                    window.open(this.props.adminReducer.vendor.facebookUrl, '_blank')
                                }} className="social-icon-vendor-icons-admin"/>
                                }
                                {this.props.adminReducer.vendor.instagramUrl &&
                                <FaInstagram onClick={() => {
                                    window.open(this.props.adminReducer.vendor.instagramUrl, '_blank')
                                }} className="social-icon-vendor-icons-admin"/>
                                }
                                {this.props.adminReducer.vendor.twitterUrl &&
                                <FaTwitter onClick={() => {
                                    window.open(this.props.adminReducer.vendor.twitterUrl, '_blank')
                                }} className="social-icon-vendor-icons-admin"/>
                                }
                                {this.props.adminReducer.vendor.linkedInUrl &&
                                <FaLinkedin onClick={() => {
                                    window.open(this.props.adminReducer.vendor.linkedInUrl, '_blank')
                                }} className="social-icon-vendor-icons-admin"/>
                                }
                            </div>
                            <span onClick={(event) => this.openCloudinaryUploader(event, 'cover', 2.5)}
                                  className="vendor-edit-cover-pic-button">
                                <FaCamera/>
                                Upload Picture
                            </span>
                            <div className="vendor-profile-picture">
                                <img onClick={() => {
                                    this.props.dispatch(asyncTogglePicture(this.props.adminReducer.vendor.profilePicture))
                                }} className="vendor-profile-picture-admin"
                                     src={this.props.adminReducer.vendor.profilePicture} alt=""/>
                                <span onClick={(event) => this.openCloudinaryUploader(event, 'profile', 1.0)}
                                      className="vendor-edit-profile-pic-button">
                                    <FaCamera/>
                                    Upload Picture
                                </span>
                            </div>
                            <div className="vendor-details">
                                    <span className="vendor-name-page">
                                        <span
                                            style={{verticalAlign: 'sub'}}>{this.props.adminReducer.vendor.displayName}</span>
                                        {parseInt(this.props.adminReducer.vendor.rating) >= 3 &&
                                        <span className="rating-vendor-page">{this.props.adminReducer.vendor.rating}
                                            <FaStar style={{marginLeft: '5px'}}/>
                                        </span>
                                        }
                                        {parseInt(this.props.adminReducer.vendor.rating) < 3 &&
                                        <span
                                            className="rating-vendor-page-poor">{this.props.adminReducer.vendor.rating}
                                            <FaStar style={{marginLeft: '5px'}}/>
                                        </span>
                                        }
                                    </span>
                                {/*<div style={{marginTop: '5px'}}>*/}
                                {/*<span*/}
                                {/*className="vendor-location-page">{this.props.adminReducer.vendor.address.address}*/}
                                {/*</span>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className="vendor-basic-information-desktop">
                            <div className="vendor-admin-description-button-container">
                                <button onClick={() => {
                                    this.setState({
                                        showAdminModal: true,
                                        descriptionPanel: true
                                    });
                                    document.body.style.overflow = 'hidden';
                                }} className="vendor-admin-description-button">
                                    {addPenIcon()}
                                    Edit Profile
                                </button>
                                <button onClick={() => {
                                    window.open(
                                        `https://www.trustvardi.com/profile/${this.props.adminReducer.vendor.username}`,
                                        '_blank'
                                    );
                                }} style={{margin: '20px 0'}} className="vendor-admin-description-button">
                                    <FaGlobe/>
                                    Public Profile
                                </button>
                            </div>
                            <div className="vendor-basic-information-fame-desktop">
                                <span style={{fontSize: '14px', width: '500px'}}>
                                    {this.props.adminReducer.vendor.description}
                                </span>
                                <div style={{marginTop: '20px'}}>
                                    <span>
                                        <span
                                            className="vendor-review">{`${this.props.adminReducer.vendor.reviewCount} `}
                                            Reviews
                                        </span>
                                        <span
                                            className="vendor-follower">{`${this.props.adminReducer.vendor.followerCount} `}
                                            Followers</span>
                                        {/*<span*/}
                                        {/*className="vendor-following">{`${this.props.adminReducer.vendor.followingCount} `}*/}
                                        {/*Following</span>*/}
                                    </span>
                                </div>
                                {/*<div style={{marginTop: '30px'}}>*/}
                                {/*{this.props.adminReducer.vendor.isFollowing &&*/}
                                {/*<span className="follow-vendor-page"*/}
                                {/*onClick={() => this.followUnFollowVendor(this.props.adminReducer.vendor.username, false)}>Following</span>*/}
                                {/*}*/}
                                {/*{!this.props.adminReducer.vendor.isFollowing &&*/}
                                {/*<span className="follow-vendor-page"*/}
                                {/*onClick={() => this.followUnFollowVendor(this.props.adminReducer.vendor.username, true)}>Follow</span>*/}
                                {/*}*/}
                                {/*<span className="claim-profile-page" onClick={this.onClaimProfile}>Claim this Profile</span>*/}
                                {/*</div>*/}
                                <div style={{marginTop: '30px'}}>
                                    <span>
                                        {this.props.adminReducer.vendor.website && this.props.adminReducer.vendor.website.length > 0 &&
                                        <FaLaptop style={{height: '1.2rem', width: '1.2rem'}}/>
                                        }
                                        {this.props.adminReducer.vendor.website && this.props.adminReducer.vendor.website.length > 0 &&
                                        <span
                                            onClick={() => {
                                                window.open(this.props.adminReducer.vendor.website, '_blank');
                                            }}
                                            style={{
                                                fontSize: '14px',
                                                marginLeft: '5px',
                                                cursor: 'pointer'
                                            }}>Visit Website</span>
                                        }
                                        {this.props.adminReducer.vendor.email && this.props.adminReducer.vendor.email.length > 0 &&
                                        <MdEmail style={{
                                            fontSize: '12px',
                                            marginLeft: '15px',
                                            height: '1.2rem',
                                            width: '1.2rem'
                                        }}/>
                                        }
                                        {this.props.adminReducer.vendor.email && this.props.adminReducer.vendor.email.length > 0 &&
                                        <span
                                            style={{
                                                fontSize: '14px',
                                                marginLeft: '5px'
                                            }}>{this.props.adminReducer.vendor.email}</span>
                                        }
                                        {this.props.adminReducer.vendor.customerContactPhoneNumber && this.props.adminReducer.vendor.customerContactPhoneNumber.length > 0 &&
                                        <FaPhone style={{
                                            fontSize: '12px',
                                            marginLeft: '15px',
                                            height: '1.2rem',
                                            width: '1.2rem'
                                        }}/>
                                        }
                                        {this.props.adminReducer.vendor.customerContactPhoneNumber && this.props.adminReducer.vendor.customerContactPhoneNumber.length > 0 &&
                                        <span style={{
                                            fontSize: '14px',
                                            marginLeft: '5px'
                                        }}>{this.props.adminReducer.vendor.customerContactPhoneNumber}</span>
                                        }
                                    </span>
                                </div>
                                <div style={{marginTop: '40px'}}>
                                    <span>
                                        <span style={{marginLeft: '0'}} className="share-vendor-desktop"
                                              onClick={() => {
                                                  this.props.dispatch(asyncShareModal(`https://www.trustvardi.com/profile/${this.props.adminReducer.vendor.username}`));
                                              }}>
                                            <MdShare style={{fill: '#2c3249', marginRight: '10px'}}/>
                                            Share
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="vendor-detailed-information">
                            <div className="vendor-detailed-text-information">
                                <div className="vendor-detailed-text-information-holder">
                                    {this.props.adminReducer.vendor.companyFeatures.length > 0 &&
                                    <div>
                                        <p className="company-feature-label">
                                            Company Feature
                                        </p>
                                        <span>
                                                {this.props.adminReducer.vendor.companyFeatures.map((value, i) => {
                                                    if (i === 0) {
                                                        return (
                                                            <div style={{display: 'inline-block'}} key={i}>
                                                                <MdCheckCircle className="icon-check-circle"/>
                                                                <span className="features-text"
                                                                      style={{marginLeft: '5px'}}>{value}</span>
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div style={{display: 'inline-block', marginLeft: '5px'}}
                                                                 key={i}>
                                                                <MdCheckCircle className="icon-check-circle"/>
                                                                <span className="features-text"
                                                                      style={{marginLeft: '5px'}}>{value}</span>
                                                            </div>
                                                        );
                                                    }
                                                })
                                                }
                                            </span>
                                    </div>
                                    }
                                    <div style={{marginTop: '30px'}}>
                                        <p style={{fontWeight: '600'}}>Popular in Categories</p>
                                        <span style={{overflow: 'auto', display: 'block'}}>
                                                {this.props.adminReducer.vendor.category.map((value, i) => {
                                                    return (
                                                        <div key={i} className="popular-categories-div">
                                                            <img alt=""
                                                                 src={categories[value] ? categories[value].icon : ''}
                                                                 className="popular-categories-div-icon"/>
                                                            <span
                                                                className="popular-categories-div-text">{categories[value] ? categories[value].name : ''}</span>
                                                        </div>
                                                    );
                                                })}
                                        </span>
                                    </div>
                                    <div style={{marginTop: '30px'}}>
                                        <p style={{fontWeight: '600'}}>What People love About us</p>
                                        <span style={{overflow: 'auto', display: 'block'}}>
                                            {this.props.adminReducer.vendor.lovedCategories.map((value, i) => {
                                                return (
                                                    <div key={i} className="popular-categories-div">
                                                        <img alt="" onClick={`/category/${collectionsObject[value].icon.value}`}
                                                             src={collectionsObject[value] ? collectionsObject[value].icon : ''}
                                                             className="popular-categories-div-icon"/>
                                                        <span
                                                            className="popular-categories-div-text">{collectionsObject[value] ? collectionsObject[value].name : value}</span>
                                                    </div>
                                                );
                                            })}
                                        </span>
                                    </div>
                                    <div style={{marginTop: '30px'}}>
                                        <p style={{fontWeight: '600'}}>Customer Experience</p>
                                        <div style={{position: 'relative'}}>
                                            <div
                                                className={`c100 p${this.props.adminReducer.vendor.customerExperience} small`}>
                                                <span>{this.props.adminReducer.vendor.customerExperience}%</span>
                                                <div className="slice">
                                                    {this.props.adminReducer.vendor.customerExperience < 40 &&
                                                    <div className="bar" style={{border: '0.08em solid red'}}></div>
                                                    }
                                                    {this.props.adminReducer.vendor.customerExperience > 40 &&
                                                    <div className="bar"></div>
                                                    }
                                                    <div className="fill"></div>
                                                </div>
                                            </div>
                                            <p className="rating-positive-text">positive experience</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="vendor-address-information">
                                <div id="map" style={{height: '250px'}}></div>
                                <div style={{margin: '20px'}}>
                                    <p style={{fontWeight: '900', marginBottom: '0', display: 'inline-block'}}>
                                        Corporate Office
                                    </p>
                                    <button onClick={() => {
                                        this.setState({
                                            showAdminModal: true,
                                            addressPanel: true
                                        });
                                    }} className="vendor-admin-address-button">
                                        {addPenIcon()}
                                        Edit
                                    </button>
                                    <p style={{
                                        fontSize: '14px',
                                        width: '70%',
                                        marginBottom: '0',
                                        marginTop: '5px'
                                    }}>
                                        {this.props.adminReducer.vendor.address.address}
                                    </p>
                                    <p onClick={() => {
                                        const url = `https://www.google.com/maps?z=12&t=m&q=loc:${this.props.adminReducer.vendor.address.coordinates.coordinates[0]}+${this.props.adminReducer.vendor.address.coordinates.coordinates[1]}`;
                                        window.open(url, '_blank');
                                    }} style={{color: '#ff9f00', fontSize: '13px', cursor: 'pointer'}}>
                                        Get Directions
                                    </p>
                                    {this.props.adminReducer.vendor.timings &&
                                    <p style={{fontWeight: '900', margin: '10px 0 0 0'}}>
                                        Timings
                                    </p>
                                    }
                                    {this.props.adminReducer.vendor.timings !== '00:00 am - 00:00 am' &&
                                    <p style={{
                                        fontSize: '14px',
                                        width: '70%',
                                        marginBottom: '0',
                                        marginTop: '5px'
                                    }}>
                                        {this.props.adminReducer.vendor.timings}
                                    </p>
                                    }
                                    {this.props.adminReducer.vendor.timings === '00:00 am - 00:00 am' &&
                                    <p style={{
                                        fontSize: '14px',
                                        width: '70%',
                                        marginBottom: '0',
                                        marginTop: '5px'
                                    }}>
                                        Always Available
                                    </p>
                                    }
                                    {this.props.adminReducer.vendor.contactPhoneNumber &&
                                    <p style={{fontWeight: '900', marginBottom: '0'}}>
                                        Call
                                    </p>
                                    }
                                    {this.props.adminReducer.vendor.contactPhoneNumber &&
                                    <p style={{
                                        fontSize: '14px',
                                        width: '70%',
                                        marginBottom: '0',
                                        marginTop: '5px'
                                    }}>
                                        {this.props.adminReducer.vendor.contactPhoneNumber}
                                    </p>
                                    }
                                    {this.props.adminReducer.vendor.availableAt &&
                                    <p style={{fontWeight: '900', marginBottom: '0'}}>
                                        Available at
                                    </p>
                                    }
                                    {this.props.adminReducer.vendor.availableAt &&
                                    <p style={{
                                        fontSize: '14px',
                                        width: '70%',
                                        marginBottom: '0',
                                        marginTop: '5px'
                                    }}>
                                        {this.props.adminReducer.vendor.availableAt}
                                    </p>
                                    }
                                </div>
                            </div>
                        </div>
                        {/*<div className="vendor-tabs-holder">*/}
                        {/*<div className="vendor-tabs-div experience-vendor">*/}
                        {/*<span className="vendor-tabs-div-span"*/}
                        {/*style={{borderRight: '2px solid rgba(35,54,76, 0.1)'}}>Experiences</span>*/}
                        {/*</div>*/}
                        {/*<div className="vendor-tabs-div gallery-vendor" style={{left: '20%'}}>*/}
                        {/*<span className="vendor-tabs-div-span"*/}
                        {/*style={{borderRight: '2px solid rgba(35,54,76, 0.1)'}}>Gallery</span>*/}
                        {/*</div>*/}
                        {/*<div className="vendor-tabs-div review-vendor" style={{left: '40%'}}>*/}
                        {/*<span className="vendor-tabs-div-span"*/}
                        {/*style={{borderRight: '2px solid rgba(35,54,76, 0.1)'}}>Reviews</span>*/}
                        {/*</div>*/}
                        {/*<div className="vendor-tabs-div product-vendor" style={{left: '60%'}}>*/}
                        {/*<span className="vendor-tabs-div-span"*/}
                        {/*style={{borderRight: '2px solid rgba(35,54,76, 0.1)'}}>Products</span>*/}
                        {/*</div>*/}
                        {/*<div className="vendor-tabs-div article-vendor" style={{left: '80%'}}>*/}
                        {/*<span className="vendor-tabs-div-span">Articles</span>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        <div>
                            <div className="vendor-experiences">
                                <div className="vendor-experiences-container-tabs">
                                    {this.props.adminReducer.videos.length > 0 &&
                                    <div style={{overflow: 'auto', marginBottom: '30px'}}>
                                        <span style={{
                                            float: 'left',
                                            fontWeight: '800',
                                            fontSize: '18px'
                                        }}>Experiences</span>
                                        {/*<button style={{float: 'right'}} className="view-all-button">View All*/}
                                        {/*</button>*/}
                                    </div>
                                    }
                                    {this.props.adminReducer.videos.length > 0 &&
                                    <div style={{overflow: 'auto'}}>
                                        {this.props.adminReducer.videos.map(this.mapExperience)}
                                    </div>
                                    }

                                    <div style={{textAlign: 'center', marginTop: '20px', marginBottom: '50px'}}>
                                        <div style={{overflow: 'auto', marginBottom: '30px'}}>
                                            <span style={{
                                                float: 'left',
                                                fontWeight: '800',
                                                fontSize: '18px'
                                            }}>Images</span>
                                            <button onClick={() => {
                                                this.props.history.push({
                                                    pathname: `/admin/profile/${this.props.match.params.profileId}/photos`
                                                })
                                            }} style={{float: 'right'}} className="view-all-button">View All
                                            </button>
                                        </div>
                                        {this.props.adminReducer.images.map(this.mapGallery)}
                                        <div style={{textAlign: 'center'}}>
                                            <button onClick={this.openCloudinaryMultipleImages}
                                                    className="add-product-button-admin">
                                                <MdAddCircle/>
                                                <span>
                                                Add {this.props.adminReducer.images.length > 0 ? 'More ' : ''} Photos
                                            </span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/*<div>*/}
                        {/*<div className="vendor-review">*/}
                        {/*<div className="vendor-review-container-tabs ">*/}
                        {/*<div style={{overflow: 'auto', marginBottom: '30px'}}>*/}
                        {/*<span style={{float: 'left', fontWeight: '800', fontSize: '18px',  letterSpacing: '2px'}}>COMPANY REVIEWS</span>*/}
                        {/*/!*<button style={{float: 'right'}} className="view-all-button">View All*!/*/}
                        {/*/!*</button>*!/*/}
                        {/*</div>*/}
                        {/*<div style={{*/}
                        {/*backgroundColor: '#f8f8f9',*/}
                        {/*height: '3rem',*/}
                        {/*position: 'relative',*/}
                        {/*width: '80%'*/}
                        {/*}}>*/}
                        {/*<span*/}
                        {/*className="write-review-label">Write your own reviews & help our users</span>*/}
                        {/*<span className="write-review-button" onClick={() => {*/}
                        {/*if(this.props.meReducer.isLoggedIn) {*/}
                        {/*this.setState({*/}
                        {/*reviewModal: true*/}
                        {/*});*/}
                        {/*} else {*/}
                        {/*this.props.dispatch(toggleLoginModal());*/}
                        {/*}*/}
                        {/*}}>Write a Review</span>*/}
                        {/*</div>*/}
                        {/*{this.props.adminReducer.reviews.length > 0 ?*/}
                        {/*<div>*/}
                        {/*{this.props.adminReducer.reviews.map((card, i) => {*/}
                        {/*return (*/}
                        {/*<ReviewComment key={i} match={this.props.match} card={card}/>*/}
                        {/*);*/}
                        {/*})}*/}
                        {/*</div>*/}
                        {/*:*/}
                        {/*<div style={{height: '6rem', position: 'relative'}}>*/}
                        {/*<span style={{*/}
                        {/*position: 'absolute',*/}
                        {/*top: '50%',*/}
                        {/*left: '50%',*/}
                        {/*transform: 'translate(-50%, -50%)',*/}
                        {/*fontSize: '18px',*/}
                        {/*fontWeight: '500'*/}
                        {/*}}>Zero reviews. Please leave a review if you have one.</span>*/}
                        {/*</div>*/}
                        {/*}*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        <div>
                            <div className="vendor-product">
                                <div className="vendor-product-container">
                                    <div style={{overflow: 'auto', marginBottom: '30px'}}>
                                        <span style={{
                                            float: 'left',
                                            fontWeight: '800',
                                            fontSize: '18px',
                                            marginLeft: '15px',
                                            letterSpacing: '2px'
                                        }}>HAVE YOU TRIED THESE OUT, YET?</span>
                                        <button style={{float: 'right'}} className="view-all-button"
                                                onClick={this.goToAllProductsPage}>View All
                                        </button>
                                    </div>
                                    <div>
                                        {this.props.adminReducer.products.map((card, i) => {
                                            return (
                                                <ProductCard editProduct={this.editProduct} key={i} match={this.props.match} history={this.props.history} card={card}/>
                                            );
                                        })}
                                    </div>
                                    <div style={{textAlign: 'center'}}>
                                        <button onClick={() => {
                                            this.setState({
                                                productPanel: true,
                                                showAdminModal: true
                                            });
                                        }} className="add-product-button-admin">
                                            <MdAddCircle/>
                                            <span>
                                                Add {this.props.adminReducer.products.length > 0 ? 'More ' : ''}
                                                Products
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*<div>*/}
                        {/*<div className="vendor-similar-profile">*/}
                        {/*<div className="vendor-similar-profile-container">*/}
                        {/*<div style={{overflow: 'auto', marginBottom: '30px'}}>*/}
                        {/*<span style={{float: 'left', fontWeight: '800', fontSize: '18px'}}>Similar Company Profiles</span>*/}
                        {/*<button style={{float: 'right'}} className="view-all-button">View All*/}
                        {/*</button>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*{SIMILAR_PROFILE.map((card, i) => {*/}
                        {/*return (*/}
                        {/*<TrendingCard key={i} card={card}/>*/}
                        {/*);*/}
                        {/*})}*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {this.props.adminReducer.articles.length > 0 &&
                        <div>
                            <div className="vendor-article">
                                <div className="vendor-article-container">
                                    <div style={{overflow: 'auto', marginBottom: '30px'}}>
                                        <span style={{
                                            float: 'left',
                                            fontWeight: '800',
                                            fontSize: '18px',
                                            marginLeft: '15px',
                                            letterSpacing: '2px'
                                        }}>VARDI VERDICT</span>
                                        <button style={{float: 'right'}} className="view-all-button">View All
                                        </button>
                                    </div>
                                    <div>
                                        {this.props.adminReducer.articles.map((card, i) => {
                                            return (
                                                <BlogCard history={this.props.history} key={i} card={card}/>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            );
        } else if (this.props.adminReducer.loading) {
            return (
                <div className="vendor-loader-container-desktop">
                    <img alt="" className="vendor-loader-desktop" src={loader}/>
                </div>
            )
        } else if (!this.props.adminReducer.loading && _.isEmpty(this.props.adminReducer.vendor)) {
            const tempCookie = new Cookies();
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    {!tempCookie.get('token') &&
                        <Login logIn={this.logIn} signUp={this.signUp} facebookLogin={this.facebookLogin} googleLogin={this.googleLogin} admin={true} />
                    }
                    {tempCookie.get('token') &&
                        <span>This Account does not have access to this Brand.</span>
                    }
                </div>
            )
        }
    };

    facebookLogin = (responseData) => {
        if (responseData) {
            if (this.getQueryVariable('refCode')) {
                responseData.referredBy = this.getQueryVariable('refCode');
                responseData.isReferred = true;
            }
            this.props.dispatch(asyncFacebookLogin(responseData))
                .then(data => {
                    if (data.success) {
                        const cookies = new Cookies();
                        cookies.set('token', data.accessToken, { path: '/', maxAge: 2592000 });
                        cookies.set('mode', 'facebook');
                    }
                })
                .catch(error => {

                });
        }
    };

    googleLogin = (responseData) => {
        this.props.dispatch(asyncGoogleSignin(responseData, responseData.googleId))
            .then((data) => {
                if (data.success) {
                    const cookies = new Cookies();
                    cookies.set('token', data.accessToken, { path: '/', maxAge: 2592000 });
                    cookies.set('mode', 'google');
                }
            })
            .catch(error => {

            });
    };

    signUp = (signUpData) => {
        this.props.dispatch(asyncSignUp(signUpData))
            .then((data) => {
                if (data.success) {
                    const cookies = new Cookies();
                    cookies.set('token', data.data.accessToken, { path: '/', maxAge: 2592000 });
                    cookies.set('mode', 'email');
                }
            })
            .catch(error => {
                alert(error.data.message);
            });
    };

    logIn = (loginData) => {
        this.props.dispatch(asyncLogin(loginData))
            .then((data) => {
                if (data.success) {
                    const cookies = new Cookies();
                    cookies.set('token', data.data.accessToken, { path: '/', maxAge: 2592000 });
                    cookies.set('mode', 'email');
                }
            })
            .catch(error => {
                alert(error.data.message);
            });
    };


    render() {
        if (window.innerWidth > 768) {
            return (
                <div>
                    {this.desktopUI()}
                </div>
            );
        } else if (window.innerWidth < 768) {
            return (
                <div>

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

export default connect((state) => state, mapDispatchToProps)(VendorAdmin);