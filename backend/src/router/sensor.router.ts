import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { SensorModel } from '../models/sensor.model';

const router = Router();

router.post('/led_1', asyncHandler(async (req, res) => {
  const { sensor_id, description, location, enable, type, value } = req.body;
  const sensor = await SensorModel.findOne({sensor_id : "led_1" });

  if (sensor!.value === 'LOW') {
    await sensor!.updateOne({ $set: { value: 'HIGH' } });
  } else {
    await sensor!.updateOne({ $set: { value: 'LOW' } });
  }

  // Send a response if needed
  res.status(200).json({ message: 'Update successful' });
}));

export default router;