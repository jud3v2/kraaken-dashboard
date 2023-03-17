import {atom} from 'recoil';

export const user = atom({
    key: 'user',
    default: {}
});

export const userState = atom({
    key: 'userState',
    default: {
        isConnected: false
    }
});

export default user