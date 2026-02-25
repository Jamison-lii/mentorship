import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { CheckCircle, XCircle, User, ShieldCheck } from 'lucide-react';

export default function AdminPanel() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  async function fetchPendingUsers() {
    // Only fetch users who are waiting for approval
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('verification_status', 'pending');
    
    if (!error) setPendingUsers(data);
    setLoading(false);
  }

  const handleApprove = async (userId) => {
    const { error } = await supabase
      .from('profiles')
      .update({ verification_status: 'approved' })
      .eq('id', userId);

    if (!error) {
      alert("User Approved! They can now list properties.");
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500">Accessing Admin Records...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900">Admin Control</h1>
      </div>

      <h2 className="text-xl font-bold mb-6 text-slate-600">Pending Agent Approvals</h2>

      {pendingUsers.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-dashed text-center text-slate-400">
          No pending verification requests at the moment.
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingUsers.map((profile) => (
            <div key={profile.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-4 rounded-full text-slate-500">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{profile.full_name}</h3>
                  <p className="text-sm text-slate-500">{profile.office_address || "No Office Address Provided"}</p>
                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md mt-2 inline-block">PENDING REVIEW</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                <button 
                  onClick={() => handleApprove(profile.id)}
                  className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-600 transition"
                >
                  <CheckCircle size={18} /> Approve
                </button>
                <button className="flex items-center gap-2 bg-slate-100 text-slate-600 px-5 py-2 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition">
                  <XCircle size={18} /> Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}