// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyProfile, selectMyProfile } from "../../redux/userSlice";
import { getTreeData } from "../../redux/referralSlice";
import { getAllDepositeByid } from "../../redux/depositeSlice";
import { getAllWithdrawalByid } from "../../redux/withdrawalSlice";
import StatsGrid from "@/components/user/StatsGrid";
import ReferralCard from "@/components/user/ReferralCard";
import CustomersOverview from "@/components/user/UserOverview";
import IncomeDetails from "@/components/user/IncomeDetails";
import TradeNow from "@/components/user/TradeNow";
import UserTransactions from "../../components/user/UserTransactions";
import Loader from "../../components/common/Loader";
import ViewChart from "../../web/charts/ViewChart";
import CandleChart from "../../web/charts/CandleChart";
import EURCard from "../../web/charts/EURCard";
import GBPJPYCard from "../../web/charts/GBPJPYCard";
import GBPCard from "../../web/charts/GBPCard";
import XAUCard from "../../web/charts/XAUCard";
import {
  calculateTotalEarnings,
  calculateBusinessForLegs,
  countTotalTeamWithActiveInactive,
  combineTransactions,
} from "../../utils/dashboardUtils";
import { selectUser } from "../../redux/authSlice";
import InvestmentViewer from "./UserInvestments";
import UserWallet from "../../components/user/UserWallet";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [limitModal, setLimitModal] = useState(false);
  const [totalBusiness, setTotalBusiness] = useState(0);
  const [topGenerations, setTopGenerations] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  // Get loading states
  const { loading: userLoading } = useSelector((state) => state.users);
  const { singleDeposite, loading: depositeLoading } = useSelector((state) => state.alldeposite);
  const { singleWithdrawal, loading: withdrawalLoading } = useSelector((state) => state.allwithdrawal);
  const { treeData, loading: treeLoading } = useSelector((state) => state.referralTree);
  const user = useSelector(selectUser);
  const singleuser = useSelector(selectMyProfile);

  // Debug logs
  console.log("========== DASHBOARD DEBUG ==========");
  console.log("singleuser from Redux:", singleuser);
  console.log("userLoading:", userLoading);
  console.log("depositeLoading:", depositeLoading);
  console.log("withdrawalLoading:", withdrawalLoading);
  console.log("treeLoading:", treeLoading);
  console.log("=====================================");

  // Fetch profile on mount
  useEffect(() => {
    console.log("Dispatching getMyProfile...");
    dispatch(getMyProfile());
  }, [dispatch]);

  // Fetch additional data when user ID is available
  useEffect(() => {
    if (singleuser?.id) {
      console.log("User ID found, fetching additional data:", singleuser.id);
      Promise.all([
        dispatch(getAllDepositeByid(singleuser.id)),
        dispatch(getAllWithdrawalByid(singleuser.id)),
        dispatch(getTreeData(singleuser.refferal_code))
      ]).then(() => {
        console.log("All additional data fetched");
        setPageLoading(false);
      }).catch((error) => {
        console.error("Error fetching data:", error);
        setPageLoading(false);
      });
    } else if (singleuser === null) {
      console.log("singleuser is null, stopping loading");
      setPageLoading(false);
    }
  }, [singleuser?.id, dispatch]);

  // Don't calculate until data is loaded
  const totalEarning = singleuser ? calculateTotalEarnings(singleuser) : 0;
  const limit = singleuser?.limit_plan ? singleuser.limit_plan * 5 : 0;
  const usedLimit = totalEarning;
  const percentage = limit > 0 ? Math.min(Math.round((Number(usedLimit) / limit) * 100), 100) : 0;
  const res = totalEarning;
  const totallimit = limit - res;
  const tradellimit = singleuser?.limit_plan ? (Number(singleuser.limit_plan) * 2 - (singleuser?.roi_income || 0)) : 0;

  const totalDirectActiveMembers = treeData?.filter((user) => user?.is_active === "active").length || 0;
  const totalDirectInactiveMembers = treeData?.filter((user) => user?.is_active === "inactive").length || 0;

  let totalTeamCount = 0;
  let totalActiveMembers = 0;
  let totalInactiveMembers = 0;

  if (treeData && Array.isArray(treeData)) {
    treeData.forEach((user) => {
      const { totalTeam, activeCount, inactiveCount } = countTotalTeamWithActiveInactive(user);
      totalTeamCount += totalTeam;
      totalActiveMembers += activeCount;
      totalInactiveMembers += inactiveCount;
    });
  }

  const combinedArray = singleDeposite && singleWithdrawal ? combineTransactions(singleDeposite, singleWithdrawal) : [];
  const totalDeposits = singleDeposite?.reduce((total, deposit) => total + (deposit.amount || 0), 0) || 0;
  const totalWithdrawals = singleWithdrawal?.reduce((total, withdrawal) => total + (withdrawal.amount || 0) + (withdrawal.deduction || 0), 0) || 0;

  useEffect(() => {
    if (percentage >= 75 && percentage <= 100) {
      setLimitModal(true);
    }
  }, [percentage]);

  useEffect(() => {
    if (treeData && Array.isArray(treeData) && treeData.length > 0) {
      const businessByLeg = calculateBusinessForLegs(treeData);
      const sortedLegs = Object.entries(businessByLeg)
        .map(([legId, totalBusiness]) => ({ legId: parseInt(legId), totalBusiness }))
        .sort((a, b) => b.totalBusiness - a.totalBusiness);

      const topTwoLegs = sortedLegs.slice(0, 2);
      const totalBusinessSum = Object.values(businessByLeg).reduce((acc, value) => acc + value, 0);
      const thirdLegTotalBusiness = sortedLegs.slice(2).reduce((acc, leg) => acc + leg.totalBusiness, 0);
      const topGenerations = [...topTwoLegs, { legId: "Other", totalBusiness: thirdLegTotalBusiness }];

      setTopGenerations(topGenerations);
      setTotalBusiness(totalBusinessSum);
    }
  }, [treeData]);

  const dashboardData = {
    user: singleuser,
    totalEarning,
    totalBusiness,
    totalDeposits,
    totalWithdrawals,
    totalTeamCount,
    totalActiveMembers,
    totalInactiveMembers,
    totalDirectActiveMembers,
    totalDirectInactiveMembers,
    totallimit,
  };

  // Show loading while fetching initial data
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Pass singleuser to StatsGrid */}
      <StatsGrid user={singleuser} />
      
      <UserWallet />
      <InvestmentViewer view="cards" />
      
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="lg:col-span-5 col-span-12 bg-[#1a1a1a] rounded-xl shadow-[inset_6px_6px_12px_rgba(0,86,162,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.05)] p-4">
          <div className="mb-3">
            <TradeNow />
          </div>
          <ViewChart />
        </div>
        <div className="lg:col-span-7 col-span-12">
          <ReferralCard user={singleuser} />
          <div className="mt-4">
            <CandleChart height={380} />
          </div>
        </div>
      </div>
      
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mb-4">
        <div className="">
          <IncomeDetails
            totalBusiness={totalBusiness}
            totalWithdrawals={totalWithdrawals}
            totalDeposits={totalDeposits}
            totalTeamCount={totalTeamCount}
            totalEarning={totalEarning}
            user={singleuser}
          />
        </div>
        <div className="">
          <CustomersOverview
            data={dashboardData}
            showTradeNow={true}
            user={singleuser}
            tradellimit={tradellimit}
            TradeNowComponent={<TradeNow user={singleuser} />}
          />
        </div>
      </div>
      
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        <EURCard />
        <GBPJPYCard />
        <GBPCard />
        <XAUCard />
      </div>
      
      <div className="">
        <aside className="w-full overflow-y-auto custom-scroll rounded-md">
          <div className="flow-root mt-1">
            <div className="overflow-x-auto custom-scroll">
              <div className="inline-block min-w-full py-2 align-middle">
                <UserTransactions />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}