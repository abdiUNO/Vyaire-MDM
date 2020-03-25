import { Colors } from '../theme';

export const TaskType = {
    1: 'SapApollo | Create Customer | Role: Sold To ',
    2: 'SapApollo | Create Customer | Role: Ship To ',
    3: 'SapApollo | Create Customer | Role: Bill To ',
    4: 'SapApollo | Create Customer | Role: Payer',
    5: 'SapApollo | Create | Role: Sales Rep',
    6: 'SapApollo | Create | Role:DropShip',
    7: 'SapOlympus | Create | Role: Sold To',
    8: 'SapOlympus | Create | Role: Ship To',
    9: 'SapOlympus | Create | Role: Bill To',
    10: 'SapOlympus | Create | Role: Payer',
    11: 'SapOlympus | Create | Role: Sales Rep',
    12: 'Create SoldTo Pointman',
    13: 'Create ShipTo Pointman',
    14: 'Create SalesRepPointman',
    15: 'Create SoldTo Made2Manage',
    16: 'Create ShipTo Made2Manage',
    17: 'Create SalesRepMade2Manage',
    18: 'Create SoldTo JDEdwards',
    19: 'Create ShipTo JDEdwards',
    20: 'Create SalesRepJDEdwards',
    21: 'SapApollo | Update Customer',
    22: 'SapApollo | Extend To SalesOrg',
    23: 'SapApollo | Block',
    24: 'SapApollo | Extend To System',
    25: 'SapApollo | Partner',
    27: 'SapApollo | Withdraw',
};

export const WorkflowType = {
    1: 'CreateSoldToSapApollo',
    2: 'CreateShipToSapApollo',
    3: 'CreateBillToSapApollo',
    4: 'CreatePayerSapApollo',
    5: 'CreateSalesRepSapApollo',
    6: 'CreateDropShipSapApollo',
    7: 'CreateSoldToSapOlympus',
    8: 'CreateShipToSapOlympus',
    9: 'CreateBillToSapOlympus',
    10: 'CreatePayerSapOlympus',
    11: 'CreateSalesRepSapOlympus',
    12: 'CreateSoldToPointman',
    13: 'CreateShipToPointman',
    14: 'CreateSalesRepPointman',
    15: 'CreateSoldToMade2Manage',
    16: 'CreateShipToMade2Manage',
    17: 'CreateSalesRepMade2Manage',
    18: 'CreateSoldToJDEdwards',
    19: 'CreateShipToJDEdwards',
    20: 'CreateSalesRepJDEdwards',
    21: 'UpdateSapApollo',
    22: 'ExtendToSalesOrgSapApollo',
    23: 'BlockSapApollo',
    24: 'ExtendToSystemSapApollo',
    25: 'PartnerSapApollo',
    27: 'WithdrawSapApollo',
};

export const TypeToSystem = {
    1: 'SAP Apollo',
    2: 'SAP Apollo',
    3: 'SAP Apollo',
    4: 'SAP Apollo',
    5: 'SAP Apollo',
    6: 'SAP Apollo',
};

export const WorkflowStateType = {
    1: 'New',
    2: 'InProgress',
    3: 'Completed',
    4: 'Withdrawn',
    5: 'Rejected',
};

export const WorkflowTaskType = {
    1: 'ApproveSoldTo',
    2: 'UnblockSoldTo',
    3: 'ApproveShipTo',
    4: 'ApproveBillTo',
    5: 'ApprovePayer',
};

export const WorkflowTaskStateType = {
    1: 'New',
    2: 'ReadyForProcessing',
    3: 'InProcess',
    4: 'Approved',
    5: 'Rejected',
};

export const ColorCodeWorkFlowTaskStateType = {
    0: Colors.lightGrey,
    1: Colors.lightYellow,
    2: Colors.lightYellow,
    3: Colors.lightYellow,
    4: Colors.lightGreen,
    5: Colors.lightRed,
};

export const AliasWorkflowTeamType = {
    1: 'Cust Service Sales',
    2: 'Global Trade',
    3: 'Customer Master',
    4: 'Credit',
    5: 'Contracts',
    6: 'Sales Op',
    7: 'Customer Service Op',
    8: 'Pricing',
    9: 'Tax',
};

export const WorkflowTeamType = {
    1: 'CustomerServiceSales',
    2: 'GlobalTrade',
    3: 'CustomerMaster',
    4: 'Credit',
    5: 'Contracts',
    6: 'SalesOperations',
    7: 'CustomerServiceOperations',
    8: 'Pricing',
    9: 'Tax',
};

export const WorkflowTeamTypeRouteAddress = {
    1: '#',
    2: '/my-tasks/global-trade',
    3: '/my-tasks/customer-master',
    4: '/my-tasks/credit-form',
    5: '/my-tasks/contracts',
    6: '#',
    7: '#',
    8: '/my-tasks/pricing',
    9: '#',
};

export const RoleType = {
    1: 'SAP Apollo: Sold To (0001)',
    2: 'SAP Apollo: Ship To (0001)',
    3: 'SAP Apollo: Payer (0003)',
    4: 'SAP Apollo: Bill To (0004)',
    5: 'SAP Apollo: Sales Rep (0001)',
    6: 'SAP Apollo: Drop Ship (0001)',
    7: 'SAP Olympus: Sold To',
    8: 'SAP Olympus: Ship To',
    9: 'SAP Olympus: Payer',
    10: 'SAP Olympus: Bill To',
    11: 'SAP Olympus: Sales Rep',
    12: 'Pointman: Sold To',
    13: 'Pointman: Ship To',
    14: 'Pointman: Sales Rep',
    15: 'Made2Manage: Sold To',
    16: 'Made2Manage: Ship To',
    17: 'Made2Manage: Sales Rep',
    18: 'JD Edwards: Sold To',
    19: 'JD Edwards: Ship To',
    20: 'JD Edwards: Sales Rep',
};

export const SalesOrgType = { 1: '0120', 2: '0130', 3: '0150' };

export const SystemType = {
    1: 'SAP Apollo',
    2: 'SAP Olympus',
    3: 'Pointman',
    4: 'Made2Manage',
    5: 'JD Edwards',
    6: 'Salesforce',
};

export const DistributionChannelType = {
    1: '10',
};
export const DivisionType = { 1: '99' };

export const CompanyCodeType = { 1: '0120', 2: '0150' };

export const CategoryTypes = [
    'Distributor',
    'Self-Distributor',
    'OEM',
    'Kitter',
    'Direct',
    'Drop Ship',
    'Other',
];

export const CategoryTypesById = {
    Distributor: 0,
    'Self-Distributor': 1,
    OEM: 2,
    Kitter: 3,
    Direct: 4,
    'Drop Ship': 5,
    Other: 6,
};
