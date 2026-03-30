import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import MoodCheckIn from "./pages/MoodCheckIn";
import Results from "./pages/Results";
import MealDetail from "./pages/MealDetail";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import AIChef from "./pages/AIChef";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/mood" element={<MoodCheckIn />} />
            <Route path="/results/:moodId" element={<Results />} />
            <Route path="/meal/:id" element={<MealDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-chef" element={<AIChef />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
