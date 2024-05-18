interface EntraGroupsResponse {
  "@onformdata.context": string;
  value: { id: string }[];
}

/**
 * EntraID より現在ログイン済みユーザーの所属するグループ情報を取得する
 */
export async function getGroupsFromEntraId(accessToken: string): Promise<string[] | Error> {
  try {
    const url = "https://graph.microsoft.com/v1.0/me/memberOf/microsoft.graph.group";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return new Error(`Failed to get user groups: ${response.statusText}`);
    }

    const entraGroupsResponse = (await response.json()) as EntraGroupsResponse;
    return await Promise.all<string>(entraGroupsResponse.value.map(async (group) => group.id));
  } catch (error) {
    if (error instanceof Error) {
      return error;
    } else {
      console.error(error);
      return new Error("Failed to get user groups");
    }
  }
}
