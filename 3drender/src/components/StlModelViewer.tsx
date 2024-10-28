import useControls from "r3f-native-orbitcontrols";
import React, { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { Canvas, useLoader } from "@react-three/fiber/native";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { ActivityIndicator, View, Dimensions, Text } from "react-native";

type Props = {
	path: string;
};

const StlModel = ({ path }: Props) => {
	const geometry = useLoader(STLLoader, path);

	return (
		<mesh geometry={geometry}>
			<meshStandardMaterial color="#9A9A9A" />
		</mesh>
	);
};

const StlModelViewer = () => {
	const headerHeight = useHeaderHeight();
	const [modelLoading, setModelLoading] = useState(true);
	const [OrbitControls, events] = useControls();

	useEffect(() => {
		const loadModel = async () => {
			// Simulate model loading delay
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setModelLoading(false);
		};
		loadModel();
	}, []);

	return (
		<View style={{ flex: 1 }} {...events}>
			<Canvas camera={{ position: [Dimensions.get("screen").width / 2, 0, 300], fov: 75 }}>
				<color attach="background" args={["white"]} />
				<ambientLight intensity={2} />
				<directionalLight position={[1, 1, 1]} intensity={1} />
				<StlModel path={require("../../assets/stlModel1.stl")} />
				<OrbitControls enableZoom={true} enableRotate={true} enablePan={true} />
			</Canvas>
			{modelLoading && (
				<View
					style={{
						backgroundColor: "#9a9a9a",
						width: Dimensions.get("screen").width,
						height: Dimensions.get("screen").height,
						justifyContent: "center",
						alignItems: "center",
						position: "absolute",
						top: 0 - headerHeight,
						left: 0,
					}}
				>
					<ActivityIndicator size="large" color="white" />
					<Text style={{ color: "white", fontSize: 24 }}>Loading 3D model</Text>
				</View>
			)}
		</View>
	);
};

export default StlModelViewer;

/* import React, { useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber/native";
import * as THREE from "three";

function Box(props: ThreeElements["mesh"]) {
	const meshRef = useRef<THREE.Mesh>(null!);
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);

	useFrame((state, delta) => (meshRef.current!.rotation.x += delta));

	return (
		<mesh
			{...props}
			ref={meshRef}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}
		>
			<boxGeometry args={[0.8, 0.8, 0.8]} />
			<meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
		</mesh>
	);
}

export default function App() {
	return (
		<Canvas>
			<ambientLight intensity={Math.PI / 2} />
			<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
			<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
			<Box position={[-0.7, 0, 0]} />
			<Box position={[0.7, 0, 0]} />
		</Canvas>
	);
} */

/* import { GLView } from "expo-gl";
import { Asset } from "expo-asset";
import { Renderer, THREE } from "expo-three";
import { ExpoWebGLRenderingContext } from "expo-gl";
import React, { useRef, useState, useEffect } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { PanResponder, View, Dimensions, ActivityIndicator, Text } from "react-native";

const StlModelViewer = () => {
	const modelRef = useRef<THREE.Object3D | null>(null);
	const initialZoomDistance = useRef(0);
	const [zoomDistance, setZoomDistance] = useState(0);
	const [modelLoading, setModelLoading] = useState<boolean | null>(null);
	const headerHeight = useHeaderHeight();

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (evt, gestureState) => {
				if (!modelRef.current) return;
				const touches = evt.nativeEvent.touches;
				// Pinch zoom
				if (touches.length >= 2) {
					const dx = touches[0].pageX - touches[1].pageX;
					const dy = touches[0].pageY - touches[1].pageY;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (initialZoomDistance.current === 0) {
						initialZoomDistance.current = distance;
					}

					const zoomFactor = 0.01; // Adjust zoom factor
					const zoomDelta = (distance - initialZoomDistance.current) * zoomFactor;
					setZoomDistance((prevZoomDistance) => prevZoomDistance + zoomDelta);
				} else {
					const { dx, dy } = gestureState;
					// Rotate model
					const rotateSpeed = 0.002; // Adjust rotate speed factor
					modelRef.current!.rotation.y += dx * rotateSpeed;
					modelRef.current!.rotation.x += dy * rotateSpeed;
				}
			},
			onPanResponderEnd: () => {
				initialZoomDistance.current = 0;
			},
		})
	).current;

	const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
		const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(1, 1, 1).normalize();

		scene.add(ambientLight);
		scene.add(directionalLight);

		const asset = Asset.fromModule(require("../../assets/stlModel1.stl"));
		await asset.downloadAsync();

		const loader = new STLLoader();
		setModelLoading(true);
		loader.load(asset.uri, (geometry) => {
			const material = new THREE.MeshStandardMaterial({ color: "#9A9A9A" });
			const mesh = new THREE.Mesh(geometry, material);

			geometry.computeBoundingBox();
			const boundingBox = geometry.boundingBox;
			const modelSize = boundingBox!.max.clone().sub(boundingBox!.min);
			const modelCenter = boundingBox!.min.clone().add(modelSize.clone().multiplyScalar(0.5));

			scene.add(mesh);
			modelRef.current = mesh;

			// Adjust initial scale based on model size and zoomDistance
			const zoomFactor = 0.01; // Adjust zoom factor
			const initialScale = 1.0 - zoomDistance * zoomFactor; // Adjust scale based on zoomDistance

			mesh.scale.set(initialScale, initialScale, initialScale);
			camera.position.copy(modelCenter).add(new THREE.Vector3(0, 0, 300)); // Adjust camera position

			// Rendering setup (unchanged)
			const renderer = new Renderer({ gl });
			renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

			const render = () => {
				requestAnimationFrame(render);
				renderer.render(scene, camera);
				setModelLoading(false);
				gl.endFrameEXP();
			};
			render();
		});
	};

	// Update scale dynamically when zoomDistance changes
	useEffect(() => {
		if (modelRef.current) {
			const zoomFactor = 0.01; // Adjust zoom factor
			const updatedScale = 1.0 + zoomDistance * zoomFactor;
			modelRef.current.scale.set(updatedScale, updatedScale, updatedScale);
		}
	}, [zoomDistance]);

	return (
		<View style={{ flex: 1 }}>
			<GLView
				style={{ flex: 1 }}
				onContextCreate={onContextCreate}
				{...(modelLoading ? {} : panResponder.panHandlers)}
			/>
			{modelLoading && (
				<View
					style={{
						backgroundColor: "#9a9a9a",
						width: Dimensions.get("screen").width,
						height: Dimensions.get("screen").height,
						justifyContent: "center",
						alignItems: "center",
						position: "absolute",
						top: 0 - headerHeight,
						left: 0,
					}}
				>
					<ActivityIndicator size="large" color="white" />
					<Text style={{ color: "white", fontSize: 24 }}>Loading 3D model</Text>
				</View>
			)}
		</View>
	);
};

export default StlModelViewer;
 */
