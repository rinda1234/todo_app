import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Signup() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert("오류", "이메일과 비밀번호를 입력하세요");
            return;
        }

        if (password.length < 6) {
            Alert.alert("오류", "비밀번호는 6자 이상이어야 합니다");
            return;
        }

        try {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
            // 회원가입 성공 → 자동 로그인 → 메인
            router.replace("/(tabs)" as never);
        } catch (e: any) {
            Alert.alert("회원가입 실패", e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
            <Text style={{ fontSize: 28, textAlign: "center", marginBottom: 32 }}>
                SIGN UP
            </Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 12,
                    marginBottom: 12,
                    borderRadius: 6,
                    color: "#000",
                }}
            />

            <TextInput
                placeholder="Password (min 6 chars)"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 12,
                    marginBottom: 24,
                    borderRadius: 6,
                    color: "#000",
                }}
            />

            <TouchableOpacity
                onPress={handleSignup}
                disabled={loading}
                style={{
                    backgroundColor: "#000",
                    padding: 14,
                    borderRadius: 6,
                }}
            >
                <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
                    {loading ? "가입 중..." : "회원가입"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginTop: 16 }}
            >
                <Text style={{ textAlign: "center", color: "#555" }}>
                    이미 계정이 있나요? 로그인
                </Text>
            </TouchableOpacity>
        </View>
    );
}
