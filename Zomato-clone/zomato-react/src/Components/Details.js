import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import '../Styles/details.css';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: 'solid 1px brown'
    },
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            itemsModalIsOpen: false,
            summaryModalIsOpen: false,
            formModalIsOpen: false,
            galleryModalIsOpen: false,
            restaurantId: undefined,
            menuItems: [],
            subTotal: 0,
            quantity: undefined,
            name: undefined,
            email: undefined,
            conatctNumber: undefined,
            address: undefined,

        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { restaurant } = qs;

        axios({
            url: `http://localhost:2209/restaurant/${restaurant}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(respone => {
                this.setState({ restaurant: respone.data.restaurant, restaurantId: restaurant })
            })
            .catch()

    }

    handleOrder = () => {
        const { restaurantId } = this.state;
        axios({
            url: `http://localhost:2209/menuitems/${restaurantId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ menuItems: response.data.items, itemsModalIsOpen: true })
            })
            .catch()
    }

    handleModalState = (state, value) => {

        if (state === 'summaryModalIsOpen' && value === true) {
            this.setState({ itemsModalIsOpen: false });
        }

        if (state === 'formModalIsOpen' && value === true) {
            this.setState({ summaryModalIsOpen: false });
        }

        this.setState({ [state]: value });
        <header state={value} />
    }

    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType === 'add') {
            item.qty += 1;
        }
        else {
            item.qty -= 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }

    handleInputChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    /* saveOrder = () => {
         const { user } = this.props;
         const { restaurant, address, subTotal, name, qty } = this.state;
         console.log(restaurant.name, user, address, subTotal, name);
 
         const items = [...this.state.menuItems];
         console.log(items)
         const j = items.map((item, index) => {
             if (item.qty > 0) {
                 items.map((i) => i.name);
             }
         })
         console.log(j)
         // const itemObj = [{ name: itemName, nos: Nos }];
         // const orderObj = { resName: restaurant.name, user, name, address, items: itemObj, subTotal };
 
         axios({
             url: 'https:/localhost:2209/order',
             method: 'POST',
             headers: { 'content-type': 'application/json' },
             //  data: orderObj
 
         })
             .then({})
             .catch({})
     }
 */
    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = async (data) => {
        try {
            const response = await fetch(`http://localhost:2209/payment`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (err) {
            return console.log(err);
        }
    }


    Payment = () => {
        const { subTotal, email } = this.state;

        const paymentObj = {
            amount: subTotal,
            email
        };

        this.getData(paymentObj).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            this.post(information)
        })
    }

    render() {

        const { restaurant, itemsModalIsOpen, formModalIsOpen, galleryModalIsOpen, menuItems, subTotal, summaryModalIsOpen } = this.state;
        return (
            <div>
                <div>
                    <img className="bg-image" src={restaurant.image} alt="Thing not Available" />

                    <button class="button" onClick={() => this.handleModalState('galleryModalIsOpen', true)}>Click to see Image Gallery</button>
                </div>
                <div class="heading">{restaurant.name}</div>
                <button class="btn-order" onClick={this.handleOrder}>Place Order</button>

                <div class="tabs">
                    <div class="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" checked />
                        <label for="tab-1">Overview</label>
                        <div class="content">
                            <div class="about">About this place</div>
                            <div class="head">Cuisine</div>
                            <div class="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map(item => `${item.name}, `)}</div>
                            <div class="head">Average Cost</div>
                            <div class="value">&#8377; {restaurant.min_price} for two people(approx)</div>
                        </div>
                    </div>

                    <div class="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label for="tab-2">Contact</label>
                        <div class="content" >
                            <div class="about">Contact Details</div>
                            <div class="head">Phone Number</div>
                            <div class="value">{restaurant.contact_number}</div>
                            <div class="head">{restaurant.name}</div>
                            <div class="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={itemsModalIsOpen}
                    style={customStyles}
                >
                    <div style={{ width: '430px' }}>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', border: '1px solid black', padding: '2px', marginRight: '10px' }} onClick={() => this.handleModalState('itemsModalIsOpen', false)}></div>
                        <div>
                            <h3 className="restaurant-name">{restaurant.name}</h3>
                            <h3 className="item-total">SubTotal : &#8377; {subTotal}</h3>

                            <button className="btn btn-danger order-button" onClick={() => this.handleModalState('summaryModalIsOpen', true)}>Add to Cart</button>
                            {menuItems.map((item, index) => {
                                return <div style={{ width: '40rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                    <div className="card" style={{ width: '40rem', margin: 'auto' }}>
                                        <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingBottom: '10px' }}>
                                                <span className="card-body">
                                                    <h5 className="item-name">{item.name}</h5>
                                                    <h5 className="item-price">&#8377;{item.price}</h5>
                                                    <p className="item-descp">{item.description}</p>
                                                </span>
                                            </div>
                                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={`../${item.image}`} alt="Thing not Available" style={{ height: '75px', width: '75px', borderRadius: '20px', marginTop: '10px' }} />
                                                {item.qty === 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                    <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white', padding: '3px' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={summaryModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', border: '1px solid black', padding: '2px', marginRight: '10px' }} onClick={() => this.handleModalState('summaryModalIsOpen', false)}></div>
                        <h3>Order Summary</h3>
                        {menuItems.map((item) => {
                            return (
                                <div className="col-12" style={{ paddingLeft: '8px', paddingBottom: '5px' }}>
                                    {item.qty > 0 ?
                                        <div style={{ width: '420px' }}>
                                            <div className="i-name" style={{ width: '200px' }}>{item.name}</div>
                                            <div className="i-name" style={{ width: '20px' }}>{item.qty}</div>
                                            <div className="far fa-times i-name" style={{ width: '20px' }}></div>
                                            <div className="i-name" style={{ width: '50px' }}>{item.price}</div>
                                            <div className="far fa-equals i-name" style={{ width: '20px' }}></div>
                                            <div className="i-name">&#8377; {item.price * item.qty}</div>

                                        </div> : <div></div>}

                                </div>
                            )
                        })
                        }
                        <div className="i-name" style={{ marginLeft: '252px' }}>Total <span className="far fa-equals"></span> &#8377; {subTotal}</div>

                        <div className="btn btn-danger pay" onClick={() => this.handleModalState('formModalIsOpen', true)}> Pay Now</div>

                    </div>
                </Modal>
                <Modal
                    isOpen={formModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('formModalIsOpen', false)}></div>
                        <h2>{restaurant.name}</h2>
                        <label>Name</label>
                        <input style={{ width: '350px' }} type="text" placeholder="Enter your name" className="form-control" onChange={(event) => this.handleInputChange(event, 'name')} />
                        <label>Email</label>
                        <input style={{ width: '350px' }} type="text" placeholder="Enter your email" className="form-control" onChange={(event) => this.handleInputChange(event, 'email')} />
                        <label>Mobile Number</label>
                        <input style={{ width: '350px' }} type="text" placeholder="Enter your number" className="form-control" onChange={(event) => this.handleInputChange(event, 'contactNumber')} />
                        <label>Address</label>
                        <textarea style={{ width: '350px' }} placeholder="Enter your address" className="form-control" onChange={(event) => this.handleInputChange(event, 'address')} />
                        <button style={{ float: 'right', marginTop: '10px' }} className="btn btn-danger" onClick={this.Payment}>Proceed</button>
                        { }
                    </div>
                </Modal>
                <Modal
                    isOpen={galleryModalIsOpen}
                    style={customStyles}
                >
                    <div className="carouse">
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('galleryModalIsOpen', false)}></div>
                        <h4 className="i-name">Image Gallery</h4>
                        <Carousel
                            infiniteLoop={false}
                            showThumbs={false}
                            autoPlay={false}
                        >
                            {restaurant && restaurant.thumb && restaurant.thumb.map((image) => {
                                return <div className="carouseImage">
                                    <img src={image} alt="Thing not Available" />
                                </div>
                            })}
                        </Carousel>
                    </div>
                </Modal>
                {/*  
                > Backend Deployment 
                */}
                <div>
                </div>
            </div>

        )
    }
}

export default Details;