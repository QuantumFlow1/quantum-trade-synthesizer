
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Play, Pause } from "lucide-react";

interface ModelCardProps {
  id?: string;
  name: string;
  description?: string;
  isActive?: boolean;
  isEnabled?: boolean; // Added this property to match usage in LLMModelsList
  type?: string;
  apiProvider?: string; // Added this property to match usage in LLMModelsList
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, active: boolean) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  id = "",
  name,
  description,
  isActive = true,
  isEnabled, // Added this property
  apiProvider, // Added this property
  type,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  // Use isEnabled if it's provided, otherwise fall back to isActive
  const active = isEnabled !== undefined ? isEnabled : isActive;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className="flex items-center gap-2">
            {apiProvider && (
              <Badge variant="outline" className="capitalize">{apiProvider}</Badge>
            )}
            {type && (
              <Badge variant="outline">{type}</Badge>
            )}
            <Badge variant={active ? "success" : "secondary"}>
              {active ? "Actief" : "Inactief"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-2">
        {onToggleActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleActive(id, !active)}
          >
            {active ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {active ? "Deactiveer" : "Activeer"}
          </Button>
        )}
        
        {onEdit && (
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => onEdit(id)}
          >
            <Edit className="h-4 w-4 mr-1" /> Bewerk
          </Button>
        )}
        
        {onDelete && (
          <Button 
            variant="destructive"
            size="sm" 
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Verwijder
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
