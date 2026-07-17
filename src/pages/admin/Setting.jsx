// import { useState, useEffect } from "react";
// import { Description, Field, Label, Switch } from "@headlessui/react";
// import {
//   getSettings,
//   clearErrors,
//   clearMessage,
//   updateSettings,
// } from "../../redux/settingsSlice";
// import { useDispatch, useSelector } from "react-redux";
// import SuccessAlert from "../../components/common/SuccessAlert";
// import ErrorAlert from "../../components/common/ErrorAlert";
// export default function Setting() {
//   const dispatch = useDispatch();
//   const { settings, loading, error, message } = useSelector(
//     (state) => state.settings
//   );

//   // Initialize states based on settings from backend
//   const [level, setLevel] = useState(false);
//   const [direct, setDirect] = useState(false);
//   const [reward, setReward] = useState(false);
//   const [register, setRegister] = useState(false);
//   const [login, setLogin] = useState(false);
//   const [withdrawal, setWithdrawal] = useState(false);
//   const [deposite, setDeposite] = useState(false);
//   const [roi, setRoi] = useState(false);
//   const [support, setSupport] = useState(false);
//   const [topup, setTopup] = useState(false);

//   useEffect(() => {
//     dispatch(getSettings());
//   }, [dispatch]);

//   useEffect(() => {
//     if (settings) {
//       setLevel(settings.setlevel === 1);
//       setDirect(settings.setdirect === 1);
//       setReward(settings.setreward === 1);
//       setRegister(settings.setregister === 1);
//       setLogin(settings.setlogin === 1);
//       setWithdrawal(settings.setwithdrawal === 1);
//       setDeposite(settings.setdeposite === 1);
//       setRoi(settings.setroi === 1);
//       setSupport(settings.setsupport === 1);
//       setTopup(settings.settopup === 1);
//     }
//   }, [settings]);

//   useEffect(() => {
//     if (error) {
//       const errorInterval = setInterval(() => {
//         dispatch(clearErrors());
//       }, 3000);
//       return () => clearInterval(errorInterval);
//     }
//     if (message) {
//       const messageInterval = setInterval(() => {
//         dispatch(clearMessage());
//       }, 3000);
//       return () => clearInterval(messageInterval);
//     }
//   }, [dispatch, error, message]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const values = {
//       level,
//       direct,
//       reward,
//       register,
//       login,
//       withdrawal,
//       deposite,
//       roi,
//       support,
//       topup,
//     };
//     dispatch(updateSettings(values));
//   };

