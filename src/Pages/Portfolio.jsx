import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContext';

const Portfolio = () => {
  // 1. CONTEXT: Get Junior's data (Balance and his list of investments)
  const { user } = useContext(UserContext);

  // 2. STATE: Local state to store fetched history from db.json
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. EFFECT: Fetch the investments table from our JSON server
  useEffect(() => {
    fetch('http://localhost:5000/investments')
      .then((res) => res.json())
      .then((data) => {
        // Filter the history to only show Junior's investments
        const myData = data.filter(inv => inv.investorName === user.name);
        setHistory(myData);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching portfolio:", err));
  }, [user.name]);

  // Calculate Total Invested Amount
  const totalInvested = history.reduce((sum, item) => sum + item.amountSpent, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-12">
      {/* 4. DASHBOARD HEADER */}
      <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl mb-12 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">My Portfolio</h1>
          <p className="text-gray-400 mt-1">Investor Profile: <span className="text-blue-400 font-bold">{user.name}</span></p>
        </div>
        <div className="mt-6 md:mt-0 flex gap-8">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Assets</p>
            <p className="text-2xl font-black text-green-400">{totalInvested.toLocaleString()} FCFA</p>
          </div>
          <div className="text-center border-l border-gray-700 pl-8">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Available Cash</p>
            <p className="text-2xl font-black text-blue-400">{user.balance.toLocaleString()} FCFA</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Investment History</h2>

      {loading ? (
        <div className="text-center py-10">Loading your history...</div>
      ) : history.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <p className="text-gray-400 mb-4 text-lg font-medium">You haven't made any investments yet.</p>
          <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
            Go to Marketplace
          </a>
        </div>
      ) : (
        /* 5. INVESTMENT TABLE */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4 text-center">Fractions</th>
                <th className="px-6 py-4 text-right">Amount Spent</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.map((inv, index) => (
                <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-black text-gray-800">{inv.propertyName}</p>
                    <p className="text-xs text-blue-600 font-bold">Verified Transaction</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                      {inv.fractions} Units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">
                    {inv.amountSpent.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400 text-sm">
                    {inv.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Portfolio;