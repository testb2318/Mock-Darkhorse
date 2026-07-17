import {
  LayoutDashboard,
  HandCoins,
  Blocks,
  List,
  Handshake,
  DollarSign,
  Wallet,
  Trophy,
  Bell,
  Users,
  ChartCandlestick,
  Flag,
  Flame,
  ListChecks,
  TreePalm,
  ArrowUp,
  Ticket,
  TrendingDown,
  Layers,
} from "lucide-react";

export const income = [
  {
    name: "Roi Income",
    to: "/user/transaction/roi_transaction/invest",
    icon: ChartCandlestick,
    submenu: [],
  },
  {
    name: "Direct Income",
    to: "/user/transaction/direct_transaction",
    icon: Handshake,
    submenu: [],
  },
  // {
  //   name: "Level Income",
  //   to: "/user/transaction/invest_level_transaction/invest",
  //   icon: Flag,
  //   submenu: [],
  // },
  {
    name: "Income Detail",
    to: "/user/income",
    icon: Flag,
    submenu: [],
  },
  // {
  //   name: "Activity Reward",
  //   to: "/user/transaction/reward_transaction",
  //   icon: Flame,
  //   submenu: [],
  // },
  // {
  //   name: "Reward Level Income",
  //   to: "/user/transaction/reward_level_transaction",
  //   icon: Flag,
  //   submenu: [],
  // },
  // {
  //   name: "Upline Earnings",
  //   to: "/user/upline_transaction",
  //   icon: ChartCandlestick,
  //   submenu: [],
  // },
];

export const userMenus = [
  {
    name: "Dashboard",
    to: "/user/dashboard",
    icon: LayoutDashboard,
    submenu: [],
  },
  {
    name: "Deposit",
    to: "/user/deposit",
    icon: DollarSign,
    submenu: [
      {
        name: "Transactions History",
        to: "/user/deposit-history",
        icon: Blocks,
        submenu: [],
      },
      {
        name: "Crypto Deposit",
        to: "/user/web3-deposit",
        icon: List,
        submenu: [],
      },
      //                   {
      //   name: "Pay With Scanner",
      //   to: "/user/scanner",
      //   icon: List,
      //   submenu: [],
      // },
    ],
  },
  {
    name: "Refer & Earn",
    to: "/user/refferral-tree",
    icon: TreePalm,
    submenu: [
      {
        name: "Referral Tree",
        to: "/user/refferral-tree",
        icon: Blocks,
        submenu: [],
      },
      
      {
        name: "Referral History",
        to: "/user/direct-members",
        icon: List,
        submenu: [],
      },
    ],
  },
  {
    name: "Returns",
    to: "/user/income",
    icon: HandCoins,
    submenu: income,
  },
  {
    name: "Markets",
    to: "/user/markets",
    icon: ChartCandlestick,
    submenu: [],
  },
  // {
  //   name: "Withdrawal Menu",
  //   icon: DollarSign,
  //   to: "/user/withdrawal",
  //   submenu: [
  //     {
  //       name: "Withdraw Funds",
  //       to: "/user/withdrawal",
  //       icon: Layers,
  //       submenu: [],
  //     },
  //     {
  //       name: "Compound Withdrawal",
  //       to: "/user/compound-withdrawal",
  //       icon: Layers,
  //       submenu: [],
  //     },

  //   ],
  // }, 
// {
//     name: "Tokens",
//     to: "/user/tokens",
//     icon: LayoutDashboard,
//     submenu: [
//       { name: 'Tokens', to: '/user/tokens', icon: Wallet, submenu: [], },
//       // { name: 'Wallets', to: '/user/wallets', icon: Wallet },
//       // { name: 'Stakes', to: '/user/stakes', icon: Wallet },
//       // { name: 'Transfer', to: '/user/transfer', icon: Wallet },
//       { name: 'Transaction', to: '/user/token-transactions', icon: Wallet, submenu: [], },
//       //  { name: 'Referral-Transaction', to: '/user/transaction/referral-bouns', icon: Wallet },
//         // { name: 'Staking-Transaction', to: '/user/transaction/daily-returns', icon: Wallet }
//     ],
//   },

  {
  
    name: "Withdraw",
    to: "/user/withdrawal",
    icon: Layers,
    submenu: []
      
  },

  // {
  //   name: "Activity",
  //   to: "/user/rewards",
  //   icon: Trophy,
  //   submenu: [],
  // },

  // {
  //   name: "Trading Chart",
  //   to: "/user/trading",
  //   icon: TrendingDown,
  //   submenu: [],
  // },
  {
    name: "Upgrade",
    to: "/user/topup",
    icon: ArrowUp,
    submenu: [],
  },
   
  {
    name: "Alerts",
    to: "/user/notifications",
    icon: Bell,
    submenu: [],
  },
  {
    name: "My Plan",
    to: "/user/subscription",
    icon: Users,
    submenu: [],
  },

  // {
  //   name: "Support",
  //   to: "/user/queries",
  //   icon: Ticket,
  //   submenu: [],
  // },
];
