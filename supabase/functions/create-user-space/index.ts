import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("Creating User Space Function");

Deno.serve(async (req) => {
  const { record: { user_id } } = await req.json();
  console.log(`Creating Space for User with ID: ${user_id}`);

	const supabase = createClient(
		Deno.env.get("SUPABASE_URL") ?? "",
		Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
	);

	const { error } = await supabase.storage
		.from("media")
		.upload(`${user_id}/ignore.plam`, new File([], ""));

	if (error) {
		console.error(error);
		return new Response(null, { status: 500 });
	}

	return new Response(
		{
			status: "success",
		},
		{
			headers: { "Content-Type": "application/json" },
		},
	);
});
