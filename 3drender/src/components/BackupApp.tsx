// import { Asset } from "expo-asset";
// import { Renderer, THREE } from "expo-three";
// import React, { useRef, useState, useEffect } from "react";
// import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
// import { useHeaderHeight } from "@react-navigation/elements";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { View, PanResponder, Text, Dimensions, ActivityIndicator } from "react-native";

// const GlbModelViewer = () => {
// 	const modelRef = useRef<THREE.Object3D | null>(null);
// 	const initialZoomDistance = useRef<number>(0);
// 	const [zoomDistance, setZoomDistance] = useState<number>(0);
// 	const [modelLoading, setModelLoading] = useState<boolean>(true);
// 	const headerHeight = useHeaderHeight();

// 	const panResponder = useRef(
// 		PanResponder.create({
// 			onMoveShouldSetPanResponder: () => true,
// 			onPanResponderMove: (evt, gestureState) => {
// 				if (!modelRef.current) return;
// 				const touches = evt.nativeEvent.touches;
// 				// Pinch zoom
// 				if (touches.length >= 2) {
// 					const dx = touches[0].pageX - touches[1].pageX;
// 					const dy = touches[0].pageY - touches[1].pageY;
// 					const distance = Math.sqrt(dx * dx + dy * dy);

// 					if (initialZoomDistance.current === 0) {
// 						initialZoomDistance.current = distance;
// 					}

// 					const zoomFactor = 0.01; // Adjust zoom factor
// 					const zoomDelta = (distance - initialZoomDistance.current) * zoomFactor;
// 					setZoomDistance((prevZoomDistance) => prevZoomDistance + zoomDelta);
// 				} else {
// 					const { dx, dy } = gestureState;
// 					// Rotate model
// 					const rotateSpeed = 0.002; // Adjust rotate speed factor
// 					modelRef.current!.rotation.y += dx * rotateSpeed;
// 					modelRef.current!.rotation.x += dy * rotateSpeed;
// 				}
// 			},
// 			onPanResponderEnd: () => {
// 				initialZoomDistance.current = 0;
// 			},
// 		})
// 	).current;

// 	const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
// 		const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
// 		const scene = new THREE.Scene();
// 		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
// 		camera.position.z = 2;

// 		const renderer = new Renderer({ gl });
// 		renderer.setSize(width, height);

// 		// Load model
// 		const asset = Asset.fromModule(require("../../assets/glbModel1.glb"));
// 		await asset.downloadAsync();
// 		const loader = new GLTFLoader();
// 		loader.load(
// 			asset.uri,
// 			(gltf) => {
// 				const model = gltf.scene;
// 				modelRef.current = model;
// 				model.scale.set(1 + zoomDistance, 1 + zoomDistance, 1 + zoomDistance);
// 				scene.add(model);
// 				setModelLoading(false);
// 			},
// 			undefined,
// 			(error) => {
// 				console.error(error);
// 			}
// 		);

// 		// Lighting
// 		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
// 		scene.add(ambientLight);

// 		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// 		directionalLight.position.set(0.5, 0, 0.866);
// 		scene.add(directionalLight);

// 		const render = () => {
// 			requestAnimationFrame(render);

// 			// if (modelRef.current) {
// 			// 	modelRef.current.scale.set(1 + zoomDistance, 1 + zoomDistance, 1 + zoomDistance);
// 			// }

// 			renderer.render(scene, camera);
// 			gl.endFrameEXP();
// 		};
// 		render();
// 	};

// 	useEffect(() => {
// 		if (modelRef.current) {
// 			const zoomFactor = 0.01; // Adjust zoom factor
// 			const updatedScale = 1.0 + zoomDistance * zoomFactor;
// 			modelRef.current.scale.set(updatedScale, updatedScale, updatedScale);
// 		}
// 	}, [zoomDistance]);

