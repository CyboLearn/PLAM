"use client";

import { Subheading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "../ui/button";

export function FileError({
	error,
}: {
	readonly error: Error | string;
}) {
	const errorMessage = error instanceof Error ? error.message : error;

	return (
		<div>
			<Subheading>Error: {errorMessage}</Subheading>
			<Text>
				We’ve encountered an error while trying to fetch the file—it may no
				longer exist.
			</Text>
			<div className="flex flex-row gap-x-4 mt-6">
				<Button href="/storage" color="dark/white">
					Go back
				</Button>
				<Button href="/support" plain>
					Contact Support
				</Button>
			</div>
		</div>
	);
}
