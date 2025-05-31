

export async function fetchTokenPrices(addresses: string[]): Promise<Record<string, { usd: number }>> {
  try {
    const response = await fetch('/api/token-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ addresses }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Price fetch failed:", error);
    return {};
  }
}