export const WorkflowType= {1:'CreateSoldToSapApollo',
2:'CreateShipToSapApollo',
3:'CreateBillToSapApollo',
4:'CreatePayerSapApollo',
5:'CreateSalesRepSapApollo',
6:'CreateDropShipSapApollo',
7:'CreateSoldToSapOlympus',
8:'CreateShipToSapOlympus',
9:'CreateBillToSapOlympus',
10:'CreatePayerSapOlympus',
11:'CreateSalesRepSapOlympus',
12:'CreateSoldToPointman',
13:'CreateShipToPointman',
14:'CreateSalesRepPointman',
15:'CreateSoldToMade2Manage',
16:'CreateShipToMade2Manage',
17:'CreateSalesRepMade2Manage',
18:'CreateSoldToJDEdwards',
19:'CreateShipToJDEdwards',
20:'CreateSalesRepJDEdwards',
21:'UpdateSapApollo',
22:'ExtendToSalesOrgSapApollo',
23:'BlockSapApollo',
24:'ExtendToSystemSapApollo',
25:'PartnerSapApollo',
27:'WithdrawSapApollo'
}

export const WorkflowStateType = {1:'New',
2:'InProgress',
3:'Completed',
4:'Withdrawn',
5:'Rejected'
}

export const WorkflowTaskType= {1:'ApproveSoldTo',
2:'UnblockSoldTo',
3:'ApproveShipTo',
4:'ApproveBillTo',
5:'ApprovePayer'
}

export const WorkflowTaskStateType = {1:'New',
2:'ReadyForProcessing',
3:'InProcess',
4:'Approved',
5:'Rejected'
}

export const WorkflowTeamType={1:'CustomerServiceSales',
2:'GlobalTrade',
3:'CustomerMaster',
4:'Credit',
5:'Contracts',
6:'SalesOperations',
7:'CustomerServiceOperations',
8:'Pricing',
9:'Tax'
}
