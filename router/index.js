import React from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import Loadable from 'react-loadable';
import Home from '../containers/home/home.container';
import loader from '../assets/icons/loader.svg';
import '../assets/css/vendor.css';
import { CITIES_SEARCH } from '../constant/static';

// import Header from '../containers/header/header.container';

const Header = Loadable({
    loader: () => import('../containers/header/header.container'),
    loading: () => <div></div>,
});



const loadingDiv = () => (
    <div className="vendor-loader-container-desktop">
        <img alt="" className="vendor-loader-desktop" src={loader} />
    </div>
);

const Vendor = Loadable({
    loader: () => import('../containers/vendor/vendor.container'),
    loading: () => loadingDiv(),
});

const CategoryList = Loadable({
    loader: () => import('../containers/filter/category-list.container'),
    loading: () => loadingDiv(),
});

const Articles = Loadable({
    loader: () => import('../containers/articles/articles.container'),
    loading: () => loadingDiv(),
});

const About = Loadable({
    loader: () => import('../containers/about/about.container'),
    loading: () => loadingDiv(),
});

const Contact = Loadable({
    loader: () => import('../containers/contact/contact.container'),
    loading: () => loadingDiv(),
});

const User = Loadable({
    loader: () => import('../containers/user/user.container'),
    loading: () => loadingDiv(),
});
const EditProfile = Loadable({
    loader: () => import('../containers/user/editprofie.container'),
    loading: () => loadingDiv(),
});

const Product = Loadable({
    loader: () => import('../containers/products/product.container'),
    loading: () => loadingDiv(),
});

const Footer = Loadable({
    loader: () => import('../containers/footer/footer.container'),
    loading: () => loadingDiv()
});

const Search = Loadable({
    loader: () => import('../containers/search/search.container'),
    loading: () => loadingDiv()
});

const Privacy = Loadable({
    loader: () => import('../containers/privacy/privacy.container'),
    loading: () => loadingDiv()
});

const ShowAll = Loadable({
    loader: () => import('../containers/showall/showall.container'),
    loading: () => loadingDiv()
});

const VendorViewAll = Loadable({
    loader: () => import('../containers/vendor/vendor-view-all.container'),
    loading: () => loadingDiv()
});

const VendorViewAllAdmin = Loadable({
    loader: () => import('../containers/admin/vendor-view-all.container'),
    loading: () => loadingDiv()
});

const VendorAdmin = Loadable({
    loader: () => import('../containers/admin/vendor-admin.container'),
    loading: () => loadingDiv()
});

const VideoContainer = Loadable({
    loader: () => import('../containers/video/video.container'),
    loading: () => loadingDiv()
});

const Review = Loadable({
    loader: () => import('../containers/review/review.container'),
    loading: () => loadingDiv()
});

const ResetPassword = Loadable({
    loader: () => import('../containers/user/reset.password'),
    loading: () => loadingDiv(),
});

const AddProfile = Loadable({
    loader: () => import('../containers/admin/add-vendor.container'),
    loading: () => loadingDiv(),
});

const Cart = Loadable({
    loader: () => import('../containers/cart/cart.container'),
    loading: () => loadingDiv()
});

const Order = Loadable({
    loader: () => import('../containers/ordersuccessful/order.container'),
    loading: () => loadingDiv()
});

const QueryFormModal = Loadable({
    loader: () => import('../component/query-form-modal'),
    loading: () => loadingDiv()
});

const ViewAllService = Loadable({
    loader: () => import('../containers/showall/view-all-service.container'),
    loading: () => loadingDiv()
});

/**
 * All routes go here
 */
export default (
    <Router>
        <div>
            <Route path="*" component={Header} />
            <Route exact path="/" component={Home} />
            {CITIES_SEARCH.map((value, index) => {
                return (
                    <Route key={index} exact path={`/${value.key}`} render={(props) => <Home {...props} city={value.key} />} />
                )
            })}
            <Route exact path="/products" component={ShowAll} />
            <Route exact path="/experience" component={ShowAll} />
            <Route exact path="/articles" component={ShowAll} />
            <Route exact path="/profile" component={ShowAll} />
            <Route exact path="/services" component={ViewAllService} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/:city/profile" component={ShowAll} />
            <Route exact path="/category" component={CategoryList} />
            <Route exact path="/addprofile" component={AddProfile}/>
            <Route exact path="/collections/" component={CategoryList} />
            <Route exact path="/profile/:profileId" component={Vendor}/>
            <Route exact path="/review/:reviewId" component={Review} />
            <Route exact path="/profile/:profileId/:type" component={VendorViewAll} />
            <Route exact path="/admin/profile/:profileId/" component={VendorAdmin} />
            <Route exact path="/admin/profile/:profileId/:type" component={VendorViewAllAdmin} />
            <Route exact path="/products/:productId" component={Product} />
            <Route exact path="/experience/:experienceId" component={VideoContainer} />
            <Route exact path="/article/:articleId" component={Articles}/>
            <Route exact path="/category/:filter" component={Search}/>
            <Route exact path="/collections/:filter" component={Search}/>
            <Route exact path="/about-us" component={About} />
            <Route exact path="/contact-us" component={Contact} />
            <Route exact path="/privacy" component={Privacy} />
            <Route exact path="/user/:userId/:type?" component={User} />
            <Route exact path="/user/edit/:userId" component={EditProfile} />
            <Route exact path="/resetpassword/:token" component={ResetPassword} />
            <Route exact path="/order" component={Order} />
            <Route exact path="/service/:serviceId" component={QueryFormModal}  />
            <Route path="*" component={Footer} />
        </div>
    </Router>
);