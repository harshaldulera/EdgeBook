"use client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function LoginPage() {
    const supabase = useSupabaseClient();

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        });
        if (error) console.error(error);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6">📓 EdgeBook</h1>
            <button
                onClick={loginWithGoogle}
                className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500"
            >
                Sign in with Google
            </button>
        </div>
    );
}
