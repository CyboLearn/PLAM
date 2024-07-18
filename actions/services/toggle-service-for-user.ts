"use server";

import { createClient } from "@/utils/supabase/server";

export async function toggleServiceForUser({
	serviceId,
	enabled,
}: {
	readonly serviceId: string;
	readonly enabled: boolean;
}) {
	const supabase = createClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		return {
			data: null,
			error: userError.message,
		};
	}

	if (!user) {
		return {
			data: null,
			error: "User not found.",
		};
	}

	const { error } = await supabase.from("enabled_services").upsert({
		service_id: serviceId,
		user_id: user.id,
		enabled: enabled,
	});

	if (error) {
		return {
			data: null,
			error: error.message,
		};
	}

	return {
		data: `Service ${enabled ? "enabled" : "disabled"}.`,
		error: null,
	};
}
