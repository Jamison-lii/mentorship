import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2, CheckCircle2, Calendar } from 'lucide-react';

export default function CreateListing() {
  const [form, setForm] = useState({ 
    title: '', 
    location: '', 
    total_amount: '', 
    amount_per_fraction: '', 
    image_url: '', 
    description: '',
    deadline: '' // Added deadline to state
  });
  
  const [uploading, setUploading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('verification_status')
        .eq('id', user.id)
        .single();

      if (data?.verification_status === 'approved') {
        setIsApproved(true);
      }
      setChecking(false);
    };
    checkStatus();
  }, [navigate]);

  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `listings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      setForm({ ...form, image_url: data.publicUrl });
    } catch (error) {
      alert("Image upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.image_url) {
      alert("Please upload a property photo first!");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('investment_opportunities').insert([{
      ...form,
      created_by: user.id,
      total_fractions: Math.floor(Number(form.total_amount) / Number(form.amount_per_fraction)),
      status: 'open'
    }]);

    if (error) {
      console.error(error);
      alert("Error: " + error.message);
    } else {
      alert("Listing published successfully!");
      navigate('/');
    }
  };

  if (checking) return <div className="p-20 text-center">Checking permissions...</div>;

  if (!isApproved) {
    return (
      <div className="max-w-md mx-auto mt-20 p-10 bg-amber-50 border border-amber-200 rounded-3xl text-center shadow-sm">
        <h2 className="text-2xl font-bold text-amber-800 mb-4">Verification Required</h2>
        <p className="text-amber-700">Only approved agents can list land.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-6 text-amber-900 font-bold underline">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-blue-600 mb-6 font-medium">
        <ArrowLeft size={20} className="mr-2"/> Back
      </button>

      <h1 className="text-4xl font-black mb-2 text-slate-900">List New Land</h1>
      <p className="text-slate-500 mb-8">Set up your fractional investment opportunity.</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Property Title" 
            className="w-full p-4 border rounded-xl bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => setForm({...form, title: e.target.value})} required 
          />
          <input 
            type="text" placeholder="Location (e.g. Bonamoussadi, Douala)" 
            className="w-full p-4 border rounded-xl bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => setForm({...form, location: e.target.value})} required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="number" placeholder="Total Price (FCFA)" 
            className="w-full p-4 border rounded-xl bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => setForm({...form, total_amount: e.target.value})} required 
          />
          <input 
            type="number" placeholder="Min. Investment" 
            className="w-full p-4 border rounded-xl bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => setForm({...form, amount_per_fraction: e.target.value})} required 
          />
        </div>

        {/* NEW: DEADLINE FIELD */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Calendar size={16}/> Investment Deadline
          </label>
          <input 
            type="date" 
            className="w-full p-4 border rounded-xl bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => setForm({...form, deadline: e.target.value})} 
            required 
          />
          <p className="text-[10px] text-slate-400 font-medium italic">* When should this opportunity stop accepting new investors?</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Property Photo</label>
          <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${form.image_url ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
            {form.image_url ? (
              <div className="flex flex-col items-center">
                <img src={form.image_url} alt="Preview" className="h-32 rounded-lg mb-2 object-cover" />
                <span className="text-emerald-600 font-bold flex items-center gap-1 text-sm"><CheckCircle2 size={16}/> Image Uploaded</span>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                {uploading ? <Loader2 className="animate-spin text-blue-600 mb-2" /> : <Upload className="text-slate-400 mb-2" />}
                <span className="text-slate-600 text-sm font-medium">{uploading ? "Uploading..." : "Click to select a photo"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            )}
          </div>
        </div>

        <textarea 
          placeholder="Describe the potential of this land..." 
          className="w-full p-4 border text-slate-900 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 h-32" 
          onChange={(e) => setForm({...form, description: e.target.value})} required 
        />

        <button 
          type="submit"
          disabled={uploading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-600 transition disabled:bg-slate-300 shadow-lg"
        >
          {uploading ? "Finalizing Image..." : "Publish Opportunity"}
        </button>
      </form>
    </div>
  );
}