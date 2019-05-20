import React from 'react'
import {Link} from 'react-router-dom'

const NotFound = (props)=>{

    return (
        <div style={{backgroundColor : '#FCB117', height : '100vh'}}>
        <div style={{
            height : '100%',
            alignItems : 'center', 
            display : 'flex',
            flexDirection : 'column',
            justifyContent : 'center',
            paddingTop : '20px'
            }}>
        <img 
            src='https://trustvardi.sfo2.digitaloceanspaces.com/images/404.jpg' 
            alt='Not Found'
            style={
              window.innerWidth > 768 ?   {
                width : '38%',
            } : {
                width : '100%'
            }
        }/>
            <button style={{
                backgroundColor : '#FCB117',
                border : '1px solid white',
                color : 'white',
                padding : '10px 20px',
                fontSize : '15px',
                fontWeight : '700',
                borderRadius : '25px'
            }} >
                <Link to='/' 
                style={{
                    color : 'white',
                    textDecoration : 'None'
                }}>Let's Go Home</Link>
            </button>
        </div>
        </div>
    )
}

export default NotFound