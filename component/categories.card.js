import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import '../assets/css/categories.card.css';



class CategoriesCard extends Component {
    render() {
        return (
            <div className="categories-card-container">
                <div className="categories-card-main">
                    <div className="categories-card-img" style={{ backgroundImage: `url(${this.props.card.image})` }}>
                        <div className="categories-card-img-overlay">
                            <p className="categories-card-img-overlay-title">{this.props.card.title}</p>
                            <p className="categories-card-img-overlay-count">{this.props.card.count}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
};

export default connect((state) => state, mapDispatchToProps)(CategoriesCard);