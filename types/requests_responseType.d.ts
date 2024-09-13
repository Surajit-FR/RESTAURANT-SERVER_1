import { ObjectId } from "mongoose";

export type HealthcheckResponse = {
    host: Array<string>;
    message: string;
    status: boolean;
    time: Date;
};

export type HealthcheckApiResponse = {
    response: HealthcheckResponse;
};

export type TRole = {
    name: string,
    description: string
};

export type ICredentials = {
    email: string;
    password: string;
};

export type ILoginCredentials = ICredentials & {};

export type IRegisterCredentials = ICredentials & {
    fullName: string;
    role: string;
};