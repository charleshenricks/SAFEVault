import { Schema, model } from 'mongoose';

export interface ISensor{
    id: string;
    sensor_id: string;
    description: string;
    location: string;
    enable: boolean;
    type: string;
    value: string;
}

export const SensorSchema = new Schema<ISensor>(
    {
        sensor_id: { type:String, required:true },
        description: { type:String, required:true },
        location: { type:String, required:true, unique:true },
        enable: { type:Boolean, required:true },
        type: { type:String, required:true, unique:true },
        value: { type:String, unique:true },
        
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

export const SensorModel = model<ISensor>('sensor', SensorSchema);