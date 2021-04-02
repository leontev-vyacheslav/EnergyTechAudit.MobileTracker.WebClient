import saveAs from 'file-saver';

const excelSaver = ({ workbook, mobileDevice, workDate, title }) => {
    const formattedDate = new Date(workDate)
        .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    const userCaption = !mobileDevice.extendedUserInfo
        ? mobileDevice.email
        : `${ mobileDevice.extendedUserInfo.firstName } ${ mobileDevice.extendedUserInfo.lastName }`;

    workbook.xlsx.writeBuffer()
        .then(buffer => {
            saveAs(
                new Blob([buffer], { type: 'application/octet-stream' }),
                `${ title } (${ userCaption }#${ mobileDevice.model } - ${ formattedDate }).xlsx`
            );
        });
};

export { excelSaver };
