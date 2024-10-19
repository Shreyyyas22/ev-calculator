import React from 'react';

const CalculationResult = ({ result }) => {
  // Check if the result object is valid before trying to access its properties
  if (!result || !result.ev || !result.ice || !result.evTotalCost || !result.iceTotalCost) {
    return <p>No result to display yet. Please fill out the form to compare EV and ICE TCO.</p>;
  }

  return (
    <div className="card bg-base-100 shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Total Cost of Ownership Comparison</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Category</th>
              <th>Electric Vehicle (EV)</th>
              <th>Internal Combustion Engine (ICE)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Purchase Price</td>
              <td>₹{result.ev?.purchasePrice.toLocaleString() ?? 'N/A'}</td>
              <td>₹{result.ice?.purchasePrice.toLocaleString() ?? 'N/A'}</td>
            </tr>
            <tr>
              <td>Fuel/Charging Cost (Annual)</td>
              <td>₹{result.ev?.chargingCost.toLocaleString() ?? 'N/A'}</td>
              <td>₹{result.ice?.fuelCost.toLocaleString() ?? 'N/A'}</td>
            </tr>
            <tr>
              <td>Maintenance Cost (Annual)</td>
              <td>₹{result.ev?.maintenanceCost.toLocaleString() ?? 'N/A'}</td>
              <td>₹{result.ice?.maintenanceCost.toLocaleString() ?? 'N/A'}</td>
            </tr>
            <tr>
              <td>Insurance Cost (Annual)</td>
              <td>₹{result.ev?.insuranceCost.toLocaleString() ?? 'N/A'}</td>
              <td>₹{result.ice?.insuranceCost.toLocaleString() ?? 'N/A'}</td>
            </tr>
            <tr>
              <td>Resale Value</td>
              <td>₹{result.ev?.resaleValue.toLocaleString() ?? 'N/A'}</td>
              <td>₹{result.ice?.resaleValue.toLocaleString() ?? 'N/A'}</td>
            </tr>
            <tr>
              <td>Years of Ownership</td>
              <td>{result.ev?.yearsOfOwnership ?? 'N/A'} years</td>
              <td>{result.ice?.yearsOfOwnership ?? 'N/A'} years</td>
            </tr>
            <tr className="font-bold">
              <td>Total Cost of Ownership</td>
              <td>₹{result.evTotalCost.toLocaleString()}</td>
              <td>₹{result.iceTotalCost.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalculationResult;
