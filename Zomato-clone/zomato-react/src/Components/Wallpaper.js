import React from 'react';
import '../Styles/home.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Wallpaper extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurantList: [],
            searchText: undefined,
            suggestions: []
        }
    }

    handleLocationChange = (event) => {
        const locId = event.target.value;
        sessionStorage.setItem('locationId', locId);

        axios({
            url: `http://localhost:2209/restaurants/${locId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurantList: response.data.restaurant })
            })
            .catch()
    }

    handleInputChange = (event) => {
        const { restaurantList } = this.state;
        const searchText = event.target.value;

        let searchRestaurants = [];
        if (searchText) {
            searchRestaurants = restaurantList.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }

        this.setState({ suggestions: searchRestaurants, searchText });

    }

    selectedText = (resItem) => {
        this.props.history.push(`/details?restaurant=${resItem._id}`);
    }

    renderSuggestions = () => {
        const { suggestions, searchText } = this.state;

        if (suggestions.length === 0 && searchText === "") {
            return <ul >
                <li>
                    <div className="no">
                        <div className="far fa-frown frown"></div>
                        <div className="text">Oops..! No Results Found</div>
                    </div>
                </li>
            </ul>
        }

        return (
            <ul >
                {suggestions.map((item, index) => (
                    <li key={index} onClick={() => this.selectedText(item)}>{
                        <div className="qsdiv">
                            <div className="image-1 col-xs-4"><img id="image-2" src={item.image} alt="Thing not Available" /></div>
                            <div className="col-xs-7 ">
                                <div className="name1">{item.name}</div>
                                <div className="city1">{`${item.locality} - ${item.city}`}</div>
                            </div>
                        </div>}
                    </li>))
                }
            </ul>
        );
    }

    render() {
        const { locationsData } = this.props;
        return (
            <div>
                <div className="image"></div>
                <div>

                    <div className="logo"><b>e!</b></div>

                    <div className="headings">Find the best restaurants, cafés, and bars</div>

                    <div className="locationSelector">
                        <div>
                            <select className="locationDropdown" onChange={this.handleLocationChange}>
                                <option value="0">Select</option>
                                {locationsData.map((item) => {
                                    return <option key={item.location_id} value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                })}
                            </select>
                        </div>
                        <div>
                            <span id="notebooks">
                                <span className="glyphicon glyphicon-search search"></span>
                                <input id="query" className="restaurantsinput" type="text" placeholder="Please Enter Restaurant Name" onChange={this.handleInputChange} />
                                {this.renderSuggestions()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Wallpaper);