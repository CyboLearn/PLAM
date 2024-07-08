"use server";

import { createClient } from "@/utils/supabase/server";

export interface StorageItem {
	name: string;
	id: string;
	updated_at: string;
	created_at: string;
	last_accessed_at: string;
	metadata: {
		eTag: string;
		size: number;
		mimetype: string;
		cacheControl: string;
		lastModified: string;
		contentLength: number;
		httpStatusCode: number;
	};
}

export async function getItemsInStorage(folder?: string) {
	const supabase = createClient();
	const searchInFolder = folder ? `/${folder}/` : "";

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		return {
			data: null,
			error: userError,
			userId: null,
		};
	}

	if (!user) {
		return {
			data: null,
			error: new Error("User not found."),
			userId: null,
		};
	}

	const { data, error } = await supabase.storage
		.from("media")
		.list(`${user.id}${searchInFolder}`);

	return {
		userId: user.id,
		data: data as StorageItem[] | null,
		error,
	};
}
