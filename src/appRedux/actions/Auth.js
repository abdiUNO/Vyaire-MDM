import {
    LOGGED_IN_STATUS_CHANGED,
    SET_CURRENT_USER,
    AUTH_USER,
    AUTH_USER_SUCCESS,
    AUTH_USER_FAILED,
} from '../../constants/ActionTypes';

function GetIEVersion() {
    // if (Platform.OS !== 'web') return 0;

    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf('MSIE');

    // If IE, return version number.
    if (Idx > 0)
        return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf('.', Idx)));
    // If IE 11 then look for Updated user agent string.
    else if (!!navigator.userAgent.match(/Trident\/7\./)) return 11;
    else return 0; //It is not IE
}

export const authUser = () => {
    return {
        type: AUTH_USER,
    };
};

export const handleSignOut = () => {
    return {
        type: AUTH_USER,
    };
};

const capitalize = s => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const authUserSuccess = user => {
    const userAttributes = user.attributes;
    const fullName = userAttributes.email.slice(0, -11).split('.');
    const username = capitalize(fullName[0]) + ' ' + capitalize(fullName[1]);
    const userId= fullName[0].toLowerCase() + '.' + fullName[1].toLowerCase();
    localStorage.setItem('userId',userId)
    const userData = {
        ...user,
        username,
        userId
    };

    return { type: AUTH_USER_SUCCESS, user: userData };
};

export const authUserFail = error => {
    return {
        type: AUTH_USER_FAILED,
        error,
    };
};
