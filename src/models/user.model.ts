import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"
import { IUser } from "../interfaces/user.interface"

const UserSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			trim: true,
			minlength: [3, "Username must be at least 3 characters"],
			maxlength: [30, "Username cannot exceed 30 characters"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters"],
		},
	},
	{
		timestamps: true,
	}
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next()

	try {
		const salt = await bcrypt.genSalt(10)
		this.password = await bcrypt.hash(this.password, salt)
		next()
	} catch (error: any) {
		next(error)
	}
})

// Compare password method
UserSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return await bcrypt.compare(candidatePassword, this.password)
}

export const User = model<IUser>("User", UserSchema)
