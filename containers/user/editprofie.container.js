import React, { Component } from 'react';
import {
    connect
} from 'react-redux';

class EditProfile extends Component {
    render() {
        return (
            <div>
                Edit profile page
            </div>
        );
    }
}

export default connect((state) => state)(EditProfile);