import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircumIcon from "@klarr-agency/circum-icons-react";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem(
    "Dashbord",
    "/admin",
    <div className="px-1 ">
      <CircumIcon name="grid_4-1" size={18} />
    </div>
  ),
  getItem(
    "Boissons",
    "/products",
    <div className="px-1 ">
      <CircumIcon name="box_list" size={18} />
    </div>,
    [
      getItem("produits", "products"),
      getItem("Achats", "purchase"),
      getItem("Stock", "stock"),
      getItem("Avaris", "issue"),
      getItem("Magasin Vide", "empty"),
    ]
  ),
  getItem(
    "Ventes",
    "sales",
    <div className="px-1 ">
      <CircumIcon name="shopping_cart" size={18} />
    </div>
  ),

  getItem(
    "Reconciliation",
    "team report",
    <div className="px-1 ">
      <CircumIcon name="delivery_truck" size={18} />
    </div>
  ),
  getItem(
    "Finances",
    "finances",
    <div className="px-1 ">
      <CircumIcon name="money_check_1" size={18} />
    </div>,
    [getItem("Approvisionement", "income"), getItem("Depenses", "expenses")]
  ),

  getItem(
    "Utilisateurs",
    "users",
    <div className="px-1 ">
      <CircumIcon name="user" size={18} />
    </div>
  ),
  getItem(
    "Equipes",
    "teams",
    <div className="px-1 ">
      <CircumIcon name="user" size={18} />
    </div>
  ),

  getItem(
    "Rapports",
    "reports",
    <div className="px-1 ">
      <CircumIcon name="view_list" size={18} />
    </div>,
    [
      getItem("Ristournes", "ristourn"),
      getItem("Generer rapport", "generate reports"),
    ]
  ),
];

const SideNav = ({ content }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const onClick = (e) => {
    navigate(e.key);
    console.log(e.key);
  };

  return (
    <Layout
      className="w-auto "
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />

        <Menu
          onClick={onClick}
          theme="dark"
          defaultSelectedKeys={["/"]}
          mode="inline"
          items={items}
        />
      </Sider>
      {content}
    </Layout>
  );
};

export default SideNav;
