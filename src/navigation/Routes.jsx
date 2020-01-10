import React from 'react';
import { Route, Switch } from './router';
import { withTitle } from '../components/pagetitle';
import CreateCustomer from '../containers/CreateCustomer';
import CreateList from '../containers/CreateList';
import UpdateCustomer from '../containers/UpdateCustomer';
import SearchPage from '../containers/SearchPage';
import ResultsPage from '../containers/ResultsPage';
import AdvanceSearch from '../containers/AdvancedSearch';
import MyTasks from '../containers/MyTasks';
import MyRequests from '../containers/MyRequests';
import HomePage from '../containers/HomePage';

class Routes extends React.PureComponent {
    render() {
        return (
            <Switch>
                <Route
                    exact
                    path="/customers/create"
                    component={withTitle({
                        component: CreateCustomer,
                        title: 'Create Customer',
                    })}
                />

                <Route
                    exact
                    path="/customers/create-additional"
                    component={withTitle({
                        component: CreateList,
                        title: 'Create Additional',
                    })}
                />

                <Route
                    exact
                    path="/customers/:id"
                    component={withTitle({
                        component: UpdateCustomer,
                        title: 'Update Customer',
                    })}
                />

                <Route
                    exact
                    path="/search"
                    component={withTitle({
                        component: SearchPage,
                        title: 'Search',
                    })}
                />

                <Route
                    exact
                    path="/search-results"
                    component={withTitle({
                        component: ResultsPage,
                        title: 'Search Results',
                    })}
                />
                <Route
                    exact
                    path="/advance-search"
                    component={withTitle({
                        component: AdvanceSearch,
                        title: 'Advance Search',
                    })}
                />
                <Route
                    exact
                    path="/my-tasks"
                    component={withTitle({
                        component: MyTasks,
                        title: 'My Tasks',
                    })}
                />
                <Route
                    exact
                    path="/my-requests"
                    component={withTitle({
                        component: MyRequests,
                        title: 'My Requests',
                    })}
                />
                <Route
                    exact
                    path="/"
                    component={withTitle({
                        component: HomePage,
                        title: 'Vyaire MDM',
                    })}
                />
            </Switch>
        );
    }
}

export default Routes;
