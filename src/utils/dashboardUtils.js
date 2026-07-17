
export const calculateTotalEarnings = (user) => {
  const toNum = (val) => Number(val) || 0;
  return (
    toNum(user?.roi_income) +
    toNum(user?.direct_income)
  ).toFixed(2);
};

export const calculateBusinessForTeam = (user) => {
  let totalBusiness = user?.active_plan || 0;

  if (user?.referrals && user?.referrals?.length > 0) {
    user?.referrals?.forEach((referral) => {
      totalBusiness += calculateBusinessForTeam(referral);
    });
  }

  return totalBusiness;
};


export const calculateBusinessForLegs = (users) => {
  const result = {};
  users?.forEach((user) => {
    result[user.id] = calculateBusinessForTeam(user);
  });
  return result;
};


export const countTotalTeamWithActiveInactive = (user) => {
  let totalTeam = 0;
  let activeCount = 0;
  let inactiveCount = 0;
  const stack = [user];

  while (stack.length > 0) {
    const currentUser = stack.pop();
    totalTeam += 1;

    if (currentUser.is_active === "active") {
      activeCount += 1;
    } else if (currentUser.is_active === "inactive") {
      inactiveCount += 1;
    }

    if (currentUser.referrals && currentUser.referrals.length > 0) {
      stack.push(...currentUser.referrals);
    }
  }

  return { totalTeam, activeCount, inactiveCount };
};


export const combineTransactions = (deposits, withdrawals) => {
  const depositsWithType = deposits?.map((deposit) => ({
    ...deposit,
    type: "deposit"
  })) || [];

  const withdrawalsWithType = withdrawals?.map((withdrawal) => ({
    ...withdrawal,
    type: "withdrawal",
  })) || [];

  if (withdrawalsWithType.length === 0 && depositsWithType.length === 0) {
    return [];
  }

  const combinedArray = [...depositsWithType, ...withdrawalsWithType];
  return combinedArray.sort((a, b) => new Date(a.createdAT) - new Date(b.createdAT));
};


export const calculateTotalDeposits = (deposits) => {
  return deposits?.reduce((total, deposit) => total + (deposit.amount || 0), 0) || 0;
};

export const calculateTotalWithdrawals = (withdrawals) => {
  return withdrawals?.reduce(
    (total, withdrawal) =>
      total + (withdrawal.amount || 0) + (withdrawal.deduction || 0),
    0
  ) || 0;
};


export const calculateUsagePercentage = (usedAmount, totalLimit) => {
  if (!totalLimit || totalLimit === 0) return 0;
  return Math.min(Math.round((Number(usedAmount) / totalLimit) * 100), 100);
};


export const calculateRemainingTradeLimit = (user) => {
  if (!user?.active_plan || user.active_plan === 0) return 0;

  return Number(user.active_plan) * 2 - Number(user?.roi_income || 0);
};


export const calculateLimitLeft = (user, totalEarnings) => {
  const limit = Number(user?.active_plan) * 4;
  return Math.max(limit - Number(totalEarnings), 0);
};


export const getActiveSinceInfo = (createdAt) => {
  const createdDate = new Date(createdAt);
  const today = new Date();
  const options = { year: "numeric", month: "long" };
  const formattedDate = createdDate.toLocaleDateString("en-US", options);

  let months = (today.getFullYear() - createdDate.getFullYear()) * 12 +
    (today.getMonth() - createdDate.getMonth());
  months = months <= 0 ? 0 : months;

  return {
    formattedDate,
    monthsActive: months,
    displayText: `Active Since\n${formattedDate}\n${months} months`,
  };
};

export const formatReferralLink = (referralCode, baseUrl = "https://Mock.ceo/registration") => {
  return `${baseUrl}?referral=${referralCode}`;
};

export const truncateWalletAddress = (address, startChars = 4, endChars = 4) => {
  if (!address) return "N/A";

  if (address.length <= startChars + endChars) {
    return address;
  }

  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};


export const calculateTeamStatistics = (treeData) => {
  if (!treeData || !Array.isArray(treeData)) {
    return {
      totalTeamCount: 0,
      totalActiveMembers: 0,
      totalInactiveMembers: 0,
      totalDirectActiveMembers: 0,
      totalDirectInactiveMembers: 0,
      totalBusiness: 0
    };
  }

  const totalDirectActiveMembers = treeData.filter(
    (user) => user?.is_active === "active"
  ).length;

  const totalDirectInactiveMembers = treeData.filter(
    (user) => user?.is_active === "inactive"
  ).length;

  let totalTeamCount = 0;
  let totalActiveMembers = 0;
  let totalInactiveMembers = 0;

  treeData.forEach((user) => {
    const { totalTeam, activeCount, inactiveCount } =
      countTotalTeamWithActiveInactive(user);
    totalTeamCount += totalTeam;
    totalActiveMembers += activeCount;
    totalInactiveMembers += inactiveCount;
  });

  // Calculate total business
  const businessByLeg = calculateBusinessForLegs(treeData);
  const totalBusiness = Object.values(businessByLeg).reduce(
    (acc, value) => acc + value,
    0
  );

  return {
    totalTeamCount,
    totalActiveMembers,
    totalInactiveMembers,
    totalDirectActiveMembers,
    totalDirectInactiveMembers,
    totalBusiness
  };
};