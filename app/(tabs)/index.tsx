import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function Home() {
    const [events, setEvents] = useState([
        { id: "1", title: "자료구조 과제", time: "14:00" },
        { id: "2", title: "팀 프로젝트 회의", time: "18:00" },
    ]);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {/* 상단 */}

            <Text style={{ fontSize: 20, color: "#666", marginTop: 16}}>
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
                        }}
                    >
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "600" }}>
                                {item.title}
                            </Text>
                            <Text style={{ color: "#555" }}>
                                {item.time}
                            </Text>
                        </View>

                        <Text style={{ color: "red" }}>삭제</Text>
                    </View>
                )}
            />

            {/* 추가 버튼 */}
            <TouchableOpacity
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
