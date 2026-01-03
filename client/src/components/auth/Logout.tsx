import React from "react";
import { useLogin } from "@/context/LoginContext";

const LogoutButton: React.FC = () => {
  const { logout } = useLogin();

  return (
    <button
      onClick={logout}
      className="
        inline-flex items-center gap-2
        rounded-md border border-border
        bg-background px-3 py-1.5
        text-xs font-medium
        text-foreground
        hover:bg-muted
        transition
      "
    >
      Logout
    </button>
  );
};

export default LogoutButton;
