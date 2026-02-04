import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
const { isAuthenticated } = useAuth();


return isAuthenticated ? <Dashboard/> : <Login/>
}

export default App;
