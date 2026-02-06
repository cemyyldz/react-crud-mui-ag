import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import UserDetail from "./pages/UserDetail";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
function App() {
  const { isAuthenticated } = useAuth();


  return (
    <BrowserRouter>

      {isAuthenticated && <Navbar />}

      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/user/:id" element={<UserDetail />} />

      </Routes>


    </BrowserRouter>

  );
}

export default App;
