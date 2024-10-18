import express from 'express';
import { calculateTCO } from '../controller/Calculator.cotroller.js';

const router = express.Router();

router.post('/tco', calculateTCO);

export default router;
