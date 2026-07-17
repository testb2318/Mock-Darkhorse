import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getAllPlans,
  addPlan,
  updatePlan,
  deletePlan,
  getPlan,
  addActiveLevel,
  addInvestLevel,
  clearErrors,
  clearMessage,
} from "../redux/planSlice";

export const usePlans = () => {
  const dispatch = useDispatch();
  const { plans, singleplan, loading, error, message } = useSelector((state) => state.plans);

  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  return {
    plans,
    singleplan,
    loading,
    error,
    message,
    getPlan: (id) => dispatch(getPlan(id)),
    addPlan: (values) => dispatch(addPlan(values)),
    updatePlan: (id, updatedData) => dispatch(updatePlan({ id, updatedData })),
    deletePlan: (id) => dispatch(deletePlan(id)),
    addActiveLevel: (values) => dispatch(addActiveLevel(values)),
    addInvestLevel: (values) => dispatch(addInvestLevel(values)),
    clearErrors: () => dispatch(clearErrors()),
    clearMessage: () => dispatch(clearMessage()),
  };
};
