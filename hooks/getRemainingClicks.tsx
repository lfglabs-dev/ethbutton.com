import { FullId, NetworkType, RemainingClicks } from "@/constants/types";
import {
  getDomainClaimedStatus,
  getEthEligibility,
  getStarknetEligibility,
  getUserDomains,
} from "@/services/apiService";
import { useEffect, useState } from "react";

export default function getRemainingClicks(
  network?: NetworkType,
  address?: string
) {
  const [remainingClicks, setRemainingClicks] = useState<RemainingClicks>({
    whitelisted: false,
  });
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    if (!address || !network) {
      setRemainingClicks({ whitelisted: false });
      setIsFirstLoad(true);
      return;
    }

    let intervalId: NodeJS.Timeout;

    const fetchStarknetData = async () => {
      try {
        const [eligibilityAmt, availableIds] = await Promise.all([
          getStarknetEligibility(address),
          getUserDomains(address),
        ]);
        const now = Date.now();
        console.log("availableIds", availableIds);
        console.log("now", now);
        const domains = availableIds.full_ids.map((fullId: FullId) => {
          if (
            fullId.domain &&
            fullId.domain_expiry &&
            fullId.domain_expiry * 1000 > now
          )
            return fullId.domain;
        });

        const domainStatus = await getDomainClaimedStatus(domains);
        const domainClicks = Object.values(domainStatus).filter(
          (value) => !value
        ).length;

        const whitelisted = eligibilityAmt.whitelisted
          ? true
          : domains.length > 0
          ? true
          : false;

        setRemainingClicks({
          eligibilityAmt: eligibilityAmt.eligibility_amt ?? 0,
          domainClicks,
          domainStatus,
          whitelisted,
        });
        setIsFirstLoad(false);
      } catch (error) {
        console.log("Error while fetching starknet data", error);
        setRemainingClicks({
          eligibilityAmt: 0,
          whitelisted: false,
        });
        setIsFirstLoad(false);
      }
    };

    const fetchEvmData = async () => {
      try {
        const eligibilityAmt = await getEthEligibility(address);
        setRemainingClicks({
          eligibilityAmt: eligibilityAmt.eligibility_amt ?? 0,
          whitelisted: eligibilityAmt.whitelisted,
          evmBlacklisted: eligibilityAmt.blacklisted ?? false,
        });
        setIsFirstLoad(false);
        return;
      } catch (error) {
        console.log("Error while fetching ethereum eligibility", error);
        setRemainingClicks({ eligibilityAmt: 0, whitelisted: false });
        setIsFirstLoad(false);
        return;
      }
    };

    if (network === NetworkType.STARKNET) {
      fetchStarknetData();
      intervalId = setInterval(fetchStarknetData, 5000); // Set interval for fetching Starknet data
    } else if (network === NetworkType.EVM) {
      fetchEvmData();
      intervalId = setInterval(fetchEvmData, 5000); // Set interval for fetching EVM data
    }

    // Clean up interval on component unmount or when network/address changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [network, address]);

  return { isFirstLoad, remainingClicks };
}
