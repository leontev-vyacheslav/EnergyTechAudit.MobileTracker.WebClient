import { MobileDeviceModel } from '../models/mobile-device';

const getUserDescription = (mobileDevice: MobileDeviceModel) => {
    if(mobileDevice) {
        return !mobileDevice.extendedUserInfo
            ? mobileDevice.email
            : `${ mobileDevice.extendedUserInfo.firstName } ${ mobileDevice.extendedUserInfo.lastName }`;
    }
    return null;
};

const getUserDeviceDescription = (mobileDevice: MobileDeviceModel) => {
    if(mobileDevice && mobileDevice.extendedUserInfo) {
        return !mobileDevice.extendedUserInfo
            ? mobileDevice.email
            : `${ mobileDevice.extendedUserInfo.firstName } ${ mobileDevice.extendedUserInfo.lastName } / ${ mobileDevice.model }`;
    }
    return null;
};

export  { getUserDescription, getUserDeviceDescription };