// 	return (
// 		<View style={{ flex: 1 }}>
// 			<GLView style={{ flex: 1 }} onContextCreate={onContextCreate} {...panResponder.panHandlers} />
// 			{modelLoading && (
// 				<View
// 					style={{
// 						backgroundColor: "#9a9a9a",
// 						width: Dimensions.get("screen").width,
// 						height: Dimensions.get("screen").height,
// 						justifyContent: "center",
// 						alignItems: "center",
// 						position: "absolute",
// 						top: 0 - headerHeight,
// 						left: 0,
// 					}}
// 				>
// 					<ActivityIndicator size="large" color="white" />
// 					<Text style={{ color: "white", fontSize: 24 }}>Loading 3D model</Text>
// 				</View>
// 			)}
// 		</View>
// 	);
// };

// export default GlbModelViewer;

// import "react-native-gesture-handler";
// import React from "react";
// import { Button, View } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// // import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import GlbModelViewerGlView from "./src/components/GlbModelViewerGlView";
// import StlModelViewerGlView from "./src/components/StlModelViewerGlView";
// import { RootStackParamList, HomeScreenProps } from "./src/types";

// const Stack = createStackNavigator<RootStackParamList>();
// // const Stack = createNativeStackNavigator<RootStackParamList>();

// const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
// 	return (
// 		<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
// 			<Button title="View GLB Model" onPress={() => navigation.navigate("GlbModelViewerGlView")} />
// 			<Button title="View STL Model" onPress={() => navigation.navigate("StlModelViewerGlView")} />
// 		</View>
// 	);
// };

// export default function App() {
// 	return (
// 		<NavigationContainer>
// 			<Stack.Navigator initialRouteName="Home">
// 				<Stack.Screen name="Home" component={HomeScreen} options={{ title: "Choose Model Viewer" }} />
// 				<Stack.Screen name="GlbModelViewerGlView" component={GlbModelViewerGlView} />
// 				<Stack.Screen name="StlModelViewerGlView" component={StlModelViewerGlView} />
// 			</Stack.Navigator>
// 		</NavigationContainer>
// 	);
// }

// import React, { Suspense } from "react";
// import { Canvas, useFrame } from "@react-three/fiber/native";
// import { useGLTF } from "@react-three/drei/native";

// import modelPath from "./assets/glbModel1.glb";

// function Model(props: any) {
// 	const gltf = useGLTF(modelPath);
// 	useFrame(() => (gltf.scene.rotation.y += 0.05));
// 	return <primitive {...props} object={gltf.scene} scale={[5, 5, 5]} />;
// }

// export default function App() {
// 	return (
// 		<Canvas>
// 			<ambientLight />
// 			<Suspense>
// 				<Model />
// 			</Suspense>
// 		</Canvas>
// 	);
// }

// import React, { useRef, useState } from "react";
// import { Canvas, useFrame, ThreeElements } from "@react-three/fiber/native";
// import * as THREE from "three";

// function Box(props: ThreeElements["mesh"]) {
// 	const meshRef = useRef<THREE.Mesh>(null!);
// 	const [hovered, setHover] = useState(false);
// 	const [active, setActive] = useState(false);

// 	useFrame((state, delta) => (meshRef.current!.rotation.x += delta));

// 	return (
// 		<mesh
// 			{...props}
// 			ref={meshRef}
// 			scale={active ? 1.5 : 1}
// 			onClick={(event) => setActive(!active)}
// 			onPointerOver={(event) => setHover(true)}
// 			onPointerOut={(event) => setHover(false)}
// 		>
// 			<boxGeometry args={[0.8, 0.8, 0.8]} />
// 			<meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
// 		</mesh>
// 	);
// }

// export default function App() {
// 	return (
// 		<Canvas>
// 			<ambientLight intensity={Math.PI / 2} />
// 			<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
// 			<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
// 			<Box position={[-0.7, 0, 0]} />
// 			<Box position={[0.7, 0, 0]} />
// 		</Canvas>
// 	);
// }

// Regi fajta

// import React, { useRef, useState, Suspense, forwardRef, useEffect } from "react";
// import {
// 	View,
// 	PanResponder,
// 	GestureResponderEvent,
// 	PanResponderGestureState,
// 	Text,
// 	Dimensions,
// 	ActivityIndicator,
// } from "react-native";
// import { Canvas, useFrame } from "@react-three/fiber/native";
// import { Environment, useGLTF, useProgress } from "@react-three/drei/native";
// import * as THREE from "three";

