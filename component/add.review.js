/* eslint-disable array-callback-return, radix*/
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    addReview,
    addReviewProduct
} from '../action/index';
import {
    MdClose
} from 'react-icons/lib/md';
import StarRatingComponent from 'react-star-rating-component';
import {
    CLOUDINARY
} from "../constant/keys";
import '../assets/css/addreview.css';

class AddReview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            user: '',
            vendor: '',
            rating: 1,
            media: [],
            content: '',
            showLoading: false
        };
    }

    componentWillMount() {
        if (this.props.data) {
            const title = this.props.data.title;
            const user = this.props.data.user;
            const vendor = this.props.data.vendor;
            const rating = parseInt(this.props.data.rating);
            const content = this.props.data.content;
            const media = this.props.data.media;
            this.setState({
                title,
                user,
                vendor,
                rating,
                content,
                media
            });
        }
        if (this.props.rating) {
            this.setState({
                rating: this.props.rating
            });
        }
    }

    componentDidMount() {
        document.body.style.overflow = 'hidden';
    }

    componentWillUnmount() {
        document.body.style.overflow = 'auto';
    }

    openCloudinaryUploader = (event) => {
        event.preventDefault();
        window.cloudinary.openUploadWidget({
                cloud_name: CLOUDINARY.cloud_name,
                upload_preset: CLOUDINARY.upload_preset,
                api_key: CLOUDINARY.api_key,
                api_secret: CLOUDINARY.api_secret,
                folder: 'reviews',
                sources: ['local', 'url', 'camera', 'facebook'],
                gravity: 'custom',
                quality: 'auto:eco',
                max_file_size: 5000000,
                max_files: 4
            },
            (error, result) => {
                if (!error) {
                    if (result) {
                       const media = this.state.media;
                       result.map((value, i) => {
                           media.push({ link: `${value.secure_url.split('/upload/')[0]}/upload/${value.secure_url.split('/upload/')[1]}`, description: '', time: Date.now(), type: 'image', thumbnail: `${value.secure_url.split('/upload/')[0]}/upload/${value.secure_url.split('/upload/')[1]}` });
                       });
                       this.setState({
                           media
                       });
                    }
                }
            });
    };

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }

    sendReview = (event) => {
      event.preventDefault();
      if (!this.state.showLoading) {
          this.setState({
              showLoading: true
          });
          setTimeout(() => {
              if (this.props.product) {
                  let review = {};
                  const state = this.state;
                  if (typeof state.title === 'string') {
                      review.title = state.title;
                  }
                  review.media = state.media || [];
                  review.content = this.state.content;
                  review.rating = parseInt(state.rating);
                  review.user = this.props.meReducer.userData.user.username;
                  review.product = this.props.id;
                  review.time = `${Date.now()}`;
                  this.props.dispatch(addReviewProduct(review))
                      .then((data) => {
                          this.setState({
                              showLoading: false
                          });
                          if (data.success) {
                              this.props.closeModal();
                          }
                      });
              } else {
                  let review = {};
                  const state = this.state;
                  if (typeof state.title === 'string') {
                      review.title = state.title;
                  }
                  review.media = state.media || [];
                  review.content = this.state.content;
                  review.rating = parseInt(state.rating);
                  review.user = this.props.meReducer.userData.user.username;
                  if (this.props.match.path.includes('/profile/:profileId')) {
                      review.vendor = this.props.vendorReducer.vendor.username;
                  }
                  if (this.props.match.path.includes('/user/:userId')) {
                      review.vendor = state.vendor;
                  }

                  if (this.props.match.path.includes('/review/:reviewId')) {
                      review.vendor = this.props.reviewReducer.vendor.username;
                  }
                  review.time = `${Date.now()}`;
                  this.props.dispatch(addReview(review))
                      .then((data) => {
                          this.setState({
                              showLoading: false
                          });
                          if (data.success) {
                              this.props.closeModal();
                          }
                      });
              }
          }, 200);
      }
    };


    removeImage = (index) => {
      const media = this.state.media;
      media.splice(index, 1);
      this.setState({
          media
      });
    };

    handleChange = (html) => {
        if (html !== '<p><br></p>') {
            this.setState({
                content: html
            });
        } else {
            this.setState({
                content: ''
            });
        }
    };


    render() {
        if(window.innerWidth > 768) {
            return (
                <div className="add-review-desktop">
                    <div className="add-review-label-desktop">
                        <span className="">Write a review</span>
                        <MdClose onClick={() => {this.props.closeModal()}} className="add-review-close-button" />
                    </div>
                    <div className="add-review-title-container-desktop">
                        <input onChange={(event) => {
                            this.setState({
                                title: event.target.value
                            });
                        }} type="text" placeholder="Write a title." maxLength="150" defaultValue={this.state.title} className="add-review-title-desktop"/>
                    </div>
                    <div className="add-review-rating-container-desktop">
                        <div className="add-review-rating-label-desktop">
                            Give your rating
                        </div>
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={this.state.rating}
                            onStarClick={this.onStarClick.bind(this)}
                        />
                    </div>
                    {this.state.media.length > 0 &&
                    <div className="add-review-image-container-desktop">
                        {this.state.media.map((value, i) => {
                            return (
                                <div key={value.link} className="add-review-image-gallery-desktop">
                                    <MdClose onClick={() => this.removeImage(i)}  style={{ position: 'absolute', top: '5px', right: '5px', fill: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px' }}/>
                                    <img style={{ height: '100%' }} alt=""  src={value.link} />
                                </div>
                            )
                        })}

                    </div>
                    }
                    {!this.props.product &&
                    <div className="add-review-image-button-container-desktop">
                        <button className="add-review-image-button-desktop" onClick={this.openCloudinaryUploader}>Add Images</button>
                    </div>
                    }
                    <div className="add-review-content-container-desktop">
                        <ReactQuill value={this.state.content}
                                    placeholder={'Write Your Review Here...'}
                                    onChange={this.handleChange} />
                    </div>
                    <div className="add-review-button-container">
                        <button onClick={this.sendReview} className="add-review-add-button">
                            {this.state.showLoading &&
                                <div className="loader small"></div>
                            }
                            {!this.state.showLoading &&
                                "Add Review"
                            }
                        </button>
                    </div>
                </div>
            );
        } else if (window.innerWidth < 768) {
            return (
                <div>
                    <div className="add-review-label-desktop">
                        <span className="">Write a review</span>
                        <MdClose onClick={() => {this.props.closeModal()}} className="add-review-close-button"/>
                    </div>
                    <div className="add-review-title-container-desktop">
                        <input onChange={(event) => {
                            this.setState({
                                title: event.target.value
                            });
                        }} type="text" placeholder="Write a title." maxLength="150" defaultValue={this.state.title} className="add-review-title-mobile"/>
                    </div>
                    <div className="add-review-rating-container-desktop">
                        <div className="add-review-rating-label-desktop">
                            Give your rating
                        </div>
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={this.state.rating}
                            onStarClick={this.onStarClick.bind(this)}
                        />
                    </div>
                    {this.state.media.length > 0 &&
                        <div className="add-review-image-container-desktop">
                            {this.state.media.map((value, i) => {
                                return (
                                    <div key={value.link} className="add-review-image-gallery-desktop">
                                        <MdClose onClick={() => this.removeImage(i)}  style={{ position: 'absolute', top: '5px', right: '5px', fill: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px' }}/>
                                        <img style={{ width: '100%' }} alt=""  src={value.link} />
                                    </div>
                                )
                            })}
                        </div>
                    }
                    {!this.props.product &&
                        <div className="add-review-image-button-container-desktop">
                            <button className="add-review-image-button-desktop" onClick={this.openCloudinaryUploader}>Add Images</button>
                        </div>
                    }
                    {/*<div className="add-review-image-button-container-desktop">*/}
                        {/*<button className="add-review-image-button-desktop" onClick={this.openCloudinaryUploader}>UPLOAD IMAGES</button>*/}
                    {/*</div>*/}
                    <div className="add-review-content-container-desktop">
                        <ReactQuill value={this.state.content}
                                    placeholder={'Write Your Review Here...'}
                                    onChange={this.handleChange} />
                    </div>
                    <div className="add-review-button-container">
                        <button onClick={this.sendReview} className="add-review-add-button">
                            {this.state.showLoading &&
                            <div className="loader small"></div>
                            }
                            {!this.state.showLoading &&
                            "Add Review"
                            }
                        </button>
                    </div>
                </div>
            )
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
};

export default connect((state) => state, mapDispatchToProps)(AddReview);