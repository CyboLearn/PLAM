"use client";

import { Subheading } from "./heading";
import { Link } from "./link";
import { Text } from "./text";
import clsx from "clsx";

export function Card({
	title = "",
	description = "",
	href = "",
	cta = undefined,
	children,
	...props
}: {
	readonly title: string;
	readonly description: string;
	readonly href?: string;
	readonly cta?: string;
	readonly children?: React.ReactNode;
	readonly className?: string;
}): JSX.Element {
	if (!href) {
		return (
			<div
				className={clsx(
					"flex flex-col lg:flex-row bg-zinc-100 dark:bg-zinc-800 px-4 py-6 border border-zinc-200 dark:border-zinc-700 rounded-lg gap-4",
					props?.className,
				)}
				{...props}
			>
				<div className="flex flex-col">
					<Subheading level={4}>{title}</Subheading>
					<Text>{description}</Text>
				</div>
				<div className="lg:ml-auto flex flex-col justify-center w-fit">
					{children}
				</div>
			</div>
		);
	}

	return (
		<Link
			href={href}
			className={clsx(
				"flex flex-col lg:flex-row bg-zinc-100 dark:bg-zinc-800 px-4 py-6 border border-zinc-200 dark:border-zinc-700 rounded-lg gap-4",
				props?.className,
			)}
			{...props}
		>
			<div className="flex flex-col">
				<Subheading level={4}>{title}</Subheading>
				<Text>{description}</Text>
			</div>
			<div className="lg:ml-auto flex flex-col justify-center w-fit">
				{children}
			</div>
		</Link>
	);
}

export function CardGroup({
	className = "",
	children,
}: {
	readonly className?: string;
	readonly children: React.ReactNode;
}): JSX.Element {
	return (
		<div className={clsx("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
			{children}
		</div>
	);
}
