"use server";

export async function makePexelsApiRequest({
	query,
	media_type,
	orientation,
	size,
}: {
	readonly query: string;
	readonly media_type: "video" | "photo";
	readonly orientation: "landscape" | "portrait";
	readonly size: "small" | "medium" | "large";
}) {
	const url =
		media_type === "photo"
			? `https://api.pexels.com/v1/search?query=${query}&orientation=${orientation}&size=${size}`
			: `https://api.pexels.com/videos/search?query=${query}&orientation=${orientation}&size=${size}`;

	// Make the request
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${process.env.PEXELS_API_KEY}`,
		},
	});

	// Check for errors
	if (!response.ok) {
		return {
			data: null,
			error: {
				status: response.status,
				statusText: response.statusText,
			},
		};
	}

	return {
		data: await response.json(),
		error: null,
	};
}
