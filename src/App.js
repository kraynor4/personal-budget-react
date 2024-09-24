import './App.scss';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importing only what is necessary

import Menu from './Menu/Menu'; 
import Hero from './Hero/Hero'; 
import HomePage from './HomePage/HomePage';
import Footer from './Footer/Footer';
import AboutPage from './AboutPage/AboutPage';
import LoginPage from './LoginPage/LoginPage';

function App() {
  return (
    <Router>
      <Menu />
      <Hero />
      <div className='mainContainer'> 
        <Routes> {/* Replacing switch with Routes */}
          <Route path='/about' element={<AboutPage />} /> {/* Use element prop to render components */}
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<HomePage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;