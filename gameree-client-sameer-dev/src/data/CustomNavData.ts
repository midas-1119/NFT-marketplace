import {
  ArrowPathIcon,
  Bars3Icon,
  BookmarkSquareIcon,
  CalendarIcon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  LifebuoyIcon,
  PhoneIcon,
  PlayIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export const NavigationData = {
  categories: [
    {
      name: "Marketplace",
      href: "/marketplace",
      subcategory: [
        {
          name: "All NFTs",
          description: "All in one place! Discover our collection of NFTs now",
          href: "/marketplace",
          icon: ChartBarIcon,
        },
        {
          name: "Sale",
          description:
            "Mint and become the first owner to earn royalties for the property’s lifetime",
          href: "/marketplace",
          icon: CursorArrowRaysIcon,
        },
        {
          name: "ReSale",
          description: "Properties available on resale",
          href: "/marketplace",
          icon: ShieldCheckIcon,
        },
      ],
    },
    {
      name: "Metaverse",
      href: "",
      subcategory: [
        {
          name: "3d World",
          description:
            "Experience the 3D view of the  metaverse and discover a new dimension of unique digital assets",
          href: "/mapview/view3d",
          icon: CursorArrowRaysIcon,
        },
        {
          name: "2d World",
          description:
            "Step into a whole new world - Explore 2D view of the metaverse",
          href: "/mapview/view2d",
          icon: ChartBarIcon,
        },
        // {
        //   name: "3d World",
        //   description:
        //     "Speak directly to your customers in a more meaningful way.",
        //   href: "/mapview",
        //   icon: CursorArrowRaysIcon,
        // },
        {
          name: "Metaverse rooms",
          description: "This feature will be supported in future",
          href: "#",
          icon: ShieldCheckIcon,
        },
        {
          name: "Perpetual Swaps",
          description:
            "This feature will be supported in future, property owners will be able to offer perpetual swaps contract on their properties",
          href: "#",
          icon: Squares2X2Icon,
        },
      ],
    },
    {
      name: "Offers",
      href: "",
      subcategory: [
        {
          name: "Received",
          description:
            "Never miss a great deal - Keep track of received offers",
          // description:
          //   "Get a better understanding of where your traffic is coming from.",
          href: "/recieveOffers",
          icon: ChartBarIcon,
        },
        {
          name: "Sent",
          description:
            "Manage your negotiations - Keep track of your sent offers",
          // description:
          //   "Speak directly to your customers in a more meaningful way.",
          href: "/sendOffers",
          icon: CursorArrowRaysIcon,
        },
        {
          name: "Successful",
          // description: "Your customers' data will be safe and secure.",
          description:
            "Manage your negotiations - Keep track of your successfull offers",
          href: "#",
          icon: ShieldCheckIcon,
        },
      ],
    },
    {
      name: "Auction",
      subcategory: [
        {
          name: "Auction Tracking",
          description: "Keep track of your auctioned assets",
          // description:
          //   "Get a better understanding of where your traffic is coming from.",
          href: "/auctionTracking",
          icon: ChartBarIcon,
        },
        {
          name: "Bid Tracking",
          description: "Keep track of your bids",
          // description:
          //   "Speak directly to your customers in a more meaningful way.",
          href: "/bidTracking",
          icon: CursorArrowRaysIcon,
        },
      ],
    },
    {
      name: "Rent Property",
      subcategory: [
        {
          name: "To Gameree",
          description: "This feature will be supported in future",
          // description:
          //   "Get a better understanding of where your traffic is coming from.",
          href: "#",
          icon: ChartBarIcon,
        },
        {
          name: "To Metaverse",
          description: "This feature will be supported in future",
          // description:
          //   "Speak directly to your customers in a more meaningful way.",
          href: "#",
          icon: CursorArrowRaysIcon,
        },
      ],
    },
    {
      name: "Gameree Academy",
      href: "/academy",
      subcategory: [
        {
          name: "Why Gameree",
          description: "Learn everything you need to know about GameRee",
          // href: "/academy",
          href: "https://abduls-organization-2.gitbook.io/gameree-documentaion/",
          icon: ChartBarIcon,
        },
        // {
        //   name: "Why Trade",
        //   description: "This feature will be supported in future",
        //   // description:
        //   //   "Speak directly to your customers in a more meaningful way.",
        //   href: "#",
        //   icon: CursorArrowRaysIcon,
        // },
        // {
        //   name: "How to Earn",
        //   description: "This feature will be supported in future",
        //   // description:
        //   //   "Speak directly to your customers in a more meaningful way.",
        //   href: "#",
        //   icon: CursorArrowRaysIcon,
        // },
        // {
        //   name: "How to Buy",
        //   description: "This feature will be supported in future",
        //   // description:
        //   //   "Speak directly to your customers in a more meaningful way.",
        //   href: "#",
        //   icon: CursorArrowRaysIcon,
        // },
        // {
        //   name: "How to Sell",
        //   description: "This feature will be supported in future",
        //   // description:
        //   //   "Speak directly to your customers in a more meaningful way.",
        //   href: "#",
        //   icon: CursorArrowRaysIcon,
        // },
        // {
        //   name: "Buy Back Policy",
        //   description: "This feature will be supported in future",
        //   // description:
        //   //   "Speak directly to your customers in a more meaningful way.",
        //   href: "#",
        //   icon: CursorArrowRaysIcon,
        // },
      ],
    },
    // {
    //   name: "USDG",
    //   href: "",
    //   subcategory: [
    //     {
    //       name: "BNB",
    //       description:
    //         "Get a better understanding of where your traffic is coming from.",
    //       href: "#",
    //       icon: ChartBarIcon,
    //     },
    //     {
    //       name: "ETH",
    //       description:
    //         "Speak directly to your customers in a more meaningful way.",
    //       href: "#",
    //       icon: CursorArrowRaysIcon,
    //     },
    //     {
    //       name: "USDT",
    //       description:
    //         "Speak directly to your customers in a more meaningful way.",
    //       href: "#",
    //       icon: CursorArrowRaysIcon,
    //     },
    //   ],
    // },
  ],
};

export const callsToAction = [
  { name: "Watch Demo", href: "#", icon: PlayIcon },
  { name: "Contact Sales", href: "#", icon: PhoneIcon },
];

export const resources = [
  {
    name: "Help Center",
    description:
      "Get all of your questions answered in our forums or contact support.",
    href: "#",
    icon: LifebuoyIcon,
  },
  {
    name: "Guides",
    description:
      "Learn how to maximize our platform to get the most out of it.",
    href: "#",
    icon: BookmarkSquareIcon,
  },
  {
    name: "Events",
    description:
      "See what meet-ups and other events we might be planning near you.",
    href: "#",
    icon: CalendarIcon,
  },
  {
    name: "Security",
    description: "Understand how we take your privacy seriously.",
    href: "#",
    icon: ShieldCheckIcon,
  },
];
export const recentPosts = [
  { id: 1, name: "Boost your conversion rate", href: "#" },
  {
    id: 2,
    name: "How to use search engine optimization to drive traffic to your site",
    href: "#",
  },
  { id: 3, name: "Improve your customer experience", href: "#" },
];
