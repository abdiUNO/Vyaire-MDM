import { Platform, Linking, AsyncStorage } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import { url } from 'inspector';

const url = '';

let REGION = 'us-east-2',
    IDENTITY_POOL_ID = 'us-east-2:105b1b52-87f9-4099-b0bf-9a98ef44af57',
    OAUTH_DOMAIN = 'customermasterdev.auth.us-east-2.amazoncognito.com',
    USER_POOL_ID = 'us-east-2_ax2pnsoSr',
    CLIENT_ID = '2n59mltfuroiljel49pjounmtd',
    SIGNIN_CALLBACK = 'https://d3uhve580i3kde.cloudfront.net/',
    SIGNOUT_CALLBACK = 'https://d3uhve580i3kde.cloudfront.net/signout';

// if (Platform.OS !== 'web') {

if (__DEV__) {
    SIGNIN_CALLBACK = 'http://localhost:19006/';
    SIGNOUT_CALLBACK = 'http://localhost:19006/signout';
}

// }

let SIGNIN_CALLBACK_URL = SIGNIN_CALLBACK;
let SIGNOUT_CALLBACK_URL = SIGNOUT_CALLBACK;

const urlOpener = async (url, redirectUrl) => {
    // On Expo, use WebBrowser.openAuthSessionAsync to open the Hosted UI pages.
    // const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(
    //     url,
    //     redirectUrl
    // );

    if (type === 'success') {
        // await WebBrowser.dismissBrowser();

        if (Platform.OS === 'ios') {
            // return Linking.openURL(newUrl);
        }
    }
};

const MEMORY_KEY_PREFIX = '@MyStorage:';
let dataMemory = {};

/** @class */
class MemoryStorage {
    static syncPromise = null;

    /**
     * This is used to set a specific item in storage
     */
    static setItem(key, value) {
        AsyncStorage.setItem(MEMORY_KEY_PREFIX + key, value);
        dataMemory[key] = value;
        return dataMemory[key];
    }

    /**
     * This is used to get a specific key from storage
     */
    static getItem(key) {
        return Object.prototype.hasOwnProperty.call(dataMemory, key)
            ? dataMemory[key]
            : undefined;
    }

    /**
     * This is used to remove an item from storage
     */
    static removeItem(key) {
        AsyncStorage.removeItem(MEMORY_KEY_PREFIX + key);
        return delete dataMemory[key];
    }

    /**
     * This is used to clear the storage
     */
    static clear() {
        dataMemory = {};
        return dataMemory;
    }

    /**
     * Will sync the MemoryStorage data from AsyncStorage to storageWindow MemoryStorage
     */
    static sync() {
        if (!MemoryStorage.syncPromise) {
            MemoryStorage.syncPromise = new Promise((res, rej) => {
                AsyncStorage.getAllKeys((errKeys, keys) => {
                    if (errKeys) rej(errKeys);
                    const memoryKeys = keys.filter(key =>
                        key.startsWith(MEMORY_KEY_PREFIX)
                    );
                    AsyncStorage.multiGet(memoryKeys, (err, stores) => {
                        if (err) rej(err);
                        stores.map((result, index, store) => {
                            const key = store[index][0];
                            const value = store[index][1];
                            const memoryKey = key.replace(
                                MEMORY_KEY_PREFIX,
                                ''
                            );
                            dataMemory[memoryKey] = value;
                        });
                        res();
                    });
                });
            });
        }
        return MemoryStorage.syncPromise;
    }
}

export default {
    Auth: {
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: IDENTITY_POOL_ID,

        // REQUIRED - Amazon Cognito Region
        region: REGION,

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region
        // Required only if it's different from Amazon Cognito Region
        identityPoolRegion: REGION,

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: USER_POOL_ID,

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: CLIENT_ID,

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: true,

        storage: MemoryStorage,

        oauth: {
            domain: OAUTH_DOMAIN,
            scope: [
                'phone',
                'email',
                'profile',
                'openid',
                'aws.cognito.signin.user.admin',
            ],
            urlOpener: Platform.OS === 'web' ? null : urlOpener,
            redirectSignIn: SIGNIN_CALLBACK_URL,
            redirectSignOut: SIGNOUT_CALLBACK_URL,
            responseType: 'token', // or 'token', note that REFRESH token will only be generated when the responseType is code
        },
    },
};
