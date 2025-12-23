import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../features/auth";
import { UserProvider } from "../features/user";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          {children}
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}