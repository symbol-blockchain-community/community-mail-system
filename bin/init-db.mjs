/*

  データベースに対して初期化処理を行うスクリプト

*/

import { CosmosClient, ErrorResponse } from "@azure/cosmos";
import dotenv from "dotenv";
import readline from "readline";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../", ".env.local") });

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;
const containerId = process.env.COSMOS_CONTAINER;
const userAgentSuffix = "CosmosDBJavascriptLocal";

async function init() {
  if (!endpoint || !key || !databaseId || !containerId) {
    throw new Error("環境変数が設定されていません");
  }

  const client = new CosmosClient({ endpoint, key, userAgentSuffix });
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });

  await database.containers.createIfNotExists({
    id: containerId,
    partitionKey: { paths: ["/tenantId"] },
    uniqueKeyPolicy: {
      uniqueKeys: [
        {
          paths: ["/address"],
        },
      ],
    },
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(`> 次の Cosmos DB に接続します: ${endpoint}`);
rl.question("> 初期化を実行しますか？ (y/N): ", async (answer) => {
  if (answer.toLowerCase() === "y") {
    try {
      await init();
      console.log("データベースの初期化が完了しました");
    } catch (error) {
      if (error instanceof ErrorResponse) {
        console.error(`エラーが発生しました: ${error.message}`);
      } else {
        console.error(error);
      }
    }
  } else {
    console.log("初期化を中止しました");
  }

  rl.close();
});
