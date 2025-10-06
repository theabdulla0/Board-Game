import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import CreateBoard from "./pages/Board/CreateBoard";
import ViewBoars from "./pages/Board/ViewBoars";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" index element={<Home />} />
            <Route path="/board/create" element={<CreateBoard />} />
            <Route path="/board" element={<ViewBoars />} />
          </Route>
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
