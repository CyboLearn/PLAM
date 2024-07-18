"use server";

export async function textToSpeech({
	text = "", // text to convert to speech
	live = false, // streaming audio
}: {
	readonly text: string;
	readonly live?: boolean;
}) {
	return {};
}
