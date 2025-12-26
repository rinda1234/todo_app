import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

type EventItem = {
    id: string;
    title: string;
    description: string;
    startTime: string;
    date: string; // "YYYY-MM-DD"
};

export default function Home() {
    const router = useRouter();

    // 🔑 날짜별로 묶인 이벤트
    const [eventsByDate, setEventsByDate] = useState<
        Record<string, EventItem[]>
    >({});

    // 오늘 날짜 key (로컬 타임존 기준)
    const todayKey = (() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    })();

    const todayEvents = eventsByDate[todayKey] || [];

    // 일정 삭제
    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "events", id));
    };

    // Firestore 실시간 구독
    useEffect(() => {
        if (!auth.currentUser) return;

        const q = query(
            collection(db, "events"),
            where("userId", "==", auth.currentUser.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const grouped: Record<string, EventItem[]> = {};

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();

                const dateKey = data.date; // "2025-12-25"

                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }

                grouped[dateKey].push({
                    id: docSnap.id,
                    title: data.title,
                    description: data.description,
                    startTime: data.startTime,
                    date: data.date,
                });
            });

            setEventsByDate(grouped);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TouchableOpacity
                onPress={() => router.push("/calendar" as any)}
                style={{
                    marginTop: 12,
                    padding: 12,
                    backgroundColor: "#000",
                    borderRadius: 8,
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "#fff" }}>📅 전체 캘린더 보기</Text>
            </TouchableOpacity>


            {/* 날짜 */}
            <Text style={{ fontSize: 20, color: "#666", marginTop: 16 }}>
                {new Date().toLocaleDateString()}
            </Text>

            {/* 타이틀 */}
            <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>
                오늘 일정
            </Text>

            {/* 오늘 일정 리스트 */}
            {todayEvents.length === 0 ? (
                <Text style={{ color: "#999", marginTop: 20 }}>
                    오늘은 일정이 없어요 🙂
                </Text>
            ) : (
                <FlatList
                    data={todayEvents}
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
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                    }}
                                >
                                    {item.title}
                                </Text>

                                <Text
                                    style={{
                                        color: "#444",
                                        marginTop: 4,
                                    }}
                                >
                                    {item.description}
                                </Text>

                                <Text
                                    style={{
                                        color: "#777",
                                        marginTop: 6,
                                    }}
                                >
                                    ⏰ {item.startTime}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                            >
                                <Text style={{ color: "red" }}>삭제</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            {/* 일정 추가 버튼 */}
            <TouchableOpacity
                onPress={() => router.push("/(tabs)/add")}
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
