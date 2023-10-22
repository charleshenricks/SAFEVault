import { Router } from 'express';
import jwt from 'jsonwebtoken'
import  asyncHandler  from 'express-async-handler';
import { IUser, UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';


const router = Router();
/*
router.get("/seed", asyncHandler( async (req, res) =>{
    const usersCount = await UserModel.countDocuments();
    if(usersCount>0){
        res.send("Seed is already done!");
        return;
    }
    
    await UserModel.create(sample_users);
    res.send("Seed is DONE!");
}
))
*/

router.post("/login",  asyncHandler(
    async (req, res) => {
      const {email, password} = req.body;
      const user = await UserModel.findOne({ email });
      if(!user){                                                                    //if user email does not exist
        res.status(400).send("Email does not exist");
        return;
      }
      const isPassMatch = await bcrypt.compare(password, user.password);           
      if(isPassMatch) {
        res.send(generateTokenResponse(user));
        return;
      }
      res.status(400).send("Incorrect Password"); 
    }
))


router.post('/register', asyncHandler(
    async (req, res) => {
      const {Fullname, email, contactinfo, password} = req.body;
      const user = await UserModel.findOne({email});
      if(user){
        res.status(400)
        .send('User email already exist!');
        return;
      }
    const salt = await bcrypt.genSalt(10); 
    const newUser:IUser = {
      id:'',
      Fullname,
      email: email.toLowerCase(),
      contactinfo,
      password: await bcrypt.hash(password, salt),       //hash and salts the password with bcrypt
    }

    const dbUser = await UserModel.create(newUser);  
    res.send(generateTokenResponse(dbUser));
  }
))

router.patch("/edit/:id", asyncHandler(
  async (req, res) =>{
    const {Fullname, email, contactinfo, password} = req.body;
    const editUser = await UserModel.findOne({_id: req.params.id});
    const user = await UserModel.findOne({ _id: { $ne: req.params.id }, email: email });
      if(user){
        res.status(400)
        .send('User email already exist!');
        return;
      }

    if(password){
      const salt = await bcrypt.genSalt(10); 
      const newPassword = await bcrypt.hash(password, salt);
      await editUser!.updateOne({ $set: { "Fullname": Fullname, "email": email, "contactinfo": contactinfo, "password": newPassword } });
    }
    else{
      await editUser!.updateOne({ $set: { "Fullname": Fullname, "email": email, "contactinfo": contactinfo } });
    }
    res.send(editUser);                  
  }
))

router.get("/get", asyncHandler(
  async (req, res) =>{
    const users = await UserModel.find({_id: { $ne: "6535010718dcee614802f3a3" }});
    res.send(users);                       
}
))

router.get("/admin", asyncHandler(
  async (req, res) =>{
    const admin = await UserModel.findOne({_id: "6535010718dcee614802f3a3" });
    res.send(admin);                       
}
))

const generateTokenResponse = (user:any) => {
    const token = jwt.sign({
        id: user.id
    },"Some Text",{
        expiresIn: "30d"
    })
    return {
        id: user.id,
        email: user.email,
        password: user.password,
        Fullname: user.Fullname,
        contactinfo: user.contactinfo,
        token: token,
      };
}

router.delete("/delete/:id", asyncHandler(
  async (req, res) => {
    const user = await UserModel.findOne({ _id: req.params.id });
    await user!.delete(); 
    res.send();
  }
))

router.delete("/deleteAll", asyncHandler(
  async (req, res) => {
    const result = await UserModel.deleteMany({ _id: { $ne: "6535010718dcee614802f3a3" } });
    res.send(result);
  }
))

export default router;