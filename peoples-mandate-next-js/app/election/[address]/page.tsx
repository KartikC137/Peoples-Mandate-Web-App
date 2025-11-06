"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useWeb3 } from "@/lib/contexts/web3/Web3Context";
import { isAddress, type Address } from "viem";
import Button from "@/components/Button";
import { electionContractAbi } from "@/lib/contracts/election";
// import Vote  from "@/components/web3/Vote";

export default function ElectionPage() {
  const params = useParams();
  const electionAddress = params.id as `0x${string}`;

  const { account, chain, publicClient, walletClient } = useWeb3();

  const [isVoting, setIsVoting] = useState<boolean>(false);

  if (!isAddress(electionAddress)) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: Invalid Election format in URL.
      </div>
    );
  }

  async function handleVote() {
    if (!walletClient) {
      return;
    }
    try {
      setIsVoting(true);

      // const votingArgs = [voteArr];

      // const hash = walletClient.writeContract({
      //   address: electionAddress,
      //   chain: chain,
      //   abi: electionContractAbi,
      //   functionName: "userVote",
      //   args: votingArgs,
      //   account,
      // });
    } catch (err) {
    } finally {
      setIsVoting(false);
    }
  }

  return <div></div>;
}
