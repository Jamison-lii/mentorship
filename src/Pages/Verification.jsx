import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Briefcase } from 'lucide-react';

export default function Verification() {
  const [officeAddress, setOfficeAddress] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();

    // Update the profile to 'pending' and add office details
    const { error } = await supabase
      .from('profiles')
      .update({ 
        office_address: officeAddress,
        bio: bio,
        verification_status: 'pending' 
      })
      .eq('id', user.id);

    if (error) {
      alert("Error sending request.");
    } else {
      alert("Request sent! Admin will review your office location.");
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
        <ShieldCheck size={40} />
      </div>
      <h1 className="text-3xl font-black mb-2">Become a Verified Agent</h1>
      <p className="text-slate-500 mb-10">Submit your business details to start listing land opportunities on the marketplace.</p>

      <form onSubmit={handleRequest} className="space-y-4 text-left bg-white p-8 rounded-3xl border shadow-sm">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Physical Office Address</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="e.g. Opposite Pharmacie de la Rive, Akwa" 
              className="w-full p-4 pl-12 border rounded-xl bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setOfficeAddress(e.target.value)}
              required 
            />
            <MapPin className="absolute left-4 top-4 text-slate-400" size={20} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Agency Description</label>
          <textarea 
            placeholder="Tell us about your real estate experience..." 
            className="w-full p-4 border rounded-xl bg-slate-50 text-slate-900 h-32 outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setBio(e.target.value)}
            required 
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-slate-300"
        >
          {loading ? 'Sending...' : 'Submit Verification Request'}
        </button>
      </form>
    </div>
  );
}