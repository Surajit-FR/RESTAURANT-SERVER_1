import { Request, Response, NextFunction } from 'express';
import { TUser } from './schemaTypes';

export type DBInfo = {
    STATUS: string,
    HOST: string,
    DATE_TIME: string,
};

export type IDocumentBase = Document & {
    createdAt?: Date;
    updatedAt?: Date;
}

export type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export interface CustomRequest extends Request {
    user?: TUser;
};