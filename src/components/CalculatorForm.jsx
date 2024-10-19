import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faGasPump, faTools, faShieldAlt, faMoneyBill, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'; 

const CalculatorForm = ({ onResult, onReset }) => {
  const initialFormData = {
    ev: {
      purchasePrice: 30000,
      chargingCost: 500,
      maintenanceCost: 300,
      insuranceCost: 1000,
      resaleValue: 15000,
      yearsOfOwnership: 5,
    },
    ice: {
      purchasePrice: 20000,
      fuelCost: 1500,
      maintenanceCost: 400,
      insuranceCost: 1200,
      resaleValue: 8000,
      yearsOfOwnership: 5,
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    // Validate EV fields
    Object.keys(formData.ev).forEach((field) => {
      if (!formData.ev[field]) {
        newErrors[`ev_${field}`] = 'This field is required';
      }
    });

    // Validate ICE fields
    Object.keys(formData.ice).forEach((field) => {
      if (!formData.ice[field]) {
        newErrors[`ice_${field}`] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (vehicleType, e) => {
    setFormData({
      ...formData,
      [vehicleType]: {
        ...formData[vehicleType],
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      console.log('Validation failed', errors);
      return;
    }
  
    setIsSubmitting(true);
  
    const flattenedData = {
      ev: {
        purchasePrice: parseFloat(formData.ev.purchasePrice),
        chargingCost: parseFloat(formData.ev.chargingCost),
        maintenanceCost: parseFloat(formData.ev.maintenanceCost),
        insuranceCost: parseFloat(formData.ev.insuranceCost),
        resaleValue: parseFloat(formData.ev.resaleValue),
        yearsOfOwnership: parseInt(formData.ev.yearsOfOwnership),
      },
      ice: {
        purchasePrice: parseFloat(formData.ice.purchasePrice),
        fuelCost: parseFloat(formData.ice.fuelCost),
        maintenanceCost: parseFloat(formData.ice.maintenanceCost),
        insuranceCost: parseFloat(formData.ice.insuranceCost),
        resaleValue: parseFloat(formData.ice.resaleValue),
        yearsOfOwnership: parseInt(formData.ice.yearsOfOwnership),
      },
    };
  
    console.log('Submitting flattened data:', flattenedData);
  
    try {
      // Use the environment variable for the API URL
      const response = await axios.post(process.env.REACT_APP_API_URL, flattenedData);
      console.log('Response from backend:', response.data);
      onResult(response.data);  // Pass the result to the parent component
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form and errors
  const resetForm = () => {
    setFormData(initialFormData);  
    setErrors({});  
    if (onReset) {
      onReset();  
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-control space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Electric Vehicle (EV) Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Electric Vehicle (EV)</h2>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faCar} className="text-blue-500" />
              <span>Purchase Price (₹):</span>
            </label>
            <input
              type="number"
              name="purchasePrice"
              className="input input-bordered w-full"
              value={formData.ev.purchasePrice}
              onChange={(e) => handleInputChange('ev', e)}
            />
            {errors.ev_purchasePrice && <p className="text-red-500">{errors.ev_purchasePrice}</p>}
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faGasPump} className="text-green-500" />
              <span>Charging Cost (Annual) (₹):</span>
            </label>
            <input
              type="number"
              name="chargingCost"
              className="input input-bordered w-full"
              value={formData.ev.chargingCost}
              onChange={(e) => handleInputChange('ev', e)}
            />
            {errors.ev_chargingCost && <p className="text-red-500">{errors.ev_chargingCost}</p>}
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faTools} className="text-yellow-500" />
              <span>Maintenance Cost (Annual) (₹):</span>
            </label>
            <input
              type="number"
              name="maintenanceCost"
              className="input input-bordered w-full"
              value={formData.ev.maintenanceCost}
              onChange={(e) => handleInputChange('ev', e)}
            />
            {errors.ev_maintenanceCost && <p className="text-red-500">{errors.ev_maintenanceCost}</p>}
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faShieldAlt} className="text-indigo-500" />
              <span>Insurance Cost (Annual) (₹):</span>
            </label>
            <input
              type="number"
              name="insuranceCost"
              className="input input-bordered w-full"
              value={formData.ev.insuranceCost}
              onChange={(e) => handleInputChange('ev', e)}
            />
            {errors.ev_insuranceCost && <p className="text-red-500">{errors.ev_insuranceCost}</p>}
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faMoneyBill} className="text-green-600" />
              <span>Resale Value (₹):</span>
            </label>
            <input
              type="number"
              name="resaleValue"
              className="input input-bordered w-full"
              value={formData.ev.resaleValue}
              onChange={(e) => handleInputChange('ev', e)}
            />
            {errors.ev_resaleValue && <p className="text-red-500">{errors.ev_resaleValue}</p>}
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-red-500" />
              <span>Years of Ownership:</span>
            </label>
            <input
              type="number"
              name="yearsOfOwnership"
              className="input input-bordered w-full"
              value={formData.ev.yearsOfOwnership}
              onChange={(e) => handleInputChange('ev', e)}
            />
            {errors.ev_yearsOfOwnership && <p className="text-red-500">{errors.ev_yearsOfOwnership}</p>}
          </div>
        </div>

        {/* Internal Combustion Engine (ICE) Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Internal Combustion Engine (ICE)</h2>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faCar} className="text-blue-500" />
              <span>Purchase Price (₹):</span>
            </label>
            <input
              type="number"
              name="purchasePrice"
              className="input input-bordered w-full"
              value={formData.ice.purchasePrice}
              onChange={(e) => handleInputChange('ice', e)}
            />
            {errors.ice_purchasePrice && <p className="text-red-500">{errors.ice_purchasePrice}</p>}
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faGasPump} className="text-green-500" />
              <span>Fuel Cost (Annual) (₹):</span>
            </label>
            <input
              type="number"
              name="fuelCost"
              className="input input-bordered w-full"
              value={formData.ice.fuelCost}
              onChange={(e) => handleInputChange('ice', e)}
            />
            {errors.ice_fuelCost && <p className="text-red-500">{errors.ice_fuelCost}</p>}
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faTools} className="text-yellow-500" />
              <span>Maintenance Cost (Annual) (₹):</span>
            </label>
            <input
              type="number"
              name="maintenanceCost"
              className="input input-bordered w-full"
              value={formData.ice.maintenanceCost}
              onChange={(e) => handleInputChange('ice', e)}
            />
            {errors.ice_maintenanceCost && <p className="text-red-500">{errors.ice_maintenanceCost}</p>}
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faShieldAlt} className="text-indigo-500" />
              <span>Insurance Cost (Annual) (₹):</span>
            </label>
            <input
              type="number"
              name="insuranceCost"
              className="input input-bordered w-full"
              value={formData.ice.insuranceCost}
              onChange={(e) => handleInputChange('ice', e)}
            />
            {errors.ice_insuranceCost && <p className="text-red-500">{errors.ice_insuranceCost}</p>}
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faMoneyBill} className="text-green-600" />
              <span>Resale Value (₹):</span>
            </label>
            <input
              type="number"
              name="resaleValue"
              className="input input-bordered w-full"
              value={formData.ice.resaleValue}
              onChange={(e) => handleInputChange('ice', e)}
            />
            {errors.ice_resaleValue && <p className="text-red-500">{errors.ice_resaleValue}</p>}
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-red-500" />
              <span>Years of Ownership:</span>
            </label>
            <input
              type="number"
              name="yearsOfOwnership"
              className="input input-bordered w-full"
              value={formData.ice.yearsOfOwnership}
              onChange={(e) => handleInputChange('ice', e)}
            />
            {errors.ice_yearsOfOwnership && <p className="text-red-500">{errors.ice_yearsOfOwnership}</p>}
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Compare TCO for EV and ICE'}
        </button>
        <button type="button" onClick={resetForm} className="btn btn-secondary">
          Reset
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm;
