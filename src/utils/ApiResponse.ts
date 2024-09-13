class ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
    accessToken?: string;
    refreshToken?: string;

    constructor(
        statusCode: number,
        data: T,
        message: string = "Success",
        accessToken?: string,
        refreshToken?: string
    ) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}

export { ApiResponse };