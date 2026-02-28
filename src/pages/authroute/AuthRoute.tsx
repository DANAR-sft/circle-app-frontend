import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function AuthRoute() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  if (token) {
    useEffect(() => {
      navigate("/");
    }, []);
  } else {
    return <Outlet />;
  }
}
