import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import "./App.css";
import { Toaster } from "react-hot-toast";
import UserDetails from "./pages/admin/UserDetails";
import NotificationForm from "./pages/admin/NotificationForm";
import NotificationsTable from "./pages/admin/NotificationTable";
// import Home from "./pages/public/Home";
import PublicLayout from './Layouts/Public/PublicLayout'
import Home from './Pages/Public/Home'
import AboutPage from './Pages/Public/AboutPage'
import EcosystemPage from './Pages/Public/EcosystemPage'
import AdvantagesPage from './Pages/Public/AdvantagesPage'
import MarketsPage from './Pages/Public/MarketsPage'
import AcademyPage from './Pages/Public/AcademyPage'
import NewsPage from './Pages/Public/NewsPage'
import ContactPage from './Pages/Public/ContactPage'
import TransactionDashboard from "./pages/admin/Achievers";
import InvestmentDashboard from "./pages/admin/Investments";
import ActivityLogs from "./pages/admin/ActivityLogs";
import InvestmentViewer from "./pages/user/UserInvestments";
import CompoundLevelTable from "./pages/user/CompoundLevel";
import Nowpayments from "./pages/user/Nowpayment";
import UserIncome from "./pages/user/UserIncome";
import ForgotPassword from "./pages/auth/ForgotPassword";
import TokenTransactions from "./pages/user/TokenTransactions";
import Tokens from "./pages/user/Tokens";
import TokenManager from "./pages/admin/TokenManager";
import TokenDashboard from "./pages/admin/TokenDashboard";
import RewardLevelTransactions from "./pages/user/RewardLevelTransactions";
import AdminPrWithReq from "./pages/admin/AdminPrWithReq";
import AdminUplineTransactions from "./pages/admin/AdminUplineTransactions";
import UplineTransactions from "./pages/user/UplineTransactions";
import Markets from "./pages/user/Markets";
import AdminProfile from "./pages/admin/Profile";

const Login = React.lazy(() => import("./pages/auth/Login"));
const AdminLogin = React.lazy(() => import("./pages/auth/AdminLogin"));
const Signup = React.lazy(() => import("./pages/auth/Registration"));
const Unauthorized = React.lazy(() => import("./pages/shared/Unauthorized"));
const NotFound = React.lazy(() => import("./pages/shared/NotFound"));


import AdminPrivateRoute from "./components/common/AdminPrivateRoutes";
import PrivateRoute from "./components/common/PrivateRoutes";

const LoaderModal = React.lazy(() => import("./components/common/LoaderModal"));
const ErrorFallback = React.lazy(() =>
  import("./components/common/ErrorFallback")
);

// Admin pages
const Dashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const Plans = React.lazy(() => import("./pages/admin/Plans"));
const Users = React.lazy(() => import("./pages/admin/Users"));
const TicketsTable = React.lazy(() =>
  import("./pages/admin/tickets/TicketsTable")
);
const TicketChat = React.lazy(() => import("./pages/admin/tickets/TicketChat"));
const Reports = React.lazy(() => import("./pages/admin/Reports"));
const Web3Address = React.lazy(() => import("./pages/admin/Web3Address"));
const Income = React.lazy(() => import("./pages/admin/Income"));
const Setting = React.lazy(() => import("./pages/admin/Setting"));
const WithdrawalRequests = React.lazy(() =>
  import("./pages/admin/WithdrawalRequests")
);
const RoiRequest = React.lazy(() => import("./pages/admin/RoiRequest"));

const Deposits = React.lazy(() => import("./pages/admin/Deposits"));
const RewardTransactions = React.lazy(() =>
  import("./pages/admin/RewardTransactions")
);
const TopupList = React.lazy(() => import("./pages/admin/TopupList"));
const RewardsList = React.lazy(() => import("./pages/admin/RewardsList"));
const PrincipleWithdrawal = React.lazy(() =>
  import("./components/modals/PrincipleWithdrawal")
);

// User pages
const UserDashboard = React.lazy(() => import("./pages/user/Dashboard"));
const Profile = React.lazy(() => import("./pages/user/Profile"));
const Deposit = React.lazy(() => import("./pages/user/Deposit"));
const Notifications = React.lazy(() => import("./pages/user/Notifications"));
const DepositHistory = React.lazy(() => import("./pages/user/DepositHistory"));
const UserDirectMember = React.lazy(() =>
  import("./pages/user/UserDirectMember")
);
const UserReferralTree = React.lazy(() =>
  import("./pages/user/UserReferralTree")
);
const TradeTransactions = React.lazy(() =>
  import("./pages/user/TradeTransactions")
);
const UserIncomeTransaction = React.lazy(() =>
  import("./pages/user/UserIncomeTransaction")
);
const MyTransactions = React.lazy(() => import("./pages/user/MyTransactions"));
const InvestmentPlans = React.lazy(() => import("./pages/user/InvestmentPlans"));
const Rewards = React.lazy(() => import("./pages/user/Rewards"));
const UserTopup = React.lazy(() => import("./pages/user/UserTopup"));
const Withdrawals = React.lazy(() => import("./pages/user/Withdrawals"));

const Tradings = React.lazy(() => import("./pages/user/Tradings"));
const QueryList = React.lazy(() => import("./pages/user/query/QueryList"));
const QueryChat = React.lazy(() => import("./pages/user/query/QueryChat"));
const AddQuery = React.lazy(() => import("./pages/user/query/AddQuery"));

