import { Document, Types } from "mongoose"

export interface IUser extends Document {
	_id: Types.ObjectId
	username: string
	password: string
	createdAt: Date
	updatedAt: Date
	comparePassword(candidatePassword: string): Promise<boolean>
}

export interface IUserResponse {
	_id: string
	username: string
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
