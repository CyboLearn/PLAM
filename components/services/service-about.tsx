"use client";

import type { Service } from "@/actions/services/get-available-services";

export function AboutService({
	service,
}: {
	readonly service: Service | null;
}) {
	return (
		<div>
			<pre>{JSON.stringify(service, null, 2)}</pre>
		</div>
	);
}
