import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './component/Home';
import ErrorBoundary from './component/ErrorBoundary';
import Forecast from './component/ForecastPage';
import About from './component/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <header style={{ padding: '16px', borderBottom: '1px solid #ddd' }}>
          <NavLink to="/" style={{ marginRight: '12px' }}>Home</NavLink>
          <NavLink to="/forecast" style={{ marginRight: '12px' }}>Forecast</NavLink>
          <NavLink to="/about">About</NavLink>
        </header>

        <main style={{ padding: '16px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;