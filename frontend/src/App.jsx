import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomeContainer from './containers/HomeContainer';
import ForecastContainer from './containers/ForecastContainer';
import ErrorBoundary from './component/ErrorBoundary';
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
            <Route path="/" element={<HomeContainer />} />
            <Route path="/forecast" element={<ForecastContainer />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;