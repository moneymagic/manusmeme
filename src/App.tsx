
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import NetworkPage from './pages/NetworkPage';
import MLM from './pages/MLM';
import NotFound from './pages/NotFound';
import CopyTradePage from './pages/CopyTradePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/network" element={<NetworkPage />} />
        <Route path="/mlm" element={<MLM />} />
        <Route path="/copy-trade" element={<CopyTradePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
