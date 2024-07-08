"use client";

import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";

const LeaderboardSkeleton: FunctionComponent = () => {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton
        variant="rectangular"
        width={"100%"}
        height={30}
        className="mx-auto"
      />
      <Skeleton
        variant="rectangular"
        width={"100%"}
        height={30}
        className="mx-auto"
      />
      <Skeleton
        variant="rectangular"
        width={"100%"}
        height={30}
        className="mx-auto"
      />
      <Skeleton
        variant="rectangular"
        width={"100%"}
        height={30}
        className="mx-auto"
      />
      <Skeleton
        variant="rectangular"
        width={"100%"}
        height={30}
        className="mx-auto"
      />
    </div>
  );
};

export default LeaderboardSkeleton;
