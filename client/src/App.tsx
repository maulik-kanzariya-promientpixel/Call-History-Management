import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes";
import { ThemeProvider } from "./providers/ThemeProvider";
import { CallHistoryProvider } from "./context/CallHistoryContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginProvider } from "./context/LoginContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, 
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LoginProvider>
        <CallHistoryProvider>
          <RouterProvider router={router} />
        </CallHistoryProvider>
        </LoginProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
