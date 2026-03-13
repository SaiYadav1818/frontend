import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductList from "../dashboard/ProductList";
import DashboardNavbar from "../components/DashboardNavbar";
import BuyGold from "../dashboard/BuyGold";
import SellGold from "../dashboard/SellGold";
import Portfolio from "../dashboard/Portfolio";
import Profile from "../dashboard/Profile";

function Dashboard() {

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const tabFromURL = params.get("tab") || "profile";

  const [activeTab, setActiveTab] = useState(tabFromURL);

  useEffect(() => {

    const logged = localStorage.getItem("isLoggedIn");

    if (!logged) {
      navigate("/login");
    }

  }, []);

  const renderContent = () => {

    switch (activeTab) {

      case "profile":
        return <Profile />;

      case "portfolio":
        return <Portfolio />;

      case "buy":
        return <BuyGold />;

      case "sell":
        return <SellGold />;

      default:
        return null;

    }

  };
return (

  <div className="bg-black min-h-screen text-white">

    <DashboardNavbar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />

    <div className="flex">

      {/* LEFT PRODUCTS */}
      <ProductList setActiveTab={setActiveTab}/>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-10">

        {renderContent()}

      </div>

    </div>

  </div>

);

}


export default Dashboard;