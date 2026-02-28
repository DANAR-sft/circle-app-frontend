import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/authroute/LoginPage";
import { RegisterPage } from "./pages/authroute/RegisterPage";
import { HomePage } from "./pages/privateroute/HomePage";
import { PrivateRoute } from "./pages/privateroute/PrivateRoute";
import { AuthRoute } from "./pages/authroute/AuthRoute";
import { DetailThreadPage } from "./pages/privateroute/DetailThreadPage";
import { ThreadList } from "./components/ThreadList";
import { DetailProfilePage } from "./pages/privateroute/DetailProfilePage";
import { FollowsPage } from "./pages/privateroute/FollowsPage";
import { SearchPage } from "./pages/privateroute/SearchPage";
import { useTheme } from "@/hooks/useTheme";

function App() {
  useTheme();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          {/* HomePage sebagai layout, children akan di-render di dalamnya */}
          <Route element={<HomePage />}>
            <Route index element={<ThreadList />} />
            <Route path="/status/:id" element={<DetailThreadPage />} />
            <Route path="/profile/:id" element={<DetailProfilePage />} />
            <Route path="/follows" element={<FollowsPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
