import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false); // Local state for Modal visibility

  const handleLogout = () => {
    // Resetting global user state to null/empty
    setUser(null);
  };

  return (
    <>
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-700 tracking-tight">
                Fractional<span className="text-gray-900 font-normal">Realty</span>
              </Link>
            </div>

            <div className="hidden md:flex space-x-8">
              <Link to="/marketplace" className="text-gray-700 hover:text-blue-600 font-medium transition">Marketplace</Link>
              <Link to="/portfolio" className="text-gray-700 hover:text-blue-600 font-medium transition">My Investments</Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                // IF LOGGED IN: Show Balance and Profile
                <div className="flex items-center">
                  <div className="text-right mr-4 hidden sm:block">
                    <p className="text-xs text-gray-500 uppercase font-bold">Your Balance</p>
                    <p className="text-sm font-black text-green-600">{user.balance.toLocaleString()} FCFA</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="mr-4 text-xs text-red-500 hover:underline"
                  >
                    Logout
                  </button>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                    <span className="text-blue-700 font-bold">{user.name.charAt(0)}</span>
                  </div>
                </div>
              ) : (
                // IF NOT LOGGED IN: Show Login Button
                <button 
                  onClick={() => setShowLogin(true)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* LOGIN MODAL (Conditional Rendering) */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100] p-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-black mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-6">Enter your details to start investing.</p>
            
            <div className="space-y-4">
              <input type="text" placeholder="Username (Junior)" className="w-full border p-3 rounded-xl outline-blue-600" />
              <input type="password" placeholder="Password" className="w-full border p-3 rounded-xl outline-blue-600" />
              <button 
                onClick={() => {
                  // Simulate Login: Updating Global Context
                  setUser({ name: "Junior", balance: 300000, myInvestments: [] });
                  setShowLogin(false);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"
              >
                Sign In
              </button>
              <button 
                onClick={() => setShowLogin(false)}
                className="w-full text-gray-400 text-sm py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;