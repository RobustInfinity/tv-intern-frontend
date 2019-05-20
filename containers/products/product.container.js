import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import Cookies from 'universal-cookie';
import Loadable from 'react-loadable';
import NotFound from '../../component/NotFound'
import _ from 'lodash';
import {
    Helmet
} from 'react-helmet';
import loader from '../../assets/icons/loader.svg';
import {
    asyncFetchProduct, fetchSimilarProduct
} from '../../action/index';
import ReactPixel from '../../util/fbPixel';
import ReactAnalytics from "../../util/ga";

const ProductDesktop = Loadable({
    loader: () => import('./product-desktop.container'),
    loading: () => <div className="vendor-loader-container-desktop">
        <img alt="" className="vendor-loader-desktop" src={loader} />
    </div>,
});

const ProductMobile = Loadable({
    loader: () => import('./product-mobile.container'),
    loading: () => <div className="vendor-loader-container-desktop">
        <img alt="" className="vendor-loader-desktop" src={loader} />
    </div>,
});

let FIRST_LOADING = false;

class Products extends Component {

    componentWillMount() {
        const tempCookie = new Cookies();
        window.scrollTo(0, 0);
        FIRST_LOADING = true;
        let desktop = true;

        if (window.innerWidth < 768) {
            desktop = false;
        }

        this.props.dispatch(asyncFetchProduct(this.props.match.params.productId, tempCookie.get('token')))
            .then((data) => {
                if (data.success) {
                    const pageUrl = this.props.match.url;
                    const isDev = (this.props.location.search && this.props.location.search.indexOf('isDevelopment') > -1)
                        ?
                        true
                        :
                        false;

                    
                    FIRST_LOADING = false;
                    setTimeout(() => {
                        ReactPixel.track('ViewContent', {
                            content_name: this.props.productReducer.product.title
                        });
                        !isDev && ReactAnalytics.pageView(pageUrl, this.props.productReducer.product.title);
                    }, 500);
                    this.props.dispatch(fetchSimilarProduct({
                        categories: this.props.productReducer.product.category,
                        productId: this.props.productReducer.product._id,
                        desktop
                    }));
                }
            });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps.meReducer.userData) && !FIRST_LOADING) {
            if (this.props.meReducer.userData !== nextProps.meReducer.userData) {
                nextProps.dispatch(asyncFetchProduct(nextProps.match.params.productId, nextProps.meReducer.userData.accessToken))
                    .then((data) => {
                        if (data.success) {
                            const pageUrl = nextProps.match.url;
                            const isDev = (nextProps.location.search && nextProps.location.search.indexOf('isDevelopment') > -1)
                                ?
                                true
                                :
                                false;

                            !isDev && ReactAnalytics.pageView(pageUrl);
                            setTimeout(() => {
                                ReactPixel.track('ViewContent', {
                                    content_name: nextProps.productReducer.product.title
                                });
                            }, 500)
                        }
                    });
            }
        }

        if (nextProps.match.url !== this.props.match.url) {
            if (!FIRST_LOADING) {
                const tempCookie = new Cookies();
                window.scrollTo(0, 0);
                nextProps.dispatch(asyncFetchProduct(nextProps.match.params.productId, tempCookie.get('token')))
                    .then((data) => {
                        if (data.success) {
                            setTimeout(() => {
                                ReactPixel.track('ViewContent', {
                                    content_name: nextProps.productReducer.product.title
                                });
                            }, 500);
                            let desktop = true;

                            if (window.innerWidth < 768) {
                                desktop = false;
                            }
                            nextProps.dispatch(fetchSimilarProduct({
                                categories: nextProps.productReducer.product.category,
                                productId: nextProps.match.params.productId,
                                desktop
                            }));
                        }
                    });
            }
        }
    }


    renderMetaTags = () => {
        const productData = this.props.productReducer.product;
        const vendor = this.props.productReducer.vendor;
        return (
            <Helmet
                titleTemplate="%s">
                <title>{productData.title}</title>
                <meta name="fragment" content="!" />
                <meta name="description" content={
                    (productData.metaDescription && productData.metaDescription.length > 0)
                        ?
                        productData.metaDescription
                        :
                        _.truncate(String(productData.description.replace(/<(?:.|\n)*?>/gm, '')), {
                            length: 100
                        })
                } />
                <link rel="canonical" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="en" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <link rel="alternate" hreflang="" href={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta name="robots" content="index, follow" />
                <meta name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta property="og:title" content={productData.title} />
                <meta property="og:description" content={
                    (productData.metaDescription && productData.metaDescription.length > 0)
                        ?
                        productData.metaDescription
                        :
                        _.truncate(String(productData.description.replace(/<(?:.|\n)*?>/gm, '')), {
                            length: 100
                        })
                } />
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={`https://www.trustvardi.com${this.props.location.pathname}`} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={productData.images[0]} />
                <meta property="og:site_name" content="trustvardi.com" />
                <meta property="article:section" content="Lifestyle" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@trustvardi" />
                <meta name="twitter:creator" content="trustvardi.com" />
                <meta name="amphtml" content={`https://www.trustvardi.com/amp/products/${productData._id}`} />
                <meta name="twitter:title" content={productData.title} />
                <meta name="twitter:description" content={
                    (productData.metaDescription && productData.metaDescription.length > 0)
                        ?
                        productData.metaDescription
                        :
                        _.truncate(String(productData.description.replace(/<(?:.|\n)*?>/gm, '')), {
                            length: 100
                        })
                } />
                <meta name="twitter:image" content={productData.images[0]} />
                <script type="application/ld+json">
                    {`
                        [{
                            "@context": "http://schema.org",
                            "url": "https://www.trustvardi.com",
                            "@type": "Product",
                            "name": "${productData.title}",
                            "image": [${productData.images.map((value) => {
                        return `"${value}"`
                    })}],
                            "description": "${_.truncate(String(productData.description.replace(/<(?:.|\n)*?>/gm, '')), {
                        length: 100
                    })}",
                            "aggregateRating":{
                                "@type":"AggregateRating",
                                "ratingValue":${productData.rating},
                                "reviewCount":${(productData.reviewCount > 0) ? productData.reviewCount : 1}
                                },
                            "brand":{
                                "@type":"Thing",
                                "name":"${vendor.displayName}"
                            },
                            "offers": {
                              "@type": "AggregateOffer",
                              "highPrice": "${(productData.price) > 0 ? productData.price : productData.finalPrice}",
                              "lowprice":"${productData.finalPrice}",
                              "priceCurrency": "INR"
                            }
                        }
                        ,{
                            "@context": "http://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [{
                                "@type": "ListItem",
                                "position": 1,
                                "item": {
                                    "@id": "https://www.trustvardi.com",
                                    "name": "TRUSTVARDI",
                                    "description": "home"
                                }
                            }, {
                                "@type": "ListItem",
                                "position": 2,
                                "item": {
                                    "@id": "https://www.trustvardi.com/products",
                                    "name": "PRODUCTS",
                                    "description": "products"
                                }
                            }, {
                                "@type": "ListItem",
                                "position": 3,
                                "item": {
                                    "@id": "https://www.trustvardi.com/products/${productData._id}",
                                    "name": "${productData.title}",
                                    "description": "masterPostTitle"
                                }
                            }]
                        }]
                    `}
                </script>
            </Helmet>
        );
    };

    render() {
        if (this.props.productReducer.loading) {
            return (
                <div className="vendor-loader-container-desktop">
                    <img alt="" className="vendor-loader-desktop" src={loader} />
                </div>
            );
        } else if (!_.isEmpty(this.props.productReducer.product)) {
            if (window.innerWidth > 768) {
                return (
                    <div>
                        {this.renderMetaTags()}
                        <ProductDesktop history={this.props.history} match={this.props.match} />
                    </div>
                );
            } else {
                return (
                    <div>
                        {this.renderMetaTags()}
                        <ProductMobile history={this.props.history} match={this.props.match} />
                    </div>
                );
            }
        } else if (!this.props.productReducer.loading && _.isEmpty(this.props.productReducer.product)) {
            return (
                <div className="vendor-loader-container-desktop">
                    <NotFound />
                </div>
            )

        }
        // else {
        //     return (
        //         <div></div>
        //     )
        // }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
};

export default connect((state) => state, mapDispatchToProps)(Products);