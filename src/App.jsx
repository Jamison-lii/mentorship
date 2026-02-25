import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Marketplace from './Pages/MarketPlace';
import OpportunityDetails from './Pages/OpportunityDetails';
import Dashboard from './Pages/Dashboard';
import CreateListing from './Pages/CreateListing';
import Auth from './Pages/Auth';
import AdminPanel from './Pages/AdminPanel';
import Verification from './Pages/Verification';
// Import your Signup/Login pages here once you create the files
// import Signup from './pages/Signup'; 

function App() {
  return (
    <Router>
      <Layout>
       <Routes>
  <Route path="/" element={<Marketplace />} />
  <Route path="/opportunity/:id" element={<OpportunityDetails />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/create-listing" element={<CreateListing />} />
  <Route path="/admin" element={<AdminPanel />} />
  <Route path="/verification" element={<Verification />} />
</Routes>
      </Layout>
    </Router>
  );
}

export default App;