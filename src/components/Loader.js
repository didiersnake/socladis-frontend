import { useEffect } from "react";
import readProductAction from "../admin/features/product/actions/readProductAction";
import readStockActions from "../admin/features/stock/actions/readStockActions";
import readUsersAction from "../features/users/actions/readUsersAction";
import { useDispatch } from "react-redux";

export const Loader = () => {
  const dispatch = useDispatch();

  const readProducts = async () => {
    try {
      await dispatch(readProductAction());
    } catch (error) {
      console.log(error.response);
    }
  };

  const readStockItems = async () => {
    try {
      await dispatch(readStockActions());
    } catch (error) {
      console.log(error.response);
    }
  };

  const readUsers = async () => {
    try {
      await dispatch(readUsersAction());
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readUsers();
    readProducts();
    readStockItems();
  });

  return;
};
