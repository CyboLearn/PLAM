import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
	const {
		record: { user_id },
	} = await req.json();
	console.log(`Deleting Space for User with ID: ${user_id}`);

	const supabase = createClient(
		Deno.env.get("SUPABASE_URL") ?? "",
		Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
	);

	const { data, error } = await supabase.storage
		.from("media")
		.list(`${user_id}`);

	if (error) {
		throw error;
	}

	console.log(data);

	const files = data || [];

	for (const file of files) {
		await supabase.storage.from("media").remove([`${user_id}/${file.name}`]);
	}

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
