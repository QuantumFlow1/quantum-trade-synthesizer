
import React from 'react';
import ResearchLab from '@/components/research/ResearchLab';

export function ResearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Research & Testing Environment</h1>
        <p className="text-gray-500 mb-8">
          A controlled space for experimenting with new components and features.
          Add elements one by one to observe their behavior without affecting the main application.
        </p>
        
        <ResearchLab />
      </div>
    </div>
  );
}

export default ResearchPage;
