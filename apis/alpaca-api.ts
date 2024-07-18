"use server";

export async function makeAlpacaApiRequest({
	endpoint = "data",
	resource = "",
	json = {},
	method = "GET",
}: {
	readonly endpoint?: "data" | "account";
	readonly resource: string;
	readonly json?: Record<string, unknown>;
	readonly method?: "GET" | "POST" | "PUT" | "DELETE";
}) {
	const url = `${
		endpoint === "data"
			? process.env.ALPACA_DATA_API_ENDPOINT!
			: process.env.ALPACA_API_ENDPOINT!
	}/${resource}`;

	const response = await fetch(url, {
		method,
		headers: {
			"Content-Type": "application/json",
			"APCA-API-KEY-ID": process.env.ALPACA_API_KEY_ID!,
			"APCA-API-SECRET-KEY": process.env.ALPACA_SECRET_KEY!,
		},
		...(method !== "GET" && { body: JSON.stringify(json) }),
	});

	if (!response.ok) {
		console.error(
			`Error making Alpaca API request: ${response.status} ${response.statusText}`,
		);
		return {
			error: {
				status: response.status,
				statusText: response.statusText,
				message: await response.text(),
			},
			data: null,
		};
	}

	return {
		error: null,
		data: await response.json(),
	};
}
