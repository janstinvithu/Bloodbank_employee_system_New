import React, { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import { FloatButton } from "antd";
import { useNavigate } from "react-router-dom";

import {
  HomeOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";

import Logo from "../src/Common/medical_logo.png"

const { Header, Content, Footer, Sider } = Layout;

const loggedInUserType = localStorage.getItem("loggedInUserType");

const adminUserItems = [
  {
    key: "dashboard",
    icon: <HomeOutlined />,
    label: "Home",
  },
  // Employee Management
  {
    key: "employee",
    icon: <TeamOutlined />,
    label: "Employee Management",
    children: [
      {
        key: "employee",
        icon: <StarOutlined />,
        label: "Employee",
      },
      {
        key: "attendance",
        icon: <ClockCircleOutlined />,
        label: "Attendance",
      },
      {
        key: "payroll",
        icon: <DollarCircleOutlined />,
        label: "Payroll",
      },
      {
        key: "leaveRequest",
        icon: <ReadOutlined />,
        label: "Leave Tracking",
      },
    ],
  },
];

const employeeUserItems = [
  {
    key: "dashboard",
    icon: <HomeOutlined />,
    label: "Home",
  },
  {
    key: "employee",
    icon: <TeamOutlined />,
    label: "Attendance & Leave ",
    children: [
      {
        key: "attendance",
        icon: <ClockCircleOutlined />,
        label: "Attendance",
      },
      {
        key: "leaveRequest",
        icon: <ReadOutlined />,
        label: "Leave Request",
      },
    ],
  },
];

const headerItems = [
  { key: "1", text: "User", icon: <UserSwitchOutlined /> },
  { key: "2", text: "LogOut", icon: <LogoutOutlined /> },
];

const App = ({ children, userType }) => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [isBackTopVisible, setIsBackTopVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      setIsBackTopVisible(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleHeaderClick = (key) => {
    if (key === "2") {
      localStorage.setItem("authToken", null);
      localStorage.setItem("loggedInUserType", null);
      navigate("/");
    }
  };

  const handleMenuClick = (item) => {
    switch (item.key) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "employee":
        navigate("/employee");
        break;
      case "attendance":
        navigate("/attendance");
        break;
      case "payroll":
        navigate("/payroll");
        break;
      case "leaveRequest":
        navigate("/leaveTracking");
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        style={{ backgroundColor: "#b04a53", color: "white" }}
      >
        <div
          className="demo-logo-vertical"
          style={{
            height: "75px",
            width: "200px",
            backgroundColor: "#b04a53",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft:"20px"
          }}
        >
          <img
            alt="Logo"
            src={Logo}
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "#b04a53",
              display: "flex",
            alignItems: "center",
            justifyContent: "center",
            }}
          />
        </div>

        <Menu
          defaultSelectedKeys={["dashboard"]}
          mode="inline"
          items={userType === "admin" ? adminUserItems : employeeUserItems}
          onClick={handleMenuClick}
          style={{
            position: "sticky",
            marginTop: "10px",
            background: "#b04a53",
            color: "black", // Change text color to black
            fontSize: "16px", // Adjust the font size as per your requirement
            fontWeight: "bold",
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#b04a53",
          }}
        >
          <div className="demo-logo" />
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {headerItems.map((item) => (
              <Button
                key={item.key}
                type="text"
                icon={item.icon}
                style={{
                  color: "black",
                  background: "#b04a53",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                onClick={() => handleHeaderClick(item.key)}
              >
                {item.text}
              </Button>
            ))}
          </div>
        </Header>
        <Content style={{ margin: "0 20px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {isBackTopVisible && (
              <FloatButton.Group
                shape="circle"
                style={{
                  right: 24,
                  background: "#b04a53",
                }}
              >
                <FloatButton.BackTop visibilityHeight={0} />
              </FloatButton.Group>
            )}
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
};

export default App;