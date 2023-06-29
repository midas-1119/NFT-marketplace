import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const ProcessingPayment = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/marketplace");
    }, 15000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="font-TTTrailers-Regular">Processing Payment</h1>
      <Box sx={{ width: "50%" }}>
        <LinearProgress />
      </Box>
    </div>
  );
};

export default ProcessingPayment;
