
import React from "react";
import { ModelCard } from "./ModelCard";

export interface ModelItem {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  type?: string;
}

interface ModelListProps {
  models: ModelItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, active: boolean) => void;
}

export const ModelList: React.FC<ModelListProps> = ({
  models,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  if (models.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Geen modellen gevonden</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {models.map((model) => (
        <ModelCard
          key={model.id}
          id={model.id}
          name={model.name}
          description={model.description}
          isActive={model.isActive}
          type={model.type}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};
