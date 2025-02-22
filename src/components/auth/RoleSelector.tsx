
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserRole } from "@/types/auth"
import { Mail, Shield, ShieldAlert } from "lucide-react"

interface RoleSelectorProps {
  value: UserRole
  onValueChange: (value: UserRole) => void
}

export const RoleSelector = ({ value, onValueChange }: RoleSelectorProps) => {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecteer een rol" />
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
      </SelectContent>
    </Select>
  )
}
