
export class DateEx extends Date {
    toLocalISOString = () => new Date(this.getTime() - this.getTimezoneOffset() * 60000).toISOString();
}
