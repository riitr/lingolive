import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './pages/About';
import Footer from './pages/Footer';
import Header from './pages/Header';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Work from './pages/Work';


function App() {

  return (
    <Router>
      <div className="min-h-screen bg-[#fafafa] text-gray-900">
        {/* Navigation */}
        <Header />

        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Work />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/" element={<Home />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;