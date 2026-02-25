import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Building2, MapPin, Users, Calendar, ArrowLeft } from 'lucide-react';

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opp, setOpp] = useState(null);
  const [fractions, setFractions] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  async function fetchDetails() {
    const { data } = await supabase
      .from('investment_opportunities')
      .select(`*, profiles(full_name, office_address, phone)`)
      .eq('id', id)
      .single();
    setOpp(data);
    setLoading(false);
  }

  const handleCommit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please login to invest!");

    const totalCost = fractions * opp.amount_per_fraction;

    const { error } = await supabase.from('investments').insert([{
      investment_id: opp.id,
      user_id: user.id,
      fractions_bought: fractions,
      amount_committed: totalCost
    }]);

    if (!error) {
      alert(`Success! You committed ${totalCost.toLocaleString()} FCFA. Please visit the office at ${opp.profiles.office_address} to finalize.`);
      navigate('/dashboard');
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Property...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-blue-600 mb-6">
        <ArrowLeft size={20} className="mr-2"/> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Images & Info */}
        <div className="lg:col-span-2">
          <img src={opp.image_url} className="w-full h-[400px] object-cover rounded-3xl mb-8 shadow-lg" alt={opp.title} />
          <h1 className="text-4xl font-black mb-4">{opp.title}</h1>
          <p className="flex items-center text-slate-500 mb-6 text-lg">
            <MapPin size={20} className="mr-2 text-blue-600"/> {opp.location}
          </p>
          <div className="prose max-w-none text-slate-600">
            <p className="text-xl leading-relaxed">{opp.description}</p>
          </div>
        </div>

        {/* Right: Investment Sidebar */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-fit sticky top-24">
          <div className="mb-6">
            <span className="text-slate-500 block mb-1">Price per Fraction</span>
            <span className="text-3xl font-black text-blue-700">{opp.amount_per_fraction.toLocaleString()} FCFA</span>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
              <span className="font-bold">How many fractions?</span>
              <input 
                type="number" 
                min="1" 
                value={fractions} 
                onChange={(e) => setFractions(e.target.value)}
                className="w-16 p-2 rounded border font-bold text-center"
              />
            </div>
            
            <div className="flex justify-between text-lg font-black border-t pt-4">
              <span>Total Commitment</span>
              <span className="text-emerald-600">{(fractions * opp.amount_per_fraction).toLocaleString()} FCFA</span>
            </div>
          </div>

          <button 
            onClick={handleCommit}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition transform active:scale-95 shadow-lg shadow-blue-200"
          >
            Commit to Invest
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-4 px-4">
            By clicking, you agree to meet the project owner within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}