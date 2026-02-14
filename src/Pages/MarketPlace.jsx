import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  // 1. STATE: To store the list of properties from the API
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. EFFECT: Fetch the data once when the component "mounts" (appears on screen)
  useEffect(() => {
    const getProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/properties');
        console.log("this is the response", response);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        console.log("this is the data", data);
        setProperties(data);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProperties();
  }, []); // Empty array means: "Only run this once"

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600 font-medium">Scanning for opportunities in Cameroon...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Investment Marketplace
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Join other young professionals. Pool capital, buy fractions, build wealth.
        </p>
      </div>

      {/* Grid of Properties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => {
          // Calculate funding progress percentage
          const progress = Math.round((property.amountRaised / property.targetAmount) * 100);

          return (
            <div 
              key={property.id} 
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Visual "Tag" for the location */}
              <div className="bg-blue-600 h-2 w-full"></div>
              
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <span className="mr-1">📍</span> {property.location}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-6">
                  {property.description}
                </p>

                {/* Progress Section */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-gray-500">Funding Progress</span>
                    <span className="text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-900">{property.amountRaised.toLocaleString()} FCFA</span>
                    <span className="text-gray-400">Target: {property.targetAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Per Fraction</p>
                    <p className="text-lg font-black text-gray-900">
                      {property.pricePerFraction.toLocaleString()} <span className="text-xs font-normal">FCFA</span>
                    </p>
                  </div>
                  <Link 
                    to={`/property/${property.id}`}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State if no properties found */}
      {properties.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No active investment opportunities found at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;