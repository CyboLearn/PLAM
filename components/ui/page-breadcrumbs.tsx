"use client";

import { Text, TextLink, Strong } from "@/components/ui/text";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { Heading } from "@/components/ui/heading";
import { Fragment } from "react";

export function PageBreadcrumbs({
	useHeading = true,
	items = [],
	current,
	...props
}: {
	readonly useHeading?: boolean; // Use the Heading component to render the breadcrumbs instead of Text
	readonly items: {
		readonly name: string;
		readonly href: string;
	}[];
	readonly current: string;
	readonly props?: any;
}) {
	const Wrapper = useHeading ? Heading : Text;

	return (
		<div {...props}>
			<Wrapper className="flex flex-row gap-x-1 items-center">
				{items.map((item) => (
					<Fragment key={item.name}>
						<TextLink href={item.href}>
							<Strong>{item.name}</Strong>
						</TextLink>
						<ChevronRightIcon className="size-4" />
					</Fragment>
				))}
				<Strong>{current}</Strong>
			</Wrapper>
		</div>
	);
}
