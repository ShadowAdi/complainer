import { Document, Types } from "mongoose"

export enum UserRole {
	USER = "user",
	ADMIN = "admin",
}

export interface IUser extends Document {
	_id: Types.ObjectId
	username: string
	password: string
	role: UserRole
	createdAt: Date
	updatedAt: Date
	comparePassword(candidatePassword: string): Promise<boolean>
}

export interface IUserResponse {
	_id: string
	username: string
	role: UserRole
	createdAt: Date
	updatedAt: Date
}

export interface IAuthTokenPayload {
	userId: string
	username: string
}

export interface ILoginResponse {
	user: IUserResponse
	token: string
}

export interface IRegisterResponse {
	user: IUserResponse
	token: string
}
