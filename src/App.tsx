import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
  <AppRouter />
  </AuthProvider>

  )
}

export default App;
