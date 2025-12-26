import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function AddEvent() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // ✅ 내용
    const [time, setTime] = useState("");

    const handleAdd = () => {
        if (!title || !content || !time) {
            Alert.alert("오류", "제목, 내용, 시간을 모두 입력하세요");
            return;
        }

        router.replace({
            pathname: "/(tabs)",
            params: { title, content, time },
        });
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                일정 추가
            </Text>

            {/* 제목 */}
            <TextInput
                placeholder="일정 제목"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                    color: "#000",
                }}
            />

            {/* 내용 */}
            <TextInput
                placeholder="일정 내용"
                placeholderTextColor="#999"
                value={content}
                onChangeText={setContent}
                multiline
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                    color: "#000",
                    height: 100,
                    textAlignVertical: "top",
                }}
            />

            {/* 시간 */}
            <TextInput
                placeholder="시간"
                placeholderTextColor="#999"
                value={time}
                onChangeText={setTime}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 24,
                    color: "#000",
                }}
            />

            <TouchableOpacity
                onPress={handleAdd}
                style={{
                    backgroundColor: "#000",
                    padding: 14,
                    borderRadius: 8,
                }}
            >
                <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
                    추가
                </Text>
            </TouchableOpacity>
        </View>
    );
}
