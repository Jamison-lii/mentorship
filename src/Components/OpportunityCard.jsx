import { Link } from 'react-router-dom';

export default function OpportunityCard({ opportunity }) {
  // Logic for the progress bar (usually you'd calculate this from the 'investments' table)
  // For now, let's assume a static calculation or pass it as a prop
  const progressPercent = 65; // Example value

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-200">
      <div className="relative">
        <img 
          src={opportunity.image_url || 'https://via.placeholder.com/400x300'} 
          className="w-full h-56 object-cover" 
          alt={opportunity.title} 
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-800 uppercase">
          {opportunity.location}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 truncate">{opportunity.title}</h3>
        
        <div className="flex justify-between text-sm text-slate-500 mb-4">
          <span>Fraction Price:</span>
          <span className="font-bold text-slate-900">{opportunity.amount_per_fraction.toLocaleString()} FCFA</span>
        </div>

        {/* Progress Bar Area */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1 font-bold">
            <span>{progressPercent}% Funded</span>
            <span>{opportunity.total_amount.toLocaleString()} FCFA Goal</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <Link 
          to={`/opportunity/${opportunity.id}`}
          className="block text-center bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}