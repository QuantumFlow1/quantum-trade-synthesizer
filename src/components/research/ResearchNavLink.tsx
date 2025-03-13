
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BeakerIcon } from 'lucide-react';

export function ResearchNavLink() {
  return (
    <Link to="/research">
      <Button variant="outline" size="sm" className="gap-2">
        <BeakerIcon className="h-4 w-4" />
        Research Lab
      </Button>
    </Link>
  );
}

export default ResearchNavLink;
