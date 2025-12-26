import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });

        return unsub;
    }, []);

    // 🔹 로그인 상태 확인 중 (로딩)
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {user ? (
                <Stack.Screen name="(tabs)" />
            ) : (
                <Stack.Screen name="(auth)" />
            )}
        </Stack>
    );
}
