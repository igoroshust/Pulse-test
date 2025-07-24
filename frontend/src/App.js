import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/Home';
import About from './components/About/About';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Header />

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-page" element={<About />} />
        </Routes>

        <div id="layoutSidenav">
            <Sidebar />

        </div>

      </div>
    </Router>
  );
}

export default App;
