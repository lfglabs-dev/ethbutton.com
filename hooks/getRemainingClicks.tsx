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

  useEffect(() => {
    if (!address || !network) {
      setRemainingClicks({ whitelisted: false });
      return;
    }

    let intervalId: NodeJS.Timeout;

    const fetchStarknetData = async () => {
      try {
        const [eligibilityAmt, availableIds] = await Promise.all([
          getStarknetEligibility(address),
          getUserDomains(address),
        ]);
        const domains = availableIds.full_ids
          .map((fullId: FullId) => fullId.domain)
          .filter((domain: string) => domain);

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
      } catch (error) {
        console.log("Error while fetching starknet data", error);
        setRemainingClicks({
          eligibilityAmt: 0,
          whitelisted: false,
        });
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
        return;
      } catch (error) {
        console.log("Error while fetching ethereum eligibility", error);
        setRemainingClicks({ eligibilityAmt: 0, whitelisted: false });
        return;
      }
    };

    if (network === NetworkType.starknet) {
      fetchStarknetData();
      intervalId = setInterval(fetchStarknetData, 5000); // Set interval for fetching Starknet data
    } else if (network === NetworkType.evm) {
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

  return remainingClicks;
}
