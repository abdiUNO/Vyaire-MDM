export const fetchWorkFlow = () => {
    return new Promise((resolve, reject) =>
        resolve({
            WorkflowCustomerSearchResults: [
                {
                    WorkflowId: 'wf0098379',
                    WorkflowType: 1,
                    WorkflowTitle: 'My Workflow',
                    CustomerName: 'Cardinal Health',
                    WorkflowDateCreated: '2020-01-13T21:00:26.724359-06:00',
                    WorkflowStatusType: 1,
                },
                {
                    WorkflowId: 'wf234243',
                    WorkflowType: 2,
                    WorkflowTitle: 'My Workflow 2',
                    CustomerName: 'Cardinal Health 2',
                    WorkflowDateCreated: '2020-01-13T21:00:26.7415697-06:00',
                    WorkflowStatusType: 2,
                },
            ],
        })
    );
};