// Loading fallback component
const LoadingFallback = () => <LoaderModal isLoading={true} />;

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to your error reporting service
        console.error("Application Error:", error, errorInfo);
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>

             
              {/* Public routes */}
              {/* <Route path="/" element={<Home />} /> */}

              <Route
                path="/"
                element={
                  <PublicLayout>
                    <Home />
            // </PublicLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <PublicLayout>
                    <AboutPage />
            // </PublicLayout>
                }
              />
              <Route
                path="/ecosystem"
                element={
                  <PublicLayout>
                    <EcosystemPage />
            // </PublicLayout>
                }
              />
              <Route
                path="/advantages"
                element={
                  <PublicLayout>
                    <AdvantagesPage />
            // </PublicLayout>
                }
              />
              <Route
                path="/markets"
                element={
                  <PublicLayout>
                    <MarketsPage />
            // </PublicLayout>
                }
              />
              <Route
                path="/academy"
                element={
                  <PublicLayout>
                    <AcademyPage />
            // </PublicLayout>
                }
              />
              <Route
                path="/news"
                element={
                  <PublicLayout>
                    <NewsPage />
            // </PublicLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <PublicLayout>
                    <ContactPage />
            // </PublicLayout>
                }
              />
              <Route path="*" element={<NotFound />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/registration" element={<Signup />} />
               <Route
                path="/reset-password/:token"
                element={<ForgotPassword />}
              />
              

              {/* ***********************admin routes *************************** */}
              <Route element={<AdminPrivateRoute />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/plans" element={<Plans />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/tickets" element={<TicketsTable />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/income" element={<Income />} />
                <Route path="/admin/web3" element={<Web3Address />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/settings" element={<Setting />} />
                <Route
                  path="/admin/activity"
                  element={<ActivityLogs />}
                ></Route>
                <Route
                  path="/admin/withdrawals"
                  element={<WithdrawalRequests />}
                />
                <Route path="/admin/token" element={<TokenManager />} />
                <Route path="/admin/token-dashboard" element={<TokenDashboard />} />
                <Route path="/admin/roi-request" element={<RoiRequest />} />

                <Route path="/admin/deposits" element={<Deposits />} />
                <Route path="/admin/upline-income" element={<AdminUplineTransactions />} />
                <Route path="/admin/topup" element={<TopupList />} />
                <Route
                  path="/admin/ticket/:ticketId"
                  element={<TicketChat />}
                />
                <Route path="/admin/reward-plans" element={<RewardsList />} />
                <Route
                  path="/admin/reward-transactions"
                  element={<RewardTransactions />}
                />
                <Route
                  path="/admin/check/profile/:id"
                  element={<UserDetails />}
                />
                <Route path="/admin/token-dashboard" element={<TokenDashboard />} />

                <Route
                  path="/admin/notifications"
                  element={<NotificationForm />}
                />
                <Route
                  path="/admin/notification/list"
                  element={<NotificationsTable />}
                />
                <Route
                  path="/admin/achivers"
                  element={<TransactionDashboard />}
                />
                <Route
                  path="/admin/investments"
                  element={<InvestmentDashboard />}
                />
                <Route
                  path="/admin/pending-principle-withdrawal-request"
                  element={<AdminPrWithReq />}
                />

              </Route>

              {/* ******************** User Routes ********************* */}
              <Route element={<PrivateRoute />}>
                <Route path="/user/principle-withdrawal" element={<PrincipleWithdrawal />} />
                <Route path="/user/profile/:id" element={<Profile />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/web3-deposit" element={<Deposit />} />
                <Route path="/user/markets" element={<Markets/>} />
                <Route path="/user/notifications" element={<Notifications />} />
                <Route
                  path="/user/deposit-history"
                  element={<DepositHistory />}
                />
                <Route path="/user/scanner" element={<Nowpayments />} />
                <Route
                  path="/user/direct-members"
                  element={<UserDirectMember />}
                />
                <Route path="/user/income" element={<UserIncome />} />
                <Route
                  path="/user/refferral-tree"
                  element={<UserReferralTree />}
                />
                <Route
                  path="/user/user-investments"
                  element={<InvestmentViewer view="list" />}
                />

                <Route path="/user/subscription" element={<InvestmentPlans />} />

                <Route
                  path="/user/tokens"
                  element={<Tokens />} />

                <Route path="/user/token-transactions" element={<TokenTransactions />} />

                <Route path="/user/topup" element={<UserTopup />} />
                <Route path="/user/withdrawal" element={<Withdrawals />} />

                <Route path="/user/trading" element={<Tradings />} />

                <Route
                  path="/user/transaction/:table_name/:fit"
                  element={<UserIncomeTransaction />}
                />
                <Route
                  path="/user/transaction/roi_transaction/invest"
                  element={<TradeTransactions />}
                />
                <Route
                  path="/user/upline_transaction"
                  element={<UplineTransactions />}
                />
                <Route
                  path="/user/transaction/:table_name"
                  element={<UserIncomeTransaction />}
                />
                <Route
                  path="/transactions/:source"
                  element={<MyTransactions />}
                />
                <Route
                  path="/user/transaction/reward_level_transaction"
                  element={<RewardLevelTransactions />}
                />
                <Route
                  path="/compound-level"
                  element={<CompoundLevelTable />}
                />
                <Route
                  path="/transactions/compound-roi"
                  element={<MyTransactions transaction_type="compound_roi" />}
                />
                <Route path="/user/rewards" element={<Rewards />} />
                <Route path="/user/queries" element={<QueryList />} />
                <Route path="/user/queries/:ticketId" element={<QueryChat />} />
                <Route path="/user/query/create" element={<AddQuery />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
