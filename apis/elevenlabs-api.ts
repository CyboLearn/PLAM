"use server";

type VoiceId = string; // NOSONAR

export type ElevenLabsApiEndpoints =
	// Text-to-Speech
	| `text-to-speech/${VoiceId}`
	| `text-to-speech/${VoiceId}/with-timestamps`
	| `text-to-speech/${VoiceId}/stream`
	| `text-to-speech/${VoiceId}/stream/with-timestamps`
	// Speech-to-Speech
	| `speech-to-speech/${VoiceId}`
	| `speech-to-speech/${VoiceId}/stream`
	// Sound Generation
	| `sound-generation`
	// Audio Isolation
	| `audio-isolation`
	| `audio-isolation/stream`
	// History
	| `history`
	| `history/download`
	| `history/${string}`
	| `history/${string}/audio`
	// Samples
	| `voices/${VoiceId}/samples/${string}`
	| `voices/${VoiceId}/samples/${string}/audio`;

export async function makeElevenLabsApiRequest({
	endpoint,
	method = "GET",
	body,
}: {
	readonly endpoint: ElevenLabsApiEndpoints;
	readonly method: "GET" | "POST" | "DELETE";
	readonly body?: any;
}) {
	const url = `https://api.elevenlabs.io/v1/${endpoint}`;

	// Make the request
	const response = await fetch(url, {
		method,
		headers: {
			"xi-api-key": `${process.env.ELEVENLABS_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
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
