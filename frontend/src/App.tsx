import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/public/login";
import Register from "./pages/public/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
