import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

function App() {
const { isAuthenticated } = useAuth();


return isAuthenticated ? (
  <>
  <Navbar/>
  <Dashboard/>
  </>
):(
  <Login/>
);


}

export default App;
