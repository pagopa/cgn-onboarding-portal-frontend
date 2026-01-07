import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "./store";
export const useCgnDispatch = () => useDispatch<AppDispatch>();
export const useCgnSelector = useSelector.withTypes<RootState>();
