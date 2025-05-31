# InspectiFI 
## EthPragueGlobal-2025

## What Is InspectiFI?
InspectiFI is a **conversational blockchain analytics assistant**.  
It lets anyone—regardless of technical depth—ask natural-language questions about addresses, transactions, or price feeds and receive **concise, human-readable answers** backed by live on-chain data.


Thanks to an **MCP (Model Context Protocol) server layer** and Blockscout + 1Inch we connect LLM prompts to real-time data APIs, eliminating the lag and uncertainty of stale snapshots.  
We can solve typical question even tricky ones, get surprised with the result!

* “What tokens were involved in Tx hash `0x…`?”
* “Make me a full report about this address `0x…`?”
* “What tokens were involved in hash `0x…`?”
* “Give me the current ETH, LINK, WTBC prices”

---

Extra Fun Feature: We use Vlayer to proof if the address that you are researching is Whale or not, If you find one, you get a nice Badge!!!

## Key Features

| # | Feature | Why It Matters |
|---|---------|----------------|
| **1** | **Natural-language UX** –     |Make it easy to    newcomers to understand transactions, addresses activities nad much more |
| **2** | **Live MCP data connectors** | Guarantees answers are based on *current* on-chain data or oracle data, not cached indexes. |
| **3** | **Address & Txn Intelligence** | Generates rich reports (balances, token positions, fee spend, risk heuristics). |
| **4** | **Price-Feed Insights** | Pulls pricfeeds of many Tokens such as ETH, USDC, WBTC and more from on-chain 1inch oracles. |
| **5** | **Extensible Tooling** | Many of possibilities to continue growing adding new chains and more |

---


### Technology Stack

| Layer | What We Use | Notes |
|-------|-------------|-------|
| **LLM Orchestration** | **Model Context Protocol** and **n8n** for automation | Thanks to n8n server we run AI agents that have context of APIs sets such as Blockscout or 1Inch |
| **Blockchain Data** | **Blockscout MCP npm package used** – <https://www.npmjs.com/package/@0xagmaso/blockscout-mcp> | Indexed address & txn data for MAINNET chain with Blockscout. |
| **Price Feeds** | **Flare MCP** – <https://github.com/AGMASO/flare-mcp> | Fetches FTSO V2 feeds (FLR, BTC, ETH / USD). |
| **1inch MCP** – |https://github.com/figtracer/1inch-mpc-server/tree/master | DeFi token prices via the 1inch Fusion oracle. |
| **Frontend**                          || React + shadcn/ui + Tailwind  |
| **Backend** || MongoDB | 
---
![alt text](<assets/images/Screenshot 2025-05-31 at 22.18.56.png>)

## Future Work
1. Multi-chain connection for MCPs. 
2. Use Vlayer to prove more data from addresses.
3. Serve Charts dynamically using MCPs about real time on-chain data.
4. Use MCPs connections with Swap aggregators to get best possible Swap oportunity

## Hackathon Submission

| Field | Entry |
|-------|-------|
| **PROJECT NAME** | InspectiFI |
| **DESCRIPTION** | Conversational analytics assistant delivering real-time blockchain intelligence through MCP-powered tools. |
| **DISCORD / TELEGRAM** | Discord: `0xagmaso, figtracer, christopherus, dmdm`  |
| **REPOSITORY** | https://github.com/AGMASO/EthPrague2025 |
| **VIDEO DEMO / SLIDES** | Video: `<link>` |
| **DEPLOYMENTS** | <br>InspectiFI: `0x…`<br>FlareMCP: https://github.com/AGMASO/flare-mcp <br>1InchMCP:     https://github.com/figtracer/1inch-mpc-server/tree/master BlockscoutMCP package used: https://www.npmjs.com/package/@0xagmaso/blockscout-mcp <br>

---

## 🤝 Contributing

PRs are welcome! 
Please open an issue for feature requests or bugs.

