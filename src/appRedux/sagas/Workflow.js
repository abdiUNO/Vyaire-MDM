import { all, call, takeLatest, fork, put } from 'redux-saga/effects';
import axios from 'axios';
import { getWorkflowsSuccess } from '../../appRedux/actions/Workflow.js';

import { GET_WORKFLOW } from '../../constants/ActionTypes';

export function* getWorkflows(action) {
    const url =
        'https://cors-anywhere.herokuapp.com/https://33p9kiusdk.execute-api.us-east-2.amazonaws.com/dev';
    try {
        // const fetchWorkFlows = () =>
        //     axios.post(url, {
        //         WorkflowFilterTask: {
        //             WorkflowTaskOperation: 0,
        //             RequestorUserId: 'customerservice.user',
        //         },
        //     });

        // const res = yield call(fetchWorkFlows);

        const res = {
            OperationName: 'GetUserTasks',
            IsSuccess: true,
            OperationResultMessages: [
                {
                    Message:
                        'The following Global Workflow Records cannot be found: wf000000380008314Z.',
                    OperationalResultType: 2,
                },
                {
                    Message:
                        'The following Workflow Records cannot be found: wf001,wf000000380008314Z.',
                    OperationalResultType: 2,
                },
            ],
            ResultData: [
                {
                    RequestorUserId: 'customerservice.user',
                    RequestorId: 0,
                    WorkflowType: 0,
                    WorkflowStateType: 0,
                    WorkflowId: 'wf001',
                    WorkflowCreatedDateTime: '0001-01-01T00:00:00',
                    WorkflowOperation: null,
                    WorkflowTasks: [
                        {
                            WorkflowTaskType: 1,
                            WorkflowTaskStateType: 3,
                            WorkflowTeamType: 1,
                            WorkflowTaskContextType: 1,
                            WorkTaskflowOperation: 3,
                            WorkflowTaskNote: null,
                            TaskId: 1,
                            WorkflowId: 'wf001',
                        },
                    ],
                    WorkflowCustomerGlobalModel: {
                        Id: 157,
                        WorkflowId: 'wf001',
                        MdmCustomerId: null,
                        SystemRecordId: null,
                        Title: 'new title',
                        Name1: 'new name1',
                        Name2: null,
                        Name3: null,
                        Name4: null,
                        Street: 'Street',
                        Street2: null,
                        City: '',
                        Region: '',
                        PostalCode: '',
                        Country: '',
                        VatRegNo: null,
                        Telephone: null,
                        Fax: null,
                        Email: null,
                        TaxNumber: null,
                        DunsNumber: null,
                        NaicsCode: null,
                        SicCode4: null,
                        SicCode6: null,
                        SicCode8: null,
                        Purpose: null,
                        CategoryTypeId: 1,
                        SoldToNumber: null,
                        RoleTypeId: null,
                        SalesOrgTypeId: null,
                        SystemTypeId: 1,
                        EffectiveDate: '2020-01-01T00:00:00',
                        CreatedOn: '2020-02-03T11:52:00Z',
                        ModifiedOn: '2020-02-14T11:47:39Z',
                    },
                    Role: null,
                    SystemName: 'SAP Apollo',
                },
                {
                    RequestorUserId: 'customerservice.user',
                    RequestorId: 4,
                    WorkflowType: 1,
                    WorkflowStateType: 3,
                    WorkflowId: 'wf000000380008314',
                    WorkflowCreatedDateTime: '2020-02-07T21:07:31Z',
                    WorkflowOperation: null,
                    WorkflowTasks: [
                        {
                            WorkflowTaskType: 1,
                            WorkflowTaskStateType: 4,
                            WorkflowTeamType: 1,
                            WorkflowTaskContextType: 1,
                            WorkTaskflowOperation: 3,
                            WorkflowTaskNote: null,
                            TaskId: 2,
                            WorkflowId: 'wf000000380008314',
                        },
                        {
                            WorkflowTaskType: 2,
                            WorkflowTaskStateType: 4,
                            WorkflowTeamType: 1,
                            WorkflowTaskContextType: 1,
                            WorkTaskflowOperation: 3,
                            WorkflowTaskNote: null,
                            TaskId: 54,
                            WorkflowId: 'wf000000380008314',
                        },
                    ],
                    WorkflowCustomerGlobalModel: {
                        Id: 68,
                        WorkflowId: 'wf000000380008314',
                        MdmCustomerId: null,
                        SystemRecordId: null,
                        Title: '11My Title',
                        Name1: '11FirstName LastName11',
                        Name2: null,
                        Name3: null,
                        Name4: null,
                        Street: '123 test11',
                        Street2: null,
                        City: 'City11',
                        Region: '11Region',
                        PostalCode: '90210',
                        Country: 'USA',
                        VatRegNo: '123test',
                        Telephone: '7737772244',
                        Fax: null,
                        Email: null,
                        TaxNumber: null,
                        DunsNumber: '123411',
                        NaicsCode: null,
                        SicCode4: null,
                        SicCode6: null,
                        SicCode8: null,
                        Purpose: null,
                        CategoryTypeId: 1,
                        SoldToNumber: null,
                        RoleTypeId: 1,
                        SalesOrgTypeId: 1,
                        SystemTypeId: 1,
                        EffectiveDate: '2020-01-28T20:39:40',
                        CreatedOn: '2020-01-29T02:39:41Z',
                        ModifiedOn: '2020-01-29T02:39:41Z',
                    },
                    Role: 'SAP Apollo: Sold To (0001)',
                    SystemName: 'SAP Apollo',
                },
                {
                    RequestorUserId: 'customerservice.user',
                    RequestorId: 0,
                    WorkflowType: 0,
                    WorkflowStateType: 0,
                    WorkflowId: 'wf000000380008314Z',
                    WorkflowCreatedDateTime: '0001-01-01T00:00:00',
                    WorkflowOperation: null,
                    WorkflowTasks: [
                        {
                            WorkflowTaskType: 1,
                            WorkflowTaskStateType: 4,
                            WorkflowTeamType: 1,
                            WorkflowTaskContextType: 1,
                            WorkTaskflowOperation: 3,
                            WorkflowTaskNote: null,
                            TaskId: 13,
                            WorkflowId: 'wf000000380008314Z',
                        },
                        {
                            WorkflowTaskType: 1,
                            WorkflowTaskStateType: 4,
                            WorkflowTeamType: 1,
                            WorkflowTaskContextType: 1,
                            WorkTaskflowOperation: 3,
                            WorkflowTaskNote: null,
                            TaskId: 21,
                            WorkflowId: 'wf000000380008314Z',
                        },
                        {
                            WorkflowTaskType: 1,
                            WorkflowTaskStateType: 4,
                            WorkflowTeamType: 1,
                            WorkflowTaskContextType: 1,
                            WorkTaskflowOperation: 3,
                            WorkflowTaskNote: null,
                            TaskId: 38,
                            WorkflowId: 'wf000000380008314Z',
                        },
                    ],
                    WorkflowCustomerGlobalModel: null,
                    Role: null,
                    SystemName: null,
                },
            ],
        };

        console.log(res);

        yield put(getWorkflowsSuccess(res));
    } catch (error) {
        // yield put(showMessage(error));
    }
}

const workflowSagas = function* rootSaga() {
    yield all([takeLatest(GET_WORKFLOW, getWorkflows)]);
};
export default workflowSagas;
