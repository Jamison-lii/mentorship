import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const PropertyDetail = () => {
  // 1. ROUTING: Get the property ID from the URL (/property/:id)
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. CONTEXT: Access Junior's global wallet
  const { user, setUser } = useContext(UserContext);

  // 3. STATE: Local memory for this page
  const [property, setProperty] = useState(null);
  const [fractionsToBuy, setFractionsToBuy] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 4. FETCHING: Get the data for this specific property
  useEffect(() => {
    fetch(`http://localhost:5000/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching property:", err));
  }, [id]);

  if (loading) return <div className="p-20 text-center font-bold">Loading Property Details...</div>;
  if (!property) return <div className="p-20 text-center">Property not found.</div>;

  // 5. LOGIC: Calculate costs and progress
  const totalCost = fractionsToBuy * property.pricePerFraction;
  const progressPercent = (property.amountRaised / property.targetAmount) * 100;
  const remainingFractions = property.totalFractions - property.fractionsTaken;

  // 6. UPDATING DATA: Send the investment to the API
  const handleInvestment = async () => {
    if (totalCost > user.balance) {
      alert("Insufficient Balance! You need " + totalCost + " FCFA");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step A: Record the investment in our API
      const investmentRecord = {
        propertyId: id,
        propertyName: property.title,
        investorName: user.name,
        fractions: fractionsToBuy,
        amountSpent: totalCost,
        date: new Date().toLocaleDateString()
      };

      await fetch('http://localhost:5000/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investmentRecord)
      });

      // Step B: Update Junior's Global Balance in Context
      setUser({
        ...user,
        balance: user.balance - totalCost,
        myInvestments: [...user.myInvestments, investmentRecord]
      });

      alert(`Congratulations Junior! You have successfully committed to ${property.title}`);
      navigate('/portfolio'); // Redirect to portfolio after success

    } catch (error) {
      alert("Something went wrong with the API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Property Info */}
        <div className="p-8 bg-gray-50">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            {property.duration} Remaining
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4">{property.title}</h1>
          <p className="text-gray-500 flex items-center mt-2">
            📍 {property.location}
          </p>

          <div className="mt-8">
            <h3 className="font-bold text-gray-800">About this opportunity</h3>
            <p className="text-gray-600 mt-2 leading-relaxed">{property.description}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">Target Amount</p>
            <p className="text-2xl font-black text-gray-900">{property.targetAmount.toLocaleString()} FCFA</p>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span>{progressPercent}% Funded</span>
                <span>{property.amountRaised.toLocaleString()} FCFA raised</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Investment Tool */}
        <div className="p-8 flex flex-col justify-center bg-white">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Make your Commitment</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How many fractions? (Max: {remainingFractions})
              </label>
              <input 
                type="number"
                min="1"
                max={remainingFractions}
                value={fractionsToBuy}
                onChange={(e) => setFractionsToBuy(parseInt(e.target.value) || 1)}
                className="w-full text-black p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
              />
              <p className="text-xs text-blue-500 mt-1">1 Fraction = {property.pricePerFraction.toLocaleString()} FCFA</p>
            </div>

            <div className="border-t border-blue-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Investment:</span>
                <span className="text-2xl font-black text-blue-700">{totalCost.toLocaleString()} FCFA</span>
              </div>
            </div>

            <button 
              onClick={handleInvestment}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95 ${
                isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? "Processing..." : "Confirm Investment"}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              Funds are held in an escrow account. No money is managed directly by this platform.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyDetail;