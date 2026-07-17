    import React, { useState, useEffect } from "react";
    import { useSelector, useDispatch } from "react-redux";
    import { getMyProfile, selectMyProfile } from "../../redux/userSlice";
    import { getTreeData } from "../../redux/referralSlice";
    import { getAllDepositeByid } from "../../redux/depositeSlice";
    import { getAllWithdrawalByid } from "../../redux/withdrawalSlice";
    import StatsGrid from "@/components/user/StatsGrid";
    import WelcomeCard from "@/components/user/WelcomeCard";
    import ReferralCard from "@/components/user/ReferralCard";
    import UserOverview from "@/components/user/UserOverview";
    import IncomeDetails from "@/components/user/IncomeDetails";
    import SummaryStats from "@/components/user/SummaryStats";
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
      calculateBusinessForTeam,
      calculateBusinessForLegs,
      countTotalTeamWithActiveInactive,
      combineTransactions,
    } from "../../utils/dashboardUtils";
    import { selectUser } from "../../redux/authSlice";
    import InvestmentViewer from "./UserInvestments";
    import UserWallet from "../../components/user/UserWallet";
import IdeasSection from "../Public/HomeSections/IdeasSection";
import TradingViewTicker from "../../ThirdApi/TradingViewTicker";
import TradingViewSingleTicker from "../../ThirdApi/TradingViewSingleTicker";

    export default function Dashboard() {
      const dispatch = useDispatch();
      const [limitModal, setLimitModal] = useState(false);
      const [totalBusiness, setTotalBusiness] = useState(0);
      const [topGenerations, setTopGenerations] = useState([]);

      const { singleDeposite, loading } = useSelector((state) => state.alldeposite);
      const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
      const { treeData } = useSelector((state) => state.referralTree);
      const user = useSelector(selectUser);
      const singleuser = useSelector(selectMyProfile);

      const totalEarning = calculateTotalEarnings(singleuser);
      const limit = singleuser?.limit_plan * 5;
      const usedLimit = totalEarning;
      const percentage = Math.min(Math.round((Number(usedLimit) / limit) * 100), 100);
      const res = totalEarning;
      const totallimit = limit - res;
      const tradellimit = Number(singleuser?.limit_plan) * 2 - singleuser?.roi_income;

      const totalDirectActiveMembers = treeData?.filter((user) => user?.is_active === "active").length || 0;
      const totalDirectInactiveMembers = treeData?.filter((user) => user?.is_active === "inactive").length || 0;

      let totalTeamCount = 0;
      let totalActiveMembers = 0;
      let totalInactiveMembers = 0;

      treeData?.forEach((user) => {
        const { totalTeam, activeCount, inactiveCount } = countTotalTeamWithActiveInactive(user);
        totalTeamCount += totalTeam;
        totalActiveMembers += activeCount;
        totalInactiveMembers += inactiveCount;
      });

      const combinedArray = combineTransactions(singleDeposite, singleWithdrawal);
      const totalDeposits = singleDeposite?.reduce((total, deposit) => total + (deposit.amount || 0), 0) || 0;
      const totalWithdrawals = singleWithdrawal?.reduce((total, withdrawal) => total + (withdrawal.amount || 0) + (withdrawal.deduction || 0), 0) || 0;

      useEffect(() => {
        if (percentage >= 75) {
          setLimitModal(true);
        }
      }, [percentage]);

      useEffect(() => {
        dispatch(getMyProfile());
      }, [dispatch]);

      useEffect(() => {
        if (singleuser?.id) {
          dispatch(getAllDepositeByid(singleuser.id));
          dispatch(getAllWithdrawalByid(singleuser.id));
          dispatch(getTreeData(singleuser.refferal_code));
        }
      }, [singleuser?.id, dispatch]);

      useEffect(() => {
        if (treeData) {
          const businessByLeg = calculateBusinessForLegs(treeData);
          const sortedLegs = Object.entries(businessByLeg)
            .map(([legId, totalBusiness]) => ({ legId: parseInt(legId), totalBusiness }))
            .sort((a, b) => b.totalBusiness - a.totalBusiness);

          const topTwoLegs = sortedLegs.slice(0, 2);
          const totalBusiness = Object.values(businessByLeg).reduce((acc, value) => acc + value, 0);
          const thirdLegTotalBusiness = sortedLegs.slice(2).reduce((acc, leg) => acc + leg.totalBusiness, 0);
          const topGenerations = [...topTwoLegs, { legId: "Other", totalBusiness: thirdLegTotalBusiness }];

          setTopGenerations(topGenerations);
          setTotalBusiness(totalBusiness);
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



      const row1Images = [
  {
    img: '/images/img_7.jpg',
    label: 'Forex Markets',
  },
  {
    img: '/images/img_8.jpg',
    label: 'S&P 500 Rally',
  },
  {
    img: '/images/img_21.jpg',
    label: 'Bitcoin Surge',
  },
  {
    img: '/images/img_22.jpg',
    label: 'Bond Markets',
  },
  {
    img: '/images/img_7.jpg',
    label: 'Commodities',
  },
  {
    img: '/images/img_23.jpg',
    label: 'Stock Exchange',
  },
]

const row2Images = [
  {
    img: '/images/img_24.jpg',
    label: 'Crypto Derivatives',
  },
  {
    img: '/images/img_25.jpg',
    label: 'Real Estate',
  },
  {
    img: '/images/img_24.jpg',
    label: 'Market Volatility',
  },
  {
    img: '/images/img_26.jpg',
    label: 'Portfolio Strategy',
  },
  {
    img: '/images/img_27.jpg',
    label: 'Algorithmic Trading',
  },
  {
    img: '/images/img_7.jpg',
    label: 'FX Liquidity',
  },
]

const row3Images = [
  {
    img: '/images/img_28.jpg',
    label: 'Market Analysis',
  },
  {
    img: '/images/img_29.jpg',
    label: 'Investment Banking',
  },
  {
    img: '/images/img_30.jpg',
    label: 'Risk Management',
  },
  {
    img: '/images/img_31.jpg',
    label: 'Global Assets',
  },
  {
    img: '/images/img_32.jpg',
    label: 'Wealth Management',
  },
  {
    img: '/images/img_27.jpg',
    label: 'Capital Markets',
  },
]

const MarqueeCard = ({ img, label, isDark }) => (
  <div
    className={`relative flex-shrink-0 w-52 h-36 rounded-xl overflow-hidden  cursor-pointer group `}
    style={{ margin: '0 6px' }}
  >
    <img
      src={img}
      alt={label}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
    {/* Label */}
    <span className="absolute bottom-2.5 left-3 text-[10px] font-bold text-white uppercase tracking-wider line-clamp-1">
      {label}
    </span>
    {/* Gold accent line on hover */}
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-dark to-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
  </div>
)

       const row1Loop = [...row1Images, ...row1Images]
  const row2Loop = [...row2Images, ...row2Images]
  const row3Loop = [...row3Images, ...row3Images]

      return (
        /* ── Dark Horse Dashboard Shell ── */
        <div className="min-h-screen relative user-theme w-screen max-w-full overflow-x-hidden block">
          {/* ── Ambient glow blobs (decorative, pointer-events-none) ── */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 max-w-full">
            {/* top-left teal glow */}
            <div
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{ background: "radial-gradient(circle, #1a6b8a 0%, transparent 70%)" }}
            />
            {/* top-right gold glow */}
            <div
              className="absolute -top-20 right-1/3 w-80 h-80 rounded-full opacity-15 blur-3xl"
              style={{ background: "radial-gradient(circle, #c9a227 0%, transparent 70%)" }}
            />
            {/* center-right cyan glow */}
            <div
              className="absolute top-1/2 -right-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
              style={{ background: "radial-gradient(circle, #4dc5c5 0%, transparent 70%)" }}
            />
            {/* bottom-left deep teal */}
            <div
              className="absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-10 blur-3xl"
              style={{ background: "radial-gradient(circle, #0e4f6e 0%, transparent 70%)" }}
            />
          </div>

          {/* ── Subtle grid overlay ── */}
          <div
            className="pointer-events-none fixed inset-0 z-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(74,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(74,182,212,0.4) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* ── Page content ── */}
          <div className="relative z-10 p-4 pb-8 space-y-5 w-full max-w-full overflow-hidden block">

            {/* ── Top Section: Brand Header + Stats Grid ── */}
            <div className="space-y-4">

              {/* ── Stats Grid ── */}
              <div className="glass-card animated-border-gold rounded-2xl overflow-hidden p-3">
                <StatsGrid user={singleuser} />
              </div>
            </div>

            {/* ── Main Two-Column Bento Grid (2/5 left · 3/5 right) ── */}
            <div className="grid lg:grid-cols-6 grid-cols-1 gap-5">

              {/* ── LEFT COLUMN (2/5) ── */}
              <div className="lg:col-span-2 flex flex-col gap-4">

                {/* ── Referral Card ── */}
                <div className="glass-card animated-border-gold rounded-2xl overflow-hidden p-3">
                  <ReferralCard user={singleuser} />
                </div>

                {/* ── Income Details + Overview ── */}
                <div className="grid sm:grid-cols-1 grid-cols-1 gap-8">
                  {/* Income Details */}
                  <div className="glass-card animated-border-gold rounded-2xl overflow-hidden">
                    <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--color-gold-medium)", boxShadow: "0 0 6px var(--color-gold-medium)" }}
                      />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold-medium/80 font-semibold font-sans">
                        Income Details
                      </span>
                    </div>
                    <div className="p-2 pt-1">
                      <IncomeDetails
                        totalBusiness={totalBusiness}
                        totalWithdrawals={totalWithdrawals}
                        totalDeposits={totalDeposits}
                        totalTeamCount={totalTeamCount}
                        totalEarning={totalEarning}
                        user={singleuser}
                      />
                    </div>
                  </div>
                   <TradingViewTicker/>
                   <div className="border border-gold-medium rounded-2xl">
                   <TradingViewSingleTicker symbol="BITSTAMP:BTCUSD"  />
                   </div>
                  
                </div>

                {/* ── Market Pairs ── */}
                {/* <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="h-px flex-1"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(26,107,138,0.5) 0%, transparent 100%)",
                      }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#4ab6d4]/50 font-semibold px-2">
                      Market Pairs
                    </span>
                    <div
                      className="h-px flex-1"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.5) 100%)",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { Component: EURCard, accent: "#4dc5c5", label: "EUR/USD" },
                      { Component: GBPJPYCard, accent: "#c9a227", label: "GBP/JPY" },
                      { Component: GBPCard, accent: "#1a8fa0", label: "GBP/USD" },
                      { Component: XAUCard, accent: "#f0d060", label: "XAU/USD" },
                    ].map(({ Component, accent, label }, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/5 overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:border-white/10"
                        style={{
                          background: `linear-gradient(145deg, ${accent}18 0%, rgba(8,18,35,0.8) 100%)`,
                          backdropFilter: "blur(12px)",
                          boxShadow: `inset 0 1px 0 ${accent}20, 0 4px 24px rgba(0,0,0,0.4)`,
                          transitionProperty: "transform, box-shadow, border-color",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = `inset 0 1px 0 ${accent}35, 0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${accent}15`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = `inset 0 1px 0 ${accent}20, 0 4px 24px rgba(0,0,0,0.4)`;
                        }}
                      >
                        <div
                          className="h-0.5 w-full"
                          style={{ background: `linear-gradient(90deg, ${accent} 0%, transparent 100%)` }}
                        />
                        <div className="px-3 pt-2 pb-0.5 flex items-center gap-1.5">
                          <div
                            className="w-1 h-1 rounded-full"
                            style={{ background: accent, boxShadow: `0 0 5px ${accent}` }}
                          />
                          <span
                            className="text-[9px] uppercase tracking-[0.2em] font-bold"
                            style={{ color: accent + "99" }}
                          >
                            {label}
                          </span>
                        </div>
                        <div className="p-2 pt-0">
                          <Component />
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}

              </div>
              {/* ── END LEFT COLUMN ── */}


              {/* ── RIGHT COLUMN (3/5) ── */}
              <div className="lg:col-span-4 flex flex-col gap-1">

                {/* ── Candle Chart ── */}
                <div
                  className="rounded-2xl border border-white/5 overflow-hidden"
                  style={{
                    // background: "rgba(7, 6, 1, 0.7)",
                    // backdropFilter: "blur(14px)",
                    // boxShadow:
                    //   "inset 0 1px 0 rgba(74,182,212,0.1), 0 8px 40px rgba(230, 174, 20, 0.5), 0 0 0 1px rgba(26,107,138,0.1)",
                  }}
                >
                  <div
                    className="h-0.5 w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, #c79f0c 15%, #daa318 40%, #c9a227 60%, #f0d060 80%, transparent 100%)",
                    }}
                  />
                  <div className="px-4 pt-1 pb-1 flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#4dc5c5", boxShadow: "0 0 6px #dca40a" }}
                    />
                    {/* <span className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-semibold">
                      Price Chart
                    </span> */}
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a227] opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9a227]" />
                      </span>
                      <span className="text-[9px] text-[#c9a227]/70 tracking-widest uppercase font-medium">
                        Real-time
                      </span>
                    </div>
                  </div>
                  <div className="p-3 pt-0">
                    {/* <CandleChart height={380} /> */}
                    
                      {/* ─── LEFT 7 cols: Triple-Row Marquee Image Slider ─── */}
          <div className="lg:col-span-7 flex flex-col">
            <div className={`relative rounded-2xl overflow-hidden bor flex-1 flex flex-col justify-between gap-2 py-1 `}>

              {/* Top label */}
              <div className="px-6 mb-0.5 flex-shrink-0">
                <div className="inline-flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className={`text-[10px] uppercase tracking-widest font-bold `}>
                    Live Market Highlights
                  </span>
                </div>
              </div>

              {/* Marquee Container */}
              <div className="flex flex-col gap-4 justify-center flex-1 my-auto">
                {/* ─── ROW 1: slides LEFT (→ left, normal marquee) ─── */}
                <div className="relative w-full overflow-hidden">
                  {/* Left fade */}
                  <div className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none`} />
                  {/* Right fade */}
                  <div className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none`} />

                  <div className="flex animate-marquee " style={{ width: 'max-content' }}>
                    {row1Loop.map((item, i) => (
                      <MarqueeCard key={`r1-${i}`} img={item.img} label={item.label}  />
                    ))}
                  </div>
                </div>

                {/* ─── ROW 2: slides RIGHT (← right, reverse marquee) ─── */}
                <div className="relative w-full overflow-hidden">
                  {/* Left fade */}
                  <div className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none `} />
                  {/* Right fade */}
                  <div className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none `} />

                  <div className="flex animate-marquee-reverse" style={{ width: 'max-content' }}>
                    {row2Loop.map((item, i) => (
                      <MarqueeCard key={`r2-${i}`} img={item.img} label={item.label}  />
                    ))}
                  </div>
                </div>

                {/* ─── ROW 3: slides LEFT (→ left, normal marquee) ─── */}
                <div className="relative w-full overflow-hidden">
                  {/* Left fade */}
                  <div className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none `} />
                  {/* Right fade */}
                  <div className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none `} />

                  {/* <div className="flex animate-marquee" style={{ width: 'max-content' }}>
                    {row3Loop.map((item, i) => (
                      <MarqueeCard key={`r3-${i}`} img={item.img} label={item.label}  />
                    ))}
                  </div> */}
                </div>
              </div>

              {/* Bottom label strip */}
              <div className="px-6 mt-1 flex items-center justify-between flex-shrink-0">
                <span className={`text-[9px] uppercase tracking-widest font-mono `}>
                  Forex · Stocks · Crypto · Commodities · Bonds
                </span>
                <span className={`text-[9px] font-mono `}>
                  Continuous Feed ↔
                </span>
              </div>
            </div>
          </div>

                  </div>
                </div>
                     

                <IdeasSection/>

                {/* ── Transactions ── */}
                <div
                  className="rounded-2xl border border-white/5 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(26,107,138,0.08) 0%, rgba(8,18,35,0.75) 100%)",
                    backdropFilter: "blur(16px)",
                    boxShadow:
                      "inset 0 1px 0 rgba(74,182,212,0.08), 0 8px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    className="h-0.5 w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, #c9a227 40%, #4dc5c5 60%, transparent 100%)",
                    }}
                  />
                  <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#c9a227", boxShadow: "0 0 6px #c9a227" }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#c9a227]/60 font-semibold">
                      Transactions
                    </span>
                  </div>
                  <aside className="w-full overflow-y-auto custom-scroll">
                    <div className="flow-root p-3 pt-0">
                      <div className="overflow-x-auto custom-scroll">
                        <div className="inline-block min-w-full py-2 align-middle">
                          <UserTransactions />
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>

              </div>
              {/* ── END RIGHT COLUMN ── */}

            </div>
            {/* Customers Overview */}
                  <div
                    className="rounded-2xl border border-white/5 overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(201,162,39,0.1) 0%, rgba(8,18,35,0.7) 100%)",
                      backdropFilter: "blur(16px)",
                      boxShadow:
                        "inset 0 1px 0 rgba(201,162,39,0.12), inset 1px 0 0 rgba(201,162,39,0.05), 0 8px 40px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div
                      className="h-0.5 w-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #c9a227 0%, #f0d060 50%, transparent 100%)",
                      }}
                    />
                    <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#c9a227", boxShadow: "0 0 6px #c9a227" }}
                      />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#c9a227]/60 font-semibold">
                        Overview
                      </span>
                    </div>
                    <div className="p-3 pt-1">
                      <UserOverview
                        data={dashboardData}
                        showTradeNow={true}
                        user={singleuser}
                        tradellimit={tradellimit}
                        TradeNowComponent={<TradeNow user={singleuser} />}
                      />
                    </div>
                  </div>

          </div>

          <Loader isLoading={loading} />
        </div>
      );
    } 

   