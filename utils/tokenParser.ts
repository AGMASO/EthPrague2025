import randomColor from "randomcolor";

export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export function formatTokenData(
  dataTokens: any[] | undefined
): ChartDataItem[] {
  if (!Array.isArray(dataTokens)) return [];

  const safeParse = (str: string | null) => {
    try {
      return BigInt(str || "0");
    } catch {
      return BigInt(0);
    }
  };

  return dataTokens
    .filter(
      (item) =>
        item.token?.type === "ERC-20" &&
        item.token?.decimals !== null &&
        item.value &&
        safeParse(item.value) > 0n
    )
    .map((item, index) => {
      const decimals = parseInt(item.token.decimals, 10);
      const rawValue = safeParse(item.value);
      const value = Number(rawValue) / 10 ** decimals;

      return {
        name: item.token.symbol || `Token ${index}`,
        value,
        color: randomColor({ luminosity: "bright", seed: item.token.address }),
      };
    });
}
