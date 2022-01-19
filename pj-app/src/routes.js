import { Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";

const routes = (isLoggedIn) => [
  {
    path: "/",
    element: isLoggedIn ? <Home /> : <Navigate to="/login" />,
  },
  { path: "/login", element: <LoginPage /> },
];

export default routes;
