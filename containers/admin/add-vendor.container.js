import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import Modal from 'react-modal';
import Cookies from 'universal-cookie';
import Loadable from 'react-loadable';
import _ from 'lodash';
import {
    MdClose,
    MdCheckBox,
    MdCheckBoxOutlineBlank
} from 'react-icons/lib/md';
import loader from '../../assets/icons/loader.svg';
import loaderWhite from '../../assets/icons/loader-white.svg';
import '../../assets/css/addprofile.css';
import { categories, CITIES_SEARCH } from '../../constant/static';
import { CLOUDINARY } from '../../constant/keys';
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { asyncTogglePicture, toggleLoginModal } from '../../action/index';
import { postCallApi, postCallApiForm, showLoader } from '../../util/util';
import { SAVE_VENDOR_API, UPLOAD_IMAGE_API } from '../../constant/api';
// import { categories, collectionsObject, CITIES_SEARCH } from '../../constant/static';

const popupStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        maxHeight: '40rem',
        backgroundColor: '#fafafa'
    },
    overlay: {
        zIndex: '12'
    }
};

const mobilePopupStyles = {
    content: {
        width: '100%',
        backgroundColor: '#fafafa',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        padding: 0
    },
    overlay: {
        zIndex: '12'
    }
}

const TIME = [
    '00:00 am',
    '00:30 am',
    '01:00 am',
    '01:30 am',
    '02:00 am',
    '02:30 am',
    '03:00 am',
    '03:30 am',
    '04:00 am',
    '04:30 am',
    '05:00 am',
    '05:30 am',
    '06:00 am',
    '06:30 am',
    '07:00 am',
    '07:30 am',
    '08:00 am',
    '08:30 am',
    '09:00 am',
    '09:30 am',
    '10:00 am',
    '10:30 am',
    '11:00 am',
    '11:30 am',
    '12:00 pm',
    '12:30 pm',
    '01:00 pm',
    '01:30 pm',
    '02:00 pm',
    '02:30 pm',
    '03:00 pm',
    '03:30 pm',
    '04:00 pm',
    '04:30 pm',
    '05:00 pm',
    '05:30 pm',
    '06:00 pm',
    '06:30 pm',
    '07:00 pm',
    '07:30 pm',
    '08:00 pm',
    '08:30 pm',
    '09:00 pm',
    '09:30 pm',
    '10:00 pm',
    '10:30 pm',
    '11:00 pm',
    '11:30 pm'
];

const Day = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

const Map = Loadable({
    loader: () => import('../../component/map'),
    loading: () => <div>Loading...</div>,
});


let imageUploadingDialogOpen = false;

let saveVendorLoader = false;

const PROFILE_PICTURE = 'profilePicture'

const COVER_PICTURE = 'coverPicture'

const PROFILE_PICTURE_SIZES = [200, 400, 600, 800]

const COVER_PICTURE_SIZES = [600]

