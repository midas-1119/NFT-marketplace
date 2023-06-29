import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

import { useDispatch, useSelector } from "react-redux";
import { connectMetamaskWallet } from "../../store/auth/async.fun";
import { authService } from "../../services/auth.service";

import { selectUser } from "../../store/auth/selector";

const MetamaskLogin = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const query = router.query;

  useEffect(() => {
    const timer = setTimeout(async () => {
      const resp: any = await dispatch(connectMetamaskWallet({}));

      const userId = query.user;

      const data = { metamaskId: resp.payload.account, userId: userId };

      console.log("Data: ", data);

      const res = await authService.syncMetamask(data);

      console.log("Response: ", res);

      router.push(res.data.data.url);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="font-TTTrailers-Regular">Logging In</h1>
      <Box sx={{ width: "50%" }}>
        <LinearProgress />
      </Box>
    </div>
  );
};

export default MetamaskLogin;
