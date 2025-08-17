import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
    const supabase = createRouteHandlerClient({ cookies });
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { data, error } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ accounts: data });
}

export async function POST(req: Request) {
    const supabase = createRouteHandlerClient({ cookies });
  
    const {
      name,
      broker,
    }: { name: string; broker: string } = await req.json();
  
    // get the logged-in user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
  
    if (authError || !user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
  
    // insert account tied to this user
    const { data, error } = await supabase
      .from("trading_accounts")
      .insert({
        user_id: user.id,
        name,
        broker,
      })
      .select();
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  
    return NextResponse.json({ success: true, account: data[0] });
  }
  