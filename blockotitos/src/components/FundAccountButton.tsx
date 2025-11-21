import React, { useState, useTransition } from "react";
import { useNotification } from "../hooks/useNotification.ts";
import { useWallet } from "../hooks/useWallet.ts";
import { Button, Tooltip } from "@stellar/design-system";
import { getFriendbotUrl } from "../util/friendbot";

const FundAccountButton: React.FC = () => {
  const { addNotification } = useNotification();
  const [isPending, startTransition] = useTransition();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { address } = useWallet();

  if (!address) return null;

  const handleFundAccount = () => {
    startTransition(async () => {
      try {
        const response = await fetch(getFriendbotUrl(address));

        if (response.ok) {
          addNotification("Account funded successfully!", "success");
        } else {
          const body: unknown = await response.json();
          if (
            body !== null &&
            typeof body === "object" &&
            "detail" in body &&
            typeof body.detail === "string"
          ) {
            addNotification(`Error funding account: ${body.detail}`, "error");
          } else {
            addNotification("Error funding account: Unknown error", "error");
          }
        }
      } catch {
        addNotification("Error funding account. Please try again.", "error");
      }
    });
  };

  return (
    <div
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
      className="whitespace-nowrap"
    >
      <Tooltip
        isVisible={isTooltipVisible}
        isContrast
        title="Fund Account"
        placement="bottom"
        triggerEl={
          <Button
            disabled={isPending}
            onClick={handleFundAccount}
            variant="secondary"
            size="md"
            className="font-semibold px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm border border-purple-200 shadow-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300 hover:scale-105 text-purple-700 hover:text-purple-800 hover:bg-white"
            style={{
              minWidth: 'fit-content',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="hidden sm:inline">Fund Account</span>
            <span className="sm:hidden">Fund</span>
          </Button>
        }
      >
        <div style={{ width: "13em" }}>Account is already funded</div>
      </Tooltip>
    </div>
  );
};

export default FundAccountButton;
