/* eslint-disable array-callback-return, radix, no-useless-escape */
/**
 * For all GET api's, Call this function.
 * @param api_url String contains api to be called
 * @returns {Promise<any> | * | Promise | Promise.<T>}
 */
export const getCallApi = (api_url) => {


    return fetch(api_url)
        .then((res) => res.json())
        .then(data => {
            return Promise.resolve(data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });

}


/**
 * For all POST api's, Call this function.
 * @param api_url String contains api to be called
 * @param body Object contains the data to be sent in the POST request.
 * @returns {Promise<any> | * | Promise | Promise.<T>}
 */
export const postCallApi = (api_url, body) => {


    return fetch(api_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then((res) => res.json())
        .then(data => {
            return Promise.resolve(data);
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

export const postCallApiForm = (api_url,body, sizes)=>{
  
    return fetch(api_url, {
        method : 'POST',
        headers : {
            sizes : sizes
        },
        body : body
    })
        .then(res => res.json())
        .then(data => Promise.resolve(data))
        .catch(error => Promise.reject(error))
}
const monthArray = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
];


export const convertDate = (originalDate) => {
    const date = new Date(parseInt(originalDate));
    return `${date.getDate()} ${monthArray[date.getMonth()]} ${date.getFullYear()}`
};

/**
 * Function to change time to google format.
 * @param time
 * @returns {string}
 */
export const googleTimeFormat = (time) => {
    const date = new Date(time);
    const dateTime = date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate() + 'T' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds() + '+5:30';
    return dateTime.toString();
};

export const userMetaDescription = (displayName) => {
    return `View ${displayName}'s profile on TrustVardi, the Search & discovery platform that enables you to browse through multiple brands, read reviews, experiences and share your own stories`;
};

export const valueFromElemId = (id) => {
    return document.getElementById(id) ? document.getElementById(id).value : ''
};

export const showLoader = (shouldShow) => {
    document.getElementById('main-loading-overlay').style.display = shouldShow ? 'flex' : 'none';
    document.body.style.overflow = shouldShow ? 'hidden' : 'auto';
};

export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
export const imageTransformation = (imageUrl, size, isDigitalOceanSpaces) => {
    const digitalOceanUrlScheme = 'https://trustvardi.sfo2.digitaloceanspaces.com/*******/';
    if (imageUrl.indexOf('res.cloudinary') > -1 && imageUrl.indexOf('f_auto,fl_lossy,q_auto') === -1) { 
        const newImage = imageUrl.split('/upload/')[0] + `/upload/f_auto,fl_lossy,q_70${(size && !isDigitalOceanSpaces) ? `,h_${size}` : ''}/` + imageUrl.split('/upload/')[1];
        return newImage.replace('q_80/', '');
    } else if (imageUrl.indexOf('res.cloudinary') > -1 && imageUrl.indexOf('f_auto,fl_lossy,q_auto') !== -1 && size) {
        const newImage = imageUrl.split('/upload/')[0] + `/upload/f_auto,fl_lossy,q_70${(size && !isDigitalOceanSpaces) ? `,h_${size}` : ''}/` + imageUrl.split('/upload/')[1];
        return newImage.replace('q_80/', '');
    } else if (imageUrl.indexOf(digitalOceanUrlScheme) > -1) {
        const newImage = `${digitalOceanUrlScheme}${(size && isDigitalOceanSpaces) ? `${size}_` : ''}${imageUrl.split(digitalOceanUrlScheme)[1]}`;
        return newImage;
    } return imageUrl;
};

export const ellipsizeTextBox = (id) => {
    var el = document.getElementById(id);
    var wordArray = el.innerText.split(' ');
    while(el.scrollHeight > el.offsetHeight) {
        wordArray.pop();
        el.innerHTML = wordArray.join(' ') + '...';
     }
}