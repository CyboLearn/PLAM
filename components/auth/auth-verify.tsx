"use client";

import { useAuth } from "@/utils/auth/AuthProvider";
import { redirect } from "next/navigation";

export default function AuthVerifyPage() {
	const { authStatus } = useAuth();

	if (authStatus === "authenticated") {
		return redirect("/chat");
	}

	return (
		<div>
			<h1>Verify</h1>
		</div>
	);
}
