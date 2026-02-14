import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Marketplace from './Pages/MarketPlace';
import PropertyDetail from './Pages/PropertyDetail';
import { UserProvider } from './context/userContext';
import Portfolio from './Pages/Portfolio';
import LandingPage from './Pages/LandingPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path='/marketplace' element={<Marketplace />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}
export default App;