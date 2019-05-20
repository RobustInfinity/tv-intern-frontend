import React, { Component } from 'react';
import {
    connect
} from 'react-redux';

class Map extends Component {

    componentDidMount() {
        var input = document.getElementById('autocomplete');
        if (window.google) {
            var autocomplete = new window.google.maps.places.Autocomplete(input);
            window.google.maps.event.addListener(autocomplete, 'place_changed', () => {
                var place = autocomplete.getPlace();
                if (place && place.geometry) {
                    this.props.setLocation(place);
                    const uluru = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    };
                    const map = new window.google.maps.Map(document.getElementById('map'), {
                        zoom: 15,
                        center: uluru
                    });
                    new window.google.maps.Marker({
                        position: uluru,
                        map: map
                    });
                }
            });
            if (document.getElementById('map')) {
                const uluru = {
                    lat: 28.9090,
                    lng: 77.003
                };
                const map = new window.google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: uluru
                });
                new window.google.maps.Marker({
                    position: uluru,
                    map: map
                });

            }
        }
    }

    render() {
        return (
            <div>
                <div className="a-p-label">Address</div>
                <input type="text" className="a-p-input-no-icon" name="" id="autocomplete" />
                <div id="map" style={{ height: '250px' }}></div>
            </div>
        )
    }
}

export default connect((state) => state)(Map);