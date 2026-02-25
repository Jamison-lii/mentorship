import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, Building2, Wallet, 
  ShieldAlert, Clock, LogOut, MapPin,
  TrendingUp, Landmark, ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const [myInvestments, setMyInvestments] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // 1. Fetch Profile
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);
      
      setUserProfile(profiles?.[0] || { verification_status: 'unverified', full_name: 'Investor' });

      // 2. Fetch Investments (Fractions bought by user)
      const { data: invData, error: invError } = await supabase
        .from('investments')
        .select(`
          id, 
          fractions_bought, 
          amount_committed, 
          investment_opportunities (
            id,
            title, 
            location, 
            image_url
          )
        `)
        .eq('user_id', user.id);
      
      if (invError) console.error("Investment Fetch Error:", invError.message);
      else setMyInvestments(invData || []);

      // 3. Fetch My Listings (Land posted by this user)
      const { data: listData, error: listError } = await supabase
        .from('investment_opportunities')
        .select('*')
        .eq('created_by', user.id);

      if (listError) console.error("Listings Fetch Error:", listError.message);
      else setMyListings(listData || []);

    } catch (err) {
      console.error("Dashboard Logic Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-500 font-medium tracking-tight">Syncing your portfolio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      {/* --- ALERTS SECTION --- */}
      <div className="mb-10 space-y-4">
        {(userProfile?.verification_status === 'unverified') && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl"><ShieldAlert size={28}/></div>
              <div>
                <h4 className="font-bold text-lg">Verification Required</h4>
                <p className="text-blue-100 text-sm">You need to be a verified agent to list property for investment.</p>
              </div>
            </div>
            <Link to="/verification" className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black hover:scale-105 transition-transform shadow-lg">
              Verify Now
            </Link>
          </div>
        )}

        {userProfile?.verification_status === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 animate-pulse"><Clock size={28}/></div>
            <div>
              <h4 className="font-bold text-amber-900">Application Under Review</h4>
              <p className="text-amber-700 text-sm">We are verifying your office address. You'll be able to list land soon.</p>
            </div>
          </div>
        )}
      </div>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Hi, {userProfile?.full_name?.split(' ')[0] || 'Investor'}
          </h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-500"/> Your portfolio is growing.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {userProfile?.verification_status === 'approved' && (
            <Link to="/create-listing" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <PlusCircle size={20} /> List New Land
            </Link>
          )}
          <button onClick={handleSignOut} className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-red-50 hover:text-red-600 transition">
            <LogOut size={22} />
          </button>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Portfolio Value</p>
          <h2 className="text-4xl font-black text-slate-900">
            {myInvestments.reduce((sum, inv) => sum + (inv.amount_committed || 0), 0).toLocaleString()}
            <span className="text-lg ml-1 font-medium text-slate-400 font-sans">FCFA</span>
          </h2>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Total Fractions</p>
          <h2 className="text-4xl font-black text-slate-900">
            {myInvestments.reduce((sum, inv) => sum + (inv.fractions_bought || 0), 0)}
          </h2>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Account Status</p>
          <div className="flex items-center gap-3">
            <div className={`h-4 w-4 rounded-full ${userProfile?.verification_status === 'approved' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'}`}></div>
            <h2 className="text-2xl font-black capitalize text-slate-900">{userProfile?.verification_status || 'Unverified'}</h2>
          </div>
        </div>
      </div>

      {/* --- MY LISTINGS SECTION (LAND YOU CREATED) --- */}
      {myListings.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Landmark className="text-blue-600" size={24}/>
            <h3 className="text-2xl font-black text-slate-900">Properties You've Listed</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map(item => (
              <Link to={`/opportunity/${item.id}`} key={item.id} className="bg-white overflow-hidden rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
                <div className="h-40 bg-slate-200 relative">
                  <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-900">
                    {item.status}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-black text-slate-900 text-lg">{item.title}</h4>
                  <p className="text-slate-500 text-sm flex items-center gap-1 mt-1"><MapPin size={12}/> {item.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* --- MY INVESTMENTS SECTION (FRACTIONS YOU BOUGHT) --- */}
      <div className="flex items-center gap-2 mb-8">
        <Wallet className="text-blue-600" size={24}/>
        <h3 className="text-2xl font-black text-slate-900">My Investment Portfolio</h3>
      </div>
      
      <div className="space-y-4">
        {myInvestments.length > 0 ? (
          myInvestments.map((inv) => (
            <div key={inv.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all flex flex-col md:flex-row justify-between md:items-center shadow-sm">
              <div className="flex items-center gap-5">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-100">
                   <img src={inv.investment_opportunities?.image_url} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 leading-tight">
                    {inv.investment_opportunities?.title || 'Unknown Property'}
                  </h4>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                      <MapPin size={12} /> {inv.investment_opportunities?.location}
                    </span>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      {inv.fractions_bought} Fractions
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex justify-between md:flex-col items-center md:items-end border-t md:border-0 pt-4 md:pt-0">
                <p className="text-2xl font-black text-slate-900">{inv.amount_committed?.toLocaleString()} <span className="text-xs text-slate-400">FCFA</span></p>
                <Link to={`/opportunity/${inv.investment_opportunities?.id}`} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                   View Project <ArrowRight size={14}/>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-slate-300">
              <Wallet size={32} />
            </div>
            <p className="text-slate-900 font-black text-xl">No investments found.</p>
            <p className="text-slate-500 mt-2 mb-8">Your portfolio is currently empty.</p>
            <Link to="/" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 transition shadow-lg">
              Start Investing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}