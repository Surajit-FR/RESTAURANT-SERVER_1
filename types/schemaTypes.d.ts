import { ObjectId } from "mongoose";
import { IDocumentBase } from "./commonType";

export type TPermission = IDocumentBase & {
    name: string;
    description?: string;
};

export type TRole = IDocumentBase & {
    name: string;
    permissions: Array<ObjectId>;
};

export type TUser = IDocumentBase & {
    _id: string | ObjectId;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    web_theme: string;
    role: string | ObjectId;
    refreshToken?: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    isActive?: boolean;
    isDeleted?: boolean;
};

export type TProduct = IDocumentBase & {
    productTitle: string;
    offer: 'true' | 'false';
    offerPercentage?: string;
    coverImage: string;
    productImages: Array<string>;
    productDescription?: string;
    price: string;
    availability: 'in_stock' | 'out_of_stock' | 'pre_order';
    visibility: 'public' | 'private';
    category: string | ObjectId;
    tags?: Array<string>;
    sku?: string;
    isDelete: boolean;
};

export type TCategory = IDocumentBase & {
    categoryID: string;
    categoryName: string;
    categoryDesc: string;
    isDelete: boolean;
};