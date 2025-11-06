"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { isAddress } from "viem";

export default function FetchElectionForm() {
  const router = useRouter();
  const [electionAddressInput, setElectionAddressInput] = useState<string>("");
  const [inputError, setInputError] = useState<string | undefined>(undefined);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setInputError(undefined);

    if (!isAddress(electionAddressInput)) {
      setInputError("Invalid Election Address.");
      return;
    }

    router.push(`/election/${electionAddressInput}`);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <Input
        id="electionAddress"
        type="text"
        value={electionAddressInput}
        onChange={(e) => {
          setElectionAddressInput(e.target.value);
          setInputError(undefined);
        }}
        placeholder="0x..."
        error={inputError}
        required
      />
      <Button
        type="submit"
        variant="primary"
        loadingText="Fetching Election Details..."
      >
        Go To Election
      </Button>
    </form>
  );
}
