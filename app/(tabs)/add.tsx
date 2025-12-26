import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function AddEvent() {
    const router = useRouter();
    const { date } = useLocalSearchParams<{ date?: string }>();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");

    // ✅ 날짜: param 있으면 그 날짜, 없으면 오늘
    const [selectedDate] = useState(() => {
        if (date) {
            return new Date(date + "T00:00:00");
        }
        return new Date();
    });

    const formatDateKey = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const handleAdd = async () => {
        if (!title || !description || !startTime) {
            Alert.alert("오류", "제목, 내용, 시간을 모두 입력하세요");
            return;
        }

        try {
            await addDoc(collection(db, "events"), {
                title,
                description,
                startTime,
                date: formatDateKey(selectedDate), // ⭐ 핵심
                userId: auth.currentUser!.uid,
                createdAt: serverTimestamp(),
            });

            router.back();
        } catch (e) {
            Alert.alert("오류", "일정 추가 실패");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                일정 추가
            </Text>

            <TextInput
                placeholder="일정 제목"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 16 }}
            />

            <TextInput
                placeholder="일정 내용"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
                style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 16, height: 100 }}
            />

            <TextInput
                placeholder="시간 (예: 09:00)"
                placeholderTextColor="#999"
                value={startTime}
                onChangeText={setStartTime}
                style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 24 }}
            />

            <TouchableOpacity
                onPress={handleAdd}
                style={{ backgroundColor: "#000", padding: 14 }}
            >
                <Text style={{ color: "#fff", textAlign: "center" }}>추가</Text>
            </TouchableOpacity>
        </View>
    );
}
