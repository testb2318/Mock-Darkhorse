import {
  DollarSign, 
  Folder, 
  Hand, 
  Heart, 
  Home, 
  QrCode, 
  Scroll, 
  Trophy, 
  User,
  Users,
  UserCheck,
  UserX,
  UserMinus,
  UserPlus,
  BarChart3,
  Calendar,
  CreditCard,
  Download,
  TrendingDown,
  Banknote,
  Upload,
  Plus,
  Settings,
  Bell,
  BellRing,
  Award,
  FileText,
  Currency,
  LayoutDashboard
} from 'lucide-react'

// Submenu configurations
// const Management = [
//   { name: "Unblocked Users", to: "/admin/user/unblock", icon: UserCheck, current: true },
//   { name: "Blocked User", to: "/admin/user/block", icon: UserX, current: false },
//   { name: "Active Member", to: "/admin/user/active", icon: UserPlus, current: false },
//   { name: "Inactive Member", to: "/admin/user/inactive", icon: UserMinus, current: false },
//   { name: "All User", to: "/admin/users", icon: Users, current: false },
// ];

const Salaries = [
  { name: "Salary Analysis", to: "/admin/salary-analysis", icon: BarChart3, current: true },
  { name: "Today Salary", to: "/admin/salary-today", icon: Calendar, current: false },
  { name: "Transactions", to: "/admin/salary-transactions", icon: CreditCard, current: false },
];

const Requests = [
  { name: "Withdrawal", to: "/admin/withdrawals", icon: Download, current: true },
  // { name: "ROI Withdrawal", to: "/admin/roi-request", icon: TrendingDown, current: false },
  // { name: "Upline Income", to: "/admin/upline-income", icon: Banknote, current: false },
  // { name: "Principle Withdrawal", to: "/admin/pending-principle-withdrawal-request", icon: Banknote, current: false },
  { name: "Deposite", to: "/admin/deposits", icon: Upload, current: false },
  { name: "TopUp", to: "/admin/topup", icon: Plus, current: false },
];

// Main menu configuration
export const MainMenu = [
  { name: "Dashboard", to: "/admin/dashboard", icon: Home, current: true, submenu: [] },
  // {
  //   name: "Tokens", to: "/admin/token", icon: Currency, current: false, submenu: [
  //     { name: 'Token Statics', to: '/admin/token-dashboard', icon: LayoutDashboard, current: false },
  //     { name: 'Tokens', to: '/admin/token', icon: LayoutDashboard, current: false }
  //   ]
  // },
 
  { name: "Users", to: "/admin/users", icon: Users, current: false, submenu: [] },
  { name: "Membership Plans", to: "/admin/plans", icon: Folder, current: false, submenu: [] },
  { name: "Income", to: "/admin/income", icon: DollarSign, current: false, submenu: [] },
  // { name: "Rewards", to: "/admin/reward-plans", icon: Trophy, current: false, submenu: [] },
  // { name: "Compound plans History", to: "/admin/investments", icon: Hand, current: false, submenu: [] },
  // { name: "Salaries", to: "/admin/salary-analysis", icon: Hand, current: false, submenu: Salaries },
  { name: "Reports", to: "/admin/reports", icon: Scroll, current: false, submenu: [] },
  // { name: "Defaulter", to: "/admin/defaulter", icon: User, current: false, submenu: [] },
  // { name: "Support", to: "/admin/support", icon: Heart, current: false, submenu: [] },
  { name: "QR setting", to: "/admin/web3", icon: QrCode, current: false, submenu: [] },
  // { name: "Achivers", to: "/admin/achivers", icon: Award, current: false, submenu: [] },
  { name: "Transactions", to: "/admin/pending-withdrawal-request", icon: CreditCard, current: false, submenu: Requests },
  // { name: "Reward Transactions", to: "/admin/reward-transactions", icon: Trophy, current: false, submenu: [] },
  { name: "General", to: "/admin/settings", icon: Settings, current: false, submenu: [] },
  { name: "create notification", to: "/admin/notifications", icon: Bell, current: false, submenu: [] },
  { name: "notification list", to: "/admin/notification/list", icon: BellRing, current: false, submenu: [] },
  { name: "Activities", to: "/admin/activity", icon: BellRing, current: false, submenu: [] },
];