class AddVendor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showCategoyModal: false,
            showCollectionModal: false,
            showCityModal: false,
            formError: false,
            nameError: false,
            emailError: false,
            descriptionError: false,
            coverPictureError: false,
            profilePictureError: false,
            categoryError: false,
            collectionsError: false,
            regionError: false,
            companyFeaturesError: false,
            searchKeywordsError: false,
            errorString: '',
            category: [],
            collections: [],
            region: [],
            displayName: '',
            email: '',
            customerContactPhoneNumber: '',
            contactPhoneNumber: '',
            description: '',
            website: '',
            facebookUrl: '',
            twitterUrl: '',
            linkedInUrl: '',
            instagramUrl: '',
            youtubeUrl: '',
            address: {},
            vendorType: 'product',
            companyFeatures: [],
            searchKeywords: [],
            closedDays: [],
            profilePicture: '',
            coverPicture: '',
            selectAllCity: false,

            imageType: null,
            isImageSelected: false,
            imageFile: {}
        };
    }

    componentWillMount() {
        window.scrollTo(0, 0);
    }

    openModal = (type) => {
        document.body.style.overflow = 'hidden';
        if (type === 'category') {
            this.setState({
                showModal: true,
                showCategoyModal: true
            });
        } else if (type === 'collections') {
            this.setState({
                showModal: true,
                showCollectionModal: true
            });
        } else if (type === 'city') {
            this.setState({
                showModal: true,
                showCityModal: true
            });
        }
    }

    closeModalPopup = () => {
        this.setState({
            showModal: false,
            showCategoyModal: false,
            showCollectionModal: false,
            showCityModal: false
        });
        document.body.style.overflow = 'auto';
    };

    addCategoriesCollection = (type, value) => {
        const array = this.state[type];
        if (value.length > 0 && array.indexOf(value) === -1) {
            array.push(value);
            this.setState({
                [type]: array
            });
        }
    };

    removeCategoryCollection = (type, value) => {
        const array = this.state[type];
        if (array.indexOf(value) !== -1) {
            array.splice(array.indexOf(value), 1);
            if (type === 'region') {
                this.setState({
                    [type]: array,
                    selectAllCity: false
                });
            } else {
                this.setState({
                    [type]: array
                });
            }
        }
    };

    changeInput = (key, value) => {
        this.setState({
            [key]: value
        });
    }

    setLocation = (place) => {
        if (place && place.geometry) {
            this.setState({
                address: {
                    address: place.formatted_address,
                    coordinates: {
                        type: 'Point',
                        coordinates: [
                            place.geometry.location.lat(),
                            place.geometry.location.lng()
                        ]
                    }
                }
            });
        }
    }

    openCloudinaryUploader = (event, type, aRatio) => {
        event.preventDefault();
        if (!imageUploadingDialogOpen) {
            imageUploadingDialogOpen = true;
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
                                if (type === 'cover') {
                                    this.setState({
                                        coverPicture: result[0].secure_url
                                    });
                                } else if (type === 'profile') {
                                    this.setState({
                                        profilePicture: result[0].secure_url
                                    });
                                }
                            }
                        }
                    }
                });
        }
    };

    saveProfile = () => {
        this.validateForm();
        if (!saveVendorLoader) {
            saveVendorLoader = true;
            setTimeout(() => {
                if (this.state.formError) {
                    alert(this.state.errorString);
                    saveVendorLoader = false;
                } else {
                    const data = this.state;
                    const tempCookie = new Cookies();
                    data['timings'] = `${document.getElementById('start-time').value} - ${document.getElementById('end-time').value}`;
                    data['token'] = tempCookie.get('token');
                    postCallApi(SAVE_VENDOR_API, {
                        data
                    })
                        .then((saved) => {
                            if (saved.success) {
                                alert('Hey!\nThanks for submitting your details. Your brand\'s TrustVardi profile will be ready in about 24 hours. Please check your email for further updates.');
                                this.props.history.push({
                                    pathname: '/'
                                });
                            } else {
                                alert('Something went wrong try again');
                            }
                            saveVendorLoader = false;
                        })
                        .catch((error) => {
                            saveVendorLoader = false;
                            alert('Something went wrong try again');
                        });
                }
            }, 400);
        }
    };

    validateForm = () => {
        const data = this.state;
        const errorArray = [];
        let error = {
            formError: false,
            nameError: false,
            emailError: false,
            descriptionError: false,
            profilePictureError: false,
            coverPictureError: false,
            categoryError: false,
            regionError: false,
            companyFeaturesError: false,
            errorString: ''
        };
        if (data.displayName.length <= 0) {
            error.formError = true;
            error.nameError = true;
            errorArray.push('Display Name');
        }
        if (data.email.length <= 0) {
            error.formError = true;
            error.emailError = true;
            errorArray.push('Email');
        }
        if (data.description.length <= 0) {
            error.formError = true;
            error.descriptionError = true;
            errorArray.push('Description');
        }
        if (data.profilePicture.length <= 0) {
            error.formError = true;
            error.profilePictureError = true;
            errorArray.push('Profile Picture');
        }
        if (data.coverPicture.length <= 0) {
            error.formError = true;
            error.coverPictureError = true;
            errorArray.push('Cover Picture');
        }
        if (data.category.length <= 0) {
            error.formError = true;
            error.categoryError = true;
            errorArray.push('Categories');
        }
        if (data.region.length <= 0) {
            error.formError = true;
            error.regionError = true;
            errorArray.push('Region');
        }
        if (data.companyFeatures.length <= 0) {
            error.formError = true;
            error.companyFeaturesError = true;
            errorArray.push('Company Features');
        }
        if (error.formError) {
            error.errorString = `You forgot to fill these fields: ${errorArray.join(',')}`
        }
        this.setState(error);
    }

    selectAllCityFunc = (status) => {
        if (status) {
            const region = [];
            _.map(CITIES_SEARCH, (value) => {
                region.push(value.key);
            });
            this.setState({
                region,
                selectAllCity: true
            });
        } else {
            this.setState({
                region: [],
                selectAllCity: false
            })
        }
    }

    handleFileSelect = (event) => {
        event.preventDefault();
        const fileSelector = document.createElement('input')
        fileSelector.setAttribute('type', 'file')
        fileSelector.setAttribute('id', 'file')
        fileSelector.setAttribute('accept', '.jpg, .jpeg, .png, .gif, .bmp, .webp')
        fileSelector.click();
        fileSelector.addEventListener('change', (event) => {
            if (Object.keys(event.target.files).length === 1) {
                var file = event.target.files[0]
                this.setState({ isImageSelected: true, imageFile: file })
            }
        })
    }

    createCroppedImg = (imageFile) => {

        var pixelCrop = this.cropper.getData(true)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        var img = new Image()
        var reader = new FileReader()
        reader.readAsDataURL(imageFile)
        reader.onload = (e) => {
            if (e.target.readyState === FileReader.DONE) {
                img.src = e.target.result
                img.onload = () => {
                    ctx.drawImage(
                        img,
                        pixelCrop.x,
                        pixelCrop.y,
                        pixelCrop.width,
                        pixelCrop.height,
                        0, 0,
                        pixelCrop.width,
                        pixelCrop.height
                    )

                    if (img.complete) {
                        canvas.toBlob((blob) => {
                            blob.fileName = this.state.imageFile.name
                            this.uploadCroppedImg(blob)
                        }, 'image/jpeg')
                    }
                }


            }
        }
    }

    uploadCroppedImg = (croppedImgBlob) => {

        var file = new File([croppedImgBlob], this.state.imageFile.name)
        var formData = new FormData()
        formData.append('image', file)
        var type = this.state.imageType
        if (type === PROFILE_PICTURE) {
            var sizes = PROFILE_PICTURE_SIZES
        }
        if (type === COVER_PICTURE) {
            sizes = COVER_PICTURE_SIZES
        }


        showLoader(true)
        postCallApiForm(UPLOAD_IMAGE_API(), formData, sizes)
            .then(response => {
                const imageLink = response.data.url
                if (response.data.error !== "") {
                    alert(response.data.error)
                } else {
                    if (imageLink !== undefined) {
                        this.setState({
                            [type]: imageLink
                        }, () => showLoader(false))
                    } else {
                        alert('Some Error Occured')
                    }
                }

            })
            .catch(reason => {
                console.log(reason)
            })

        this.setState({
            imageType: null,
            isImageSelected: false,
            imageFile: {},
        })

    }

    renderUploadModal = () => {
        return (

            <div>
                {
                    <Modal
                        isOpen={this.state.isImageSelected}

                        style={window.innerWidth > 768 ? {
                            content: {
                                top: '50%',
                                bottom: '0',
                                left: '50%',
                                right: '0',
                                position: 'absolute',
                                transform: 'translate(-50%, -50%)',
                                overflow: 'hidden',
                                height: '70%',
                                width: '40%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                alignContent: 'center'
                            },
                            overlay: {
                                zIndex: '11',
                                overflow: 'auto'
                            }
                        } : {
                            content: {
                                top: '50%',
                                bottom: '0',
                                left: '50%',
                                right: '0',
                                position: 'absolute',
                                transform: 'translate(-50%, -50%)',
                                overflow: 'hidden',
                                height: '100%',
                                width: '90%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                alignContent: 'center'
                            },
                            overlay: {
                                zIndex: '11',
                                overflow: 'auto'
                            }
                        }}>
                        <div style={{ borderBottom: '1px solid #e7e7e7' }}>
                            <p
                                style={{
                                    color: 'black',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    margin: '0px',
                                    marginBottom: '16px'
                                }}>
                                Crop Your Picture</p></div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '16px',
                            maxHeight: '75%',
                            maxWidth: '100%',
                        }}>

                            <Cropper ref={(ref) => { this.cropper = ref }}
                                src={URL.createObjectURL(this.state.imageFile)}
                                style={{ maxWidth: '100%', objectFit: 'cover', display: 'flex' }}
                                aspectRatio={this.state.imageType === COVER_PICTURE ? 3 / 1 : 1 / 1}
                                responsive={true} viewMode={1} guides={false} background={false}
                                scalable={false} zoomable={false} modal={false} />

                        </div>
                        <div style={window.innerWidth > 768 ? {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'space-around',
                            width: '60%',
                            paddingTop: '16px'
                        } : {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'space-around',
                            width: '100%',
                            paddingTop: '16px'
                        }}>
                            <button style={{
                                display: 'flex',
                                fontSize: '16px',
                                backgroundColor: '#FC9C04',
                                border: '1px solid #FC9C04',
                                fontWeight: '300',
                                borderRadius: '0.2em',
                                color: 'white',
                                padding: '5px 8px'
                            }}
                                onClick={() => { this.createCroppedImg(this.state.imageFile) }}
                            >{this.state.imageType === PROFILE_PICTURE ? 'Set as Profile Photo' : 'Set as Profile Photo'}</button>
                            <button style={{
                                display: 'flex',
                                fontSize: '16px',
                                border: '1px solid #FC9C04',
                                backgroundColor: 'white',
                                borderRadius: '0.2em',
                                fontWeight: '300',
                                color: '#FC9C04',
                                padding: '5px 8px'
                            }}
                                onClick={() => { this.setState({ isImageSelected: false, imageFile: null }) }} >Cancel</button>
                        </div>
                    </Modal>
                }
            </div>
        )
    }

    modalContent = () => {
        return (
            <div
                style={{
                    paddingBottom: '25px'
                }}
                className="input-search-quick-search-container-search">
                <div className="input-quick-search-holder">
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            marginBottom: '25px'
                        }}>
                        <span
                            className="a-s-label">Select appropriate options</span>
                        <div
                            style={{
                                display: 'flex',
                                flexGrow: 1,
                                justifyContent: 'flex-end'
                            }}>
                            <MdClose onClick={this.closeModalPopup} className="a-s-label-close-button" />
                        </div>
                    </div>
                    {this.state.showCategoyModal &&
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}>
                            {_.map(categories, (value, i) => {
                                return (
                                    <div key={i} className="a-s-model-items">
                                        <span style={{ fontSize: '14px' }} className="search-trustvardi-assured-text">
                                            {value.name}
                                        </span>
                                        <div className="a-s-model-right-element">
                                            {!this.state.category.includes(value.key) &&
                                                <MdCheckBoxOutlineBlank
                                                    onClick={() => this.addCategoriesCollection('category', value.key)}
                                                    className="a-s-model-icons" />
                                            }
                                            {this.state.category.includes(value.key) &&
                                                <MdCheckBox onClick={() => this.removeCategoryCollection('category', value.key)}
                                                    style={{ fill: '#ff9f00' }}
                                                    className="a-s-model-icons" />
                                            }
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    }
                    {this.state.showCityModal &&
                        <div>
                            <div>
                                <div className="a-s-model-items">
                                    <span style={{ fontSize: '14px' }} className="search-trustvardi-assured-text">
                                        Select All
                                    </span>
                                    <div className="a-s-model-right-element">
                                        {!this.state.selectAllCity &&
                                            <MdCheckBoxOutlineBlank
                                                onClick={() => this.selectAllCityFunc(true)}
                                                className="a-s-model-icons" />
                                        }
                                        {this.state.selectAllCity &&
                                            <MdCheckBox
                                                onClick={() => this.selectAllCityFunc(false)}
                                                style={{ fill: '#ff9f00' }}
                                                className="a-s-model-icons" />
                                        }
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap'
                                }}>
                                {_.map(CITIES_SEARCH, (value, i) => {
                                    return (
                                        <div key={i} className="a-s-model-items">
                                            <span style={{ fontSize: '14px' }} className="search-trustvardi-assured-text">
                                                {value.name}
                                            </span>
                                            <div className="a-s-model-right-element">
                                                {!this.state.region.includes(value.key) &&
                                                    <MdCheckBoxOutlineBlank
                                                        onClick={() => this.addCategoriesCollection('region', value.key)}
                                                        className="a-s-model-icons" />
                                                }
                                                {this.state.region.includes(value.key) &&
                                                    <MdCheckBox onClick={() => this.removeCategoryCollection('region', value.key)}
                                                        style={{ fill: '#ff9f00' }}
                                                        className="a-s-model-icons" />
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    }
                    <div>
                        <div style={{ float: 'right' }}>
                            <button onClick={this.closeModalPopup} className="category-filter-cancel">
                                Cancel
                                                </button>
                            <button onClick={() => {
                                this.setState({
                                    showModal: false,
                                    showCategoyModal: false,
                                    showCollectionModal: false,
                                    showCityModal: false
                                });
                                document.body.style.overflow = 'auto';
                            }} className="category-filter-apply">
                                Add
                                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    mainContent() {
        return (
            <div className="add-pofile-container">
                {this.state.isImageSelected && this.state.imageFile && this.renderUploadModal()}
                {window.innerWidth > 768 &&
                    <Modal
                        isOpen={this.state.showModal}
                        onRequestClose={this.closeModalPopup}
                        style={popupStyles}
                        contentLabel="Example Modal"
                    >
                        {this.modalContent()}
                    </Modal>
                }

                {window.innerWidth <= 768 &&
                    <Modal
                        isOpen={this.state.showModal}
                        onRequestClose={this.closeModalPopup}
                        style={mobilePopupStyles}
                        contentLabel="Example Modal"
                    >
                        {this.modalContent()}
                    </Modal>
                }
                <div className="add-profile-main-content">
                    <div className="add-profile-label-container">
                        <h1>Fill this form with details of your brand</h1>
                    </div>
                    <div className="a-p-form-container">
                        <div>
                            <div className="a-p-label">Display Name</div>
                            <input type="text" onChange={(event) => this.changeInput('displayName', event.target.value)} className="a-p-input-no-icon" name="" id="" />
                        </div>
                        <div>
                            <div className="a-p-label">Email</div>
                            <input type="email" onChange={(event) => this.changeInput('email', event.target.value)} className="a-p-input-no-icon" name="" id="" />
                        </div>
                        <div>
                            <div className="a-p-label">Contact Phone Number</div>
                            <input type="number" onChange={(event) => this.changeInput('contactPhoneNumber', event.target.value)} className="a-p-input-no-icon" name="" id="" />
                        </div>
                        <div>
                            <div className="a-p-label">Customer contact Phone Number</div>
                            <input type="number" onChange={(event) => this.changeInput('customerContactPhoneNumber', event.target.value)} className="a-p-input-no-icon" name="" id="" />
                        </div>
                        <div>
                            <div className="a-p-label">Description</div>
                            <textarea onKeyDown={(event) => {
                                if (event.keyCode === 13) {
                                    event.preventDefault();
                                }
                            }} maxLength={320} type="text" onChange={(event) => this.changeInput('description', event.target.value)} className="a-p-text-area" name="" id="" ></textarea>
                            <span className="a-p-label">{this.state.description.length}/320</span>
                        </div>
                        <Map setLocation={this.setLocation} />
                        <div style={{ textAlign: 'center' }}>
                            <button onClick={(event) => {
                                this.setState({
                                    imageType: PROFILE_PICTURE,
                                }, () => {
                                    this.handleFileSelect(event)
                                })
                            }} className="a-p-lg-button">Upload Profile Picture</button>
                            {this.state.profilePicture.length > 0 &&
                                <div style={{ marginTop: '20px' }}>
                                    <img onClick={() => { this.props.dispatch(asyncTogglePicture(this.state.profilePicture)) }} style={{ height: '50px', cursor: 'pointer' }} alt="" src={this.state.profilePicture} />
                                </div>
                            }
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button onClick={(event) => {
                                this.setState({
                                    imageType: COVER_PICTURE,
                                }, () => {
                                    this.handleFileSelect(event)
                                })
                            }} className="a-p-lg-button">Upload Cover Picture</button>
                            {this.state.coverPicture.length > 0 &&
                                <div style={{ marginTop: '20px' }}>
                                    <img onClick={() => { this.props.dispatch(asyncTogglePicture(this.state.coverPicture)) }} style={{ height: '50px', cursor: 'pointer' }} alt="" src={this.state.coverPicture} />
                                </div>
                            }
                        </div>
                        <div>
                            <div className="a-p-label">Website</div>
                            <input type="text" onChange={(event) => this.changeInput('website', event.target.value)} className="a-p-input-no-icon" name="" id="" />
                        </div>
                        <div>
                            <div className="a-p-label">Facebook Page Url</div>
                            <input type="text" onChange={(event) => this.changeInput('facebookUrl', event.target.value)} className="a-p-input-no-icon" name="" id="" />
                        </div>
                        <div>
                            <div className="a-p-label">Twitter Page Url</div>
                            <input type="text" onChange={(event) => this.changeInput('twitterUrl', event.target.value)} className="a-p-input-no-icon" name="" id="" />
                        </div>
                        <div>
                            <div className="a-p-label">LinkedIn Page Url</div>
                            <input type="text" onChange={(event) => this.changeInput('linkedInUrl', event.target.value)} className="a-p-input-no-icon" name="" id="" />
                        </div>
                        <div>
                            <div className="a-p-label">Instagram Page Url</div>
                            <input type="text" onChange={(event) => this.changeInput('instagramUrl', event.target.value)} className="a-p-input-no-icon" name="" id="" />
                        </div>
                        <div>
                            <div className="a-p-label">YouTube Page Url</div>
                            <input type="text" onChange={(event) => this.changeInput('youtubeUrl', event.target.value)} className="a-p-input-no-icon" name="" id="" />
                        </div>
                        <div>
                            <div className="a-p-label">Select your Brand Type</div>
                            <div className="a-p-dropdown-container">
                                <select name="" id="" onChange={(event) => this.changeInput('vendorType', event.target.value)} defaultValue={this.state.vendorType} className="a-p-dropdown">
                                    <option value='service'>Service</option>
                                    <option value='product'>Product</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className="a-p-dropdown-container">
                                <button className="a-p-lg-button" onClick={() => this.openModal('category')}>Add Category</button>
                                <div className="a-p-tags-container">
                                    {this.state.category.map((value, index) => {
                                        return (
                                            <button className="a-p-tags-button" key={index}>
                                                {value}
                                                <MdClose onClick={() => this.removeCategoryCollection('category', value)} />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="a-p-dropdown-container">
                                <button className="a-p-lg-button" onClick={() => this.openModal('city')}>Add Region</button>
                                <div className="a-p-tags-container">
                                    {this.state.region.map((value, index) => {
                                        return (
                                            <button className="a-p-tags-button" key={index}>
                                                {value}
                                                <MdClose onClick={() => this.removeCategoryCollection('region', value)} />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="a-p-label">Add Company Features</div>
                            <div className="a-p-dropdown-container">
                                <input style={{ width: '350px' }} onKeyUp={(event) => {
                                    if (event.keyCode === 13) {
                                        this.addCategoriesCollection('companyFeatures', event.target.value);
                                        document.getElementById('company-features').value = '';
                                    }
                                }} type="text" className="a-p-dropdown" name="" id="company-features" />
                                <button onClick={(event) => {
                                    this.addCategoriesCollection('companyFeatures', document.getElementById('company-features') ? document.getElementById('company-features').value : '');
                                    document.getElementById('company-features').value = '';
                                }} className="a-p-button mobile-margin">Add Company Features</button>
                                <div className="a-p-tags-container">
                                    {this.state.companyFeatures.map((value, index) => {
                                        return (
                                            <button className="a-p-tags-button" key={index}>
                                                {value}
                                                <MdClose onClick={() => this.removeCategoryCollection('companyFeatures', value)} />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="a-p-label">Add Search Tags *Add relevant tags to Improve your ranking on Search page.*</div>
                            <div className="a-p-dropdown-container">
                                <input onKeyUp={(event) => {
                                    if (event.keyCode === 13) {
                                        this.addCategoriesCollection('searchKeywords', event.target.value.toLowerCase());
                                        document.getElementById('search-keyword').value = '';
                                    }
                                }} style={{ width: '350px' }} type="text" className="a-p-dropdown" name="" id="search-keyword" />
                                <button onClick={(event) => {
                                    this.addCategoriesCollection('searchKeywords', document.getElementById('search-keyword') ? document.getElementById('search-keyword').value.toLowerCase() : '');
                                    document.getElementById('search-keyword').value = '';
                                }} className="a-p-button mobile-margin">Add Search Tags</button>
                                <div className="a-p-tags-container">
                                    {this.state.searchKeywords.map((value, index) => {
                                        return (
                                            <button className="a-p-tags-button" key={index}>
                                                {value}
                                                <MdClose onClick={() => this.removeCategoryCollection('searchKeywords', value)} />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="a-p-label">Business Timings</div>
                            <div className="a-p-timings">
                                <select name="" id="start-time">
                                    {TIME.map((value, index) => {
                                        return (
                                            <option key={index}>{value}</option>
                                        )
                                    })}
                                </select>
                                <span className="a-p-to-text">To</span>
                                <select name="" id="end-time">
                                    {TIME.map((value, index) => {
                                        return (
                                            <option key={index}>{value}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className="a-p-label">Closed Weekdays</div>
                            <div className="a-p-dropdown-container">
                                <select className="a-p-dropdown" name="" id="closed-days">
                                    {Day.map((value, index) => {
                                        return (
                                            <option key={index}>{value}</option>
                                        )
                                    })}
                                </select>
                                <button onClick={(event) => {
                                    this.addCategoriesCollection('closedDays', document.getElementById('closed-days') ? document.getElementById('closed-days').value : '');
                                }} className="a-p-button mobile-margin">Add Days</button>
                                <div className="a-p-tags-container">
                                    {this.state.closedDays.map((value, index) => {
                                        return (
                                            <button className="a-p-tags-button" key={index}>
                                                {value}
                                                <MdClose onClick={() => this.removeCategoryCollection('closedDays', value)} />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button style={{ position: 'relative' }} className="a-p-lg-button" onClick={this.saveProfile}>{
                                !saveVendorLoader && 'Submit Profile'
                            } {saveVendorLoader &&
                                <img className="loader-login" src={loaderWhite} alt="" />
                                }</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {

        return (
            <div>
                <div>
                    {this.props.meReducer.isLoggedIn && this.mainContent()}
                    {this.props.meReducer.tokenLoading && !this.props.meReducer.isLoggedIn &&
                        <div className="vendor-loader-container-desktop">
                            <img alt="" className="vendor-loader-desktop" src={loader} />
                        </div>
                    }
                    {!this.props.meReducer.tokenLoading && !this.props.meReducer.isLoggedIn &&
                        <div className="vendor-loader-container-desktop">
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                whiteSpace: 'nowrap'
                            }}>
                                You need to <span style={{
                                    color: '#ff9f00',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }} onClick={() => {
                                    this.props.dispatch(toggleLoginModal());
                                }}>Login</span> to access this page.
                    </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default connect((state) => state)(AddVendor);