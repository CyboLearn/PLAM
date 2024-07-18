"use server";

export enum SupportedLanguagesForDubbing {
	en = "English",
	hi = "Hindi",
	pt = "Portuguese",
	zh = "Chinese",
	es = "Spanish",
	fr = "French",
	de = "German",
	ja = "Japanese",
	ar = "Arabic",
	ru = "Russian",
	ko = "Korean",
	id = "Indonesian",
	it = "Italian",
	nl = "Dutch",
	tr = "Turkish",
	pl = "Polish",
	sv = "Swedish",
	fil = "Filipino",
	ms = "Malay",
	ro = "Romanian",
	uk = "Ukrainian",
	el = "Greek",
	cs = "Czech",
	da = "Danish",
	fi = "Finnish",
	bg = "Bulgarian",
	hr = "Croatian",
	sk = "Slovak",
	ta = "Tamil",
}

export type SupportedLanguages = keyof typeof SupportedLanguagesForDubbing;

export async function dubAudioOrVideo({
	mediaLocation,
	sourceLang = "en",
	targetLang = "fr",
}: {
	readonly mediaLocation: string;
	readonly sourceLang?: SupportedLanguages;
	readonly targetLang?: SupportedLanguages;
}) {
	if (sourceLang === targetLang) {
		return {
			status: "failed",
			error: "Source and target languages are the same.",
			data: null,
		};
	}

	return {
		status: "pending",
		error: null,
		data: null,
	};
}
