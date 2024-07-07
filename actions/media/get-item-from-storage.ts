"use server";

import { createClient } from "@/utils/supabase/server";

export async function getItemFromStorage({
	filename,
}: {
	readonly filename: string;
}) {
	const supabase = createClient();

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

	const { data: itemDetails, error: itemError } = await supabase.storage
		.from("media")
		.list(`${user.id}`,
			{
				search: decodeURIComponent(filename),
			}
		);

	if (itemError) {
		return {
			data: null,
			error: itemError,
			userId: user.id,
		};
	}

	if (!itemDetails) {
		return {
			data: null,
			error: new Error("Item not found."),
			userId: user.id,
		};
	}

	const singleItemDetails = itemDetails.find(
		(item) => item.name === decodeURIComponent(filename)
	);

	if (!singleItemDetails) {
		return {
			data: null,
			error: new Error("Item not found."),
			userId: user.id,
		};
	}

	const { data, error } = await supabase.storage
		.from("media")
		.createSignedUrl(`${user.id}/${filename}`, 60);

	if (error) {
		return {
			data: null,
			error,
			userId: user.id,
		};
	}

	return {
		userId: user.id,
		data: {
			...singleItemDetails,
			signedUrl: data?.signedUrl,
		},
		error,
	};
}
