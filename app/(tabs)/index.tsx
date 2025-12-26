import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Home() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [events, setEvents] = useState([
        { id: "1", title: "자료구조 과제",content: "aaa", time: "14:00" },
        { id: "2", title: "팀 프로젝트 회의",content: "aaa", time: "18:00" },
    ]);

    // ✅ add.tsx에서 넘어온 일정 처리
    useEffect(() => {
        if (params.title && params.time) {
            setEvents((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    title: params.title as string,
                    content: params.content as string,
                    time: params.time as string,
                },
            ]);
        }
    }, [params]);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {/* 날짜 */}
            <Text style={{ fontSize: 20, color: "#666", marginTop: 16 }}>
                {new Date().toLocaleDateString()}
            </Text>

            <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>
                오늘 일정
            </Text>

            {/* 일정 리스트 */}
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            padding: 16,
                            borderRadius: 10,
                            backgroundColor: "#f2f2f2",
                            marginBottom: 12,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            {/* 제목 */}
                            <Text style={{ fontSize: 16, fontWeight: "600" }}>
                                {item.title}
                            </Text>

                            {/* 내용 ⭐ */}
                            <Text style={{ color: "#444", marginTop: 4 }}>
                                {item.content}
                            </Text>

                            {/* 시간 */}
                            <Text style={{ color: "#777", marginTop: 6 }}>
                                ⏰ {item.time}
                            </Text>
                        </View>

                        {/* 삭제 버튼 */}
                        <Text style={{ color: "red", marginLeft: 12 }}>
                            삭제
                        </Text>
                    </View>
                )}

            />

            {/* ➕ 일정 추가 버튼 */}
            <TouchableOpacity
                onPress={() => {

                    router.push("/(tabs)/add")
                }}
                style={{
                    position: "absolute",
                    right: 20,
                    bottom: 30,
                    backgroundColor: "#000",
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "#fff", fontSize: 28 }}>＋</Text>
            </TouchableOpacity>
        </View>
    );
}
