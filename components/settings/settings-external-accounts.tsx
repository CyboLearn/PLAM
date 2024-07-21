"use client";

import { PageSubheading } from "@/components/ui/page-heading";
import { Card, CardGroup } from "@/components/ui/card";
import { Button } from "../ui/button";
import {
	ArrowPathIcon,
	ArrowRightIcon,
	TrashIcon,
	ExclamationCircleIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Divider } from "../ui/divider";

interface Connection {
	id: string;
	name: string;
	description: string;
	connected?: boolean;
	cta?: string;
	beta?: boolean;
}

export function ExternalAccountsAndConnections({
	connections,
}: {
	readonly connections: Connection[];
}) {
	const router = useRouter();
	const [disabledButtons, setDisabledButtons] = useState<{
		[key: string]: boolean;
	}>({});

	const linkPlatform = async (id: any) => {
		setDisabledButtons((prevState) => ({ ...prevState, [id]: true }));

		const response = await fetch("/api/social-media/link", {
			method: "POST",
			body: JSON.stringify({ platform: id }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const { redirectUrl = null } = await response.json();

		if (redirectUrl) {
			router.push(redirectUrl);
		} else {
			router.refresh();
		}

		setTimeout(() => {
			setDisabledButtons((prevState) => ({ ...prevState, [id]: false }));
		}, 5000);
	};

	const disconnectPlatform = async (id: string) => {
		setDisabledButtons((prevState) => ({ ...prevState, [id]: true }));

		await fetch("/api/social-media/disconnect", {
			method: "POST",
			body: JSON.stringify({ platform: id }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		router.refresh();

		setTimeout(() => {
			setDisabledButtons((prevState) => ({ ...prevState, [id]: false }));
		}, 5000);
	};

	return (
		<div>
			<PageSubheading
				title="External Accounts & Connections"
				description="Connect your social media and work accounts to allow PLAM to do things on your behalf."
			/>
			<CardGroup>
				{connections.map((connection) => {
					let cta = connection.connected ? "Disconnect" : "Connect";
					if (connection.beta) {
						cta = "Coming soon";
					}
					let CTAIcon = connection.connected ? (
						<TrashIcon className="size-4 mr-2" />
					) : (
						<ArrowRightIcon className="size-4 mr-2" />
					);
					if (connection.beta) {
						CTAIcon = <ExclamationCircleIcon className="size-4 mr-2" />;
					}
					const onClick = connection.connected
						? () => disconnectPlatform(connection.id)
						: () => linkPlatform(connection.id);

					return (
						<Card
							key={connection.id}
							title={connection.name}
							description={connection.description}
						>
							<div className="flex flex-col min-w-36 gap-y-1">
								<Button
									color={connection.connected ? "red" : "dark/white"}
									disabled={!!disabledButtons[connection.id] || connection.beta}
									onClick={onClick}
								>
									{disabledButtons[connection.id] === true ? "Loading" : cta}
									{disabledButtons[connection.id] === true ? (
										<ArrowPathIcon className="size-4 mr-2 animate-spin" />
									) : (
										CTAIcon
									)}
								</Button>
								{/**<Button
									disabled={!!disabledButtons[connection.id]}
									onClick={async () => {
										linkPlatform(connection.id);
									}}
									plain
								>
									connect another
								</Button>*/}
							</div>
						</Card>
					);
				})}
			</CardGroup>
			<Divider soft className="mt-6" />
		</div>
	);
}
