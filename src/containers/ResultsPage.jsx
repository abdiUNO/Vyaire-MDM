import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Button, Flex, Box } from '../components/common';
import { Link } from '../navigation/router';
import {
    searchCustomer,
    advanceSearchCustomer,
} from '../appRedux/actions/Customer';
import { getMockSearchResult } from '../appRedux/sagas/config';
import { WorkflowStateType } from '../constants/WorkflowEnums';
import { Tabs } from '../components/tabs';
import { connect } from 'react-redux';
import FlashMessage from '../components/FlashMessage';
const HeadCell = ({ children, rowSpan, style }) => (
    <th
        rowSpan={rowSpan}
        style={{
            fontSize: 16,
            borderSpacing: 0,
            borderRightWidth: 1,
            borderColor: '#98D7DA',
            borderRightStyle: 'solid',
            paddingTop: 24,
            paddingBottom: 24,
            paddingHorizontal: 15,
            paddingLeft: 14,
            paddingRight: 16,
            textAlign: 'left',
            wordWrap: 'break-word',
            ...style,
        }}>
        {children}
    </th>
);

const Cell = ({ children, style, odd }) => (
    <td
        style={{
            borderRightWidth: 1,
            borderColor: '#98D7DA',
            borderRightStyle: 'solid',
            borderSpacing: 0,
            paddingTop: 26,
            paddingBottom: 27,
            textAlign: 'left',
            backgroundColor: odd ? '#F8F8F8' : '#FFF',
            ...style,
        }}>
        {children}
    </td>
);

const Row = ({ children, style, dataArr, odd, borderLess }) => (
    <tr>
        {dataArr.map((value, index) => {
            if (index === 0)
                return (
                    <Cell
                        key={index}
                        odd={odd}
                        borderLess={borderLess}
                        style={{
                            paddingLeft: index === 0 ? 20 : 16,
                            paddingRight: 12,
                            borderRightWidth:
                                index === dataArr.length - 1 ? 0 : 1,
                        }}>
                        <Link
                            to={{
                                pathname: `/customers/${value}`,
                                data: {},
                            }}>
                            {value}
                        </Link>
                    </Cell>
                );
            else
                return (
                    <Cell
                        key={index}
                        odd={odd}
                        style={{
                            paddingLeft: index === 0 ? 20 : 16,
                            paddingRight: 12,
                            borderRightWidth:
                                index === dataArr.length - 1 ? 0 : 1,
                        }}>
                        {value}
                    </Cell>
                );
        })}
    </tr>
);

const CustomerRow = ({ children, customer, odd }) => (
    <tr>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 20,
                paddingRight: 12,
                borderRightWidth: 1,
            }}>
            <Link
                to={{
                    pathname: `/search-results/${customer.MdmNumber}`,
                    state: customer,
                }}>
                {customer.MdmNumber}
            </Link>
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.Name1 || customer.Name}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.Street}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.City}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.State}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.Zip}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.Country}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
                borderRightWidth: 0,
            }}>
            {customer.DUNSNumber}
        </Cell>
    </tr>
);

const workFlowStatus = ['Draft', 'In Progress', 'Rejected', 'Approved'];
const workFlowTypes = ['Create', 'Extend', 'Update', 'Block'];

const WorkFlowRow = ({ children, workflow: customer, odd }) => {
    const d = new Date(customer.CreatedDate);
    let createdAt = '';

    if (d.getTime() > 0) {
        const dtf = new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
        const [
            { value: mo },
            ,
            { value: da },
            ,
            { value: ye },
        ] = dtf.formatToParts(d);

        createdAt = `${mo} ${da}, ${ye}`;
    }

    return (
        <tr>
            <Cell
                odd={odd}
                style={{
                    paddingLeft: 20,
                    paddingRight: 12,
                    borderRightWidth: 1,
                }}>
                <Link
                    to={{
                        pathname: `/my-requests/${customer.WorkflowId}`,
                        state: customer,
                    }}>
                    {customer.WorkflowId}
                </Link>
            </Cell>
            <Cell
                odd={odd}
                style={{
                    paddingLeft: 16,
                    paddingRight: 12,
                }}>
                {customer.WorkflowType}
            </Cell>
            <Cell
                style={{
                    paddingLeft: 16,
                    paddingRight: 12,
                }}>
                {customer.Title}
            </Cell>
            <Cell
                odd={odd}
                style={{
                    paddingLeft: 16,
                    paddingRight: 12,
                }}>
                {customer.Name1}
            </Cell>
            <Cell
                style={{
                    paddingLeft: 16,
                    paddingRight: 12,
                }}>
                {createdAt}
            </Cell>
            <Cell
                odd={odd}
                style={{
                    paddingLeft: 16,
                    paddingRight: 12,
                    borderRightWidth: 0,
                }}>
                {customer.WorkflowStatusType}
            </Cell>
        </tr>
    );
};

class ResultsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customers: this.props.location.state.Customers,
            workflows: this.props.location.state.Workflows,
            workfowTotal: this.props.location.state.WorkflowSearchHits,
            customerTotal: this.props.location.state.CustomerMasterSearchHits,
            current_page: 1,
            searchType: this.props.location.state.CustomerSearchType,
            WorkflowId: this.props.location.state.WorkflowId,
            MdmNumber: this.props.location.state.MdmNumber,
            Name: this.props.location.state.Name,
            Street: this.props.location.state.Street,
            City: this.props.location.state.City,
            State: this.props.location.state.State,
            Zip: this.props.location.state.Zip,
            Country: this.props.location.state.Country,
            DUNSNumber: this.props.location.state.DUNSNumber,
            TaxIDOrVATRegNumber: this.props.location.state.TaxIDOrVATRegNumber,
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }
    componentWillReceiveProps(newProps) {
        if (newProps.customerdata != this.props.customerdata) {
            this.setState({ customers: newProps.customerdata });
        }
        if (newProps.searchResult != this.props.searchResult) {
            this.setState({ searchResult: newProps.searchResult });
        }
    }

    makeHttpRequestWithPage = (pagenumber) => {
        //set current page number & start from pointer
        const userId = localStorage.getItem('userId');
        let from_size = 0,
            to_size = 10;
        this.setState({
            current_page: pagenumber,
        });

        if (pagenumber != 1) {
            from_size = pagenumber * 10 - 9;
        }

        var postdata = {
            customerSearchType: this.state.CustomerSearchType,
            CustomerMasterSearchHits: {
                from: 0,
                size: 0,
            },
            WorkflowSearchHits: {
                from: from_size,
                size: 10,
            },
            userId: userId,
            workflowid: this.state.WorkflowId,
            mdmNumber: this.state.MdmNumber,
            name: this.state.Name,
            street: this.state.Street,
            city: this.state.City,
            state: this.state.State,
            zip: this.state.Zip,
            country: this.state.Country,
            dunsNumber: this.state.DUNSNumber,
            taxIDOrVATRegNumber: this.state.TaxIDOrVATRegNumber,
        };
        console.log(this.state.CustomerSearchType);
        // if (this.state.CustomerSearchType === 1) {
        //     this.props.searchCustomer(postdata);
        // } else {
        this.props.advanceSearchCustomer(postdata, this.props.history);
        // }
    };

    moveNext = () => {
        let lastPageNumber = Math.ceil(this.state.total / 10);
        this.setState(
            {
                current_page: this.state.current_page + 1,
            },
            () => {
                if (this.state.current_page <= lastPageNumber) {
                    this.makeHttpRequestWithPage(this.state.current_page);
                }
            }
        );
    };
    movePrev = () => {
        this.setState(
            {
                current_page: this.state.current_page - 1,
            },
            () => {
                if (this.state.current_page >= 1) {
                    this.makeHttpRequestWithPage(this.state.current_page);
                }
            }
        );
    };

    render() {
        const { width, height, marginBottom, location } = this.props;
        const { customers, workflows } = this.state;
        const data = workflows;
        let renderPageNumbers;
        const { mdmSearchResults, workflowSearchResults } = this.state;
        let totalpageCnt = Math.ceil(this.state.total / 10);

        if (this.state.workflowTotal !== null) {
            const pageNumbers = [];
            for (let i = 1; i <= totalpageCnt; i++) {
                pageNumbers.push(i);
            }
            renderPageNumbers = pageNumbers.map((number) => {
                let classes =
                    this.state.current_page === number ? 'active' : '';

                if (
                    number == 1 ||
                    number == this.state.workflowTotal ||
                    (number >= this.state.current_page - 2 &&
                        number <= this.state.current_page + 2)
                ) {
                    return (
                        <span
                            key={number}
                            className={classes}
                            onClick={() =>
                                this.makeHttpRequestWithPage(number)
                            }>
                            {number}
                        </span>
                    );
                }
            });
        }

        console.log(this.props);

        if (!data)
            return (
                <View
                    style={{
                        flex: 1,
                        flexBasis: 'auto',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 650,
                    }}>
                    <ActivityIndicator />
                </View>
            );

        let selectedIndex;

        if (customers.length > 0 || this.state.searchType === 2) {
            selectedIndex = 0;
        } else if (data.length > 0 || this.state.searchType === 1) {
            selectedIndex = 1;
        } else {
            selectedIndex = 0;
        }

        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#fff',
                    paddingTop: 40,
                    paddingBottom: 75,
                }}>
                <Box display="flex" flex="1">
                    {data.length <= 0 && customers.length <= 0 && (
                        <FlashMessage
                            animate
                            bg={{ backgroundColor: '#f39c12' }}
                            message={'No Results'}
                        />
                    )}
                </Box>
                <View
                    style={{
                        flex: 1,
                        marginTop: 75,
                        paddingHorizontal: width < 1400 ? 100 : width * 0.1,
                        paddingBottom: 5,
                    }}>
                    <Tabs selectedIndex={selectedIndex}>
                        <View
                            label="MDM"
                            style={{
                                maxWidth: 160,
                            }}>
                            <table
                                style={{
                                    zIndex: 0,
                                    borderWidth: 1.75,
                                    borderColor: '#234382',
                                    borderStyle: 'solid',
                                    borderSpacing: 0,
                                }}>
                                <thead
                                    style={{
                                        borderSpacing: 0,
                                    }}>
                                    <tr
                                        style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#ddd',
                                            borderSpacing: 0,
                                            color: '#234385',
                                            backgroundColor: '#E6F5FA',
                                        }}>
                                        <HeadCell
                                            style={{
                                                paddingLeft: 20,
                                                width: 120,
                                            }}>
                                            MDM Number
                                        </HeadCell>
                                        <HeadCell>Name</HeadCell>
                                        <HeadCell>Street</HeadCell>
                                        <HeadCell>City</HeadCell>
                                        <HeadCell>State</HeadCell>
                                        <HeadCell>Zip</HeadCell>
                                        <HeadCell>Country</HeadCell>
                                        <HeadCell
                                            style={{ borderRightWidth: 0 }}>
                                            DUNS Number
                                        </HeadCell>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer) => {
                                        return (
                                            <CustomerRow
                                                key={customer.MdmCustomerNumber}
                                                customer={customer}
                                                odd
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                        </View>
                        <View label="Workflow">
                            <table
                                style={{
                                    zIndex: 0,
                                    borderWidth: 1.75,
                                    borderColor: '#234382',
                                    borderStyle: 'solid',
                                    borderSpacing: 0,
                                }}>
                                <thead
                                    style={{
                                        borderSpacing: 0,
                                    }}>
                                    <tr
                                        style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#ddd',
                                            borderCollapse: 'collapse',
                                            borderSpacing: 0,
                                            color: '#234385',
                                            backgroundColor: '#E6F5FA',
                                        }}>
                                        <HeadCell
                                            style={{
                                                paddingLeft: 20,
                                                width: 120,
                                            }}>
                                            Workflow Number
                                        </HeadCell>
                                        <HeadCell>Type</HeadCell>
                                        <HeadCell>Title</HeadCell>
                                        <HeadCell>Customer Name</HeadCell>
                                        <HeadCell>Date of Creation</HeadCell>
                                        <HeadCell
                                            style={{
                                                borderRightWidth: 0,
                                            }}>
                                            Status
                                        </HeadCell>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((workflow) => (
                                        <WorkFlowRow
                                            key={workflow.WorkflowId}
                                            workflow={workflow}
                                        />
                                    ))}
                                </tbody>
                            </table>

                            <View className="pagination">
                                <span onClick={() => this.movePrev()}>
                                    &laquo;
                                </span>
                                {renderPageNumbers}
                                <span onClick={() => this.moveNext()}>
                                    &raquo;
                                </span>
                            </View>
                        </View>
                    </Tabs>

                    <Flex
                        justifyEnd
                        alignCenter
                        style={{
                            paddingTop: 70,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 15,
                            marginTop: 20,
                            marginBottom: 10,
                            marginHorizontal: 25,
                        }}>
                        <Button
                            onPress={() =>
                                this.props.history.push(
                                    '/search-results/create-customer'
                                )
                            }
                            title="Create New"
                        />
                    </Flex>
                </View>
            </ScrollView>
        );
    }
}

class Default extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        const props = this.props;

        return (
            <DimensionAware
                render={(dimensions) => (
                    <ResultsPage
                        {...{
                            ...props,
                            width: getWindowWidth(dimensions),
                            height: getWindowHeight(dimensions),
                            marginBottom: 25,
                        }}
                    />
                )}
            />
        );
    }
}

const mapStateToProps = ({ customer }) => {
    const { searchResult, customerdata, fetching } = customer;
    return { searchResult, customerdata, fetching };
};

export default connect(mapStateToProps, {
    searchCustomer,
    advanceSearchCustomer,
})(Default);
