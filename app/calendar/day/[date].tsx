import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    collection,
    query,
    where,
    onSnapshot,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

type EventItem = {
    id: string;
    title: string;
    description: string;
    startTime: string;
    date: string;
};

export default function DayDetailPage() {
    const router = useRouter();
    const { date } = useLocalSearchParams<{ date: string }>();

    const [events, setEvents] = useState<EventItem[]>([]);

    /* =====================
       Firestore에서 해당 날짜 일정 가져오기
    ===================== */
    useEffect(() => {
        if (!auth.currentUser || !date) return;

        const q = query(
            collection(db, "events"),
            where("userId", "==", auth.currentUser.uid),
            where("date", "==", date)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list: EventItem[] = [];

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                list.push({
                    id: docSnap.id,
                    title: data.title,
                    description: data.description,
                    startTime: data.startTime,
                    date: data.date,
                });
            });

            // 시간순 정렬
            list.sort((a, b) =>
                a.startTime.localeCompare(b.startTime)
            );

            setEvents(list);
        });

        return () => unsubscribe();
    }, [date]);

    /* =====================
       삭제
    ===================== */
    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "events", id));
    };

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>

                <Text style={styles.title}>{date}</Text>
            </View>

            {/* 일정 리스트 */}
            {events.length === 0 ? (
                <Text style={styles.emptyText}>
                    이 날짜에는 일정이 없어요 🙂
                </Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.eventTitle}>
                                    {item.title}
                                </Text>

                                <Text style={styles.eventDesc}>
                                    {item.description}
                                </Text>

                                <Text style={styles.eventTime}>
                                    ⏰ {item.startTime}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                            >
                                <Text style={styles.deleteText}>삭제</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            {/* 일정 추가 버튼 */}
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: "/(tabs)/add",
                        params: { date }, // ⭐ 핵심
                    })
                }
                style={styles.fab}
            >
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>

        </View>
    );
}

/* =====================
   스타일
===================== */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    backText: {
        fontSize: 20,
        marginRight: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    emptyText: {
        marginTop: 40,
        textAlign: "center",
        color: "#999",
    },
    card: {
        padding: 16,
        borderRadius: 10,
        backgroundColor: "#f2f2f2",
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    eventDesc: {
        marginTop: 4,
        color: "#444",
    },
    eventTime: {
        marginTop: 6,
        color: "#777",
    },
    deleteText: {
        color: "red",
        marginLeft: 12,
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        backgroundColor: "#000",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
    },
    fabText: {
        color: "#fff",
        fontSize: 28,
    },
});
