

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../../components/common/Loader";
import { usePlans } from "../../hooks/usePlans";

export default function Plans() {
  const {
    plans,
    loading,
    error,
    message,
    clearErrors,
    clearMessage,
    deletePlan,
  } = usePlans();

  useEffect(() => {
    if (error) {
      const errorInterval = setInterval(() => {
        clearErrors();
      }, 3000);
      return () => clearInterval(errorInterval);
    }
    if (message) {
      const messageInterval = setInterval(() => {
        clearMessage();
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [error, message, clearErrors, clearMessage]);

  const getPlanStyle = (planName) => {
    if (!planName) {
      return {
        bgColor: "bg-yellow-900",
        borderColor: "border-[#F5C518]",
        badgeColor: "bg-yellow-700 text-yellow-100",
        buttonColor: "bg-[#D4AF37] hover:bg-yellow-700",
        iconColor: "text-[#f0d060]",
      };
    }
    
    switch (planName.toLowerCase()) {
      case "entry":
        return {
          bgColor: "bg-yellow-900",
          borderColor: "border-[#F5C518]",
          badgeColor: "bg-yellow-700 text-yellow-100",
          buttonColor: "bg-[#D4AF37] hover:bg-yellow-700",
          iconColor: "text-[#f0d060]",
        };
      case "silver":
        return {
          bgColor: "bg-yellow-900",
          borderColor: "border-gray-400",
          badgeColor: "bg-gray-700 text-gray-100",
          buttonColor: "bg-gray-600 hover:bg-gray-700",
          iconColor: "text-gray-300",
        };
      case "golden":
        return {
          bgColor: "bg-yellow-900",
          borderColor: "border-yellow-500",
          badgeColor: "bg-yellow-600 text-yellow-100",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
          iconColor: "text-yellow-300",
        };
      case "premium":
        return {
          bgColor: "bg-yellow-900",
          borderColor: "border-purple-500",
          badgeColor: "bg-purple-700 text-purple-100",
          buttonColor: "bg-purple-600 hover:bg-purple-700",
          iconColor: "text-purple-300",
        };
      default:
        return {
          bgColor: "bg-yellow-900",
          borderColor: "border-[#F5C518]",
          badgeColor: "bg-yellow-700 text-yellow-100",
          buttonColor: "bg-[#D4AF37] hover:bg-yellow-700",
          iconColor: "text-[#f0d060]",
        };
    }
  };

  return (
    <>
      {loading ? (
        <Loader isLoading={loading} />
      ) : (
        <div className="min-h-screen  p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section - Smaller */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gold-medium mb-2">
                Investment Plans
              </h1>
              <p className="text-md text-yellow-200 max-w-2xl mx-auto">
                Select the perfect plan for your investment goals
              </p>
            </div>

            {/* Plans Grid - Black Background with Smaller Boxes */}
            <div className="bg-yellow rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans?.map((plan) => {
                  if (!plan) return null;
                  
                  const style = getPlanStyle(plan.name);
                  const monthlyPrice = plan.monthly_price || plan.price || plan.amount || 0;

                  const calculateEarnings = () => {
                    const roiDay = plan.ROI_day || 0;
                    const planPeriod = plan.plan_period || 0;
                    if (roiDay === 0 || monthlyPrice === 0) return 0;
                    const dailyEarning = (monthlyPrice * roiDay) / 100;
                    return (dailyEarning * 30 * planPeriod).toFixed(2);
                  };

                  return (
                    <div
                      key={plan.id || Math.random()}
                      className={`relative rounded-xl overflow-hidden ${style.bgColor} border ${style.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                    >
                      {/* Popular Badge - Smaller */}
                      {plan.name && plan.name.toLowerCase() === "golden" && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                            POPULAR
                          </div>
                        </div>
                      )}

                      {/* Plan Header - Compact */}
                      <div className="pt-5 pb-2 px-4 text-center border-b border-white/10">
                        <h3 className="text-xl font-bold capitalize mb-1 text-white">
                          {plan.name || "Plan"}
                        </h3>
                        <div className="flex justify-center items-end mt-1">
                          <span className="text-3xl font-bold text-white">
                            ${monthlyPrice}
                          </span>
                          <span className="text-[#f0d060] ml-1 text-sm mb-0.5">/month</span>
                        </div>
                        <p className="text-yellow-200 mt-2 text-xs">
                          {plan.description || "Start your investment journey"}
                        </p>
                      </div>

                      {/* Features List - Compact */}
                      <div className="p-4">
                        <ul className="space-y-2">
                          <li className="flex items-center text-sm p-1 rounded-lg hover:bg-white/5 transition">
                            <svg
                              className={`w-4 h-4 ${style.iconColor} mr-2`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div>
                              <span className="text-yellow-200 text-xs">Daily ROI: </span>
                              <span className="font-bold text-white text-sm">
                                {plan.ROI_day || 0}%
                              </span>
                            </div>
                          </li>
                          
                          <li className="flex items-center text-sm p-1 rounded-lg hover:bg-white/5 transition">
                            <svg
                              className={`w-4 h-4 ${style.iconColor} mr-2`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div>
                              <span className="text-yellow-200 text-xs">Overall ROI: </span>
                              <span className="font-bold text-white text-sm">
                                {plan.ROI_overall || 0}%
                              </span>
                            </div>
                          </li>
                          
                          <li className="flex items-center text-sm p-1 rounded-lg hover:bg-white/5 transition">
                            <svg
                              className={`w-4 h-4 ${style.iconColor} mr-2`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div>
                              <span className="text-yellow-200 text-xs">Sponsor Bonus: </span>
                              <span className="font-bold text-white text-sm">
                                ${plan.Sponser_bonus || 0}
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* Button Section - Smaller */}
                      {/* <div className="px-4 pb-4 pt-0">
                        <button
                          className={`w-full py-2 px-3 rounded-lg text-white font-semibold text-sm transition-all duration-300 ${style.buttonColor} shadow-md hover:shadow-lg transform hover:scale-105`}
                        >
                          Get Started
                        </button>
                      </div> */}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}