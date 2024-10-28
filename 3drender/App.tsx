import "react-native-gesture-handler";
import React from "react";
import { Button, View, Modal } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GlbModelViewer from "./src/components/GlbModelViewer";
import StlModelViewer from "./src/components/StlModelViewer";
import { RootStackParamList, HomeScreenProps } from "./src/types";

const Stack = createStackNavigator<RootStackParamList>();
// const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeScreen = ({ navigation }: HomeScreenProps) => {
	const [modalOptions, setModalOptions] = React.useState<{
		modalType: "GLB" | "STL" | "NONE";
		isVisible: boolean;
	}>({ modalType: "NONE", isVisible: false });

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Modal
				visible={modalOptions!.isVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() =>
					setModalOptions({ modalType: modalOptions!.modalType === "GLB" ? "GLB" : "STL", isVisible: false })
				}
			>
				{modalOptions!.modalType === "GLB" ? <GlbModelViewer /> : <StlModelViewer />}
				<View style={{ width: "100%" }}>
					<Button
						title="Close Modal"
						onPress={() =>
							setModalOptions({ modalType: modalOptions!.modalType === "GLB" ? "GLB" : "STL", isVisible: false })
						}
					/>
				</View>
			</Modal>
			<View
				style={{
					width: "100%",
					flexDirection: "row",
					justifyContent: "space-evenly",
					alignItems: "center",
					marginBottom: "5%",
				}}
			>
				<Button title="View GLB Model" onPress={() => navigation.navigate("GlbModelViewer")} />
				<Button title="View STL Model" onPress={() => navigation.navigate("StlModelViewer")} />
			</View>
			<View
				style={{
					width: "100%",
					flexDirection: "row",
					justifyContent: "space-evenly",
					alignItems: "center",
				}}
			>
				<Button title="Open GLB Modal" onPress={() => setModalOptions({ modalType: "GLB", isVisible: true })} />
				<Button title="Open STL Modal" onPress={() => setModalOptions({ modalType: "STL", isVisible: true })} />
			</View>
		</View>
	);
};

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen
					name="Home"
					component={HomeScreen}
					options={{ title: "Choose Model Viewer", headerTitleAlign: "center" }}
				/>
				<Stack.Screen name="GlbModelViewer" component={GlbModelViewer} options={{ headerTitleAlign: "center" }} />
				<Stack.Screen name="StlModelViewer" component={StlModelViewer} options={{ headerTitleAlign: "center" }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
