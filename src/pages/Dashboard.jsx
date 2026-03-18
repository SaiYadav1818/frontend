import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn");

    if (!logged) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      <DashboardNavbar />

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-8 lg:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
