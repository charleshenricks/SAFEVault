import { Schema, model } from 'mongoose';

export interface IUser{
    id: string;
    email: string;
    password: string;
    Fullname: string;
    contactinfo: string;
}

export const UserSchema = new Schema<IUser>(
    {
        Fullname: { type:String, required:true },
        contactinfo: { type:String, required:true },
        email: { type:String, required:true, unique:true },
        password: { type:String, required:true },
        
    },{
        toJSON:{
            virtuals:true
        },
        toObject:{
            virtuals:true
        },
        timestamps:true
    }
)

export const UserModel = model<IUser>('user', UserSchema);