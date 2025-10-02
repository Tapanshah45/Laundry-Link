import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PhoneLogin } from "@/components/PhoneLogin";
import { Dashboard } from "@/components/Dashboard";

interface User {
  name: string;
  phone: string;
  room: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          {!user ? (
            <PhoneLogin onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Dashboard user={user} onLogout={handleLogout} />
          )}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
