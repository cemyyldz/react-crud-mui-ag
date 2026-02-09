import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import UserDetail from "./pages/UserDetail";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
function App() {
  const { isAuthenticated } = useAuth();
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  }


  return (
    <BrowserRouter>

      {isAuthenticated && <Navbar />}

      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        />


        <Route path="/user/:id" element={
          <ProtectedRoute>
            <UserDetail />
          </ProtectedRoute>
        }
        />

      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={3000} 
        hideProgressBar={false}
        theme="colored"
      />


    </BrowserRouter>

  );
}

export default App;
