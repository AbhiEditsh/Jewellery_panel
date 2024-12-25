import Billing from "layouts/billing";
import Contact from "layouts/contact";
import Resume from "layouts/resume";
import Icon from "@mui/material/Icon";
import Clients from "layouts/client";
import Blog from "layouts/blog";

const routes = [
  {
    type: "collapse",
    name: "Inquiry",
    key: "inquiry",
    icon: <Icon fontSize="small">Inquiry</Icon>,
    route: "/inquiry",
    component: <Resume />,
  },
  {
    type: "collapse",
    name: "Contact",
    key: "contact",
    icon: <Icon fontSize="small">Contact</Icon>,
    route: "/contact",
    component: <Contact />,
  },
  {
    type: "collapse",
    name: "Product",
    key: "product",
    icon: <Icon fontSize="small">Product</Icon>,
    route: "/product",
    component: <Blog />,
  },
  {
    type: "collapse",
    name: "Testimonial",
    key: "testimonial",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/testimonial",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "category",
    icon: <Icon fontSize="small">Clients</Icon>,
    route: "/category",
    component: <Clients />,
  },
];

export default routes;
