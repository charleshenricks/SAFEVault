import { Router } from 'express';
import jwt from 'jsonwebtoken'
import  asyncHandler  from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { SensorModel } from '../models/sensor.model';


const router = Router();

router.post("/sensors/led_1", asyncHandler(
    async (req, res) =>{
      const sensor = await SensorModel.findOne({sensor_id:
        "led_1"});
        if(sensor!.value == "LOW"){
          await sensor!.updateOne({ $set: { "value": "HIGH" } });
        }else{
          await sensor!.updateOne({ $set: { "value": "LOW" } });
        }
    }
  ))
      

export default router;