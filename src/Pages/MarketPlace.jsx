import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import OpportunityCard from '../Components/OpportunityCard';

export default function Marketplace() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    const { data, error } = await supabase
      .from('investment_opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setOpportunities(data);
    setLoading(false);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Invest in Land from 100,000 FCFA</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Join thousands of Cameroonians co-owning prime real estate in Douala, Buea, and Yaoundé.
        </p>
      </section>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Available Opportunities</h2>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}