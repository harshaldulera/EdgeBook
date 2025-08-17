import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await req.json();

    // check user session
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json(
            { success: false, error: "Not logged in" },
            { status: 401 }
        );
    }

    // verify that the account belongs to this user
    const { data: account, error: accError } = await supabase
        .from("trading_accounts")
        .select("id")
        .eq("id", body.account_id)
        .eq("user_id", user.id)
        .single();

    if (accError || !account) {
        return NextResponse.json(
            { success: false, error: "Invalid account" },
            { status: 403 }
        );
    }

    // --- Parse numeric inputs ---
    const entry = body.entry_price ? Number(body.entry_price) : null;
    const exit = body.exit_price ? Number(body.exit_price) : null;
    const size = body.size ? Number(body.size) : null;

    // --- Auto-calc PnL ---
    let pnl: number | null = null;
    if (entry !== null && exit !== null && size !== null) {
        if (body.side?.toLowerCase() === "long") {
            pnl = (exit - entry) * size;
        } else if (body.side?.toLowerCase() === "short") {
            pnl = (entry - exit) * size;
        }
    }

    // insert trade
    const { error } = await supabase.from("trades").insert([
        {
            account_id: body.account_id,
            user_id: user.id,
            symbol: body.symbol,
            side: body.side,
            entry_price: entry,
            exit_price: exit,
            size,
            pnl, // ✅ auto-calculated
            notes: body.notes || null,
            trade_date: body.trade_date || new Date().toISOString(),
        },
    ]);

    if (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
    const supabase = createRouteHandlerClient({ cookies });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { success: false, error: "Not logged in" },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const account_id = searchParams.get("account_id");

    if (!account_id) {
        return NextResponse.json(
            { success: false, error: "Missing account_id" },
            { status: 400 }
        );
    }

    // verify that the account belongs to this user
    const { data: account, error: accError } = await supabase
        .from("trading_accounts")
        .select("id")
        .eq("id", account_id)
        .eq("user_id", user.id)
        .single();

    if (accError || !account) {
        return NextResponse.json(
            { success: false, error: "Invalid account" },
            { status: 403 }
        );
    }

    // fetch trades
    const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("account_id", account_id)
        .eq("user_id", user.id)
        .order("trade_date", { ascending: false });

    if (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true, trades: data });
}
