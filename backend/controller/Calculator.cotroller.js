import { validationResult } from 'express-validator';
import VehicleCost from '../models/VehicleCost.model.js';

// Helper function to validate EV and ICE fields
const validateVehicleData = (vehicleData, type) => {
  const {
    purchasePrice,
    chargingCost = 0,  // default to 0 for ICE
    fuelCost = 0,  // default to 0 for EV
    maintenanceCost,
    insuranceCost,
    resaleValue,
    yearsOfOwnership,
  } = vehicleData;

  // Validation logic for either EV or ICE
  const isValid = typeof purchasePrice === 'number' &&
                  typeof maintenanceCost === 'number' &&
                  typeof insuranceCost === 'number' &&
                  typeof resaleValue === 'number' &&
                  typeof yearsOfOwnership === 'number' &&
                  purchasePrice > 0 && maintenanceCost >= 0 && insuranceCost >= 0 &&
                  resaleValue >= 0 && yearsOfOwnership > 0;

  if (type === 'EV') {
    return isValid && typeof chargingCost === 'number' && chargingCost >= 0;
  } else if (type === 'ICE') {
    return isValid && typeof fuelCost === 'number' && fuelCost >= 0;
  }

  return false;
};

// Controller for calculating TCO
export const calculateTCO = async (req, res) => {
  try {
    // Log incoming request
    console.log('Request body:', req.body);

    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { ev, ice } = req.body;

    // Check if both EV and ICE data are provided
    if (!ev || !ice) {
      return res.status(400).json({ msg: 'Both EV and ICE data are required' });
    }

    // Log EV and ICE data
    console.log('EV data:', ev);
    console.log('ICE data:', ice);

    // Validate EV and ICE fields using helper function
    if (!validateVehicleData(ev, 'EV')) {
      return res.status(400).json({ msg: 'Invalid or incomplete EV data provided. Ensure all fields are positive numbers.' });
    }

    if (!validateVehicleData(ice, 'ICE')) {
      return res.status(400).json({ msg: 'Invalid or incomplete ICE data provided. Ensure all fields are positive numbers.' });
    }

    // Calculate total costs for EV and ICE
    let evTotalCost =
      ev.purchasePrice +
      ev.chargingCost * ev.yearsOfOwnership +
      ev.maintenanceCost * ev.yearsOfOwnership +
      ev.insuranceCost * ev.yearsOfOwnership -
      ev.resaleValue;

    let iceTotalCost =
      ice.purchasePrice +
      ice.fuelCost * ice.yearsOfOwnership +
      ice.maintenanceCost * ice.yearsOfOwnership +
      ice.insuranceCost * ice.yearsOfOwnership -
      ice.resaleValue;

    console.log('EV Total Cost:', evTotalCost);
    console.log('ICE Total Cost:', iceTotalCost);

    // Create VehicleCost documents for EV and ICE
    const evVehicleCost = new VehicleCost({
      purchasePrice: ev.purchasePrice,
      chargingCost: ev.chargingCost,
      maintenanceCost: ev.maintenanceCost,
      insuranceCost: ev.insuranceCost,
      resaleValue: ev.resaleValue,
      yearsOfOwnership: ev.yearsOfOwnership,
      vehicleType: 'EV',
    });

    const iceVehicleCost = new VehicleCost({
      purchasePrice: ice.purchasePrice,
      fuelCost: ice.fuelCost,
      maintenanceCost: ice.maintenanceCost,
      insuranceCost: ice.insuranceCost,
      resaleValue: ice.resaleValue,
      yearsOfOwnership: ice.yearsOfOwnership,
      vehicleType: 'ICE',
    });

    // Save both EV and ICE documents to MongoDB
    await evVehicleCost.save();
    await iceVehicleCost.save();

    // Send the total cost calculations back to the client with the detailed EV and ICE data
    res.status(200).json({
      evTotalCost,
      iceTotalCost,
      ev: {
        purchasePrice: ev.purchasePrice,
        chargingCost: ev.chargingCost,
        maintenanceCost: ev.maintenanceCost,
        insuranceCost: ev.insuranceCost,
        resaleValue: ev.resaleValue,
        yearsOfOwnership: ev.yearsOfOwnership,
      },
      ice: {
        purchasePrice: ice.purchasePrice,
        fuelCost: ice.fuelCost,
        maintenanceCost: ice.maintenanceCost,
        insuranceCost: ice.insuranceCost,
        resaleValue: ice.resaleValue,
        yearsOfOwnership: ice.yearsOfOwnership,
      },
    });
  } catch (error) {
    console.error('Server Error:', error.message);
    res.status(500).send('Server Error');
  }
};
