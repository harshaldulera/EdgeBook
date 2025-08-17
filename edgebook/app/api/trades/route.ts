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
    .eq("id", body.account_id)  // <- matching account_id
    .eq("user_id", user.id)     // <- must also match logged in user
    .single();

    if (accError || !account) {
        return NextResponse.json(
            { success: false, error: "Invalid account" },
            { status: 403 }
        );
    }

    // insert trade
    const { error } = await supabase.from("trades").insert([
        {
            account_id: body.account_id,
            user_id: user.id, // ✅ always save user_id too
            symbol: body.symbol,
            side: body.side,
            entry_price: body.entry_price ? Number(body.entry_price) : null,
            exit_price: body.exit_price ? Number(body.exit_price) : null,
            size: body.size ? Number(body.size) : null,
            pnl: body.pnl ? Number(body.pnl) : null,
            notes: body.notes || null,
            trade_date: body.trade_date || new Date().toISOString(), // fallback
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
