import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as Crypto from "expo-crypto";

import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";

import * as Google from "expo-auth-session/providers/google";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Google OAuth (Android Dev Build 전용)
    const nonce = Crypto.randomUUID();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId:
            "40516037416-mc716a582lk871foirmnvioddh0cn4an.apps.googleusercontent.com",
        scopes: ["profile", "email"],
        responseType: "id_token",
        extraParams: {
            nonce, // ⭐️ 이게 없어서 unsupported_response_type 뜬 것
        },
    });

    // =========================
    // Email / Password 로그인
    // =========================
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("오류", "이메일과 비밀번호를 입력하세요");
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/(tabs)" as never);
        } catch (e: any) {
            Alert.alert("로그인 실패", e.message);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // Google 로그인 결과 처리
    // =========================
    useEffect(() => {
        if (response?.type === "success") {
            const { idToken } = response.authentication!;

            const credential = GoogleAuthProvider.credential(idToken);

            signInWithCredential(auth, credential)
                .then(() => {
                    router.replace("/(tabs)" as never);
                })
                .catch((e) => {
                    Alert.alert("Google 로그인 실패", e.message);
                });
        }
    }, [response]);

    // =========================
    // UI
    // =========================
    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
            <Text style={{ fontSize: 28, textAlign: "center", marginBottom: 32 }}>
                LOGIN
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
                placeholder="Password"
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

            <TouchableOpacity
                onPress={() => promptAsync()}
                disabled={!request}
                style={{
                    marginTop: 16,
                    backgroundColor: "#4285F4",
                    padding: 14,
                    borderRadius: 6,
                }}
            >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                    Google 로그인
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push("/(auth)/signup" as never)}
            >
                <Text>                               계정이 없나요?</Text>
                <Text>                                   회원가입</Text>
            </TouchableOpacity>

        </View>
    );
}
