import { NextRequest } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
    const { address } = (await req.json()) as { address?: string };

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address))
        return new Response(JSON.stringify({ error: "Bad address" }), {
            status: 400,
            headers: { "content-type": "application/json" },
        });

    // command:  VLAYER_ENV=testnet bun run prove.ts "<addr>"
    const contractsDir = path.join(process.cwd(), "contracts", "vlayer");
    const child = spawn(
        "bun",
        ["run", "prove.ts", address],
        {
            cwd: contractsDir,
            env: { ...process.env, VLAYER_ENV: "testnet" },
        }
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));

    const code: number = await new Promise((res) =>
        child.on("close", res)
    );

    const body =
        code === 0
            ? { ok: true, output: stdout }
            : { ok: false, error: stderr || `Exited with ${code}` };

    return new Response(JSON.stringify(body), {
        headers: { "content-type": "application/json" },
        status: code === 0 ? 200 : 500,
    });
}