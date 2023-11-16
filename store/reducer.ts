import { combineReducers } from "@reduxjs/toolkit";
import ProfileReducer from "./slice/profileSlice";
import StoreModalReducer from "@/hooks/use-store-modal";

const CombinedReducers = combineReducers({
  profile: ProfileReducer,
  storeModal: StoreModalReducer,
});

export default CombinedReducers;
