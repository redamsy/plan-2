import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";

export default function CircularProgressPage({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <Box>
      <CircularLoading />
      {children}
    </Box>
  );
}
const DisabledBackground = styled(Box)({
  width: "100%",
  height: "100%",
  position: "fixed",
  background: "#ccc",
  opacity: 0.5,
  zIndex: 1,
});

const CircularLoading = (): JSX.Element => (
  <>
    <CircularProgress
      size={70}
      sx={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
      }}
    />
    <DisabledBackground />
  </>
);
