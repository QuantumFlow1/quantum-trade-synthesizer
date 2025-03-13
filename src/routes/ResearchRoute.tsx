
import React from 'react';
import { Route } from 'react-router-dom';
import ResearchPage from '@/pages/ResearchPage';

export const ResearchRoute = (
  <Route path="/research" element={<ResearchPage />} />
);

export default ResearchRoute;
