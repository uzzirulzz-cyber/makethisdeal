/**
 * Payrails SDK for card/wallet payments.
 * In production, verifies execution via Payrails API.
 * Without credentials, runs in mock mode (useful for testing).
 */

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getPayrailsToken(): Promise<string | null> {
  const apiKey = process.env.PAYRAILS_API_KEY;
  const clientId = process.env.PAYRAILS_CLIENT_ID;

  if (!apiKey || !clientId) return null;

  // Check cache
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  try {
    const response = await fetch('https://api.payrails.io/v1/authentication/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': clientId,
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const token = data.access_token || data.token;
    const expiresIn = data.expires_in || 3600;

    cachedToken = {
      token,
      expiresAt: Date.now() + (expiresIn - 60) * 1000, // refresh 60s early
    };

    return token;
  } catch {
    return null;
  }
}

interface PayrailsVerifyParams {
  executionId: string;
  amountPkr: number;
}

export async function verifyPayrailsExecution(
  params: PayrailsVerifyParams
): Promise<{ verified: boolean; message: string }> {
  const token = await getPayrailsToken();

  if (!token) {
    // Mock mode - auto-confirm
    return {
      verified: true,
      message: 'Payment confirmed (mock mode - no Payrails credentials configured)',
    };
  }

  try {
    const response = await fetch(
      `https://api.payrails.io/v1/executions/${params.executionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return { verified: false, message: `Payrails API error: ${response.status}` };
    }

    const execution = await response.json();
    const status = execution.status?.toLowerCase();

    if (status === 'succeeded' || status === 'completed') {
      return { verified: true, message: 'Payment confirmed via Payrails' };
    }

    return {
      verified: false,
      message: `Payment status: ${status}`,
    };
  } catch (error) {
    return {
      verified: false,
      message: `Payrails verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}