/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import {
    MdClose
} from 'react-icons/lib/md';
import _ from 'lodash';
import Modal from 'react-modal'
import loader from '../assets/icons/loader.svg';
import '../assets/css/query-form-modal.css';
import "react-datepicker/dist/react-datepicker.css";
import scrollToComponent from 'react-scroll-to-component'
import { valueFromElemId, getCallApi, showLoader, postCallApi, convertDate } from '../util/util';
import { VERIFY_SERVICE_API, SAVE_QUERY_API } from '../constant/api';
import IconInput from './icon-input';
import { userIcon, emailIcon, phoneIcon, time, address, budget } from '../assets/icons/icons';


const desktopStyle = {
    overlay: {
        zIndex: '11',
        overflow: 'auto'
    },
    content: {
        top: '50%',
        bottom: '0',
        left: '50%',
        right: '0',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        display: 'table',
        width: '40%'
    }
};

const mobileStyle = {
    overlay: {
        zIndex: '11',
        overflow: 'auto'
    },
    content: {
        top: '50%',
        bottom: '0',
        left: '50%',
        right: '0',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        display: 'table',
        width: '87%',
        height: "100vh"
    }
};

class QueryFormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            formattedDate: null,
            loading: true,
            title: '',
            success: false,
            formSchema: [],
            formSchemaValue: [],
            vendor: '',
            service: '',
            openModal: false,
            finalData: {}
        };
    }

    async componentDidMount() {
        const serviceId = this.props.serviceId;
        const service = await getCallApi(VERIFY_SERVICE_API(serviceId));
        if (service.success) {
            this.setState({
                success: true,
                title: service.data.title,
                loading: false,
                formSchema: service.data.formSchema,
                formSchemaValue: service.data.formSchema,
                vendor: service.data.vendor,
                service: serviceId
            });
        } else {
            this.setState({
                loading: false
            });
        }
    }

    handleChange = (time) => {
        if (this.isWeekday(time)) {
            const date = new Date(time);
            this.setState({
                formattedDate: time,
                date: date.getTime()
            });
        }
    };


    submitForm = (event) => {
        event.preventDefault();
        if(document.querySelector('#query-form-section')){
            if(document.querySelector('#query-form-section').getBoundingClientRect().bottom <=  600){
                let isError = false;
                const fields = {
                    fullName: {
                        value: 'Full Name',
                        key: 'fullName'
                    },
                    address: {
                        value: 'Address',
                        key: 'address'
                    },
                    maxBudget: {
                        value: 'Maximum Budget',
                        key: 'maxBudget'
                    },
                    message: {
                        value: 'Message',
                        key: 'message'
                    },
                    phoneNumber: {
                        value: 'Phone Number',
                        key: 'phoneNumber'
                    },
                    date: {
                        value: 'Date',
                        key: 'date'
                    }
                };
                const errorFields = [];
                const error = 'You are missing ';
                const fullName = valueFromElemId('fullName');
                const address = valueFromElemId('address');
                const minBudget = this.props.service.priceRange;
                const maxBudget = valueFromElemId('maxBudget');
                const message = valueFromElemId('message');
                const phoneNumber = valueFromElemId('phoneNumber');
                const email = valueFromElemId('email');
                const date = this.state.date;
                const data = {
                    fullName,
                    address,
                    minBudget,
                    maxBudget,
                    message,
                    phoneNumber,
                    date,
                    email,
                    vendor: this.state.vendor,
                    service: this.state.service,
                    queryCreated: Date.now()
                }
                _.map(fields, (value) => {
                    if (
                        data[value.key]
                        &&
                        value.key !== 'date'
                        &&
                        value.key !== 'minBudget'
                        &&
                        value.key !== 'maxBudget'
                        &&
                        data[value.key].length > 3
                    ) {
        
                    } else if (
                        data[value.key]
                        &&
                        value.key === 'maxBudget'
                        &&
                        data[value.key] > 0
                    ) {
        
                    } else if (
                        data[value.key]
                        &&
                        value.key === 'date'
                        &&
                        data[value.key] > 0
                    ) {
        
                    } else {
                        errorFields.push(value.value);
                        isError = true;
                    }
                });
                const formSchemaValue = this.state.formSchemaValue;
                formSchemaValue.map((value, index) => {
                    if (
                        value.type === 'Dropdown'
                        &&
                        value.required
                        &&
                        value.multipleSelections
                        &&
                        (
                            !value.value
                            ||
                            (
                                value.value
                                &&
                                value.value.length <= 0)
                        )
                    ) {
                        errorFields.push(`"${value.label}"`);
                        isError = true;
                    } else if (value.type === 'Dropdown' && !value.multipleSelections && !value.value) {
                        formSchemaValue[index].value = formSchemaValue[index].options[0];
                    } else if (value.type === 'TextField' && value.required && (!value.value || (value.value && value.value.length <= 0))) {
                        isError = true;
                        errorFields.push(`${value.label}`);
                    }
                });
                if (parseInt(maxBudget) < parseInt(minBudget)) {
                    return alert(`Maximum budget cannot be less than starting price. Which is ₹ ${this.props.service.priceRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
                }
        
                if (isError) {
                    alert(error.concat(errorFields.join(', ')));
                } else {
                    data.formattedDate = this.state.formattedDate;
                    data.serviceName = this.state.title;
                    data.service = this.props.service._id;
                    data.status = 'in Progress';
                    data.customOptions = formSchemaValue;
                    showLoader(false);
                    document.body.style.overflow = 'hidden'
                    this.setState({
                        openModal: true,
                        finalData: data
                    });
        
                }
            }
            else{
                scrollToComponent(this.queryForm, {offSet : 0, align : 'top', duration : 300})
                return
            }
        }
    };

    checkSubmitDetails = (data) => {

        if (data) {
            return (
                <div>
                    <div>
                        <p><span style={{ fontWeight: 700 }}>Full Name</span> : {data.fullName}</p>
                        <p><span style={{ fontWeight: 700 }}> Phone Number </span>: {data.phoneNumber}</p>
                        <p><span style={{ fontWeight: 700 }}>Email </span>: {data.email}</p>
                        <p><span style={{ fontWeight: 700 }}>Max Budget </span>: {data.maxBudget}</p>
                        <p><span style={{ fontWeight: 700 }}>Min Budget </span>: {data.minBudget}</p>
                        <p style={{ wordBreak: 'break-word' }}><span style={{ fontWeight: 700 }}>Message </span>: {data.message}</p>
                        <p><span style={{ fontWeight: 700 }}>Date </span>: {convertDate(data.date)}</p>
                        <p><span style={{ fontWeight: 700 }}>Address</span> : {data.address}</p>
                        {data.customOptions.map((value, index) => {
                            return (
                                <p
                                    key={index}>
                                    <span style={{
                                        fontWeight: 700
                                    }}>{
                                            value.label
                                        }
                                    </span>
                                    :
                                     {
                                        typeof value.value === 'object'
                                            ?
                                            value.value.join(', ')
                                            :
                                            value.value
                                    }
                                </p>
                            )
                        })}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div>
                            <button
                                onClick={() => this.submitRequest(this.state.finalData)}
                                className="form-button">Confirm</button></div>
                        <div>
                            <button
                                style={{ backgroundColor: "#fff", border: "2px solid #FC9C04", color: "#FC9C04" }}
                                onClick={() => {
                                    this.setState({ openModal: false });
                                    document.body.style.overflow = null;
                                }}
                                className="form-button">Cancel</button></div>
                    </div>
                </div>
            )
        }

    }
    submitRequest = async (data) => {
        showLoader(true);
        const API_REQUEST = await postCallApi(SAVE_QUERY_API, {
            data
        });
        if (API_REQUEST.success) {
            alert(API_REQUEST.data.message);
            window.scrollTo(0, 0);
            window.gtag_report_conversion(`https://www.trustvardi.com/products/${this.props.sku}`);
        } else {
            alert('Something went wrong, try again');
        }
        showLoader(false);
    }
    mapCustomForm = (value, index) => {
        return (
            <div
                style={{
                    marginBottom: '1rem'
                }}
                key={index}>
                {value.type === 'Dropdown' &&
                    <div>
                        <div className="text-label">{value.label}</div>
                        <div
                            style={{
                                display: 'flex'
                            }}>
                            <select
                                id={`option-${index}`}
                                onChange={(event) => {
                                    if (!value.multipleSelections) {
                                        const formSchemaValue = this.state.formSchemaValue;
                                        formSchemaValue[index].value = event.target.value;
                                        this.setState({
                                            formSchemaValue
                                        });
                                    }
                                }}
                                className="form-select">
                                {value.options.map((val, i) => {
                                    return (
                                        <option
                                            key={i}
                                            value={val}>{val}</option>
                                    )
                                })}
                            </select>
                            {value.multipleSelections &&
                                <button
                                    onClick={(event) => {
                                        event.preventDefault();
                                        const formSchemaValue = this.state.formSchemaValue;
                                        const array = formSchemaValue[index].value || [];
                                        const value = document.getElementById(`option-${index}`);
                                        if (value && array.indexOf(value.value) === -1) {
                                            array.push(value.value);
                                            formSchemaValue[index].value = array;
                                            this.setState({
                                                formSchemaValue
                                            });
                                        }
                                    }}
                                    style={{
                                        marginLeft: '10px'
                                    }}
                                    className="form-button">Add</button>
                            }

                        </div>
                        {value.multipleSelections &&
                            this.state.formSchemaValue[index]
                            &&
                            this.state.formSchemaValue[index].value
                            &&
                            this.state.formSchemaValue[index].value.length > 0
                            &&
                            <div
                                style={{
                                    marginTop: '1rem'
                                }}>
                                {this.state.formSchemaValue[index]
                                    &&
                                    this.state.formSchemaValue[index].value
                                    &&
                                    this.state.formSchemaValue[index].value.length > 0
                                    &&
                                    typeof this.state.formSchemaValue[index].value === 'object'
                                    &&
                                    this.state.formSchemaValue[index].value.map((_value, key) => {
                                        return (
                                            <div
                                                key={key}
                                                style={{
                                                    backgroundColor: '#ff9f00',
                                                    border: 'none',
                                                    color: 'white',
                                                    display: 'inline-flex',
                                                    padding: '10px',
                                                    alignItems: 'center',
                                                    marginRight: '10px',
                                                    fontSize: '12px',
                                                    whiteSpace: 'nowrap',
                                                    marginBottom: '10px'
                                                }}>
                                                {_value}
                                                <MdClose
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        const formSchemaValue = this.state.formSchemaValue;
                                                        const array = formSchemaValue[index].value || [];
                                                        array.splice(key, 1);
                                                        formSchemaValue[index].value = array;
                                                        this.setState({
                                                            formSchemaValue
                                                        });
                                                    }}
                                                    style={{
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                }
                {value.type === 'TextField' &&
                    <div>
                        <div className="text-label">{value.label}</div>
                        <div>
                            <div>
                                <input
                                    onChange={(event) => {
                                        const formSchemaValue = this.state.formSchemaValue;
                                        formSchemaValue[index].value = event.target.value;
                                        this.setState({
                                            formSchemaValue
                                        });
                                    }}
                                    id={`option-${index}`}
                                    type="text"
                                    className="form-input" />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    };

    isWeekday = date => {
        var dateObj = Date.now();
        dateObj += 1000 * 60 * 60 * 24 * this.props.service.turnAroundTime;
        dateObj = new Date(dateObj);
        const _date = new Date(date);
        return _date.getTime() > dateObj.getTime();
    };

    formContainer = () => {
        return (
            <div>
                <form ref={(div)=>this.queryForm = div}>
                    <div
                        style={{
                            marginBottom: '1rem'
                        }}>
                        <IconInput
                            icon={() => (
                                userIcon('icon-input')
                            )}
                            placeholder={"Full Name"}
                            id="fullName"
                            type="text" name="fullName"

                        />
                    </div>
                    <div
                        style={{
                            marginBottom: '1rem'
                        }}>
                        <IconInput
                            icon={() => (
                                emailIcon('icon-input')
                            )}
                            placeholder={"Email"}
                            id="email"
                            type="email"
                            name="email"

                        />
                    </div>
                    <div
                        style={{
                            marginBottom: '1rem'
                        }}>
                        <IconInput
                            icon={() => (
                                phoneIcon('icon-input')
                            )}
                            placeholder={"Phone Number"}
                            id="phoneNumber"
                            type="number"
                            name="phoneNumber"

                        />
                    </div>
                    <div
                        style={{
                            marginBottom: '1rem'
                        }}>
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                {time('icon-input')}
                            </div>
                            {!this.props.service.isAvailableForSpecificDate &&
                                <DatePicker
                                    filterDate={this.isWeekday}
                                    className="form-datepicker"
                                    selected={this.state.formattedDate}
                                    onChange={this.handleChange}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    timeCaption="time"
                                    placeholderText="Select Date & Time"
                                />
                            }
                            {
                                this.props.service.isAvailableForSpecificDate
                                &&
                                this.props.service.availabilityType === 'specificDate'
                                &&
                                this.props.service.availability
                                &&
                                this.props.service.availability.length > 0
                                &&
                                <DatePicker
                                    filterDate={(date) => {
                                        const availability = this.props.service.availability;
                                        const _date = new Date(date);
                                        return availability.includes(_date.getTime())
                                    }}
                                    className="form-datepicker"
                                    selected={this.state.formattedDate}
                                    onChange={this.handleChange}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    timeCaption="time"
                                    placeholderText="Select Date & Time"
                                />
                            }
                            {
                                this.props.service.isAvailableForSpecificDate
                                &&
                                this.props.service.availabilityType === 'dateRange'
                                &&
                                this.props.service.availability
                                &&
                                this.props.service.availability.length > 1
                                &&
                                <DatePicker
                                    minDate={new Date(this.props.service.availability[0])}
                                    maxDate={new Date(this.props.service.availability[1])}
                                    className="form-datepicker"
                                    selected={this.state.formattedDate}
                                    onChange={this.handleChange}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    timeCaption="time"
                                    placeholderText="Select Date & Time"
                                />
                            }
                        </div>
                    </div>
                    <div
                        style={{
                            marginBottom: '1rem'
                        }}>
                        <IconInput
                            icon={() => (
                                address('icon-input')
                            )}
                            placeholder={"Address"}
                            id="address"
                            type="text"
                            name="address1"

                        />
                    </div>
                    <div
                        style={{
                            marginBottom: '1rem'
                        }}>
                        <IconInput
                            icon={() => (
                                budget('icon-input')
                            )}
                            placeholder={"Maximum Budget"}
                            id="maxBudget"
                            type="number"

                        />
                    </div>
                    {this.state.formSchema && this.state.formSchema.length > 0 && this.state.formSchema.map(this.mapCustomForm)}
                    <div
                        style={{
                            marginBottom: '1rem'
                        }}>
                        <div className="text-label">Message</div>
                        <div>
                            <textarea id="message" className="form-text-area" rows="4" type="text" name="fullName" />
                        </div>
                    </div>
                    <div
                        id='query-button-container'
                        style={{
                            textAlign: 'center'
                        }}>
                        <button id='query-button'
                            onClick={this.submitForm}
                            style={{animationDuration: '.3s', animationDelay: '0s'}}
                            className="form-button">{this.props.service.submitButtonText ? this.props.service.submitButtonText : 'Submit'}</button>
                    </div>
                </form >
            </div>
        );
    };



    render() {

        if (this.state.loading) {
            return (
                <div className="vendor-loader-container-desktop">
                    <img alt="" className="vendor-loader-desktop" src={loader} />
                </div>
            );
        } else if (!this.state.loading && this.state.success) {
            return (

                <div
                    style={{
                        backgroundColor: 'white',
                        // overflow: 'auto'
                    }}>
                    <Modal
                        isOpen={this.state.openModal}
                        style={
                            window.innerWidth > 768
                                ?
                                desktopStyle
                                :
                                mobileStyle
                        }

                    >
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: "center",
                            flexDirection: "column"
                        }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                <h1
                                    style={{
                                        textAlign: "center"
                                    }}
                                > Confirm Your Details
                                </h1>
                            </div>
                            {this.state.openModal &&
                                Object.keys(this.state.finalData).length !== 0 &&
                                this.checkSubmitDetails(this.state.finalData)}
                        </div>
                    </Modal>

                    <div className="query-form-container">
                        <div>
                            <div
                                style={{
                                    marginBottom: '15px',
                                    fontWeight: '800'
                                }}>
                                Get Custom Quotation
                            </div>
                        </div>
                        {this.formContainer()}
                    </div>
                </div>
            );
        } else if (!this.state.loading && !this.state.success) {
            return (
                <div
                    style={{
                        backgroundColor: 'white',
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <div>Invalid Service</div>
                </div>
            );
        }
    }
}


export default QueryFormModal;