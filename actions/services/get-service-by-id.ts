"use server";

import { createClient } from "@/utils/supabase/server";
import type { Service } from "@/actions/services/get-available-services";

export async function getServiceById({
	serviceIdOrSlug,
}: {
	readonly serviceIdOrSlug: string;
}): Promise<{
	data: Service | null;
	error: Error | null;
}> {
	const supabase = createClient();

	const isUuid =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
			serviceIdOrSlug,
		);

	const { data, error } = isUuid
		? await supabase
				.from("services")
				.select(
					"service_id, created_at, service_name, service_slug, description, service_state",
				)
				.eq("service_id", serviceIdOrSlug)
				.maybeSingle()
		: await supabase
				.from("services")
				.select(
					"service_id, created_at, service_name, service_slug, description, service_state",
				)
				.eq("service_slug", serviceIdOrSlug)
				.maybeSingle();

	if (error) {
		console.error(error);
		return {
			data: null,
			error: new Error(error.message)
		};
	}

	if (!data) {
		return {
			data: null,
			error: new Error("Service not found."),
		};
	}

	return {
		data: {
			service_id: data.service_id,
			created_at: data.created_at,
			service_name: data.service_name,
			service_slug: data.service_slug,
			description: data.description,
			service_state: data.service_state,
		},
		error: null,
	};
}
