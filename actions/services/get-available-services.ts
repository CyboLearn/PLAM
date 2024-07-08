"use server";

import { createClient } from "@/utils/supabase/server";

export type UserRoleType =
	| "Guest"
	| "User"
	| "Tester"
	| "Administrator"
	| "Moderator"
	| "Owner";

export interface EnabledServices {
	service_id: string;
	is_enabled: boolean;
};

export interface Service {
	service_id: string;
	created_at: string;
	service_name: string;
	service_slug: string;
	description: string;
	service_state: string;
}

export async function getAvailableServices(): Promise<{
	data: {
		services: Service[] | null;
		enabledServices: EnabledServices[] | null;
	};
	error: string | null;
}> {
	const supabase = createClient();

	const { data: userData, error: userError } = await supabase
		.from("users")
		.select("user_id, role")
		.maybeSingle();

	if (userError) {
		return {
			data: {
				services: null,
				enabledServices: null,
			},
			error: userError.message,
		};
	}

	if (!userData) {
		return {
			data: {
				services: null,
				enabledServices: null,
			},
			error: "User not found.",
		};
	}

	// if the user is an administrator/owner, they can enable all services that are `Active`, `Beta`, or `Inactive`
	// if the user is a guest, they can't enable any services
	// if the user is a moderator/tester, they can only enable services that are either `Active` or `Beta`
	// if the user is a user, they can only enable services that are `Active`

	const { data: servicesData, error } = await supabase
		.from("services")
		.select("service_id, created_at, service_name, service_slug, description, service_state");

	if (error) {
		return {
			data: {
				services: null,
				enabledServices: null,
			},
			error: error.message,
		};
	}

	const services = servicesData.filter((service) => {
		if (userData.role === "Administrator" || userData.role === "Owner") {
			return (
				service.service_state === "Active" ||
				service.service_state === "Beta" ||
				service.service_state === "Inactive"
			);
		}

		if (userData.role === "Moderator" || userData.role === "Tester") {
			return service.service_state === "Active" || service.service_state === "Beta";
		}

		if (userData.role === "User") {
			return service.service_state === "Active";
		}

		return false;
	});

	let enabledServices: EnabledServices[] = [];

	const { data: enabledServicesData, error: enabledServicesError } = await supabase
		.from("enabled_services")
		.select("service_id, is_enabled")
		.eq("user_id", userData.user_id);

	if (enabledServicesError) {
		return {
			data: {
				services: null,
				enabledServices: null,
			},
			error: enabledServicesError.message,
		};
	}

	enabledServices = enabledServicesData.map((service) => {
		return {
			service_id: service.service_id,
			is_enabled: service.is_enabled,
		} as EnabledServices;
	});

	return {
		data: {
			services,
			enabledServices: enabledServices,
		},
		error: null,
	};
}
