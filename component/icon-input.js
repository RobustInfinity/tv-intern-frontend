import React, { Component } from 'react';

class IconInput extends Component {
    render() {
        return (
            <div
                style={{
                    border: '1px solid rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '3px'
                }}>
                <div
                    style={{
                        height: '40px',
                        width: '40px',
                        borderRight: '1px solid rgba(0,0,0,0.2)',
                        fontWeight : "bold",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    {this.props.icon()}
                </div>
                <input
                    style={{
                        border: 'none',
                        marginLeft: '5px',
                        fontSize: '14px',
                        width: '100%'
                    }}
                    {...this.props}
                />
            </div>
        );
    }
}

export default IconInput;