"use client";

import clsx from "clsx";
import type React from "react";
import { Text } from "./text";
import { Heading, Subheading } from "./heading";

export function Card({
	className,
	children,
	...props
}: {
	readonly className?: string;
	readonly children: React.ReactNode;
}) {
	return (
		<div
			className={clsx(
				"row-start-2 w-full min-w-0 rounded-t-3xl bg-white p-[--gutter] shadow-lg ring-1 ring-zinc-950/10 [--gutter:theme(spacing.8)] sm:mb-auto sm:rounded-2xl dark:bg-zinc-900 dark:ring-white/10 forced-colors:outline",
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function CardTitle({
	className,
	level = 1,
	...props
}: {
	readonly className?: string;
	readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
	readonly children: React.ReactNode;
}) {
	if (level === 1) {
		return (
			<Heading
				{...props}
				className={clsx(
					className,
					"text-balance text-2xl/6 font-semibold text-zinc-950 sm:text-xl/6 dark:text-white",
				)}
			/>
		);
	}

	return (
		<Subheading
			{...props}
			className={clsx(
				className,
				"text-balance text-lg/6 font-semibold text-zinc-950 sm:text-base/6 dark:text-white",
			)}
		/>
	);
}

export function CardDescription({
	className,
	...props
}: { readonly className?: string; readonly children: React.ReactNode }) {
	return <Text {...props} className={clsx(className, "mt-2 text-pretty")} />;
}

export function CardBody({
	className,
	...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
	return <div {...props} className={clsx(className, "mt-6")} />;
}

export function CardActions({
	className,
	...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
	return (
		<div
			{...props}
			className={clsx(
				className,
				"mt-8 flex flex-col-reverse items-center justify-start gap-3 *:w-full sm:flex-row sm:*:w-auto",
			)}
		/>
	);
}
