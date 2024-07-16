"use server";

/**
 * Make a request to a Facebook Service.
 *
 * @param endpoint - The Facebook API endpoint to make the request to, for example, youtube/v3 or upload/youtube/v3
 * @param resource - The resource to make the request to, for example, videos
 * @param accessToken - The access token to use for the request.
 * @param json - The JSON body to send with the request, if any.
 * @param method - The HTTP method to use for the request, defaults to GET.
 */
export async function makeFacebookApiRequest({
	host = "graph.facebook.com",
	version = "v20.0",
	endpoint = "",
	resource = "",
	accessToken,
	json = {},
	method = "GET",
	query = {},
	headers = {},
}: {
	readonly host?: "rupload.facebook.com" | "graph.facebook.com";
	readonly version?: string;
	readonly endpoint: string;
	readonly resource?: string;
	readonly accessToken?: string;
	readonly json?: Record<string, unknown>;
	readonly method?: "GET" | "POST" | "PUT" | "DELETE";
	readonly query?: Record<string, string>;
	readonly headers?: Record<string, string>;
}) {
	if (accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	}

	let body: BodyInit | null = null;

	if (method !== "GET") {
		headers["Content-Type"] = "application/json";
		body = JSON.stringify(json);
	}

	const queryString = new URLSearchParams(query).toString();

	const response = await fetch(
		`https://${host}/${version}/${endpoint}/${resource}?${queryString}`.replaceAll("//", "/"),
		{
			method,
			headers,
			body,
		},
	);

	if (!response.ok) {
		console.error(
			`Error making Facebook API request: ${response.status} ${response.statusText}`,
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
