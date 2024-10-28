import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import {
	AccessToken,
	GraphRequest,
	GraphRequestManager,
	LoginButton,
	Settings,
	ShareDialog,
	ShareLinkContent,
} from "react-native-fbsdk-next";

export default function App() {
	useEffect(() => {
		const requestTracking = async () => {
			const { status } = await requestTrackingPermissionsAsync();

			Settings.initializeSDK();

			if (status === "granted") {
				await Settings.setAdvertiserTrackingEnabled(true);
			}
		};

		requestTracking();
	}, []);

	const getData = () => {
		const infoRequest = new GraphRequest("/me", undefined, (error, result) => {
			console.log(error || result);
		});
		new GraphRequestManager().addRequest(infoRequest).start();
	};

	const shareLink = async () => {
		const content = {
			contentType: "link",
			contentUrl: "https://www.youtube.com/channel/UCwJWXcI12lhcorzG7Vrf2zw",
		};

		const canShow = await ShareDialog.canShow(content as ShareLinkContent);

		if (canShow) {
			try {
				const { isCancelled, postId } = await ShareDialog.show(content as ShareLinkContent);

				if (isCancelled) {
					console.log("Share cancelled");
				} else {
					console.log("Share success with postId: " + postId);
				}
			} catch (e) {
				console.log("Share fail with error: " + e);
			}
		}
	};

	return (
		<View style={styles.container}>
			<LoginButton
				onLogoutFinished={() => console.log("Logged out")}
				onLoginFinished={(error, data) => {
					console.log(error || data);
					AccessToken.getCurrentAccessToken().then((data) => {
						console.log(data);
					});
				}}
			/>
			<Button title="Get Data" onPress={getData} />
			<Button title="Share Link" onPress={shareLink} />
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
