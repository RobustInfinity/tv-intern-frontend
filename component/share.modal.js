import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import '../assets/css/share.modal.css';

class ShareModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            copySuccess: ''
        };
    }

    copyClipBoard = (e) => {
        let copyText = document.getElementById("myInput");
        var tmpElem = document.createElement("div");
        document.body.appendChild(tmpElem);
        tmpElem.textContent = copyText.value;
        let selection = document.getSelection();
        let range = document.createRange();
        range.selectNode(tmpElem);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        document.body.removeChild(tmpElem);
        this.props.onClose();
        let x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(()=>{x.className = x.className.replace("show","");},3000);
    };

    openNativeShare = () => {
        if (navigator.share) {
            navigator.share({
                url: this.props.meReducer.url,
            })
                .then(() => {
                })
                .catch((error) => console.log('Error sharing', error));
        }
    };

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <span className="share-label">Share your link on</span>
                <button className="share-facebook" onClick={() => {
                    window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${this.props.meReducer.url}`,
                        '_blank'
                    );
                }}>Facebook</button>
                <button className="share-twitter" onClick={() => {
                    window.open("https://twitter.com/share?url="+this.props.meReducer.url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                }}>Twitter</button>
                <button className="share-google" onClick={() => {
                    window.open(
                        `https://plus.google.com/share?url=${this.props.meReducer.url}`,
                        '_blank'
                    );
                }}>Google +</button>
                {window.innerWidth < 768 &&
                    <button className="share-whatsapp" onClick={() => {
                        window.open(
                            `whatsapp://send?text=${this.props.meReducer.url}`,
                            '_blank'
                        );
                    }}>
                        WhatsApp
                    </button>
                }
                <div id="snackbar">link copied</div>                
                <button className="share-copylink" onClick={this.copyClipBoard}>
                    Copy Link
                </button>
                <input style={{ display: 'none' }} type="text" defaultValue={this.props.meReducer.url} id="myInput"/>
                {navigator.share &&
                <button className="share-more" onClick={this.openNativeShare}>More</button>
                }
            </div>
        );
    }
}

export default connect((state) => state)(ShareModal);