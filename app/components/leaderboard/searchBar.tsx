"use client";

import React from "react";
import { TextField, styled } from "@mui/material";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    padding: "10px 35px",
    caretColor: "#454545",
    "& fieldset": {
      border: "1px solid #CDCCCC",
      borderRadius: "20px",
      boxShadow: "0px 2px 30px 0px rgba(0, 0, 0, 0.06)",
      backgroundColor: "#FFFFFF",
    },
    "& .MuiInputBase-input": {
      color: "#454545",
      fontSize: "24px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "24px",
      letterSpacing: "0.24px",
      textAlign: "center",
      zIndex: "1",
    },
    "&:hover fieldset": {
      border: "1px solid #CDCCCC",
    },
    "& ::placeholder": {
      color: "#B0AEAE",
      textAlign: "center",
      fontSize: "24px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "24px",
      letterSpacing: "0.24px",
      justifyContent: "center",
      alignItems: "center",
    },
    "&.Mui-focused ::placeholder": {
      color: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiOutlinedInput-root": {
      padding: "0 30px",
      "& .MuiInputBase-input": {
        fontSize: "22px",
        lineHeight: "22px",
        letterSpacing: "0.2px",
      },
      "& ::placeholder": {
        fontSize: "16px",
        lineHeight: "20px",
        letterSpacing: "0.2px",
      },
    },
  },
}));

type SearchBarProps = {
  onChangeTypedValue?: (typedValue: string) => void;
  // onSearch?: (result: SearchResult) => void;
};
