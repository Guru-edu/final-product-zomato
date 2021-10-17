import React from 'react';
import '../Styles/header.css';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { withRouter } from 'react-router';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: 'solid 1px brown',
        zIndex: '1',
    },
};

class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            isLoggedIn: false,
            loggedInUser: [],
            signupModalIsOpen: false,
            responseModalIsOpen: false,
            userSignup: [],
            userLogin: [],
            message: undefined,
            key: false,
            orderList: [],
            orderModalIsOpen: false,
            firstname: undefined,
            lastname: undefined,
            email: undefined,
            password: undefined,
            confirmPassword: undefined
        }
    }

    handleModalState = (state, value) => {
        if (state === 'formModalIsOpen' && value === true) {
            this.setState({ itemsModalIsOpen: false });
        }
        if (state === 'loginModalIsOpen' && value === true) {
            this.setState({ signupModalIsOpen: false });

        }
        this.setState({ [state]: value });
    }

    handleLogin = () => {
        this.setState({ loginModalIsOpen: true });
    }

    responseGoogle = (response) => {
        this.setState({ isLoggedIn: true, loggedInUser: response.profileObj.name, loginModalIsOpen: false })
    }

    responseFacebook = (response) => {
        this.setState({ isLoggedIn: true, loggedInUser: response.name, loginModalIsOpen: false })
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false, loggedInUser: undefined });
    }

    handlesignup = () => {
        this.setState({ signupModalIsOpen: true })
    }

    handleInputChange = (event, state) => {
        this.setState({ [state]: event.target.value });

        if (state === 'email') {
            const mail = event.target.value;
            if (state === 'password') {
                const pass = event.target.value;
                const cred = { 'email': mail, 'pass': pass }
                sessionStorage.setItem('jk', cred);
            }
        }
    }

    myFunction = () => {
        this.props.history.push('/');
    }

    login = () => {
        const { email, password } = this.state;
        this.setState({ signupModalIsOpen: false })

        const loginObj = {
            email,
            password,
        };

        axios({
            url: 'http://localhost:2209/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: loginObj
        })
            .then(response => {
                this.setState({ message: response.data.message, key: response.data.key, userLogin: response.data.user });
                this.responseLogin();
            })
            .catch()
    }

    responseLogin = () => {
        const { userLogin, loggedInUser, key } = this.state;

        if (key === true) {
            userLogin.map((item) => {
                this.setState({ isLoggedIn: true, loggedInUser: item.firstname, loginModalIsOpen: false, responseModalIsOpen: true });
                localStorage.setItem('loggedInUser', loggedInUser);
            })
        }
        else {
            this.setState({ loginModalIsOpen: true, responseModalIsOpen: true })
        }

    }


    handleOrderList = () => {

        const { loggedInUser } = this.state;

        axios({
            url: 'http://localhost:2209/getOrder',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: { user: loggedInUser }
        })
            .then(response => {
                this.setState({ orderList: response.data.orders, orderModalIsOpen: true });
            })
            .catch()
    }

    signup = () => {
        const { firstname, lastname, email, password, confirmPassword, key } = this.state;

        const signupObj = {
            firstname,
            lastname,
            email,
            password,
            confirmPassword
        };
        axios({
            url: 'http://localhost:2209/signup',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: signupObj
        })
            .then(response => {
                this.setState({ message: response.data.message, key: response.data.key });
                this.responseSignup(key);
            })
            .catch()

    }
    responseSignup = (key) => {
        if (key === true) {
            this.setState({ signupModalIsOpen: false, responseModalIsOpen: true })
        }
        else {
            this.setState({ responseModalIsOpen: true, signupModalIsOpen: true })
        }
    }

    render() {

        const { loginModalIsOpen, isLoggedIn, loggedInUser, signupModalIsOpen, orderModalIsOpen, orderList, message, responseModalIsOpen } = this.state;

        return (
            <div>
                <div className="app-header">

                    <div className="header-logo" onClick={this.myFunction}>e!</div>

                    {isLoggedIn ? <div className="user-button-gp">
                        <span className="user-login">{loggedInUser}</span>
                        <span className="user-login" onClick={this.handleOrderList}>order History</span>
                        <span className="user-signup" onClick={this.handleLogout}>Logout</span>
                    </div> :
                        <div className="user-button-gp">
                            <span className="user-login" onClick={this.handleLogin}>Login</span>
                            <span className="user-signup" onClick={this.handlesignup}>Create an account</span>
                        </div>
                    }
                </div>
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}>
                    <div >
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '1px', top: "-14px" }} onClick={() => this.handleModalState('loginModalIsOpen', false)}></div>
                        <div className="division">
                            <label >Email</label>
                            <input type="text" placeholder="Enter your email" className="form-control" onChange={(event) => this.handleInputChange(event, 'email')} />
                            <label >Password</label>
                            <input type="text" placeholder="Enter password" className="form-control" onChange={(event) => this.handleInputChange(event, 'password')} />
                            <button className="btn btn-danger lg" onClick={this.login} >Login</button>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '10px' }}> (or)</div>
                        <GoogleLogin
                            clientId="326620521859-7hbnk7soogrkma1uc9ghfhkf0h8s1haj.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                        <FacebookLogin
                            appId=""
                            autoLoad={true}
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                        />
                    </div>
                </Modal>
                <Modal isOpen={signupModalIsOpen}
                    style={customStyles}>
                    <div >
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px', top: "-8px", left: "12px" }} onClick={() => this.handleModalState('signupModalIsOpen', false)}></div>
                        <label style={{ marginTop: '20px' }}>First Name</label>
                        <input style={{ width: '320px' }} type="text" placeholder="Enter your first name" className="form-control" onChange={(event) => this.handleInputChange(event, 'firstname')} />
                        <label>Last Name</label>
                        <input style={{ width: '320px' }} type="text" placeholder="Enter your last name" className="form-control" onChange={(event) => this.handleInputChange(event, 'lastname')} />
                        <label>Email</label>
                        <input style={{ width: '320px' }} type="text" placeholder="Enter your email" className="form-control" onChange={(event) => this.handleInputChange(event, 'email')} />
                        <label>Password</label>
                        <input style={{ width: '320px' }} type="text" placeholder="Enter password" className="form-control" onChange={(event) => this.handleInputChange(event, 'password')} />
                        <label>Confirm Password</label>
                        <input style={{ width: '320px' }} type="text" placeholder="Enter password" className="form-control" onChange={(event) => this.handleInputChange(event, 'confirmPassword')} />
                        <button style={{ margin: '20px', marginLeft: '100px' }} className="btn btn-danger" onClick={this.signup}>Create an account</button>
                        <div className="all"> Already have an account? Please <span className="click" onClick={() => this.handleModalState('loginModalIsOpen', true)}>Login here</span></div>
                    </div>

                </Modal>
                <Modal
                    isOpen={responseModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px', top: "-8px", left: "12px" }} onClick={() => this.handleModalState('responseModalIsOpen', false)}></div>
                        {message}
                    </div>
                </Modal>
                <Modal
                    isOpen={orderModalIsOpen}
                    style={customStyles}
                >
                    <div className="emptylist">
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px', top: "-8px", left: "12px" }} onClick={() => this.handleModalState('orderModalIsOpen', false)}></div>
                        {orderList.length > 0 ? orderList.map((item, index) => {
                            return (
                                <div style={{ margin: '5px', marginBottom: '30px' }}>
                                    <h4 className="bill">{index + 1})</h4>
                                    <div><h4 className="res-1">Restaurant : {item.restaurantName}</h4></div>
                                    <div className="del">Name: {item.placedBy}</div>
                                    <div className="del">Delivery Location: {item.location}</div>
                                    <div id="bill">Ordered Items </div>
                                    <div>
                                        <h5 className="bill-1">Item Name</h5>
                                        <h5 className="bill-1">Number of Items</h5>
                                    </div>
                                    {item.items.map(a => {
                                        return (
                                            <div>
                                                <h5 className="bill">{a.name}</h5>
                                                <h5 className="bill">{a.nos}</h5>
                                            </div>
                                        )
                                    })}
                                    <div className="amount">Total Amount: &#8377; {item.amount}</div>
                                    <div id="line"></div>
                                </div>
                            )
                        }) : <div>
                            <div className="far fa-frown frown-1"></div>
                            <div className="result">Empty list<br></br>Please order something....</div>
                        </div>}
                    </div>
                </Modal>

            </div >
        )
    }
}

export default withRouter(Header);