import React, { Component } from 'react';
import '../assets/css/article.card.css';

class ArticleCardPlaceHolder extends Component {

    render() {
        if (window.innerWidth > 768) {
        return (
            <div className="article-card-placeholder-container">
                <div style={{ height: '120px' }} className="article-card-placeholder-image-container">                    
                        <div className="article-card-placeholder-image animatedSearchCardPlaceholder"></div>                    
                </div>
                <div className="article-card-placeholder-information">
                        <p className='article-card-placeholder-title animatedSearchCardPlaceholder'></p>
                        <p className='article-card-placeholder-title3 animatedSearchCardPlaceholder'></p>
                        <p className='article-card-placeholder-title1 animatedSearchCardPlaceholder'></p>                    
                        <div className="article-card-placeholder-user-container">                            
                                <div className="article-card-placeholder-user-picture animatedSearchCardPlaceholder"></div>
                            <p className='article-card-placeholder-title2 animatedSearchCardPlaceholder'></p>
                        </div>
                    
                </div>                
            </div>
        );
    } else {
        return(
            <div className="article-card-mobile-placeholder-container">
                <div style={{ height: '120px' }} className="article-card-mobile-placeholder-image-container">                    
                        <div className="article-card-mobile-placeholder-image animatedSearchCardPlaceholder"></div>                    
                </div>
                <div className="article-card-mobile-placeholder-information">
                    <p className='article-card-mobile-placeholder-title animatedSearchCardPlaceholder'></p>
                    <p className='article-card-mobile-placeholder-title3 animatedSearchCardPlaceholder'></p>
                    <p className='article-card-mobile-placeholder-title2 animatedSearchCardPlaceholder'></p>                     
                </div>                
            </div>
        );
    }
}
}

export default ArticleCardPlaceHolder;