import {
    GET_MDM_MAPPING_MATRIX,
    SET_MDM_MAPPING_MATRIX,
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

