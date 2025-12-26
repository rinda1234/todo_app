import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "expo-router";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("오류", "이메일과 비밀번호를 입력하세요");
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);

            // ✅ 로그인 성공 → 탭 화면 이동
            router.replace("/(tabs)" as never);
        } catch (error: any) {
            Alert.alert("로그인 실패", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
            <Text style={{ fontSize: 28, textAlign: "center", marginBottom: 32 }}>
                LOGIN
            </Text>

            <TextInput
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 12,
                    marginBottom: 12,
                    borderRadius: 6,
                }}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 12,
                    marginBottom: 24,
                    borderRadius: 6,
                }}
            />

            <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={{
                    backgroundColor: "#000",
                    padding: 14,
                    borderRadius: 6,
                }}
            >
                <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
                    {loading ? "로그인 중..." : "로그인"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
