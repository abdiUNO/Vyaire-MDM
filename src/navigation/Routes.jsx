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
import MyRequests from '../containers/MyRequests/';
import MyRequestsForm from '../containers/MyRequests/Form';
import HomePage from '../containers/HomePage';
import Checklist from '../containers/ReleaseChecklist';
// My-Task screens of Different system
import MyTasks from '../containers/MyTasks/Apollo/';
import MyTasksForm from '../containers/MyTasks/Apollo/Form';
import CustomerMasterForm from '../containers/MyTasks/Apollo/CustomerMasterForm';
import CreditForm from '../containers/MyTasks/Apollo/CreditForm';
import GlobalTradeForm from '../containers/MyTasks/Apollo/GlobalTradeForm';
import ContractsForm from '../containers/MyTasks/Apollo/ContractsForm';
import PricingForm from '../containers/MyTasks/Apollo/PricingForm';
import PTMNCustomerMasterForm from '../containers/MyTasks/PTMN/CustomerMaster'
import M2MCustomerMasterForm from '../containers/MyTasks/M2M/CustomerMaster'
// SearchResult screens of Different system 
import Extend1 from '../containers/SearchResult/Apollo/Extend1';
import Extend2 from '../containers/SearchResult/Apollo/Extend2';
import Block from '../containers/SearchResult/Apollo/Block';
import Screen2 from '../containers/SearchResult/Apollo/Screen2';
import JDEExtend2 from '../containers/SearchResult/JDE/Extend2';
import M2MExtend2 from '../containers/SearchResult/M2M/Extend2'; 
import PTMNExtend2 from '../containers/SearchResult/PTMN/Extend2';
import OlympusExtend2 from '../containers/SearchResult/Olympus/Extend2';
//Update screens for different systems
import Update from '../containers/UpdateForm/Apollo/UpdateScreen';
import PTMNUpdate from '../containers/UpdateForm/PTMN/UpdateScreen';
import M2MUpdate from '../containers/UpdateForm/M2M/UpdateScreen';
import JDEUpdate from '../containers/UpdateForm/JDE/UpdateScreen';
import OlympusUpdate from '../containers/UpdateForm/Olympus/UpdateScreen';

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
                            backgroundColor: '#EFF3F6',
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
                        path="/checklist"
                        component={withTitle({
                            component: Checklist,
                            title: 'Release checklist',
                        })}
                    />
                    <Route
                        exact
                        path="/apollo/update"
                        component={withTitle({
                            component: Update,
                            title: 'Update',
                        })}
                    />
                    <Route
                        exact
                        path="/ptmn/update"
                        component={withTitle({
                            component: PTMNUpdate,
                            title: 'Update',
                        })}
                    />
                    <Route
                        exact
                        path="/m2m/update"
                        component={withTitle({
                            component: M2MUpdate,
                            title: 'Update',
                        })}
                    />
                    <Route
                        exact
                        path="/jde/update"
                        component={withTitle({
                            component: JDEUpdate,
                            title: 'Update',
                        })}
                    />
                    <Route
                        exact
                        path="/olympus/update"
                        component={withTitle({
                            component: OlympusUpdate,
                            title: 'Update',
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
                        path="/search/results"
                        component={withTitle({
                            component: ResultsPage,
                            title: 'Search Results',
                        })}
                    />
                    <Route
                        exact
                        path="/search-results/extend-system"
                        component={withTitle({
                            component: Extend1,
                            title: 'Search Results Extend 1',
                            backgroundColor: '#EFF3F6',
                        })}
                    />
                    <Route
                        exact
                        path="/search-results/extend2"
                        component={withTitle({
                            component: Extend2,
                            title: 'Search Results Exted 2',
                        })}
                    />
                    <Route
                        exact
                        path="/search-results/jde/extend2"
                        component={withTitle({
                            component:  JDEExtend2,
                            title: 'Search Results Exted 2',
                        })}
                    />
                    <Route
                        exact
                        path="/search-results/m2m/extend2"
                        component={withTitle({
                            component:  M2MExtend2,
                            title: 'Search Results Exted 2',
                        })}
                    />
                    <Route
                        exact
                        path="/search-results/ptmn/extend2"
                        component={withTitle({
                            component:  PTMNExtend2,
                            title: 'Search Results Exted 2',
                        })}
                    />
                    <Route
                        exact
                        path="/search-results/olympus/extend2"
                        component={withTitle({
                            component:  OlympusExtend2,
                            title: 'Search Results Exted 2',
                        })}
                    />
                    <Route
                        exact
                        path="/search-results/screen2"
                        component={withTitle({
                            component: Screen2,
                            title: 'Search results screen2',
                        })}
                    />

                    <Route
                        exact
                        path="/search-results/block"
                        component={withTitle({
                            component: Block,
                            title: 'Block Screen',
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
                            backgroundColor: '#EFF3F6',
                        })}
                    />

                    <Route
                        exact
                        path="/my-tasks/global-trade"
                        component={withTitle({
                            component: GlobalTradeForm,
                            title: 'My Tasks Global Trade',
                            backgroundColor: '#EFF3F6',
                        })}
                    />
                    <Route
                        exact
                        path="/my-tasks/contracts"
                        component={withTitle({
                            component: ContractsForm,
                            title: 'My Tasks Contracts',
                        })}
                    />
                    <Route
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
                            component: MyTasksForm,
                            title: 'My Tasks',
                            backgroundColor: '#EFF3F6',
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
                            backgroundColor: '#EFF3F6',
                        })}
                    />
                    <Route
                        exact
                        path="/"
                        component={withTitle({
                            component: HomePage,
                            title: 'Vyaire M2M',
                        })}
                    />

                    {/* PTMN System */}
                    <Route
                        exact
                        path="/my-tasks/ptmn/customer-master"
                        component={withTitle({
                            component: PTMNCustomerMasterForm,
                            title: 'My Tasks PTMN Customer Master',
                        })}
                    />

                    {/* M2M System */}
                    <Route
                        exact
                        path="/my-tasks/m2m/customer-master"
                        component={withTitle({
                            component: M2MCustomerMasterForm,
                            title: 'My Tasks M2M Customer Master',
                        })}
                    />

                    <Route
                        exact
                        path="/my-tasks/global-trade/:id"
                        component={withTitle({
                            component: GlobalTradeForm,
                            title: 'My Tasks Global Trade',
                            backgroundColor: '#EFF3F6',
                            blacklist: ['global-trade'],
                        })}
                    />
                </Switch>
            </View>
        );
    }
}

export default Routes;
