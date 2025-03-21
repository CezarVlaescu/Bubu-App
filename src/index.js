import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage/homepage.tsx';
import LinkChecker from './pages/linkChecker/linkChecker.tsx';
import SummarizeArticles from './pages/summarizeArticles/summarizeArticles.tsx';
import InvestigationHelper from './pages/investigationHelper/investigationHelper.tsx';
import PEPCreator from './pages/pepCreator/pepCreator.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Homepage/>}/>
        <Route path="/link-checker" element={<LinkChecker/>}/>
        <Route path="/summarize-articles" element={<SummarizeArticles />} />
        <Route path='/investigation-helper' element={<InvestigationHelper />} />
        <Route path='/pep-creator' element={<PEPCreator />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);