import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function PrivateRoute() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  if (!token) {
    useEffect(() => {
      navigate("/login");
    }, []);
  } else {
    return <Outlet />;
  }
}
