"use client";

import { Avatar } from "@/components/ui/avatar";
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
} from "@/components/ui/dropdown";
import {
	Navbar,
	NavbarItem,
	NavbarSection,
	NavbarSpacer,
} from "@/components/ui/navbar";
import {
	Sidebar,
	SidebarBody,
	SidebarFooter,
	SidebarHeader,
	SidebarHeading,
	SidebarItem,
	SidebarLabel,
	SidebarSection,
	SidebarSpacer,
} from "@/components/ui/sidebar";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import { useAuth } from "@/utils/auth/AuthProvider";
import {
	ArrowRightStartOnRectangleIcon,
	ChevronUpIcon,
	Cog8ToothIcon,
	LightBulbIcon,
	ShieldCheckIcon,
	UserIcon,
} from "@heroicons/react/16/solid";
import {
	Cog6ToothIcon,
	WrenchScrewdriverIcon,
	ChatBubbleLeftIcon,
	MagnifyingGlassIcon,
	QuestionMarkCircleIcon,
	SparklesIcon,
	CircleStackIcon,
} from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";

export function NavigationProvider({
	children,
}: {
	readonly children: React.ReactNode;
}): JSX.Element {
	const { data, authStatus } = useAuth();
	const pathname = usePathname();

	return (
		<SidebarLayout
			navbar={
				<Navbar>
					<NavbarSpacer />
					<NavbarSection>
						<NavbarItem href="/chat" aria-label="New Chat">
							<ChatBubbleLeftIcon />
						</NavbarItem>
						<NavbarItem href="/search" aria-label="Search">
							<MagnifyingGlassIcon />
						</NavbarItem>
						<Dropdown>
							<DropdownButton as={NavbarItem}>
								<Avatar
									className="bg-orange-400 text-zinc-950"
									initials="AI"
									square
								/>
							</DropdownButton>
							<DropdownMenu className="min-w-64" anchor="bottom end">
								<DropdownItem href="/profile">
									<UserIcon />
									<DropdownLabel>My profile</DropdownLabel>
								</DropdownItem>
								<DropdownItem href="/settings">
									<Cog8ToothIcon />
									<DropdownLabel>Settings</DropdownLabel>
								</DropdownItem>
								<DropdownDivider />
								<DropdownItem href="/privacy">
									<ShieldCheckIcon />
									<DropdownLabel>Privacy policy</DropdownLabel>
								</DropdownItem>
								<DropdownItem href="/feedback">
									<LightBulbIcon />
									<DropdownLabel>Share feedback</DropdownLabel>
								</DropdownItem>
								<DropdownDivider />
								{authStatus === "authenticated" ? (
									<DropdownItem href="/auth/logout">
										<ArrowRightStartOnRectangleIcon />
										<DropdownLabel>Sign out</DropdownLabel>
									</DropdownItem>
								) : (
									<DropdownItem href="/auth">
										<ArrowRightStartOnRectangleIcon />
										<DropdownLabel>Sign in</DropdownLabel>
									</DropdownItem>
								)}
							</DropdownMenu>
						</Dropdown>
					</NavbarSection>
				</Navbar>
			}
			sidebar={
				<Sidebar>
					<SidebarHeader>
						<SidebarItem className="lg:mb-2.5">
							<Avatar className="bg-orange-400 text-zinc-950" initials="AI" />
							<SidebarLabel>PLAM</SidebarLabel>
						</SidebarItem>
						<SidebarSection className="max-lg:hidden">
							<SidebarItem>
								<MagnifyingGlassIcon />
								<SidebarLabel>Search</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					</SidebarHeader>
					<SidebarBody>
						<SidebarSection>
							<SidebarItem href="/chat" current={pathname === "/chat"}>
								<ChatBubbleLeftIcon />
								<SidebarLabel>New Chat</SidebarLabel>
							</SidebarItem>
							<SidebarItem href="/tools" current={pathname === "/tools"}>
								<WrenchScrewdriverIcon />
								<SidebarLabel>Tools & Services</SidebarLabel>
							</SidebarItem>
							<SidebarItem href="/storage" current={pathname === "/storage"}>
								<CircleStackIcon />
								<SidebarLabel>Storage</SidebarLabel>
							</SidebarItem>
							<SidebarItem href="/settings" current={pathname === "/settings"}>
								<Cog6ToothIcon />
								<SidebarLabel>Settings</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
						<SidebarSection className="max-lg:hidden">
							<SidebarHeading>Action History</SidebarHeading>
							<SidebarItem href="/chat/123">Weather in London</SidebarItem>
						</SidebarSection>
						<SidebarSpacer />
						<SidebarSection>
							<SidebarItem href="/support">
								<QuestionMarkCircleIcon />
								<SidebarLabel>Support</SidebarLabel>
							</SidebarItem>
							<SidebarItem href="/changelog">
								<SparklesIcon />
								<SidebarLabel>Changelog</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					</SidebarBody>
					<SidebarFooter className="max-lg:hidden">
						<Dropdown>
							<DropdownButton as={SidebarItem}>
								<span className="flex min-w-0 items-center gap-3">
									<Avatar
										className="size-10 bg-orange-400 text-zinc-950"
										square
										initials="A"
										alt=""
									/>
									<span className="min-w-0">
										<span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
											{data?.name ?? "Anonymous"}
										</span>
										<span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
											{data?.email ?? "anonymous@plam.app"}
										</span>
									</span>
								</span>
								<ChevronUpIcon />
							</DropdownButton>
							<DropdownMenu className="min-w-64" anchor="top start">
								<DropdownItem href="/profile">
									<UserIcon />
									<DropdownLabel>My profile</DropdownLabel>
								</DropdownItem>
								<DropdownItem href="/settings">
									<Cog8ToothIcon />
									<DropdownLabel>Settings</DropdownLabel>
								</DropdownItem>
								<DropdownDivider />
								<DropdownItem href="/privacy">
									<ShieldCheckIcon />
									<DropdownLabel>Privacy policy</DropdownLabel>
								</DropdownItem>
								<DropdownItem href="/feedback">
									<LightBulbIcon />
									<DropdownLabel>Share feedback</DropdownLabel>
								</DropdownItem>
								<DropdownDivider />
								{authStatus === "authenticated" ? (
									<DropdownItem href="/auth/logout">
										<ArrowRightStartOnRectangleIcon />
										<DropdownLabel>Sign out</DropdownLabel>
									</DropdownItem>
								) : (
									<DropdownItem href="/auth">
										<ArrowRightStartOnRectangleIcon />
										<DropdownLabel>Sign in</DropdownLabel>
									</DropdownItem>
								)}
							</DropdownMenu>
						</Dropdown>
					</SidebarFooter>
				</Sidebar>
			}
		>
			{children}
		</SidebarLayout>
	);
}
