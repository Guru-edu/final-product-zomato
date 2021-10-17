import React from 'react';
import { withRouter } from 'react-router-dom';

class QuickSearchItem extends React.Component {
    handleNavigate = (mealTypeId) => {
        const locationId = sessionStorage.getItem('locationId');
        if (locationId) {
            this.props.history.push(`/filter?mealtype=${mealTypeId}&location=${locationId}`);
        }
        else {
            this.props.history.push(`/filter?mealtype=${mealTypeId}`);
        }
    }

    render() {
        const { item } = this.props;
        return (
            <div onClick={() => this.handleNavigate(item.meal_type)} key={item.meal_type} className="col-sm-12 col-md-6 col-lg-4">
                <div className="tileContainer">
                    <div className="tileComponent1">
                        <img src={`./${item.image}`} alt="Thing not Available" height="150" width="140" />
                    </div>
                    <div className="tileComponent2">
                        <div className="componentHeading">
                            {item.name}
                        </div>
                        <div className="componentSubHeading">
                            {item.content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(QuickSearchItem);