//   return (
//        <div className="admin-dark p-4">
//       <div className="admin-table-bg rounded-md shadow-sm ">
//           <div className="overflow-hidden  rounded-md ">
//             <div className=" lg:divide-x lg:divide-y-0 ">
//               {message && <SuccessAlert message={message} />}
//               {error && <ErrorAlert error={error} />}
//               <form
//                 className=" lg:col-span-9"
//                 onSubmit={handleSubmit}
//               >
//                 <div className=" ">
//                   <div className="">
//                     <div className="p-4 border-b border-white/20">
//                       <h2 className="text-xl  font-medium leading-6 ">
//                         App settings
//                       </h2>
//                       <p className=" text-base ">
//                        Yoy can turn on and off some settings here
//                       </p>
//                     </div>
//                     <ul role="list" className="p-4 ">
//                       <div className="grid lg:grid-cols-2 grid-cols-1  gap-4">
//                         <div className=" p-4 space-y-4 rounded-md border border-white/50">
//                           <Field
//                             as="li"
//                             className="flex items-center justify-between  "
//                           >
//                             <div className="flex flex-col ">
//                               <Label
//                                 as="p"
//                                 passive
//                                 className="text-base font-medium leading-6 "
//                               >
//                                 Allow Level Income
//                               </Label>
//                               <Description className="text-base ">
//                                 You can turn on and off level income for users.
//                               </Description>
//                             </div>
//                             <Switch
//                               checked={level}
//                               onChange={setLevel}
//                               className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
//                             >
//                               <span
//                                 aria-hidden="true"
//                                 className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
//                               />
//                             </Switch>
//                           </Field>
//                           <Field
//                             as="li"
//                             className="flex items-center justify-between  "
//                           >
//                             <div className="flex flex-col">
//                               <Label
//                                 as="p"
//                                 passive
//                                 className="text-base font-medium leading-6 "
//                               >
//                                 Allow Direct Income
//                               </Label>
//                               <Description className="text-base ">
//                                 You can turn on and off direct income for users.
//                               </Description>
//                             </div>
//                             <Switch
//                               checked={direct}
//                               onChange={setDirect}
//                               className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
//                             >
//                               <span
//                                 aria-hidden="true"
//                                 className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
//                               />
//                             </Switch>
//                           </Field>
//                           <Field
//                             as="li"
//                             className="flex items-center justify-between  "
//                           >
//                             <div className="flex flex-col">
//                               <Label
//                                 as="p"
//                                 passive
//                                 className="text-base font-medium leading-6 "
//                               >
//                                 Allow Reward
//                               </Label>
//                               <Description className="text-base ">
//                                 You can turn on and off rewards for users.
//                               </Description>
//                             </div>
//                             <Switch
//                               checked={reward}
//                               onChange={setReward}
//                               className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
//                             >
//                               <span
//                                 aria-hidden="true"
//                                 className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
//                               />
//                             </Switch>
//                           </Field>
//                           <Field
//                             as="li"
//                             className="flex items-center justify-between "
//                           >
//                             <div className="flex flex-col">
//                               <Label
//                                 as="p"
//                                 passive
//                                 className="text-base font-medium leading-6 "
//                               >
//                                 Allow New Registration
//                               </Label>
//                               <Description className="text-base ">
//                                 You can turn on and off new registrations for
//                                 new users.
//                               </Description>
//                             </div>
//                             <Switch
//                               checked={register}
//                               onChange={setRegister}
//                               className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
//                             >
//                               <span
//                                 aria-hidden="true"
//                                 className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
//                               />
//                             </Switch>
//                           </Field>
//                           <Field
//                             as="li"
//                             className="flex items-center justify-between  "
//                           >
//                             <div className="flex flex-col">
//                               <Label
//                                 as="p"
//                                 passive
//                                 className="text-base font-medium leading-6 "
//                               >
//                                 Allow Login
//                               </Label>
//                               <Description className="text-base">
//                                 You can turn on and off login for users.
//                               </Description>
//                             </div>
//                             <Switch
//                               checked={login}
//                               onChange={setLogin}
//                               className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
//                             >
//                               <span
//                                 aria-hidden="true"
//                                 className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
//                               />
//                             </Switch>
//                           </Field>
//                         </div>
//                         <div className="  p-4 space-y-4 rounded-md border border-white/50">
//                           <Field
//                             as="li"
//                             className="flex items-center justify-between "
//                           >
//                             <div className="flex flex-col">
//                               <Label
//                                 as="p"
//                                 passive
//                                 className="text-base font-medium leading-6 "
//                               >
//                                 Allow Withdrawal
//                               </Label>
//                               <Description className="text-sm ">
//                                 You can turn on and off withdrawals for users.
//                               </Description>
//                             </div>
//                             <Switch
 
 
//                               checked={withdrawal}
//                               onChange={setWithdrawal}
//                               className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
//                             >
//                               <span
//                                 aria-hidden="true"
//                                 className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
//                               />
//                             </Switch>
//                           </Field>
//                           <Field
//                             as="li"
//                             className="flex items-center justify-between  "
//                           >
//                             <div className="flex flex-col">
//                               <Label
//                                 as="p"
//                                 passive
//                                 className="text-base font-medium leading-6 "
//                               >
//                                 Allow Deposite
//                               </Label>
//                               <Description className="text-base ">
//                                 You can turn on and off deposites for users.
//                               </Description>
//                             </div>
//                             <Switch
//                               checked={deposite}
//                               onChange={setDeposite}
//                               className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
//                             >
//                               <span
//                                 aria-hidden="true"
//                                 className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
//                               />
//                             </Switch>
//                           </Field>
//                           <Field
//                             as="li"
//                             className="flex items-center justify-between  "
//                           >
//                             <div className="flex flex-col">
//                               <Label
//                                 as="p"
//                                 passive
//                                 className="text-base font-medium leading-6 "
//                               >
//                                 Allow ROI
//                               </Label>
//                               <Description className="text-base ">
//                                 You can turn on and off ROI for users.
//                               </Description>
//                             </div>
//                             <Switch
//                               checked={roi}
//                               onChange={setRoi}
//                               className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
//                             >
//                               <span
//                                 aria-hidden="true"
//                                 className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
//                               />
//                             </Switch>
//                           </Field>
//                           <Field
//                             as="li"
//                             className="flex items-center justify-between "
//                           >
//                             <div className="flex flex-col">
//                               <Label
//                                 as="p"
//                                 passive
//                                 className="text-base font-medium leading-6 "
//                               >
//                                 Allow Support
//                               </Label>
//                               <Description className="text-base ">
//                                 You can turn on and off support for users.
//                               </Description>
//                             </div>
//                             <Switch
//                               checked={support}
//                               onChange={setSupport}
//                               className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
//                             >
//                               <span
//                                 aria-hidden="true"
//                                 className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
//                               />
//                             </Switch>
//                           </Field>
//                           <Field
//                             as="li"
//                             className="flex items-center justify-between "
//                           >
//                             <div className="flex flex-col">
//                               <Label
//                                 as="p"
//                                 passive
//                                 className="text-base font-medium leading-6 "
//                               >
//                                 Allow Topup
//                               </Label>
//                               <Description className="text-base ">
//                                 You can turn on and off topup for users.
//                               </Description>
//                             </div>
//                             <Switch
//                               checked={topup}
//                               onChange={setTopup}
//                               className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 data-[checked]:bg-teal-300"
//                             >
//                               <span
//                                 aria-hidden="true"
//                                 className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
//                               />
//                             </Switch>
//                           </Field>
//                         </div>
//                       </div>
//                     </ul>
 
