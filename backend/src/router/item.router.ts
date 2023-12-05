
const cloudinary = require("../configs/cloudinary.config");
const upload = require("../configs/multer.config");
import { Router } from 'express';
import  asyncHandler  from 'express-async-handler';
import { IItem, ItemModel } from '../models/item.model';
import { UserModel } from '../models/user.model';
import { SensorModel } from '../models/sensor.model';


const router = Router();

  router.post("/post", upload.single('image') ,asyncHandler(
    async (req, res) => {
        const result = await cloudinary.uploader.upload(req.file?.path);
        const {poster_id, poster_name, poster_email, poster_contactinfo, 
       //   retriever_id, retriever_name, retriever_email, retriever_contactinfo,
          type, name, characteristic, loc, date, more_info, status} = req.body;

        const randomPin = Math.floor(1000 + Math.random() * 9000);

        const Item: IItem = {
                poster_id,
                poster_name,
                poster_email,
                poster_contactinfo,
                type,
                name,
                img: result.secure_url,
                imgName: result.public_id,
                characteristic,
                loc,
                date,
                more_info,
                status,
                id: "",
                pin: randomPin,
                retriever_id: "", 
                retriever_name: "", 
                retriever_email: "", 
                retriever_date: "",
                retriever_contactinfo: "",
                returned_id: "", 
                returned_name: "", 
                returned_email: "", 
                returned_contactinfo: "",
                returned_date:"",
        }
        const dbItem = await ItemModel.create(Item);
        res.send(dbItem);
    }
  ))

  router.get("/found", asyncHandler(
    async (req, res) =>{
        const items = await ItemModel.find({type: true}).sort({date:-1});
        res.send(items);                       //sending items from database
    }
  ))

  router.get("/lost", asyncHandler(
    async (req, res) =>{
        const items = await ItemModel.find({type: false}).sort({date:-1});
        res.send(items);                
    }
  ))

  router.get("/info/:id", asyncHandler(
    async (req, res) =>{
      const item = await ItemModel.findOne({_id: req.params.id});
      res.send(item);                       
  }
  ))

  router.get("/user/posts/:id", asyncHandler(
    async (req, res) =>{
      const item = await ItemModel.find({poster_id: req.params.id}).sort({date:-1});
      res.send(item);                       
  }
  ))

  router.get("/all/posts", asyncHandler(
    async (req, res) =>{
      const item = await ItemModel.find().sort({date:-1, type:1});
      res.send(item);                       
  }
  ))

  router.get("/user/requests/:id", asyncHandler(
    async (req, res) =>{
      const item = await ItemModel.find({
        $or: [
          { retriever_id: req.params.id },
          { returned_id: req.params.id }
        ]
      }).sort({ date: -1, type: -1 });
      res.send(item);                       
  }
  ))

  router.get("/all/requests", asyncHandler(
    async (req, res) => {
      const item = await ItemModel.find({
        $or: [
          { retriever_id: { $ne: "" } },
          { returned_id: { $ne: "" } }
        ]
      }).sort({ date: -1, type: 1 });
      res.send(item);
    }
  ));


  router.get("/lost/search/:searchTerm", asyncHandler(
    async (req, res) => {
      const searchRegex = new RegExp(req.params.searchTerm, 'i');
      const items = await ItemModel.find( {"$and": 
      [{"$or": [
        { name: { '$regex': searchRegex } },
        { characteristic: { '$regex': searchRegex } },
        { loc: { '$regex': searchRegex } },
      ]
      },
      { type:false}
    ] });
      res.send(items);
    }
  ))

  router.get("/found/search/:searchTerm", asyncHandler(
    async (req, res) => {
      const searchRegex = new RegExp(req.params.searchTerm, 'i');
      const items = await ItemModel.find( {"$and": 
      [{"$or": [
        { name: { '$regex': searchRegex } },
        { characteristic: { '$regex': searchRegex } },
        { loc: { '$regex': searchRegex } },
      ]
      },
      { type:true}
    ] });
      res.send(items);
    }
  ))

  router.patch("/info/edit/:id", upload.single('image'), asyncHandler(
    async (req, res) =>{
      const result = await cloudinary.uploader.upload(req.file?.path);
      const {name, characteristic, loc, date, more_info} = req.body;
      const item = await ItemModel.findOne({_id: req.params.id});
      await cloudinary.uploader.destroy(item?.imgName);
      await item!.updateOne({ $set: { "imgName": result.public_id, "img": result.secure_url } });
      if(name){
        await item!.updateOne({ $set: { "name": name } });
      }
      if(characteristic){
        await item!.updateOne({ $set: { "characteristic": characteristic } });
      }
      if(loc){
        await item!.updateOne({ $set: { "loc": loc } });
      }
      if(date){
        await item!.updateOne({ $set: { "date": date } });
      }
      if(more_info){
        await item!.updateOne({ $set: { "more_info": more_info } });
      }
      res.send();                    
    }
  ))

  router.patch("/info/edit1/:id", asyncHandler(
    async (req, res) =>{
      const {name, characteristic, loc, date, more_info} = req.body;
      const item = await ItemModel.findOne({_id: req.params.id});
      if(name){
        await item!.updateOne({ $set: { "name": name } });
      }
      if(characteristic){
        await item!.updateOne({ $set: { "characteristic": characteristic } });
      }
      if(loc){
        await item!.updateOne({ $set: { "loc": loc } });
      }
      if(date){
        await item!.updateOne({ $set: { "date": date } });
      }
      if(more_info){
        await item!.updateOne({ $set: { "more_info": more_info } });
      }
      res.send();                    
    }
  ))

  router.patch("/claim/:id/", asyncHandler(
    async (req, res) =>{
      const {id} = req.body;
      const item = await ItemModel.findOne({_id: req.params.id});
      const user = await UserModel.findOne({_id: id});
      await item!.updateOne({ $set: { "retriever_id": id, "retriever_name": user?.Fullname, "retriever_email": user?.email, "retriever_contactinfo": user?.contactinfo, "retriever_date": new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) } });
      res.send();                    
    }
  ))

  router.patch("/profile/update/:id", asyncHandler(
    async (req, res) => {
      const { Fullname, email, contactinfo } = req.body;
      const posterItems = await ItemModel.find({ poster_id: req.params.id });
      if(posterItems){
        for (let i = 0; i < posterItems.length; i++) {
          const posterItem = posterItems[i];
          await posterItem.updateOne({
            $set: {"poster_name": Fullname, "poster_email": email, "poster_contactinfo": contactinfo}});
        }
      }

      const retrieverItems = await ItemModel.find({ retriever_id: req.params.id });
      if(retrieverItems){
        for (let i = 0; i < retrieverItems.length; i++) {
          const retrieverItem = retrieverItems[i];
          await retrieverItem.updateOne({
            $set: {"retriever_name": Fullname,"retriever_email": email,"retriever_contactinfo": contactinfo}});
        }
      }
    
      const returnedItems = await ItemModel.find({ returned_id: req.params.id });
      if(returnedItems){
        for (let i = 0; i < returnedItems.length; i++) {
          const returnedItem = returnedItems[i];
          await returnedItem.updateOne({
            $set: {"returned_name": Fullname,"returned_email": email,"returned_contactinfo": contactinfo}});
        }
      }
      res.send();
    }
));


  router.patch("/approve", asyncHandler(
    async (req, res) =>{
      const {id} = req.body;
      const item = await ItemModel.findOne({_id: id});
      await item!.updateOne({ $set: { "returned_id": item?.retriever_id, "returned_name": item?.retriever_name, "returned_email": item?.retriever_email, "returned_contactinfo": item?.retriever_contactinfo, "returned_date": new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })} });
      await item!.updateOne({ $set: { "status": true ,"retriever_id": "", "retriever_name": "", "retriever_email": "", "retriever_contactinfo": "", "retriever_date": "" } });
      res.send();                    
    }
  ))

  router.patch("/deny", asyncHandler(
    async (req, res) =>{
      const {id} = req.body;
      const item = await ItemModel.findOne({_id: id});
      await item!.updateOne({ $set: { "retriever_id": "", "retriever_name": "", "retriever_email": "", "retriever_contactinfo": "", "retriever_date": ""  } });
      res.send();                    
    }
  ))

  router.patch("/change", asyncHandler(
    async (req, res) =>{
      const {id} = req.body;
      const item = await ItemModel.findOne({_id: id});
      await item!.updateOne({ $set: { "status": true ,"returned_id": item?.retriever_id, "returned_name": item?.retriever_name, "returned_email": item?.retriever_email, "returned_contactinfo": item?.retriever_contactinfo, "returned_date": new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) } });
      await item!.updateOne({ $set: { "retriever_id": "", "retriever_name": "", "retriever_email": "", "retriever_contactinfo": "", "retriever_date": ""  } });
      res.send();                    
    }
  ))

  router.delete("/delete-item/:id", asyncHandler(
    async (req, res) => {
      const ITEM = await ItemModel.findOne({ _id: req.params.id });
      await cloudinary.uploader.destroy(ITEM?.imgName);
      await ITEM!.delete(); 
      res.send();
    }
  ))

  router.delete("/deleteAll-item", asyncHandler(
    async (req, res) => {
      const ITEMS = await ItemModel.find();
      for (const ITEM of ITEMS) {
        await cloudinary.uploader.destroy(ITEM.imgName);
        await ITEM.delete();
      }
      res.send();
    }
  ))

  // router.post("/sensors/led_1", asyncHandler(
  //   async (req, res) =>{
  //     const sensor = await SensorModel.findOne({sensor_id:
  //       "led_1"});
  //       if(sensor!.value == "LOW"){
  //         await sensor!.updateOne({ $set: { "value": "HIGH" } });
  //       }else{
  //         await sensor!.updateOne({ $set: { "value": "LOW" } });
  //       }
  //   }
  // ))
      

export default router;

