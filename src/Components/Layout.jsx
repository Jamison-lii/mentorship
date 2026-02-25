import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-blue-700 tracking-tighter">
            FRACTIONAL<span className="text-slate-400">REALTY</span>
          </Link>
          
          <div className="space-x-6 font-medium text-slate-600 flex items-center">
            <Link to="/" className="hover:text-blue-600">Marketplace</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-600">My Portfolio</Link>
                <button 
                  onClick={handleLogout}
                  className="bg-slate-100 text-slate-600 px-5 py-2 rounded-full hover:bg-red-50 hover:text-red-600 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">{children}</main>
    </div>
  );
}