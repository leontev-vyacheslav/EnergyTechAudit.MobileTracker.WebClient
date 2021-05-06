const getUserDescription = (mobileDevice) => {
    if(mobileDevice) {
        return !mobileDevice.extendedUserInfo
            ? mobileDevice.email
            : `${ mobileDevice.extendedUserInfo.firstName } ${ mobileDevice.extendedUserInfo.lastName }`;
    }
    return null;
};

const getUserDeviceDescription = (mobileDevice) => {
    if(mobileDevice && mobileDevice.extendedUserInfo) {
        return !mobileDevice.extendedUserInfo
            ? mobileDevice.email
            : `${ mobileDevice.extendedUserInfo.firstName } ${ mobileDevice.extendedUserInfo.lastName } / ${ mobileDevice.model }`;
    }
    return null;
};

export  { getUserDescription, getUserDeviceDescription };
