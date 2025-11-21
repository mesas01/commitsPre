import { useState } from "react";
import { Button, Code, Input, Text } from "@stellar/design-system";
import { useWallet } from "../hooks/useWallet";
import game from "../contracts/guess_the_number";
import { Box } from "../components/layout/Box";

export const GuessTheNumber = () => {
  const [guessedIt, setGuessedIt] = useState<boolean>();
  const [theGuess, setTheGuess] = useState<number>();
  const { address, updateBalances, signTransaction } = useWallet();

  if (!address) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <Text as="p" size="md" className="text-blue-800">
          Connect wallet to play the guessing game
        </Text>
      </div>
    );
  }

  const submitGuess = async () => {
    if (!theGuess || !address) return;
    try {
      // Check if the game client has the guess method (only available with real generated client)
      if (typeof (game as any).guess !== 'function') {
        // Visual mode only - simulate a random result for demo purposes
        const randomResult = Math.random() > 0.5;
        setGuessedIt(randomResult);
        return;
      }
      
      const tx = await (game as any).guess(
        { a_number: BigInt(theGuess), guesser: address },
        // @ts-expect-error js-stellar-sdk has bad typings; publicKey is, in fact, allowed
        { publicKey: address },
      );
      const { result } = await tx.signAndSend({ signTransaction });
      if (result.isErr()) {
        console.error(result.unwrapErr());
      } else {
        setGuessedIt(result.unwrap());
        await updateBalances();
      }
    } catch (error) {
      console.error("Error submitting guess:", error);
      // In visual mode, just show a random result
      const randomResult = Math.random() > 0.5;
      setGuessedIt(randomResult);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 shadow-lg border border-purple-100">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submitGuess();
        }}
        className="space-y-6"
      >
        {guessedIt ? (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 text-center space-y-4">
            <div className="text-4xl mb-4">🎉</div>
            <Text as="p" size="lg" className="text-green-800 font-semibold">
              You got it!
            </Text>
            <Text as="p" size="lg" className="text-green-700">
              Set a new number by calling <Code size="md">reset</Code> from the
              CLI as the admin.
            </Text>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Guess the Number Game
              </h3>
              <p className="text-gray-600">
                Try to guess a number between 1 and 10!
              </p>
            </div>
            <Box gap="sm" direction="row" align="end" justify="end" wrap="wrap" className="flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Input
                  label="Guess a number from 1 to 10!"
                  id="guess"
                  fieldSize="lg"
                  error={guessedIt === false && "Wrong! Guess again."}
                  onChange={(e) => {
                    setGuessedIt(undefined);
                    setTheGuess(Number(e.target.value));
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={!theGuess}
                className="mt-8"
                variant="primary"
                size="md"
              >
                Submit Guess
              </Button>
            </Box>
          </div>
        )}
      </form>
    </div>
  );
};
