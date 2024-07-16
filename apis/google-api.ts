"use server";

/**
 * Make a request to a Google Service.
 *
 * @param endpoint - The Google API endpoint to make the request to, for example, youtube/v3 or upload/youtube/v3
 * @param resource - The resource to make the request to, for example, videos
 * @param accessToken - The access token to use for the request.
 * @param json - The JSON body to send with the request, if any.
 * @param method - The HTTP method to use for the request, defaults to GET.
 */
export async function makeGoogleApiRequest({
	endpoint = "",
	resource = "",
	accessToken,
	json = {},
	method = "GET",
	file = null,
	query = {},
}: {
	readonly endpoint: string;
	readonly resource: string;
	readonly accessToken?: string;
	readonly json?: Record<string, unknown>;
	readonly method?: "GET" | "POST" | "PUT" | "DELETE";
	readonly file?: File | null;
	readonly query?: Record<string, string>;
}) {
	const headers: { [key: string]: string } = {};

	if (accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	}

	let body: BodyInit | null = null;

	if (file) {
		const formData = new FormData();
		formData.append(
			"metadata",
			new Blob([JSON.stringify(json)], {
				type: "application/json",
			}),
		);
		formData.append("file", file);
		body = formData;
	} else if (method !== "GET") {
		headers["Content-Type"] = "application/json";
		body = JSON.stringify(json);
	}

	const queryString = new URLSearchParams(query).toString();

	const response = await fetch(
		`https://www.googleapis.com/${endpoint}/${resource}?${queryString}`,
		{
			method,
			headers,
			body,
		},
	);

	if (!response.ok) {
		console.error(
			`Error making Google API request: ${response.status} ${response.statusText}`,
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
