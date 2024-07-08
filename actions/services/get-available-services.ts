"use server";

import { createClient } from "@/utils/supabase/server";

export type UserRoleType =
	| "Guest"
	| "User"
	| "Tester"
	| "Administrator"
	| "Moderator"
	| "Owner";

export async function getAvailableServices() {
	const supabase = createClient();

	const { data: userData, error: userError } = await supabase
		.from("users")
		.select("role")
		.maybeSingle();

	if (userError) {
		return {
			data: null,
			error: userError.message,
		};
	}

	if (!userData) {
		return {
			data: null,
			error: "User not found.",
		};
	}

	// if the user is an administrator/owner, they can enable all services that are `Active`, `Beta`, or `Inactive`
	// if the user is a guest, they can't enable any services
	// if the user is a moderator/tester, they can only enable services that are either `Active` or `Beta`
	// if the user is a user, they can only enable services that are `Active`

	const { data: servicesData, error } = await supabase
		.from("services")
		.select("*");

	if (error) {
		return {
			data: null,
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

	return {
		data: services,
		error: null,
	};
}
