
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Loading your trading dashboard...</h1>
        <p className="text-muted-foreground mt-2">Please wait while we set things up.</p>
      </div>
    </div>
  );
};

export default IndexPage;
