// show loading and redirect user to relevant page based on their role

import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { CircularProgress, Box } from "@mui/material";

const index = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  return <div>index</div>;
};

export default index;
