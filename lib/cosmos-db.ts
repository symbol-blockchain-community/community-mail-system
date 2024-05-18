import { CosmosClient, ErrorResponse, Item } from "@azure/cosmos";

function creataClient(): CosmosClient {
  return new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
    userAgentSuffix: "CosmosDBJavascriptQuickstart",
  });
}

export class AlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlreadyExistsError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export interface MailTable {
  id: string;
  tenantId: string;
  address: string;
}

/**
 * Cosmos DB へメールアドレスを登録する
 */
export async function setMailToCosmos(mailAddress: string): Promise<Item | Error | AlreadyExistsError> {
  try {
    const client = creataClient();
    const { item } = await client
      .database(process.env.COSMOS_DATABASE)
      .container(process.env.COSMOS_CONTAINER)
      .items.create({
        tenantId: "default",
        address: mailAddress,
      });

    return item;
  } catch (error) {
    if (error instanceof ErrorResponse) {
      if (error.code === 409) {
        return new AlreadyExistsError("Mail address already exists.");
      }
    }
    console.error(error);
    return new Error(`Failed to create mail address.`);
  }
}

/**
 * Cosmos DB に登録されているメールアドレスリストを取得する
 */
export async function getMailFromCosmos(): Promise<string[] | Error> {
  try {
    const client = creataClient();
    const { resources } = await client
      .database(process.env.COSMOS_DATABASE)
      .container(process.env.COSMOS_CONTAINER)
      .items.query({ query: "SELECT * FROM Items" })
      .fetchAll();

    return await Promise.all(resources.map((item: MailTable) => item.address));
  } catch (error) {
    console.error(error);
    return new Error(`Failed to get mail addresses.`);
  }
}

/**
 * Cosmos DB からメールアドレスを削除する
 */
export async function deleteMailFromCosmos(address: string): Promise<MailTable[] | Error | NotFoundError> {
  try {
    const client = creataClient();
    const container = client.database(process.env.COSMOS_DATABASE).container(process.env.COSMOS_CONTAINER);

    // クエリを実行して一致するレコードを取得
    const querySpec = {
      query: "SELECT * FROM c WHERE c.address = @address",
      parameters: [
        {
          name: "@address",
          value: address,
        },
      ],
    };

    const { resources: items } = await container.items.query(querySpec).fetchAll();

    if (items.length === 0) {
      return new NotFoundError(`Mail address not found.`);
    }

    // 一致するレコードを削除
    for (const item of items as MailTable[]) {
      await container.item(item.id, item.tenantId).delete();
      console.log(`Deleted item with id: ${item.id} ${item.address}`);
    }

    return items as MailTable[];
  } catch (error) {
    console.error(error);
    return new Error(`Failed to delete mail address.`);
  }
}
