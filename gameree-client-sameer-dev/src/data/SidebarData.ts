export const SidebarNavigation = [
  {
    name: "Account Overview",
    href: "/account/accountoverview",
    icon: "icon-crt",
  },
  {
    name: "My Projects",
    href: "/account",
    href1: "/account/myprojects",
    icon: "icon-project",
    subItem: [
      { name: "Completed", href: "#" },
      { name: "Draft", href: "#" },
      { name: "My Favorites", href: "#" },
    ],
  },
  {
    name: "My Orders",
    href: "/account/myorders",
    href1: "/account/myorders/orderslist",
    href2: "/account/myorders/ordersdetail",
    icon: "icon-order",
  },
  {
    name: "My Uploads",
    href: "/account/myuploads",
    href1: "/account/myuploads/uploadlist",
    icon: "icon-upload1",
  },
  {
    name: "Payment & Shipping",
    href: "/account/payment",
    href1: "/account/payment/savedpayment",
    href2: "/account/payment/savedaddress",
    href3: "/account/payment/editpayment",
    icon: "icon-Vector",
    subItem: [
      { name: "Saved Payments", href: "/account/payment/savedpayment" },
      { name: "Saved Addresses", href: "/account/payment/savedaddress" },
    ],
  },
  {
    name: "Account Settings",
    href: "/account/accountsetting",
    tab: 'user',
    href2: "/account/editpassword",
    icon: "icon-account",
    subItem: [
      { name: "User Details", tab: "user", href: '/account/accountsetting?tab=user' },
      { name: "Company Details", tab: "company", href: '/account/accountsetting?tab=company' },
    ],
  },
];
