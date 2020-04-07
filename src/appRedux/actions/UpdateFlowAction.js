import {
    GET_MDM_MAPPING_MATRIX,
    SAVE_APOLLO_UPDATE_CONTRACTS,
    SAVE_APOLLO_UPDATE_CREDIT,
    SAVE_APOLLO_UPDATE_PRICING,
    SAVE_APOLLO_UPDATE_GLOBALTRADE,
    SET_MDM_MAPPING_MATRIX,
    UPDATE_DELTAS,
    UPDATE_DELTAS_STATUS,
} from '../../constants/ActionTypes';

export const getMdmMappingMatrix = (id) => {
    return {
        type: GET_MDM_MAPPING_MATRIX,
        payload: id,
    };
};

export const setMdmMappingMatrix = (data) => {
    return {
        type: SET_MDM_MAPPING_MATRIX,
        payload: data,
    };
};

export const updateDeltas = (data) => {
    return {
        type: UPDATE_DELTAS,
        payload: data,
    };
};

export const updateDeltasStatus = (data) => {
    return {
        type: UPDATE_DELTAS_STATUS,
        payload: data,
    };
};

export const saveApolloUpdateUpdateMyTaskContracts = (data) => {
    return {
        type: SAVE_APOLLO_UPDATE_CONTRACTS,
        payload: data,
    };
};
export const saveApolloUpdateMyTaskCredit = (data) => {
    return {
        type: SAVE_APOLLO_UPDATE_CREDIT,
        payload: data,
    };
};
export const saveApolloUpdateMyTaskPricing = (data) => {
    return {
        type: SAVE_APOLLO_UPDATE_PRICING,
        payload: data,
    };
};
export const saveApolloUpdateMyTaskGlobalTrade = (data) => {
    return {
        type: SAVE_APOLLO_UPDATE_GLOBALTRADE,
        payload: data,
    };
};