//                   </div>
//                 </div>

//                 <div className="p-4 border-t border-white/20">
//                   <div className="flex justify-end gap-4 px-4 sm:px-6">
//                     <button
//                       type="submit"
//                       className="inline-flex justify-center px-6 py-2 text-base font-semibold text-white rounded-md shadow-sm bg-sky-700 hover:bg-sky-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-700"
//                     >
//                       Save
//                     </button>
//                     <button
//                       type="button"
//                       className="inline-flex justify-center px-6 py-2 text-base font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700  "
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//     </div>
//   );
// }















import { useState, useEffect } from "react";
import { Description, Field, Label, Switch } from "@headlessui/react";
import {
  getSettings,
  clearErrors,
  clearMessage,
  updateSettings,
} from "../../redux/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import { 
  Settings, 
  RefreshCw, 
  Save, 
  X, 
  TrendingUp, 
  Users, 
  Award, 
  UserPlus, 
  LogIn, 
  Wallet, 
  DollarSign, 
  TrendingDown, 
  Headphones, 
  ArrowUpCircle,
  Shield,
  CheckCircle,
  Zap
} from "lucide-react";

export default function Setting() {
  const dispatch = useDispatch();
  const { settings, loading, error, message } = useSelector(
    (state) => state.settings
  );
  const [refreshing, setRefreshing] = useState(false);

  // Initialize states based on settings from backend
  const [level, setLevel] = useState(false);
  const [direct, setDirect] = useState(false);
  const [reward, setReward] = useState(false);
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [withdrawal, setWithdrawal] = useState(false);
  const [deposite, setDeposite] = useState(false);
  const [roi, setRoi] = useState(false);
  const [support, setSupport] = useState(false);
  const [topup, setTopup] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [dispatch]);

  const fetchSettings = async () => {
    setRefreshing(true);
    await dispatch(getSettings());
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    if (settings) {
      setLevel(settings.setlevel === 1);
      setDirect(settings.setdirect === 1);
      setReward(settings.setreward === 1);
      setRegister(settings.setregister === 1);
      setLogin(settings.setlogin === 1);
      setWithdrawal(settings.setwithdrawal === 1);
      setDeposite(settings.setdeposite === 1);
      setRoi(settings.setroi === 1);
      setSupport(settings.setsupport === 1);
      setTopup(settings.settopup === 1);
    }
  }, [settings]);

  useEffect(() => {
    if (error) {
      const errorInterval = setInterval(() => {
        dispatch(clearErrors());
      }, 3000);
      return () => clearInterval(errorInterval);
    }
    if (message) {
      const messageInterval = setInterval(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, error, message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      level,
      direct,
      reward,
      register,
      login,
      withdrawal,
      deposite,
      roi,
      support,
      topup,
    };
    dispatch(updateSettings(values));
  };

  const handleCancel = () => {
    if (settings) {
      setLevel(settings.setlevel === 1);
      setDirect(settings.setdirect === 1);
      setReward(settings.setreward === 1);
      setRegister(settings.setregister === 1);
      setLogin(settings.setlogin === 1);
      setWithdrawal(settings.setwithdrawal === 1);
      setDeposite(settings.setdeposite === 1);
      setRoi(settings.setroi === 1);
      setSupport(settings.setsupport === 1);
      setTopup(settings.settopup === 1);
    }
  };

  const settingsGroups = [
    {
      title: "Income Settings",
      icon: TrendingUp,
      color: "blue",
      items: [
        { id: "level", label: "Allow Level Income", description: "You can turn on and off level income for users.", state: level, setState: setLevel, icon: TrendingUp },
        { id: "direct", label: "Allow Direct Income", description: "You can turn on and off direct income for users.", state: direct, setState: setDirect, icon: Users },
        { id: "reward", label: "Allow Reward", description: "You can turn on and off rewards for users.", state: reward, setState: setReward, icon: Award },
      ]
    },
    {
      title: "Access Settings",
      icon: Shield,
      color: "purple",
      items: [
        { id: "register", label: "Allow New Registration", description: "You can turn on and off new registrations for new users.", state: register, setState: setRegister, icon: UserPlus },
        { id: "login", label: "Allow Login", description: "You can turn on and off login for users.", state: login, setState: setLogin, icon: LogIn },
        { id: "support", label: "Allow Support", description: "You can turn on and off support for users.", state: support, setState: setSupport, icon: Headphones },
      ]
    },
    {
      title: "Financial Settings",
      icon: Wallet,
      color: "emerald",
      items: [
        { id: "withdrawal", label: "Allow Withdrawal", description: "You can turn on and off withdrawals for users.", state: withdrawal, setState: setWithdrawal, icon: TrendingDown },
        { id: "deposite", label: "Allow Deposite", description: "You can turn on and off deposites for users.", state: deposite, setState: setDeposite, icon: DollarSign },
        { id: "roi", label: "Allow ROI", description: "You can turn on and off ROI for users.", state: roi, setState: setRoi, icon: TrendingUp },
        { id: "topup", label: "Allow Topup", description: "You can turn on and off topup for users.", state: topup, setState: setTopup, icon: ArrowUpCircle },
      ]
    }
  ];

  const colorSchemes = {
    blue: { gradient: "from-[#D4AF37] to-[#F5C518]", bg: "bg-[#F5C518]/10", text: "text-[#F5C518]", iconBg: "bg-[#F5C518]/20", border: "border-[#F5C518]/30", switchBg: "data-[checked]:bg-[#F5C518]" },
    purple: { gradient: "from-purple-600 to-pink-600", bg: "bg-purple-500/10", text: "text-purple-400", iconBg: "bg-purple-500/20", border: "border-purple-500/30", switchBg: "data-[checked]:bg-purple-500" },
    emerald: { gradient: "from-emerald-600 to-teal-600", bg: "bg-emerald-500/10", text: "text-emerald-400", iconBg: "bg-emerald-500/20", border: "border-emerald-500/30", switchBg: "data-[checked]:bg-emerald-500" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5C518] shadow-lg shadow-[#F5C518]/30">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                System Settings
              </h1>
              <p className="text-slate-400 text-sm mt-1">Configure and manage application settings</p>
            </div>
          </div>
          <button 
            onClick={fetchSettings}
            disabled={refreshing}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Settings'}</span>
          </button>
        </div>

        {/* Alerts */}
        {message && <SuccessAlert message={message} />}
        {error && <ErrorAlert error={error} />}

        {/* Settings Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {settingsGroups.map((group, groupIdx) => {
              const Icon = group.icon;
              const colors = colorSchemes[group.color];
              return (
                <div key={groupIdx} className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
                  <div className={`p-5 border-b border-white/10 bg-gradient-to-r ${colors.gradient} bg-opacity-5`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${colors.iconBg}`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">{group.title}</h2>
                        <p className="text-sm text-slate-400">Configure {group.title.toLowerCase()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-5">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Field key={item.id} className="flex items-center justify-between group">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <ItemIcon className={`w-4 h-4 ${colors.text}`} />
                              <Label as="p" className="text-sm font-medium text-white">
                                {item.label}
                              </Label>
                            </div>
                            <Description className="text-xs text-slate-400 mt-1">
                              {item.description}
                            </Description>
                          </div>
                          <Switch
                            checked={item.state}
                            onChange={item.setState}
                            className={`group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${colors.switchBg} focus:ring-${group.color}-500`}
                          >
                            <span
                              aria-hidden="true"
                              className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                            />
                          </Switch>
                        </Field>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="submit"
              className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] hover:from-[#F5C518] hover:to-indigo-500 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-[#F5C518]/25"
            >
              <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="group flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              Cancel
            </button>
          </div>
        </form>

        {/* Status Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 to-[#F5C518]/10 backdrop-blur-md border border-[#F5C518]/20 p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Settings Status</p>
                <p className="text-xs text-slate-400">All settings are synced with the server</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs text-slate-400">Live Configuration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}