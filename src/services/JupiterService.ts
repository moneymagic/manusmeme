# Jupiter Integration Service

import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";

// Define the structure for the Quote API response (simplified)
interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: any;
  priceImpactPct: string;
  routePlan: any[]; // Define more specific type if needed
  contextSlot: number;
  timeTaken: number;
}

// Define the structure for the Swap API request body
interface SwapRequest {
  userPublicKey: string;
  quoteResponse: QuoteResponse;
  wrapAndUnwrapSol?: boolean;
  dynamicComputeUnitLimit?: boolean;
  prioritizationFeeLamports?: number | "auto";
}

// Define the structure for the Swap API response
interface SwapResponse {
  swapTransaction: string; // base64 encoded transaction
  lastValidBlockHeight: number;
}

const JUPITER_QUOTE_API_URL = "https://quote-api.jup.ag/v6";

/**
 * Fetches a swap quote from the Jupiter API.
 * @param inputMint The mint address of the input token.
 * @param outputMint The mint address of the output token.
 * @param amount The amount of the input token (in lamports).
 * @param slippageBps Slippage tolerance in basis points.
 * @returns The quote response from Jupiter API.
 */
export async function getJupiterQuote(
  inputMint: string,
  outputMint: string,
  amount: number, // Amount in lamports
  slippageBps: number = 50 // Default 0.5% slippage
): Promise<QuoteResponse | null> {
  try {
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: Math.floor(amount).toString(), // Ensure integer lamports
      slippageBps: slippageBps.toString(),
    });

    const response = await fetch(`${JUPITER_QUOTE_API_URL}/quote?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Error fetching Jupiter quote: ${response.status} ${response.statusText}`, errorData);
      return null;
    }

    const quoteResponse: QuoteResponse = await response.json();
    console.log("Received Jupiter Quote:", quoteResponse);
    return quoteResponse;
  } catch (error) {
    console.error("Error in getJupiterQuote:", error);
    return null;
  }
}

/**
 * Fetches the swap transaction from the Jupiter API.
 * @param quoteResponse The quote response object from getJupiterQuote.
 * @param userPublicKey The public key of the user initiating the swap.
 * @returns The swap response containing the serialized transaction.
 */
export async function getJupiterSwapTransaction(
  quoteResponse: QuoteResponse,
  userPublicKey: string
): Promise<SwapResponse | null> {
  try {
    const swapRequestBody: SwapRequest = {
      quoteResponse,
      userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true, // Helps prevent tx failure due to CU limits
      prioritizationFeeLamports: "auto", // Use Jupiter's recommended priority fee
    };

    const response = await fetch(`${JUPITER_QUOTE_API_URL}/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(swapRequestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Error fetching Jupiter swap transaction: ${response.status} ${response.statusText}`, errorData);
      return null;
    }

    const swapResponse: SwapResponse = await response.json();
    console.log("Received Jupiter Swap Transaction Data");
    return swapResponse;
  } catch (error) {
    console.error("Error in getJupiterSwapTransaction:", error);
    return null;
  }
}

// Placeholder for signing and sending logic
// This needs to be implemented based on the chosen signing strategy
export async function signAndSendTransaction(
  serializedTransaction: string,
  // signer: Signer // The actual signer (e.g., user's wallet adapter or backend keypair)
  connection: Connection
): Promise<string | null> {
  console.warn("signAndSendTransaction is a placeholder and needs implementation!");
  
  // 1. Deserialize the transaction
  const transaction = VersionedTransaction.deserialize(Buffer.from(serializedTransaction, 'base64'));
  
  // 2. Sign the transaction (Requires the signer's private key/logic)
  // transaction.sign([signer]); // Example
  console.log("Transaction needs to be signed by the user/backend.");

  // 3. Send the transaction
  try {
    // const txid = await connection.sendTransaction(transaction, {
    //   skipPreflight: true, // Optional: Adjust as needed
    //   maxRetries: 2 // Optional: Adjust as needed
    // });
    // console.log(`Transaction sent with ID: ${txid}`);
    
    // 4. Confirm the transaction (Optional but recommended)
    // const confirmation = await connection.confirmTransaction(txid, 'confirmed');
    // if (confirmation.value.err) {
    //   throw new Error(`Transaction confirmation failed: ${confirmation.value.err}`);
    // }
    // console.log(`Transaction confirmed: ${txid}`);
    // return txid;
    return "placeholder_tx_id_needs_signing"; // Return placeholder until signing is implemented
  } catch (error) {
    console.error("Error sending/confirming transaction:", error);
    return null;
  }
}

