import React from 'react'
import '../assets/css/service-card.css'


const ServiceCardPlaceholder = (props)=>{

    if(window.innerWidth > 768){
        return(
            <div className="service-card-container">
                <div>
                    <div className="service-card-img-container">
                        <div className="service-card-img animatedServiceCardPlaceholder"></div>
                    </div>
                    <div className='service-card-info'>
                        <div className='service-card-header' 
                            style={{
                                marginTop : '0.5rem', 
                                marginBottom : '0.5rem',
                                paddingTop : '0px',
                                paddingBottom : '0px' ,
                                border : 'none'}}>
                            <div className='service-card-title animatedServiceCardPlaceholder' 
                            style={{
                                height : '1.5rem',
                                width : '50%'}}>
                                <p className='animatedServiceCardPlaceholder' ></p>
                            </div>
                        </div>
                        <div className='service-card-description' 
                        style={{borderTop : '1px solid rgba(0,0,0,0.1)'}}>
                            <p className='animatedServiceCardPlaceholder' style={{height : '1rem'}}></p>
                            <p className='animatedServiceCardPlaceholder' style={{height : '1rem'}}></p>
                        </div>
                        <div className='line'></div>
                        <div className='service-card-bottom animatedServiceCardPlaceholder' 
                        style={{
                            height : '1.5rem',
                            padding : '0 0.5rem 0 0.5rem', 
                            margin : '0.5rem', 
                            marginRight : '0',
                            width : '35%'}}>
                            <div className='service-card-price animatedServiceCardPlaceholder'>
                                <p className='animatedServiceCardPlaceholder' style={{
                                    marginTop: '0rem',
                                    marginBottom: '0rem',
                                    height : '1rem'
                                }}></p>
                            </div>
                            <div className='service-card-share'>
                                <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}>
                                    <p className='animatedServiceCardPlaceholder' style={{
                                        marginTop: '0px',
                                        marginBottom: '0px',
                                        marginLeft: '5px'
                                    }}> </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }else{
        return(
            <div className="service-card-container">
                <div>
                    <div className="service-card-img-container">
                        <div className="service-card-img animatedServiceCardPlaceholder"></div>
                    </div>
                    <div className='service-card-info'>
                        <div className='service-card-header' 
                            style={{
                                marginTop : '0.5rem', 
                                marginBottom : '0.5rem',
                                paddingTop : '0px',
                                paddingBottom : '0px' ,
                                border : 'none'}}>
                            <div className='service-card-title animatedServiceCardPlaceholder' 
                            style={{
                                height : '0.7rem',
                                width : '50%'}}>
                                <p className='animatedServiceCardPlaceholder' ></p>
                            </div>
                        </div>
                        <div className='service-card-description'>
                            <p className='animatedServiceCardPlaceholder' 
                            style={{height : '0.7rem', margin : '0.2rem 0 0.2rem 0'}}></p>
                            <p className='animatedServiceCardPlaceholder' 
                            style={{height : '0.7rem', margin : '0.2rem 0 0.2rem 0'}}></p>
                        </div>
                        <div className='line'></div>
                        <div className='service-card-bottom animatedServiceCardPlaceholder' 
                        style={{
                            height : '0.7rem',
                            padding : '0 0.5rem 0 0.5rem', 
                            margin : '0.5rem 0 0.5rem 0', 
                            // marginRight : '0',
                            width : '35%'}}>
                            <div className='service-card-price animatedServiceCardPlaceholder'>
                                <p className='animatedServiceCardPlaceholder' style={{
                                    marginTop: '0rem',
                                    marginBottom: '0rem',
                                    height : '1rem'
                                }}></p>
                            </div>
                            <div className='service-card-share'>
                                <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}>
                                    <p className='animatedServiceCardPlaceholder' style={{
                                        marginTop: '0px',
                                        marginBottom: '0px',
                                        marginLeft: '5px'
                                    }}> </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ServiceCardPlaceholder