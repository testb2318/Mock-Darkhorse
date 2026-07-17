// // import React, { useState, useEffect } from "react";
// // import { useSelector, useDispatch } from "react-redux";
// // import { fetchUserRewards, fetchUserBusiness } from "../../redux/rewardSlice";

// // const NameReward = ({ rewards }) => {
// //   // Filter completed rewards and map to their titles
// //   const completedRewardNames = rewards
// //     ?.filter((reward) => reward.is_completed === 1)
// //     ?.map((reward) => reward.title);

// //   if (!completedRewardNames || completedRewardNames.length === 0) {
// //     return <span className="text-gray-400">No completed rewards yet.</span>;
// //   }

// //   // Show names in a single line, comma separated
// //   return (
// //     <span className="text-lg md:text-xl text-white">
// //      Rank - {completedRewardNames.join(", ")}
// //     </span>
// //   );
// // };

// // export default function Rewards() {
// //   const dispatch = useDispatch();
// //   const { auth } = useSelector((state) => state.auth);
// //   const { rewards, loading } = useSelector((state) => state.rewards);

// //   useEffect(() => {
// //     if (auth) {
// //       dispatch(fetchUserRewards(auth?.id));
// //       dispatch(fetchUserBusiness(auth?.id));
// //     }
// //   }, [dispatch, auth]);

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-full">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
// //       </div>
// //     );
// //   }

// //   if (!rewards || rewards.length === 0) {
// //     return (
// //       <div className="p-5 text-center text-gray-400">
// //         No rewards data available.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="justify-center ">
// //       {/* Sirf completed rewards ke naam, ek hi line me */}
// //       <NameReward rewards={rewards} />
// //     </div>
// //   );
// // }
// // import React, { useEffect } from "react";
// // import { useSelector, useDispatch } from "react-redux";
// // import { fetchUserRewards, fetchUserBusiness } from "../../redux/rewardSlice";

// // const NameReward = ({ rewards }) => {
// //   // Current achieved reward only (last completed)
// //   const lastCompletedReward = rewards
// //     ?.filter((reward) => reward.is_completed === 1)
// //     ?.pop();

// //   if (!lastCompletedReward) {
// //     return <span className="text-gray-400">No completed rewards yet.</span>;
// //   }

// //   return (
// //     <span className="text-lg md:text-xl text-white">
// //       Rank - {lastCompletedReward.title}
// //     </span>
// //   );
// // };

// // export default function Rewards() {
// //   const dispatch = useDispatch();
// //   const { auth } = useSelector((state) => state.auth);
// //   const { rewards, loading } = useSelector((state) => state.rewards);

// //   useEffect(() => {
// //     if (auth) {
// //       dispatch(fetchUserRewards(auth?.id));
// //       dispatch(fetchUserBusiness(auth?.id));
// //     }
// //   }, [dispatch, auth]);

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-full">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
// //       </div>
// //     );
// //   }

// //   if (!rewards || rewards.length === 0) {
// //     return (
// //       <div className="p-5 text-center text-gray-400">
// //         No rewards data available.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="justify-center">
// //       {/* Sirf current achieved reward ka naam */}
// //       <NameReward rewards={rewards} />
// //     </div>
// //   );
// // }
// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchUserRewards, fetchUserBusiness } from "../../redux/rewardSlice";

// const NameReward = ({ rewards }) => {
//   // Current achieved reward only (last completed)
//   const lastCompletedReward = rewards
//     ?.filter((reward) => reward.is_completed === 1)
//     ?.pop();

//   if (!lastCompletedReward) {
//     return (
//       <span className="text-gray-400 text-lg md:text-xl">
//         No completed rewards yet.
//       </span>
//     );
//   }

//   return (
//     <span className="text-lg md:text-xl text-white">
//       Achieved Rank -{" "}
//       <span className="text-emerald-400 font-semibold">
//         {lastCompletedReward.title}
//       </span>
//     </span>
//   );
// };

// export default function Rewards() {
//   const dispatch = useDispatch();
//   const { auth } = useSelector((state) => state.auth);
//   const { rewards, loading } = useSelector((state) => state.rewards);

//   useEffect(() => {
//     if (auth) {
//       dispatch(fetchUserRewards(auth?.id));
//       dispatch(fetchUserBusiness(auth?.id));
//     }
//   }, [dispatch, auth]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   if (!rewards || rewards.length === 0) {
//     return (
//       <div className="p-5 text-center text-gray-400">
//         No rewards data available.
//       </div>
//     );
//   }

//   return (
//     <div className="justify-center">
//       {/* Sirf current achieved reward ka naam, colored */}
//       <NameReward rewards={rewards} />
//     </div>
//   );
// }
