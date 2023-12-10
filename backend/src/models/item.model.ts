import { Schema, model } from 'mongoose';

export interface IItem{
    item_type: string;
    item_claim: string;
    id: string;
    type: boolean;
    name: string;
    img: string;
    imgName: string;
    characteristic: string;
    loc: string;
    date: string;
    more_info: string;
    status: boolean;
    pin: number;
    poster_id: string;
    poster_email: string;
    poster_name: string;
    poster_contactinfo: string;

    retriever_id: string;
    retriever_email: string;
    retriever_name: string;
    retriever_contactinfo: string;
    retriever_date: string;

    returned_id: string;
    returned_email: string;
    returned_name: string;
    returned_contactinfo: string;
    returned_date: string;
}

export const ItemSchema = new Schema<IItem>(
    {
        item_type: { type:String, required:true },
        item_claim: { type:String, required:true },
        type: { type:Boolean, required:true },
        name: { type:String, required:true },
        img: { type:String, required:true },
        imgName: { type:String, required:true },
        characteristic: { type:String, required:true},
        loc: { type:String, required:true },
        date: { type:String, required:true },
        more_info: { type:String, required:true },
        status: { type:Boolean, required:true },
        pin: { type: Number, default: null},
        poster_id: { type:String, required:true },
        poster_email: { type:String, required:true },
        poster_name: { type:String, required:true },
        poster_contactinfo: { type:String, required:true },

        retriever_id: { type:String, required:false },
        retriever_email: { type:String, required:false },
        retriever_name: { type:String, required:false },
        retriever_contactinfo: { type:String, required:false },
        retriever_date: { type:String, required:false },

        returned_id: { type:String, required:false },
        returned_email: { type:String, required:false },
        returned_name: { type:String, required:false },
        returned_contactinfo: { type:String, required:false },
        returned_date: { type:String, required:false },
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

export const ItemModel = model<IItem>('items', ItemSchema);