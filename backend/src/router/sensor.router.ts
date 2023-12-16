import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { SensorModel } from '../models/sensor.model';

const router = Router();

router.put('/led_1', asyncHandler(async (req, res) => {
  const { sensor_id, description, location, enable, type, value } = req.body;
  const sensor = await SensorModel.findOne({ sensor_id: "led_1" });

  // Introduce a 3-second delay using setTimeout()
  setTimeout(async () => {
    if (sensor!.value === 'LOW') {
      await sensor!.updateOne({ $set: { value: 'HIGH' } });
    } else {
      await sensor!.updateOne({ $set: { value: 'LOW' } });
    }
    
    // Send a response after the update
    res.status(200).json({ message: 'Update successful' });
  }, 3000); // 3000 milliseconds = 3 seconds
}));

export default router;
