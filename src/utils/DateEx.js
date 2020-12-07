
export class DateEx extends Date {
    toLocalISOString = () => {
        return new Date(this.getTime() - this.getTimezoneOffset() * 60000).toISOString();
    };

    addDays = function (days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    toLocaleString = function () {
        const dd = this.getDate();
        const mm = this.getMonth() + 1;
        const yyyy = this.getFullYear();
        const hh = this.getHours();
        const mn = this.getMinutes();
        const ss = this.getSeconds();

        return `${dd}.${mm}.${yyyy} ${hh}:${mn}:${ss}`;
    };
}
