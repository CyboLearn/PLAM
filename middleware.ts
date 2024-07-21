import * as jose from "jose";
import { verifyKey } from "@unkey/api";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

async function signJWT(
	payload: jose.JWTPayload,
	secret: string,
): Promise<string> {
	const alg = "HS256";
	const secretKey = new TextEncoder().encode(secret);

	const jwt = await new jose.SignJWT(payload)
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setIssuer("urn:example:issuer")
		.setAudience("urn:example:audience")
		.setExpirationTime("2h")
		.sign(secretKey);

	return jwt;
}

function createResponseWithHeaders(headers: Headers) {
	return NextResponse.next({
		request: {
			headers,
		},
	});
}

async function handleApiRequest(request: NextRequest, user: any) {
	const _headers = new Headers(request.headers);
	const apiKey = _headers.get("x-api-key") ?? undefined;

	if (!apiKey && !user) {
		return NextResponse.json(
			{
				error: "API Key not provided",
			},
			{
				status: 401,
			},
		);
	}

	if (!apiKey && user) {
		const token = await signJWT(
			{
				sub: user.id,
			},
			process.env.SUPABASE_JWT_SECRET!,
		);

		_headers.set("Authorization", `Bearer ${token}`);
	}

	if (apiKey && !user) {
		const { result, error } = await verifyKey({
			key: apiKey,
			apiId: process.env.UNKEY_API_ID!,
		});

		if (error) {
			return NextResponse.json(
				{
					error: "Invalid API key",
				},
				{
					status: 401,
				},
			);
		}

		const ownerId = result?.ownerId ?? undefined;

		if (!ownerId) {
			return NextResponse.json(
				{
					error:
						"Your API Key is malformed. Create a new one to fix this issue.",
				},
				{
					status: 401,
				},
			);
		}

		const token = await signJWT(
			{
				sub: ownerId,
			},
			process.env.SUPABASE_JWT_SECRET!,
		);

		_headers.set("Authorization", `Bearer ${token}`);
	}

	return createResponseWithHeaders(_headers);
}

export async function middleware(request: NextRequest) {
	const _headers = new Headers(request.headers);
	let response = NextResponse.next({
		request: {
			headers: _headers,
		},
	});

	if (
		!process.env.NEXT_PUBLIC_SUPABASE_URL ||
		!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	) {
		return response;
	}

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					response = NextResponse.next({
						request,
					});
					for (const { name, value, options } of cookiesToSet) {
						response.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (request.nextUrl.pathname.startsWith("/v1")) {
		const v1Response = await handleApiRequest(request, user);
		if (v1Response) return v1Response;
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
