
import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import Apex from "./ApexChart.js"


const Dashboard = () => {
  const [loggedInUserType, setLoggedInUserType] = useState('');

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);

  return (
    <Layout userType={loggedInUserType}>
      <h1>Dashboard</h1>
      <p>Welcome to the Admin dashboard!</p>
      {loggedInUserType && <p>User Type: {loggedInUserType}</p>}
      <Apex></Apex>

    
    </Layout>
  );
};

export default Dashboard;