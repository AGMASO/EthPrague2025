import React, { useState } from "react";
import DataCharts from "./DataCharts";
import WalletInput from "./WalletInput";
import SimplePrompt from "./SimplePrompt";

interface Props {
  addressSessionId: string;
}

const exampleNftData = [
  { name: "CryptoPunks", icon: "🧑‍🎤", count: 2 },
  { name: "Bored Apes", icon: "🐵", count: 1 },
  { name: "Art Blocks", icon: "🎨", count: 3 },
];

const Chat = ({ addressSessionId }: Props) => {
  const [answer, setAnswer] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [dataGeneral, setDataGeneral] = useState<any>(null);
  const [dataTokens, setDataTokens] = useState<any>(null);
  const [dataTxs, setDataTxs] = useState<any>(null);
  const [dataChartCoins, setDataChartCoins] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const message = inputMessage;
    console.log(message);

    let messageSplitted = await message.split(" ");

    // Busca una palabra en el mensaje que comience con "0x" (una dirección Ethereum)
    let addressExtracted = await messageSplitted.find(
      (word) => word.startsWith("0x") && word.length === 42
    );
    console.log(addressExtracted);

    if (addressExtracted) {
      try {
        const responseGeneral = await fetch(
          `https://eth.blockscout.com/api/v2/addresses/${addressExtracted}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseTokens = await fetch(
          `https://eth.blockscout.com/api/v2/addresses/${addressExtracted}/token-balances`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responseTxs = await fetch(
          `https://eth.blockscout.com/api/v2/addresses/${addressExtracted}/transactions`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseChartCoins = await fetch(
          `https://eth.blockscout.com/api/v2/addresses/${addressExtracted}/coin-balance-history`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!responseGeneral.ok) {
          throw new Error("Error en el servidor");
        }

        if (!responseTokens.ok) {
          throw new Error("Error to get token balances");
        }
        if (!responseTxs.ok) {
          throw new Error("Error to get transactions");
        }
        if (!responseChartCoins.ok) {
          throw new Error("Error to get chart coins");
        }

        const dataGeneralFetched = await responseGeneral.json();
        console.log(dataGeneralFetched);
        setDataGeneral(dataGeneralFetched);

        const dataTokensFetched = await responseTokens.json();
        console.log(dataTokensFetched);
        setDataTokens(dataTokensFetched);

        const dataTxsFetched = await responseTxs.json();
        console.log(dataTxsFetched);
        setDataTxs(dataTxsFetched);

        const dataChartCoins = await responseChartCoins.json();
        console.log(dataChartCoins);
        setDataChartCoins(dataChartCoins);

        //!Version llamada con todo el json y solo usar ChatGpt para configurar mensaje.
        try {
          const response = await fetch(
            "https://n8n-demo-u45914.vm.elestio.app/webhook-test/39430311-e25e-4993-a439-f043900c2f4b",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                addressSessionId: addressSessionId,
                message: message,
                dataGeneral: dataGeneralFetched,
                dataTokens: dataTokensFetched,
                dataTxs: dataTxsFetched,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Error en el servidor");
          }

          const data = await response.json();
          const formattedOutput = markdownToHtml(data.output);

          setAnswer(formattedOutput);
          setInputMessage("");
        } catch (error: any) {
          setAnswer("Failed to get data: " + error.message);
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error(
          "Error al obtener la información de la dirección:",
          error
        );
      }
    }

    if (!addressExtracted) {
      try {
        const response = await fetch(
          "https://n8n-demo-u45914.vm.elestio.app/webhook-test/39430311-e25e-4993-a439-f043900c2f4b",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              addressSessionId,
              message,
              dataGeneral: null,
              dataTokens: null,
              dataTxs: null,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error en el servidor");
        }

        const data = await response.json();
        const formattedOutput = markdownToHtml(data.output);
        setAnswer(formattedOutput);
        setInputMessage("");
      } catch (error: any) {
        setAnswer("Hubo un error: " + error.message);
      } finally {
        console.log("finally route 2", dataTokens);
        setIsLoading(false);
      }
    }
  };

  function markdownToHtml(markdown: string) {
    // Headings
    let html = markdown.replace(/^### (.*?)(?=\n|$)/gm, "<h3>$1</h3>");
    html = html.replace(/^#### (.*?)(?=\n|$)/gm, "<h4>$1</h4>");
    html = html.replace(/^## (.*?)(?=\n|$)/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*?)(?=\n|$)/gm, "<h1>$1</h1>");
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      "<code class='bg-gray-100 px-1 rounded'>$1</code>"
    );
    // Bullets
    html = html.replace(
      /(?:^|\n)- (.*?)(?=\n|$)/g,
      (match, p1) => `<li>${p1}</li>`
    );
    // Group <li> into <ul>
    html = html.replace(
      /(<li>.*?<\/li>)+/g,
      (match) => `<ul class="ml-6 list-disc space-y-1">${match}</ul>`
    );
    // Line breaks
    html = html.replace(/\n/g, "<br>");
    return html;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[50vh]">
      <DataCharts
        tokens={dataTokens}
        transactions={dataTxs}
        addressInfo={dataGeneral}
        chartCoins={dataChartCoins}
      />
      <div className="w-full max-w-4xl flex flex-col gap-4">
        {answer && (
          <div
            className="p-4 rounded-md border border-gray-300 w-full break-words max-w-full overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        )}

        <SimplePrompt />

        {/* <form
          className='flex flex-col gap-4 min-w-[600px]'
          onSubmit={handleSubmit}
        >
          <textarea
            name='messageInput'
            id='messageInput'
            placeholder='Ask me about addresses, transactions, blocks, etc.'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            minLength={1}
            className='w-full p-2 rounded-md border border-gray-300 min-h-[100px] resize-none'
          />

          <button
            type='submit'
            className='bg-blue-500 text-white p-2 rounded-md w-full'
          >
            {isLoading ? "Thinking..." : "Send"}
          </button>
        </form> */}
      </div>
    </div>
  );
};

export default Chat;
