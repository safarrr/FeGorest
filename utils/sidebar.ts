import { HomeOutlined, AppstoreOutlined } from "@ant-design/icons";
import { createElement } from "react";
const linkSidebar = [
  {
    key: "home",
    icon: createElement(HomeOutlined),
    label: "Home",
    link: "/",
  },
  {
    key: "allPost",
    icon: createElement(AppstoreOutlined),
    label: "Post",
    link: "/post",
  },
];
export default linkSidebar;