// import iphoneModelPath from "../../assets/iphone.glb";
// import modelPath from "../../assets/glbModel1.glb";

// type ModelProps = {
// 	url: string;
// 	scale?: number[];
// 	onModelLoaded: () => void;
// };

// const Model = forwardRef<THREE.Object3D, ModelProps>(({ url, onModelLoaded, ...rest }, ref) => {
// 	const { progress, active, errors, item, loaded, total } = useProgress();
// 	console.log({ active, progress, errors, item, loaded, total });

// 	useEffect(() => {
// 		if (progress === 100) {
// 			onModelLoaded();
// 		}
// 	}, [progress]);

// 	const { scene } = useGLTF(url);
// 	// useFrame(() => (scene.rotation.y += 0.01));
// 	return <primitive ref={ref} {...rest} object={scene} scale={rest.scale as number[]} />;
// });

// const GlbModelViewer = () => {
// 	const modelRef = useRef<THREE.Object3D>(null);
// 	const initialZoomDistance = useRef<number>(0);
// 	const [zoomDistance, setZoomDistance] = useState<number>(0);
// 	const [modelLoading, setModelLoading] = useState<boolean>(true);

// 	// useEffect(() => {
// 	// 	console.log({ zoomDistance });
// 	// }, [zoomDistance]);

// 	const panResponder = useRef(
// 		PanResponder.create({
// 			onMoveShouldSetPanResponder: () => true,
// 			onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
// 				const { dx, dy } = gestureState;

// 				// Rotate model
// 				const rotateSpeed = 0.002; // Adjust the rotate speed factor
// 				modelRef.current!.rotation.y += dx * rotateSpeed;
// 				modelRef.current!.rotation.x += dy * rotateSpeed;

// 				// Pinch zoom
// 				const touches = e.nativeEvent.touches;
// 				if (touches.length >= 2) {
// 					const dx = touches[0].pageX - touches[1].pageX;
// 					const dy = touches[0].pageY - touches[1].pageY;
// 					const distance = Math.sqrt(dx * dx + dy * dy);

// 					if (initialZoomDistance.current === 0) {
// 						initialZoomDistance.current = distance;
// 					}

// 					const zoomFactor = 0.01;
// 					const zoomDelta = (distance - initialZoomDistance.current) * zoomFactor;
// 					console.log({ zoomDelta, distance });
// 					setZoomDistance((prevZoomDistance) => prevZoomDistance + zoomDelta);
// 				}
// 			},
// 			onPanResponderEnd: () => {
// 				initialZoomDistance.current = 0;
// 				// setZoomDistance(0);
// 			},
// 		})
// 	).current;

// 	return (
// 		<View style={{ flex: 1 }} {...panResponder.panHandlers}>
// 			<Canvas>
// 				<color attach="background" args={["darkgrey"]} />
// 				<ambientLight />
// 				<directionalLight intensity={1.1} position={[0.5, 0, 0.866]} />
// 				<directionalLight intensity={0.8} position={[-6, 2, 2]} />
// 				<Suspense fallback={null}>
// 					{/* <Suspense fallback={<Test />}> */}
// 					<Environment preset="park" />
// 					<Model
// 						ref={modelRef}
// 						url={modelPath}
// 						scale={[1 + zoomDistance, 1 + zoomDistance, 1 + zoomDistance]}
// 						onModelLoaded={() => setModelLoading(false)}
// 					/>
// 					{/* <Model ref={modelRef} url={modelPath} /> */}
// 				</Suspense>
// 			</Canvas>
// 			{modelLoading && (
// 				<View
// 					style={{
// 						backgroundColor: "#9a9a9a",
// 						width: Dimensions.get("screen").width,
// 						height: Dimensions.get("screen").height,
// 						justifyContent: "center",
// 						alignItems: "center",
// 						position: "absolute",
// 						top: 0,
// 						left: 0,
// 					}}
// 				>
// 					<ActivityIndicator size="large" color="white" />
// 					<Text style={{ color: "white", fontSize: 24 }}>Loading 3D model</Text>
// 				</View>
// 			)}
// 		</View>
// 	);
// };

// export default GlbModelViewer;
