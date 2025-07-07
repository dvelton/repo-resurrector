import { Layout } from "@/components/layout/Layout";
import { Router } from "@/components/Router";
import { AuthProvider } from "@/contexts/AuthContext";
import { RepositoryProvider } from "@/contexts/RepositoryContext";
import { LeaderboardProvider } from "@/contexts/LeaderboardContext";

function App() {
  return (
    <AuthProvider>
      <RepositoryProvider>
        <LeaderboardProvider>
          <Layout>
            <Router />
          </Layout>
        </LeaderboardProvider>
      </RepositoryProvider>
    </AuthProvider>
  );
}

export default App;