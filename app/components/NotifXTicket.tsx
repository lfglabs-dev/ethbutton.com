"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { storeHasClaimedXTicket } from "@/services/localStorageService";
import Notification from "./notification";

type NotifXTicketProps = {
  hasClaimedX?: boolean;
  setHasClaimedX: (hasClaimedX: boolean) => void;
};

const NotifXTicket: FunctionComponent<NotifXTicketProps> = ({
  hasClaimedX,
  setHasClaimedX,
}) => {
  const searchParams = useSearchParams();
  const claimXStatus = searchParams.get("success");
  const claimXError = searchParams.get("error_msg");
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!claimXStatus) return;
    if (claimXStatus === "true") {
      if (!hasClaimedX) {
        storeHasClaimedXTicket();
        setHasClaimedX(true);
      }
    } else if (claimXStatus === "false" && claimXError) {
      // show error message
      if ((claimXError as string).includes("already claimed")) {
        setHasClaimedX(true);
      }
      setErrorMsg(claimXError);
      setShowErrorMsg(true);
    }
  }, [claimXStatus, claimXError]);

  const closeErrorMsg = () => {
    setShowErrorMsg(false);
    setErrorMsg("");
  };

  return (
    <>
      <Notification visible={showErrorMsg} onClose={closeErrorMsg}>
        <>{errorMsg}</>
      </Notification>
    </>
  );
};

export default NotifXTicket;
