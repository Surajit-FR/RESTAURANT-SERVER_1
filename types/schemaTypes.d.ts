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

export interface TProduct {
    productTitle: string;
    offer: 'true' | 'false';
    offerPercentage?: string;
    coverImage: string;
    productImages: string[];
    productDescription?: string;
    price: string;
    availability: 'in_stock' | 'out_of_stock' | 'pre_order';
    visibility: 'public' | 'private';
    category: string | ObjectId; // ObjectId as string
    tags?: string[];
    sku?: string; // Stock Keeping Unit
    is_delete: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};