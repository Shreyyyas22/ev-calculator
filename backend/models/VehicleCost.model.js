import mongoose from 'mongoose';

const vehicleCostSchema = new mongoose.Schema({
  purchasePrice: {
    type: Number,
    required: true,
  },
  fuelCost: {
    type: Number,
    required: false, // Not required for EV
  },
  chargingCost: {
    type: Number,
    required: false, // Not required for ICE
  },
  maintenanceCost: {
    type: Number,
    required: true,
  },
  insuranceCost: {
    type: Number,
    required: true,
  },
  resaleValue: {
    type: Number,
    required: true,
  },
  yearsOfOwnership: {
    type: Number,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['EV', 'ICE'], // Vehicle type must be either EV or ICE
  },
}, { timestamps: true });

const VehicleCost = mongoose.model('VehicleCost', vehicleCostSchema);

export default VehicleCost;
