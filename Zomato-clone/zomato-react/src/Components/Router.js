import { BrowserRouter, Route } from 'react-router-dom';

import Home from './Home';
import Filter from './Filter';
import Details from './Details';
import Header from './Header';

function Router() {
    return (
        <BrowserRouter>
            <Header />
            <Route exact path="/" component={Home}></Route>
            <Route path="/filter" component={Filter}></Route>
            <Route path="/details" component={Details}></Route>
        </BrowserRouter>
    )
}

export default Router;