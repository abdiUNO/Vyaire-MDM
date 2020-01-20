import React from 'react';
import { View } from 'react-native';
import { Route, Switch } from './router';
import { withTitle } from '../components/pagetitle';
import CreateCustomer from '../containers/CreateCustomer';
import CreateList from '../containers/CreateList';
import UpdateCustomer from '../containers/UpdateCustomer';
import SearchPage from '../containers/SearchPage';
import ResultsPage from '../containers/ResultsPage';
import AdvanceSearch from '../containers/AdvancedSearch';
import MyTasks from '../containers/MyTasks/';
import Form from '../containers/MyTasks/Form';
import  CustomerMasterForm from '../containers/MyTasks/CustomerMasterForm';
import CreditForm from '../containers/MyTasks/CreditForm';
import GlobalTradeForm from '../containers/MyTasks/GlobalTradeForm';
import ContractsForm from '../containers/MyTasks/ContractsForm';
import PricingForm from '../containers/MyTasks/PricingForm';
import MyRequests from '../containers/MyRequests/';
import MyRequestsForm from '../containers/MyRequests/Form';
import HomePage from '../containers/HomePage';

class Routes extends React.PureComponent {
    render() {
        return (
            <View>
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
                        path="/my-tasks/customer-master"
                        component={withTitle({
                            component: CustomerMasterForm,
                            title: 'My Tasks Customer Master',
                        })}
                    />

                    <Route
                        exact
                        path="/my-tasks/credit-form"
                        component={withTitle({
                            component: CreditForm,
                            title: 'My Tasks Credit',
                        })}
                    />

                    <Route
                        exact
                        path="/my-tasks/global-trade"
                        component={withTitle({
                            component: GlobalTradeForm,
                            title: 'My Tasks Global Trade',
                        })}
                    />
                    <Route
                        exact
                        path="/my-tasks/contracts"
                        component={withTitle({
                            component: ContractsForm,
                            title: 'My Tasks Contracts',
                        })}
                    /><Route
                        exact
                        path="/my-tasks/contracts"
                        component={withTitle({
                            component: ContractsForm,
                            title: 'My Tasks Contracts',
                        })}
                    />
                    <Route
                        exact
                        path="/my-tasks/pricing"
                        component={withTitle({
                            component: PricingForm,
                            title: 'My Tasks Pricing',
                        })}
                    />
                    <Route
                        exact
                        path="/my-tasks/task"
                        component={withTitle({
                            component: Form,
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
                        path="/my-requests/:id"
                        component={withTitle({
                            component: MyRequestsForm,
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
            </View>
        );
    }
}

export default Routes;
