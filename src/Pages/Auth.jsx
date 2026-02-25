import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else navigate('/');
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);
      
      // Create the profile entry immediately
      await supabase.from('profiles').insert([{ id: data.user.id, full_name: fullName }]);
      alert("Registration successful! Please check your email.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <h2 className="text-3xl font-black mb-6 text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      <form onSubmit={handleAuth} className="space-y-4">
        {!isLogin && (
          <input type="text" placeholder="Full Name" className="w-full text-slate-900 p-4 rounded-xl border bg-slate-50" 
                 onChange={(e) => setFullName(e.target.value)} required />
        )}
        <input type="email" placeholder="Email" className="w-full text-slate-900 p-4 rounded-xl border bg-slate-50" 
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full text-slate-900 p-4 rounded-xl border bg-slate-50" 
               onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-slate-500 text-sm">
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
      </button>
    </div>
  );
}