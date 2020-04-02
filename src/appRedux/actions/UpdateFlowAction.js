import {
    GET_MDM_MAPPING_MATRIX,
    SET_MDM_MAPPING_MATRIX,
    UPDATE_DELTAS,
    UPDATE_DELTAS_STATUS
} from '../../constants/ActionTypes';

export const getMdmMappingMatrix = id => {
    return {
        type: GET_MDM_MAPPING_MATRIX,
        payload: id,
    };
};

export const setMdmMappingMatrix = data => {
    return {
        type: SET_MDM_MAPPING_MATRIX,
        payload: data,
    };
};

export const updateDeltas = data => {
    return {
        type: UPDATE_DELTAS,
        payload: data,
    };
}

export const updateDeltasStatus = (data) => {
    return {
        type: UPDATE_DELTAS_STATUS,
        payload:data
    };
}