export const pauseSync = (callback, milliseconds) => {
    const now = new Date();
    while (new Date() - now <= milliseconds)
    callback();
};
