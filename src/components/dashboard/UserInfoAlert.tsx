
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { UserProfile } from "@/types/auth";

interface UserInfoAlertProps {
  userProfile: UserProfile | null;
  isAdmin: boolean;
}

export const UserInfoAlert: React.FC<UserInfoAlertProps> = ({ userProfile, isAdmin }) => {
  return (
    <Alert className="max-w-md mx-auto mt-4 mb-2">
      <Info className="h-4 w-4" />
      <AlertTitle>User Information</AlertTitle>
      <AlertDescription>
        <p><strong>Email:</strong> {userProfile?.email}</p>
        <p><strong>Role:</strong> {userProfile?.role || 'No role assigned'}</p>
        <p><strong>Should see admin panel:</strong> {isAdmin ? 'Yes' : 'No'}</p>
      </AlertDescription>
    </Alert>
  );
};
