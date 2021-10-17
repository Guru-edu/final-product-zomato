import React from 'react';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';

class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            mealtypeHead: [],
            locationHead: [],
            locations: [],
            mealtypes: [],
            location: undefined,
            mealtype: undefined,
            cuisine: [],
            lcost: undefined,
            hcost: undefined,
            sort: undefined,
            page: undefined,
            pageCount: []
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { mealtype, location } = qs;

        const { total, restaurants } = this.state;
        const filterObj = {
            mealtype,
            location,
            page: 1
        };

        axios({
            url: 'http://localhost:2209/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurant, mealtype, location })
            })
            .catch()
        console.log(restaurants)
        console.log(total)

        axios({
            url: 'http://localhost:2209/locations',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ locations: response.data.location })
            })
            .catch()

        axios({
            url: 'http://localhost:2209/filterLocation',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: { location }
        })
            .then(response => {
                this.setState({ locationHead: response.data.locationFilter })
            })
            .catch()

        axios({
            url: 'http://localhost:2209/mealtypes',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ mealtypes: response.data.mealtype })
            })
            .catch()

        axios({
            url: 'http://localhost:2209/filterMealtype',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: { mealtype }
        })
            .then(response => {
                this.setState({ mealtypeHead: response.data.mealtypeFilter })
            })
            .catch()

    }

    handleLocationChange = (event) => {
        const location = event.target.value;

        const { mealtype, cuisine, lcost, hcost, sort, page, total } = this.state;

        const filterObj = {
            mealtype: mealtype,
            location: location,
            cuisine: cuisine.length === 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            url: 'http://localhost:2209/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurant, location })
                console.log(total)
            })
            .catch()

        axios({
            url: 'http://localhost:2209/filterLocation',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: { location }
        })
            .then(response => {
                this.setState({ locationHead: response.data.locationFilter })
            })
            .catch()

        this.props.history.push(`/filter?mealtype=${mealtype}&location=${location}`);
    }

    handleSortChange = (sort) => {

        const { location, mealtype, cuisine, lcost, hcost, page, total } = this.state;

        const filterObj = {
            mealtype: mealtype,
            location: location,
            cuisine: cuisine.length === 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            url: 'http://localhost:2209/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurant, sort })
                console.log(total)
            })
            .catch()
    }

    handleCostChange = (lcost, hcost) => {

        const { location, mealtype, cuisine, sort, page, total } = this.state;

        const filterObj = {
            mealtype: mealtype,
            location: location,
            cuisine: cuisine.length === 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            url: 'http://localhost:2209/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurant, lcost, hcost })
                console.log(total)

            })
            .catch()
    }

    handlePageChange = (page) => {
        const { location, mealtype, cuisine, sort, lcost, hcost, total } = this.state;

        const filterObj = {
            mealtype: mealtype,
            location: location,
            cuisine: cuisine.length === 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page: page
        };

        axios({
            url: 'http://localhost:2209/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurant, page })
                console.log(total)

            })
            .catch()
    }

    handleCuisineChange = (cuisineId) => {

        const { location, mealtype, cuisine, sort, lcost, hcost, page, total } = this.state;

        const index = cuisine.indexOf(cuisineId);
        if (index >= 0) {
            cuisine.splice(index, 1);
        }
        else {
            cuisine.push(cuisineId);
        }

        const filterObj = {
            mealtype: mealtype,
            location: location,
            cuisine: cuisine.length === 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            url: 'http://localhost:2209/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurant, cuisine })
                console.log(total)

            })
            .catch()
    }

    handleNavigate = (resId) => {
        this.props.history.push(`/details?restaurant=${resId}`);
    }


    render() {

        const { restaurants, locations, mealtypeHead, locationHead } = this.state;

        /*  const n = Math.ceil(total.length / 2);
          const i = 0;
          console.log(n)
          for (i = 0; i <= n; i++) {
  
          }*/

        return (
            <div>

                <div className="container-fluid">
                    <div className="heading-1">
                        <div className="top">
                            {mealtypeHead.map((item) => {
                                return (<span>{item.name}</span>)
                            })}
                        </div>
                        <div className="top">Places in</div>
                        <div className="top">
                            {locationHead.map((item) => {
                                return (<span>{item.name}</span>)
                            })}
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-lg-1"></div>
                        <div className="col-sm-4 col-md-4 col-lg-4 filter-options">
                            <div className="filter-heading">Filters / Sort</div>
                            <span className="fas fa-chevron-down toggle-span" data-toggle="collapse" data-target="#filter" ></span>
                            <div id="filter" className="collapse show">
                                <div className="Select-Location">Select Location</div>
                                <select className="select-1" onChange={this.handleLocationChange}>
                                    <option value="0">Select</option>
                                    {locations.map((item) => {
                                        return <option key={item.location_id} value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                    })}
                                </select>
                                <div className="Cuisine">Cuisine</div>
                                <div>
                                    <input type="checkbox" name="cuisine" className="box" onChange={() => this.handleCuisineChange(1)} />
                                    <span className="checkbox-items">North Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" name="cuisine" className="box" onChange={() => this.handleCuisineChange(2)} />
                                    <span className="checkbox-items">South Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" name="cuisine" className="box" onChange={() => this.handleCuisineChange(3)} />
                                    <span className="checkbox-items">Chineese</span>
                                </div>
                                <div>
                                    <input type="checkbox" name="cuisine" className="box" onChange={() => this.handleCuisineChange(4)} />
                                    <span className="checkbox-items">Fast Food</span>
                                </div>
                                <div>
                                    <input type="checkbox" name="cuisine" className="box" onChange={() => this.handleCuisineChange(5)} />
                                    <span className="checkbox-items">Street Food</span>
                                </div>
                                <div className="Cuisine">Cost For Two</div>
                                <div>
                                    <input type="radio" name="cost" className="box" onChange={() => this.handleCostChange(1, 500)} />
                                    <span className="checkbox-items">Less than &#8377; 500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" className="box" onChange={() => this.handleCostChange(500, 1000)} />
                                    <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" className="box" onChange={() => this.handleCostChange(1000, 1500)} />
                                    <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" className="box" onChange={() => this.handleCostChange(1500, 2000)} />
                                    <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" className="box" onChange={() => this.handleCostChange(2000, 50000)} />
                                    <span className="checkbox-items">&#8377; 2000 +</span>
                                </div>
                                <div className="Cuisine">Sort</div>
                                <div>
                                    <input type="radio" name="sort" className="box" onChange={() => this.handleSortChange(1)} />
                                    <span className="checkbox-items">Price low to high</span>
                                </div>
                                <div>
                                    <input type="radio" name="sort" className="box" onChange={() => this.handleSortChange(-1)} />
                                    <span className="checkbox-items">Price high to low</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8 col-md-8 col-lg-6">
                            {restaurants.length > 0 ? restaurants.map((item, index) => {
                                return <div className="Item" key={index} onClick={() => this.handleNavigate(item._id)}>
                                    <div>
                                        <div className="small-item vertical">
                                            <img className="img" src={item.image} alt="Thing not Available" />
                                        </div>
                                        <div className="big-item">
                                            <div className="rest-name">{item.name}</div>
                                            <div className="rest-location">{item.locality}</div>
                                            <div className="rest-address">{item.city}</div>
                                        </div>
                                    </div>
                                    <div className="empty"></div>
                                    <div>
                                        <div className="margin-left">
                                            <div className="part-1">
                                                <div className="Bakery">CUISINES </div>
                                                <div className="Bakery">COST FOR TWO </div>
                                            </div>
                                            <div className="part-1">
                                                <div className="Bakery-1">:{item.cuisine.map((val) => `${val.name}, `)}</div>
                                                <div className="Bakery-1">:&#8377; {item.min_price}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }) : <div class="no-records">No Records Found...</div>}

                            {restaurants.length > 1 ? <div className="pagination">
                                <div className="page-item">&laquo;</div>
                                {<span>
                                    <p className="page-item" onClick={() => this.handlePageChange(1)}>1</p>
                                    <p className="page-item" onClick={() => this.handlePageChange(2)}>2</p>
                                    <p className="page-item" onClick={() => this.handlePageChange(3)}>3</p>
                                </span>}
                                <div className="page-item">&raquo;</div>
                            </div> : null}
                        </div>
                        <div className="col-lg-2"></div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Filter;