"use client";

import { useWeb3 } from "@/lib/contexts/web3/Web3Context";
import React, { useState } from "react";
import { type Address, decodeEventLog } from "viem";
import { electionFactoryAddressSepolia } from "@/lib/contracts/electionFactoryAddress";
import { electionFactoryContractAbi } from "@/lib/contracts/electionFactory";
import Button from "@/components/Button";
import Input from "@/components/Input";

export interface CreateElectionProps {}
export interface ElectionInfo {
  startTime: bigint | null;
  endTime: bigint | null;
  name: string;
  description: string;
}
export interface CandidateInfo {
  candidateID: bigint;
  name: string;
  description: string;
}

/**
 * Converts a bigint Unix timestamp (in seconds) to a string
 * suitable for a <input type="datetime-local">.
 */
function bigintToDatetimeLocal(timestamp: bigint | null): string {
  if (!timestamp) return "";

  // 1. Convert bigint seconds to milliseconds (as a number)
  const date = new Date(Number(timestamp) * 1000);

  // 2. Adjust for the local timezone offset
  // (datetime-local inputs don't understand timezones)
  const timezoneOffset = date.getTimezoneOffset() * 60000; // in milliseconds
  const localDate = new Date(date.getTime() - timezoneOffset);

  // 3. Format as "yyyy-MM-ddTHH:mm"
  // .slice(0, 16) cuts off the seconds and milliseconds
  return localDate.toISOString().slice(0, 16);
}

/**
 * Converts a string from a <input type="datetime-local">
 * into a bigint Unix timestamp (in seconds).
 */
function datetimeLocalToBigint(datetime: string): bigint | null {
  if (!datetime) return null;

  // 1. Create a Date object from the string
  const date = new Date(datetime);

  // 2. Get milliseconds, divide by 1000 for seconds, and convert to BigInt
  return BigInt(Math.floor(date.getTime() / 1000));
}

export default function CreateElectionForm() {
  const { account, chain, publicClient, walletClient } = useWeb3();

  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startTime, setStartTime] = useState<bigint | null>(null);
  const [endTime, setEndTime] = useState<bigint | null>(null);
  const [ballotType, setBallotType] = useState<number>();
  const [resultType, setResultType] = useState<number>();
  const [candidateID, setCandidateID] = useState<number>();
  const [candidateName, setCandidateName] = useState<string | "">("");
  const [candidateDescription, setCandidateDescription] = useState<string | "">(
    ""
  );
  const [candidateList, setCandidateList] = useState<CandidateInfo[] | null>(
    null
  );

  const appId = "app_staging_f3cc2971bfe6569f2eddab6a62765f42";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!account || !publicClient || !walletClient) {
      setError("Please Check Metamask Connection!");
      return;
    }
    if (!electionFactoryAddressSepolia) {
      setError("Election Factory Address Not found on Sepolia.");
      return;
    }
    if (candidateList && candidateList.length <= 2) {
      setError("More than 2 Candidates Required");
      return;
    }

    setIsCreating(true);

    const electionInfo: ElectionInfo = {
      startTime: startTime,
      endTime: endTime,
      name: name,
      description: description,
    };

    const action = name; //same as election name

    const electionArgs = [
      appId,
      action,
      electionInfo,
      candidateList,
      BigInt(ballotType as number),
      BigInt(resultType as number),
    ];

    try {
      const hash = await walletClient.writeContract({
        address: electionFactoryAddressSepolia,
        chain: chain,
        abi: electionFactoryContractAbi,
        functionName: "createElection",
        args: electionArgs,
        account,
      });
      setTransactionHash(hash);

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (!receipt) {
        setWarning("Receipt Couldn't be fetched");
      }

      const eventLog = receipt.logs
        .map((log) => {
          try {
            return decodeEventLog({ abi: electionFactoryContractAbi, ...log });
          } catch {
            return null;
          }
        })
        .find((log) => log?.eventName === "ElectionCreatedAddress");
      if (eventLog) {
        console.log("Event decoded:", eventLog.args);
        const { electionAddress: emittedElectionAddress } =
          eventLog.args as unknown as { electionAddress: Address };
        console.log("You new Election Address: ", emittedElectionAddress);
      }
    } catch (err) {
      console.error(err);
      setError("Unknown error occured, Check Console for more details.");
    } finally {
      setIsCreating(false);
    }
  }

  function handleAddCandidate(event: React.FormEvent) {
    event.preventDefault();
    const candidate: CandidateInfo = {
      candidateID: BigInt(candidateID as number),
      name: candidateName,
      description: candidateDescription,
    };
    candidateList?.push(candidate);
    setCandidateList(candidateList);
  }

  return (
    <div>
      <form>
        <Input
          id="name"
          label="Enter Election Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Eg. Best GPU 2025"
          required
        ></Input>
        <Input
          id="description"
          label="Enter Election Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Eg. Election held to vote for one true best GPU of 2025"
          required
        ></Input>
        <Input
          id="startTime"
          label="Enter Election Start Time"
          type="datetime-local"
          value={bigintToDatetimeLocal(startTime)}
          onChange={(e) => setStartTime(datetimeLocalToBigint(e.target.value))}
          required
        ></Input>
        <Input
          id="endTime"
          label="Enter Election End Time"
          type="datetime-local"
          value={bigintToDatetimeLocal(endTime)}
          onChange={(e) => setEndTime(datetimeLocalToBigint(e.target.value))}
          required
        ></Input>
        <Input
          id="ballotType"
          label="Enter Ballot Type"
          type="number"
          value={ballotType}
          onChange={(e) => {
            const num = e.target.valueAsNumber;
            setBallotType(isNaN(num) ? undefined : num);
          }}
          placeholder="Eg. 2"
          required
        ></Input>
        <Input
          id="resultType"
          label="Enter Result Type"
          type="number"
          value={resultType}
          onChange={(e) => {
            const num = e.target.valueAsNumber;
            setResultType(isNaN(num) ? undefined : num);
          }}
          placeholder="Eg. 2"
          required
        ></Input>
        <form>
          <Input
            id="Candidate ID"
            label="Enter Candidate ID"
            type="number"
            value={candidateID}
            onChange={(e) => {
              const num = e.target.valueAsNumber;
              setCandidateID(isNaN(num) ? undefined : num);
            }}
            placeholder="Eg. 2"
            required
          ></Input>
          <Input
            id="candidateName"
            label="Enter Candidate Name"
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Eg. Zohran Mamdani"
            required
          ></Input>
          <Input
            id="candidateDescription"
            label="Enter Candidate Description"
            type="text"
            value={candidateDescription}
            onChange={(e) => setCandidateDescription(e.target.value)}
            placeholder="Eg. Born in Uganda and raised in New York City, he has fought for the working class in and outside the legislature: hunger striking alongside taxi drivers to achieve more than $450 million in transformative debt relief, winning over $100 million in the state budget for increased subway service and a successful fare-free bus pilot, and organizing New Yorkers to defeat a proposed dirty power plant."
            required
          ></Input>
          <Button type="submit" variant="primary" onClick={handleAddCandidate}>
            Add Candidate
          </Button>
        </form>
        <Button
          type="submit"
          variant="primary"
          isLoading={isCreating}
          onClick={handleSubmit}
          loadingText="Creating Election..."
        >
          Create Election
        </Button>
      </form>
    </div>
  );
}
