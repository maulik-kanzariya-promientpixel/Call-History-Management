import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes";
import { ThemeProvider } from "./Provider/ThemeProvider";
import { CallHistoryProvider } from "./context/CallHistoryContext";

function App() {
  return (
    <ThemeProvider>
      <CallHistoryProvider>
        <RouterProvider router={router} />
      </CallHistoryProvider>
    </ThemeProvider>
  );
}

export default App;
