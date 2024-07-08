"use client";

import React, { useEffect, useRef, FunctionComponent, useState } from "react";
import { TextField, styled } from "@mui/material";
import styles from "../../styles/components/search.module.css";
import { StarknetIdNavigator } from "starknetid.js";
import { useIsValid, getStatus } from "@/hooks/useIsValid";
import { SearchResult } from "@/constants/types";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    padding: "10px 35px",
    caretColor: "#454545",
    margin: "1px 0 1px 1px",
    width: "calc(100% - 2px)",
    height: "100px",
    "& fieldset": {
      borderRadius: "20px",
      boxShadow: "0px 2px 30px 0px rgba(0, 0, 0, 0.06)",
      backgroundColor: "#111827",
    },
    "& .MuiInputBase-input": {
      color: "#FFFFFF",
      fontFamily: "Airstrike",
      fontSize: "32px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "32px",
      letterSpacing: "0.04em",
      textAlign: "center",
      zIndex: "1",
    },
    "&:hover fieldset": {
      border: "1px",
      borderImage:
        "linear-gradient(77.5deg, #109AE4 -31.33%, #27ABF1 -19.3%, #2BAAEE -4.45%, #3BB1F0 11.89%, #7581F7 29.28%, #EF30A2 47.54%, #F276C0 66.2%, #FFADDE 81.84%)",
      borderRadius: "20px",
    },
    "& ::placeholder": {
      color: "#A6A5A7",
      textAlign: "center",
      fontFamily: "Airstrike",
      fontSize: "32px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "32px",
      letterSpacing: "0.04em",
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
  "@media (max-width:1024px)": {
    "& .MuiOutlinedInput-root": {
      height: "60px",
    },
    "& .MuiInputBase-input": {
      fontSize: "20px !important",
      lineHeight: "20px !important",
    },
    "& ::placeholder": {
      fontSize: "20px !important",
      lineHeight: "20px !important",
    },
  },
  "@media (max-width:490px)": {
    "& .MuiOutlinedInput-root": {
      height: "30px",
    },
    "& .MuiInputBase-input": {
      fontSize: "13px !important",
      lineHeight: "13px !important",
    },
    "& ::placeholder": {
      fontSize: "13px !important",
      lineHeight: "13px !important",
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiOutlinedInput-root": {
      padding: "0 30px",
      // height: "60px",
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
  starknetIdNavigator: StarknetIdNavigator;
  setCurrentResult: (result: SearchResult | null) => void;
  onSearch: (result: SearchResult) => void;
};

const SearchBar: FunctionComponent<SearchBarProps> = ({
  starknetIdNavigator,
  setCurrentResult,
  onSearch,
}) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const latestRequestRef = useRef<number>(0);
  const [typedValue, setTypedValue] = useState<string>("");
  const isValid = useIsValid(typedValue);

  function handleChange(value: string) {
    latestRequestRef.current += 1;
    setTypedValue(value.toLowerCase());
  }

  useEffect(() => {
    if (typedValue) {
      // Cancel previous request
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      // Create a new AbortController
      controllerRef.current = new AbortController();
      const currentRequest = latestRequestRef.current;

      getStatus(starknetIdNavigator, typedValue, controllerRef.current.signal)
        .then((result) => {
          if (currentRequest === latestRequestRef.current) {
            setCurrentResult(result);
            onSearch?.(result);
          }
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("An unexpected error occurred:", error);
          }
        });
    } else {
      setCurrentResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedValue]); // We won't add getStatus because this would cause an infinite loop

  const isError = (): boolean => {
    if (isValid !== undefined && isValid != true) return true;
    return false;
  };

  return (
    <div className={styles.searchContainer} ref={resultsRef}>
      <div className={styles.searchBorders}>
        <CustomTextField
          fullWidth
          id="outlined-basic"
          placeholder="ENTER YOUR ADDRESS"
          variant="outlined"
          onChange={(e) => handleChange(e.target.value)}
          value={typedValue}
          error={isError()}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default SearchBar;
