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
	isRootFolder: boolean,
) {
	const { data: itemDetails, error: itemError } = await supabase.storage
		.from("media")
		.list(`${userId}/${folder}`, {
			search: isFile ? justTheFileName : undefined,
		});

	if (itemError || !itemDetails) {
		throw new Error(itemError ? itemError.message : "Item not found.");
	}

	if (isRootFolder && itemDetails.length === 0) {
		await createUserRootFolder(userId);
		return getItemDetails(
			supabase,
			userId,
			folder,
			isFile,
			justTheFileName,
			isRootFolder,
		);
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
		.createSignedUrl(
			`${userId}/${folder}/${filename}`.replaceAll("//", "/"),
			600,
		);

	if (error) {
		throw new Error(error.message);
	}
	return data.signedUrl;
}

async function getFileId(
	supabase: SupabaseClient,
	userId: string,
	folder: string,
	justTheFileName: string,
) {
	const { data: fileIdData, error: fileIdError } = await supabase
		.schema("storage")
		.from("objects")
		.select("id")
		.eq("name", `${userId}/${folder}/${justTheFileName}`.replaceAll("//", "/"))
		.maybeSingle();

	if (fileIdError) {
		throw new Error(fileIdError.message);
	}

	if (!fileIdData) {
		throw new Error("File ID not found.");
	}

	return fileIdData.id;
}

function parseFilename(filename: string) {
	const folderFileNameSplit = filename.split("/");
	const fileName = folderFileNameSplit[folderFileNameSplit.length - 1];
	const isFile = fileName.includes(".");
	let folder = `${folderFileNameSplit.slice(0, folderFileNameSplit.length - 1).join("/")}`;
	const justTheFileName = decodeURIComponent(
		folderFileNameSplit[folderFileNameSplit.length - 1].replaceAll("//", "/"),
	);

	if (!isFile) {
		folder = `${folderFileNameSplit.join("/")}`;
	}

	folder = decodeURIComponent(`${folder}`.replaceAll("//", "/")).replaceAll(
		"//",
		"/",
	);

	return { folder, justTheFileName, isFile };
}

export async function getItemFromStorage({
	filename,
}: { readonly filename: string }) {
	const supabase = createClient();
	const isRootFolder = filename === "";
	const { folder, justTheFileName, isFile } = parseFilename(filename);

	try {
		const user = await getUser(supabase);
		const itemDetails = await getItemDetails(
			supabase,
			user.id,
			folder,
			isFile,
			justTheFileName,
			isRootFolder,
		);

		if (isFile) {
			const singleItemDetails = itemDetails.find(
				(item) => item.name === justTheFileName,
			);

			if (!singleItemDetails) {
				throw new Error("Item not found.");
			}

			const signedUrl =
				singleItemDetails.metadata !== null
					? await getSignedUrl(supabase, user.id, folder, justTheFileName)
					: "";

			const fileId = await getFileId(
				supabase,
				user.id,
				folder,
				justTheFileName,
			);

			return {
				userId: user.id,
				data: {
					...singleItemDetails,
					signedUrl,
					fileId,
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
			data: {
				...itemDetails,
				signedUrl: "",
				name: "",
				metadata: null,
				fileId: null,
			},
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
	const searchInFolder = folder
		? decodeURIComponent(`${folder}/`).replaceAll("//", "/")
		: "";

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
		.list(`${user.id}/${searchInFolder}`.replaceAll("//", "/"));

	return {
		userId: user.id,
		data: data as StorageItem[] | null,
		error,
	};
}

async function createUserRootFolder(userId: string) {
	const supabase = createClient();

	const { error } = await supabase.storage
		.from("media")
		.upload(`${userId}/ignore.plam`, new File([], ""));

	if (error) {
		throw new Error(error.message);
	}
}
