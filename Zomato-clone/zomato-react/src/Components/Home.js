import React from 'react';
import axios from 'axios';

import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }
    }

    componentDidMount() {

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
            url: 'http://localhost:2209/mealtypes',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ mealtypes: response.data.mealtype })
            })
            .catch()

    }

    render() {
        const { locations, mealtypes } = this.state;
        sessionStorage.setItem('location', locations);
        sessionStorage.setItem('mealtype', mealtypes);
        return (
            <div>
                <Wallpaper locationsData={locations} />
                <QuickSearch QuickSearchData={mealtypes} />
            </div>
        )
    }
}

export default Home;