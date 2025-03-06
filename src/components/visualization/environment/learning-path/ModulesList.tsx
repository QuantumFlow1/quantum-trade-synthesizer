
import React, { useState } from 'react';
import { LearningModule, EnvironmentType } from '@/types/virtual-environment';
import { ModuleCard } from './ModuleCard';

interface ModulesListProps {
  modules: LearningModule[];
  environmentId: EnvironmentType;
}

export const ModulesList: React.FC<ModulesListProps> = ({ modules, environmentId }) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  
  return (
    <div className="grid gap-4">
      {modules.map((module) => (
        <ModuleCard 
          key={module.id}
          module={module}
          environmentId={environmentId}
          isExpanded={expandedModuleId === module.id}
          onExpand={() => setExpandedModuleId(module.id)}
        />
      ))}
    </div>
  );
};
