import React, { useState, useRef, useEffect } from 'react';
import CalculatorForm from './components/CalculatorForm.jsx';
import CalculationResult from './components/CalculationResult.jsx';
import TCOChart from './components/TCOChart.jsx';
import PieChart from './components/PieChart.jsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const App = () => {
  const [result, setResult] = useState(null);
  const resultRef = useRef();
  const pieChartRef = useRef(null);  // Ref for Pie Chart
  const lineChartRef = useRef(null); // Ref for Line Chart
  const [pieChartVisible, setPieChartVisible] = useState(false);
  const [lineChartVisible, setLineChartVisible] = useState(false);
  const [betterOption, setBetterOption] = useState(''); // To store which option is better

  // Auto-scroll function
  const scrollToResult = () => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle form reset: Clears the result and charts
  const handleReset = () => {
    setResult(null);
    setPieChartVisible(false);
    setLineChartVisible(false);
    setBetterOption('');
  };

  // Export as PNG using html2canvas
  const exportAsPNG = async () => {
    const canvas = await html2canvas(resultRef.current, { backgroundColor: null });
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'TCO_Calculator_Result.png';
    link.click();
  };

  // Export as PDF using jsPDF
  const exportAsPDF = async () => {
    const canvas = await html2canvas(resultRef.current, { backgroundColor: null });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 140); // Adjust size
    pdf.save('TCO_Calculator_Result.pdf');
  };

  // Compare which option is better
  useEffect(() => {
    if (result) {
      const { evTotalCost, iceTotalCost } = result;
      if (evTotalCost < iceTotalCost) {
        setBetterOption('EV is more cost-effective.');
      } else if (iceTotalCost < evTotalCost) {
        setBetterOption('ICE is more cost-effective.');
      } else {
        setBetterOption('Both options have the same Total Cost of Ownership.');
      }
    }
  }, [result]);

  // UseEffect hook for observing the charts visibility
  useEffect(() => {
    const pieChartElement = pieChartRef.current;
    const lineChartElement = lineChartRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === pieChartElement) {
              setPieChartVisible(true); // Trigger pie chart animation
            }
            if (entry.target === lineChartElement) {
              setLineChartVisible(true); // Trigger line chart animation
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (pieChartElement) {
      observer.observe(pieChartElement);
    }
    if (lineChartElement) {
      observer.observe(lineChartElement);
    }

    return () => {
      if (pieChartElement) {
        observer.unobserve(pieChartElement);
      }
      if (lineChartElement) {
        observer.unobserve(lineChartElement);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans transition-all duration-500 ease-in-out">
      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-5xl font-bold text-center mb-8 animate-fade-in">EV vs ICE TCO Calculator</h1>

        {/* Card for CalculatorForm */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 animate-fade-in">
          <CalculatorForm 
            onResult={(result) => { 
              setResult(result); 
              setTimeout(scrollToResult, 300);  // Delay to ensure the DOM is updated before scrolling
            }}
            onReset={handleReset} // Attach the reset handler here
          />
        </div>

        {/* Result Section */}
        {result && (
          <>
            <div ref={resultRef} className="mt-8">
              <div className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 animate-slide-up">
                <CalculationResult result={result} />
              </div>

              {/* Show the better option */}
              <div className="text-center text-xl font-semibold text-green-400 mb-8">
                {betterOption}
              </div>

              {/* Charts Section */}
              <hr className="my-8 border-gray-500" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div ref={pieChartRef} className={`bg-gray-800 shadow-lg rounded-lg p-6 animate-slide-up ${pieChartVisible ? 'animate-pie-chart' : ''}`}>
                  <PieChart vehicleData={result.ev} title="Electric Vehicle (EV) Cost Breakdown" />
                </div>
                <div ref={lineChartRef} className={`bg-gray-800 shadow-lg rounded-lg p-6 animate-slide-up ${lineChartVisible ? 'animate-line-chart' : ''}`}>
                  <PieChart vehicleData={result.ice} title="Internal Combustion Engine (ICE) Cost Breakdown" />
                </div>
              </div>
              <div className="bg-gray-800 shadow-lg rounded-lg p-6 mt-8 animate-slide-up">
                <TCOChart data={result} />
              </div>
            </div>

            {/* Export buttons - Visible when charts are displayed */}
            <div className="flex space-x-4 mt-8 justify-center animate-fade-in">
              <button className="btn btn-primary" onClick={exportAsPDF}>Export as PDF</button>
              <button className="btn btn-secondary" onClick={exportAsPNG}>Export as PNG</button>
            </div>
          </>
        )}

        {/* Placeholder if no result */}
        {!result && <p className="text-center">No result to display yet. Please fill out the form to compare EV and ICE TCO.</p>}
      </div>
    </div>
  );
};

export default App;
