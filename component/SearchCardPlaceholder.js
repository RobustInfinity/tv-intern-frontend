import React, {Component} from 'react';
import '../assets/css/search.css';

class SearchCardPlaceholder extends Component {
    render() {
        if (window.innerWidth > 768) {
        return(
            <div className="search-card-container">              
                    <div style={{borderRadius:'15px'}} className="search-card-desktop-cover animatedSearchCardPlaceholder"></div>
                    <div style={{borderTopRightRadius:'5px'}} className="search-card-desktop-content">
                        <div className="search-card-basic-info">
                            <div style={{margin: '20px 10px 0 20px', position: 'relative'}}>
                                <p style={{height:'20px',width:'8rem'}} className="search-card-display-name-desktop animatedSearchCardPlaceholder"></p>                                
                            </div>
                            <span style={{height:'20px'}} className="search-card-following-desktop animatedSearchCardPlaceholder"></span>
                            <div className="animatedSearchCardPlaceholder" style={{margin:'20px 0px 0px 20px', height:'20px',backgroundColor:'#f3f3f3'}}></div>
                        </div>

                        <div className="search-card-contact-info">
                            <div style={{marginTop: '40px'}}>
                                <div style={{margin:'10px 70px 10px 30px'}}>
                                <div style={{height:'20px',backgroundColor:'#f3f3f3'}} className="animatedSearchCardPlaceholder"></div>
                                </div>                                
                                <div style={{margin:'10px 50px 10px 30px'}}>  
                                <div style={{height:'20px',backgroundColor:'#f3f3f3'}} className="animatedSearchCardPlaceholder"></div>
                                </div>
                                <div style={{margin:'10px 70px 10px 30px'}}>
                                <div style={{height:'20px',backgroundColor:'#f3f3f3'}} className="animatedSearchCardPlaceholder"></div>                                
                                </div>
                                <div style={{margin:'25px 0px 0px 50px'}}>
                                    <button style={{padding:'15px 50px',border:'none',borderRadius:'8px'}} className="animatedSearchCardPlaceholder"></button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
        )
      } 
    else if(window.innerWidth < 768) {
          return (
            <div className="search-card-container-mobile-placeholder">
            <div style={{padding:'10px',backgroundColor:'white',borderRadius:'8px'}}>
                    <div className="search-card-desktop-cover-mobile-placeholder animatedSearchCardPlaceholder">                            
                    </div>
                    <div className="search-card-mobile-content-placeholder">
                        <div className="search-card-basic-info-mobile-placeholder">
                        <div style={{padding:'0px 20px' , height:'100%'}}>
                               <div className="search-card-display-name-mobile-placeholder animatedSearchCardPlaceholder"></div>                                          
                                <div className="search-card-discription-name-mobile-placeholder animatedSearchCardPlaceholder"></div>
                            <div className="search-card-following-mobile-placeholder" style={{height:'20px',width:'10rem',margin:'10px 0px',backgroundColor:'#f3f3f3'}}></div>
                            <div style={{height:'20px',margin:'10px 0px',width:'9rem', backgroundColor:'#f3f3f3'}}></div>
                        </div>
                        </div>
                    </div>
             </div>
        </div>
          )
      }
    }
}

export default SearchCardPlaceholder;
