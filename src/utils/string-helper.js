const getUserDescription = (mobileDevice) => {
    if(mobileDevice && mobileDevice.extendedUserInfo) {
        return !mobileDevice.extendedUserInfo
            ? mobileDevice.email
            : `${ mobileDevice.extendedUserInfo.firstName } ${ mobileDevice.extendedUserInfo.lastName }`;
    }
    return null;
};

export  { getUserDescription };
