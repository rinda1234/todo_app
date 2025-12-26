import { View, Text } from "react-native";
import { auth } from "@/lib/firebase";

export default function Login() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24 }}>LOGIN SCREEN</Text>
            <Text>{auth ? "Firebase OK" : "Firebase FAIL"}</Text>
        </View>
    );
}
