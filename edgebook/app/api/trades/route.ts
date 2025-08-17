import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// POST api/trades -> add a new trade
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { account_id, symbol, side, entry_price, exit_price, size, notes } = body;

        // Insert trade
        const { data, error } = await supabase
            .from("trades")
            .insert([
                {
                    account_id,
                    symbol,
                    side,
                    entry_price,
                    exit_price,
                    size,
                    pnl: (exit_price - entry_price) * size * (side === "long" ? 1 : -1),
                    notes,
                },
            ])
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, trade: data[0] });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// GET /api/trades?account_id=xxx -> fetch trades for an account
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const account_id = searchParams.get("account_id");

    if (!account_id) {
        return NextResponse.json({ success: false, error: "Missing account_id" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("account_id", account_id)
        .order("trade_date", { ascending: false });

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, trades: data });
}
