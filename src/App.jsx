import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import StaticHtmlPage from './components/StaticHtmlPage.jsx';
import Header from './components/Header.jsx';

function App() {
  const location = useLocation();
  const showHeader = location.pathname !== '/';

  return (
    <div className="app-shell">
      {showHeader && <Header />}
      <main id="MainContent" className="flex flex-col grow w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections/:slug" element={<StaticHtmlPage section="collections" />} />
          <Route path="/pages/:slug" element={<StaticHtmlPage section="pages" />} />
          <Route path="/products/:slug" element={<StaticHtmlPage section="products" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
