import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function TabsLayout() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setChecking(false);

            if (!u) {
                router.replace("/(auth)" as never);
            }
        });

        return unsub;
    }, []);

    if (checking) return null;

    return <Stack screenOptions={{ headerShown: false }} />;
}
