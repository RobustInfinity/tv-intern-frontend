/* eslint-disable no-useless-escape*/
import React, { Component } from 'react';
import {
    connect
} from 'react-redux';

class ExperienceVideoModal extends Component {

    getId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            return match[2];
        } else {
            return 'error';
        }
    };

    render() {
        return (
            <iframe title="Experience Video" style={{ width: '100%', height: '100%' }} src={`//www.youtube.com/embed/${this.getId(this.props.url)}`} frameBorder="0" allowFullScreen></iframe>
        );
    }
}

export default connect((state) => state)(ExperienceVideoModal);