class CustomErrorHandler extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}
export default CustomErrorHandler;
