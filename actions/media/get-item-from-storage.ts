"use server";

import { createClient } from "@/utils/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

async function getUser(supabase: SupabaseClient) {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		throw new Error(userError ? userError.message : "User not found.");
	}
	return user;
}

async function getItemDetails(
	supabase: SupabaseClient,
	userId: string,
	folder: string,
	isFile: boolean,
	justTheFileName: string,
) {
	const { data: itemDetails, error: itemError } = await supabase.storage
		.from("media")
		.list(`${userId}${decodeURIComponent(folder)}`, {
			search: isFile ? decodeURIComponent(justTheFileName) : undefined,
		});

	if (itemError || !itemDetails) {
		throw new Error(itemError ? itemError.message : "Item not found.");
	}
	return itemDetails;
}

async function getSignedUrl(
	supabase: SupabaseClient,
	userId: string,
	folder: string,
	filename: string,
) {
	const { data, error } = await supabase.storage
		.from("media")
		.createSignedUrl(`${userId}${folder}/${filename}`, 60);

	if (error) {
		throw new Error(error.message);
	}
	return data.signedUrl;
}

export async function getItemFromStorage({
	filename,
}: {
	readonly filename: string;
}) {
	const supabase = createClient();

	const folderFileNameSplit = filename.split("/");
	const fileName = folderFileNameSplit[folderFileNameSplit.length - 1];
	const isFile = fileName.includes(".");

	let folder = `/${folderFileNameSplit.slice(0, folderFileNameSplit.length - 1).join("/")}`;
	const justTheFileName = folderFileNameSplit[folderFileNameSplit.length - 1];

	if (!isFile) {
		folder = `/${folderFileNameSplit.join("/")}`;
	}

	try {
		const user = await getUser(supabase);
		const itemDetails = await getItemDetails(
			supabase,
			user.id,
			folder,
			isFile,
			justTheFileName,
		);

		console.warn({
			itemDetails,
			user,
			folder,
			isFile,
			justTheFileName,
			filename,
		});

		if (isFile) {
			const singleItemDetails = itemDetails.find(
				(item) => item.name === decodeURIComponent(justTheFileName),
			);

			if (!singleItemDetails) {
				throw new Error("Item not found.");
			}

			let signedUrl = "";
			if (singleItemDetails.metadata !== null) {
				signedUrl = await getSignedUrl(
					supabase,
					user.id,
					folder,
					justTheFileName,
				);
			}

			return {
				userId: user.id,
				data: {
					...singleItemDetails,
					signedUrl: signedUrl,
				},
				error: null,
				type: singleItemDetails?.metadata === null ? "folder" : "file",
			};
		}

		if (itemDetails.length === 0) {
			console.warn("This item or directory does not exist.");
			throw new Error("This item or directory does not exist.");
		}

		return {
			userId: user.id,
			data: { ...itemDetails, signedUrl: "", name: "", metadata: null },
			error: null,
			type: "folder",
		};
	} catch (error) {
		let errorMessage = "An unknown error occurred";
		if (typeof error === "string") {
			errorMessage = error;
		} else if (error instanceof Error) {
			errorMessage = error.message;
		}

		return {
			data: null,
			error: new Error(errorMessage),
			userId: null,
			type: null,
		};
	}
}

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
		.list(`${user.id}${decodeURIComponent(searchInFolder)}`);

	return {
		userId: user.id,
		data: data as StorageItem[] | null,
		error,
	};
}
