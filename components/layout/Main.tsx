import React, { Children, useState } from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Layout, Menu, theme } from "antd";
import linkSidebar from "@/utils/sidebar";
import { useRouter } from "next/router";
import Link from "next/link";

const { Header, Content, Footer, Sider } = Layout;

const scrollbarStyle: React.CSSProperties = {
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
  margin: "24px 16px 0",
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, colorPrimaryText, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout hasSider className=" h-screen overflow-hidden">
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="m-5">
          <h1
            style={{ color: colorPrimaryText }}
            className="text-xl text-center"
          >
            FeGorest
          </h1>
        </div>
        <Menu
          mode="inline"
          items={linkSidebar.map((v) => ({
            key: v.key,
            icon: v.icon,
            label: <Link href={v.link}>{v.label}</Link>,
          }))}
        ></Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content className="h-screen overflow-y-auto " style={scrollbarStyle}>
          <div>{children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ©{new Date().getFullYear()} Created by safarudin
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
