import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import Card from "../card";
import styles from "../../styles/components/card.module.css";
import Button from "../button";
import FundIcon from "../iconComponents/fundIcon";
import { getEthEligibility, getUserDomains } from "@/services/apiService";
import { AccountInterface } from "starknet";
import { getEnsAddress } from "wagmi/actions";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet as EthMainnet, sepolia as EthSepolia } from "wagmi/chains";
import { NetworkType } from "@/constants/types";
import Strong from "../strong";
import { useMediaQuery } from "@mui/material";

type EligibilityStepsProps = {
  disconnect: () => void;
  setMessage: (message: ReactNode) => void;
  address?: string;
  starknetAccount?: AccountInterface;
  network?: NetworkType;
};

const EligibilitySteps: FunctionComponent<EligibilityStepsProps> = ({
  disconnect,
  setMessage,
  address,
  starknetAccount,
  network,
}) => {
  const [hasUsedEthereum, setHasUsedEthereum] = useState(false);
  const [hasFundedWallet, setHasFundedWallet] = useState(false);
  const [hasStarkDomain, setHasStarkDomain] = useState(false);
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const [loadingEthCheck, setLoadingEthCheck] = useState(true);
  const [loadingEthAddress, setLoadingEthAddress] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1280px)");

  useEffect(() => {
    if (!address) return;
    starknetAccount
      ?.callContract({
        contractAddress: process.env
          .NEXT_PUBLIC_STARKNET_ETH_CONTRACT as string,
        calldata: [address],
        entrypoint: "balanceOf",
      })
      .then((response) => {
        // @ts-expect-error The "result" property is missing from the type definition
        if (response.result[0] !== "0x0") setHasFundedWallet(true);
      });
  }, [starknetAccount, address]);

  useEffect(() => {
    if (!address || network === NetworkType.EVM || !network) return;
    setLoadingEthAddress(true);
    getUserDomains(address).then(async (response) => {
      const ids = response.full_ids;
      for (let index = 0; index < ids.length; index++) {
        const identity = ids[index];
        if (identity.domain) {
          setHasStarkDomain(true);
          const ensDomain = identity.domain.replace(".stark", ".snid.eth");
          // ethereum connection
          const config = getDefaultConfig({
            appName: "Eth Button",
            projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_APP_ID as string,
            chains: [
              process.env.NEXT_PUBLIC_IS_TESTNET === "true"
                ? EthSepolia
                : EthMainnet,
            ],
          });
          const ensAddress = await getEnsAddress(config, { name: ensDomain });
          if (ensAddress) setEthAddress(ensAddress);
        }
      }
      setLoadingEthAddress(false);
    });
  }, [address, network]);

  useEffect(() => {
    setLoadingEthCheck(true);
    if (network === NetworkType.EVM && address)
      getEthEligibility(address).then((res) => {
        setHasUsedEthereum(res.whitelisted);
        setLoadingEthCheck(false);
      });
    if (network === NetworkType.STARKNET && ethAddress)
      getEthEligibility(ethAddress).then((res) => {
        setHasUsedEthereum(res.whitelisted);
        setLoadingEthCheck(false);
      });
    if (network === NetworkType.STARKNET && !ethAddress && !loadingEthAddress)
      setLoadingEthCheck(false);
  }, [address, ethAddress, network, loadingEthAddress]);

  useEffect(() => {
    if (loadingEthAddress || loadingEthCheck) return setMessage("");
    let points = 0;
    if (hasUsedEthereum) points += 1;
    if (hasFundedWallet) points += 1;
    if (hasStarkDomain) points += 2;
    if (points)
      setMessage(
        <p>
          Awesome! You&apos;ve earned{" "}
          <Strong>
            {points} credit{points > 1 ? "s" : ""}
          </Strong>{" "}
          to use with your wallet!
        </p>
      );
    else
      setMessage(
        <p>
          Unfortunately, you do not meet any eligibility criteria.
          <br />
          <br />
          Please fund your Starknet wallet or own a .stark domain on Starknet to
          receive credits and participate in the game.
        </p>
      );
  }, [
    hasUsedEthereum,
    hasFundedWallet,
    hasStarkDomain,
    setMessage,
    loadingEthAddress,
    loadingEthCheck,
  ]);

  return (
    <div className={styles.cardsContainer}>
      <Card
        completed={hasUsedEthereum}
        failed={!hasUsedEthereum}
        loading={loadingEthCheck || loadingEthAddress}
        showButtonDone={false}
        title="1 Credit"
      >
        Has used the Ethereum ecosystem in the last year
      </Card>
      <Card
        completed={hasFundedWallet}
        loading={false}
        buttonText="Fund Now"
        buttonIcon={<FundIcon color="#C8CCD3" width="16" />}
        showButtonDone={false}
        title="1 Credit"
        onClick={() => window.open(process.env.NEXT_PUBLIC_FUND_WALLET_URL)}
      >
        Have a funded Starknet wallet
      </Card>
      <Card
        completed={hasStarkDomain}
        loading={false}
        buttonText="Buy domain"
        buttonIcon={<img src="/visuals/StarknetId-Logo.svg" alt="StarknetID" />}
        showButtonDone={false}
        title="2 Credits"
        onClick={() => window.open(process.env.NEXT_PUBLIC_STARKNET_ID_URL)}
      >
        Own a .stark domain on Starknet
      </Card>
      {isMobile ? null : (
        <div className="mx-auto mt-7">
          <Button onClick={disconnect}>Check another wallet</Button>
        </div>
      )}
    </div>
  );
};

export default EligibilitySteps;
