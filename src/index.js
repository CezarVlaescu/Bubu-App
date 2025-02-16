import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage/homepage.tsx';
import LinkChecker from './pages/linkChecker/linkChecker.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Homepage/>}/>
        <Route path="/link-checker" element={<LinkChecker/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);