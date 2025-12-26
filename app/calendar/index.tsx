import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

/* =====================
   날짜 유틸 함수
===================== */
const formatDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};


const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

/* =====================
   타입
===================== */
type CalendarEvent = {
    id: string;
    date: string;
};

/* =====================
   메인 컴포넌트
===================== */
export default function CalendarPage() {
    const router = useRouter();

    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth()); // 0~11

    const [eventsByDate, setEventsByDate] = useState<
        Record<string, CalendarEvent[]>
    >({});

    /* =====================
       달 이동
    ===================== */
    const goPrevMonth = () => {
        if (month === 0) {
            setYear(year - 1);
            setMonth(11);
        } else {
            setMonth(month - 1);
        }
    };

    const goNextMonth = () => {
        if (month === 11) {
            setYear(year + 1);
            setMonth(0);
        } else {
            setMonth(month + 1);
        }
    };

    /* =====================
       Firestore에서 월 데이터 가져오기
    ===================== */
    useEffect(() => {
        if (!auth.currentUser) return;

        const fetchMonthEvents = async () => {
            const uid = auth.currentUser!.uid;

            const start = formatDateKey(
                new Date(year, month, 1)
            );
            const end = formatDateKey(
                new Date(year, month + 1, 0)
            );

            const q = query(
                collection(db, "events"),
                where("userId", "==", uid),
                where("date", ">=", start),
                where("date", "<=", end)
            );

            const snapshot = await getDocs(q);

            const grouped: Record<string, CalendarEvent[]> = {};

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (!grouped[data.date]) {
                    grouped[data.date] = [];
                }
                grouped[data.date].push({
                    id: docSnap.id,
                    date: data.date,
                });
            });

            setEventsByDate(grouped);
        };

        fetchMonthEvents();
    }, [year, month]);

    /* =====================
       캘린더 렌더링
    ===================== */
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const cells = [];

    // 빈칸
    for (let i = 0; i < firstDay; i++) {
        cells.push(<View key={`empty-${i}`} style={styles.cell} />);
    }

    // 날짜
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = formatDateKey(
            new Date(year, month, day)
        );

        const hasEvent = !!eventsByDate[dateKey];

        cells.push(
            <TouchableOpacity
                key={dateKey}
                style={styles.cell}
                onPress={() =>
                    router.push({
                        pathname: "/calendar/day/[date]",
                        params: { date: dateKey },
                    })
                }
            >
                <Text style={styles.dayText}>{day}</Text>
                {hasEvent && <View style={styles.dot} />}
            </TouchableOpacity>
        );
    }


    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goPrevMonth}>
                    <Text style={styles.navText}>◀</Text>
                </TouchableOpacity>

                <Text style={styles.title}>
                    {year}년 {month + 1}월
                </Text>

                <TouchableOpacity onPress={goNextMonth}>
                    <Text style={styles.navText}>▶</Text>
                </TouchableOpacity>
            </View>

            {/* 요일 */}
            <View style={styles.weekRow}>
                {["일", "월", "화", "수", "목", "금", "토"].map(
                    (d) => (
                        <Text key={d} style={styles.weekText}>
                            {d}
                        </Text>
                    )
                )}
            </View>

            {/* 캘린더 */}
            <View style={styles.grid}>{cells}</View>
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
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    navText: {
        fontSize: 20,
    },
    weekRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    weekText: {
        width: "14.2%",
        textAlign: "center",
        fontWeight: "600",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    cell: {
        width: "14.2%",
        height: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    dayText: {
        fontSize: 16,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#000",
        marginTop: 4,
    },
});
