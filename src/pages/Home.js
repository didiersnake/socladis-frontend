import { Link } from "react-router-dom";
import React from "react";

export const Home = () => {
  return (
    <div>
      <Link to={"/login"}>Admin</Link>
    </div>
  );
};
