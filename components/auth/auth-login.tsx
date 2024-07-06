"use client";

import { useAuth } from "@/utils/auth/AuthProvider";
import { redirect } from "next/navigation";

export default function AuthLoginPage() {
	const { authStatus } = useAuth();

	if (authStatus === "authenticated") {
		return redirect("/chat");
	}

	return (
		<div>
			<h1>Login</h1>
		</div>
	);
};
