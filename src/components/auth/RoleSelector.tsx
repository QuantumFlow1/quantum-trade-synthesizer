
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, Shield, ShieldAlert } from "lucide-react"
import { UserRole } from "@/types/auth"

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  disabled?: boolean;
}

export const RoleSelector = ({
  selectedRole,
  onRoleChange,
  disabled = false
}: RoleSelectorProps) => {
  return (
    <Select
      value={selectedRole}
      onValueChange={(value: UserRole) => onRoleChange(value)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer">
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Viewer
          </div>
        </SelectItem>
        <SelectItem value="trader">
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Trader
          </div>
        </SelectItem>
        <SelectItem value="admin">
          <div className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </div>
        </SelectItem>
        <SelectItem value="super_admin">
          <div className="flex items-center">
            <ShieldAlert className="mr-2 h-4 w-4" />
            Super Admin
          </div>
        </SelectItem>
        <SelectItem value="lov_trader">
          <div className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Lov Trader
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
