import React, { useRef, useState, useEffect } from "react";
import { PanResponder, View, Dimensions, ActivityIndicator, Text } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { Asset } from "expo-asset";

export default function App() {
	const glRef = useRef();
	const sceneRef = useRef();
	const cameraRef = useRef();
	const modelRef = useRef();
	const initialZoomDistance = useRef(0);
	const [zoomDistance, setZoomDistance] = useState(0);
	const [modelLoading, setModelLoading] = useState(null);

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (evt, gestureState) => {
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
					modelRef.current.rotation.y += dx * rotateSpeed;
					modelRef.current.rotation.x += dy * rotateSpeed;
				}
			},
			onPanResponderEnd: () => {
				initialZoomDistance.current = 0;
			},
		})
	).current;

	const onContextCreate = async (gl) => {
		glRef.current = gl;

		const scene = new THREE.Scene();
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
		cameraRef.current = camera;

		const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(1, 1, 1).normalize();
		scene.add(directionalLight);

		const asset = Asset.fromModule(require("./assets/model2.stl"));
		await asset.downloadAsync();

		const loader = new STLLoader();
		setModelLoading(true);
		loader.load(asset.uri, (geometry) => {
			const material = new THREE.MeshStandardMaterial({ color: "#9A9A9A" });
			const mesh = new THREE.Mesh(geometry, material);

			geometry.computeBoundingBox();
			const boundingBox = geometry.boundingBox;
			const modelSize = boundingBox.max.clone().sub(boundingBox.min);
			const modelCenter = boundingBox.min.clone().add(modelSize.clone().multiplyScalar(0.5));

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
			<GLView style={{ flex: 1 }} onContextCreate={onContextCreate} {...panResponder.panHandlers} />
			{modelLoading && (
				<View
					style={{
						backgroundColor: "#9a9a9a",
						width: Dimensions.get("screen").width,
						height: Dimensions.get("screen").height,
						justifyContent: "center",
						alignItems: "center",
						position: "absolute",
						top: 0,
						left: 0,
					}}
				>
					<ActivityIndicator size="large" color="white" />
					<Text style={{ color: "white", fontSize: 24 }}>Loading 3D model</Text>
				</View>
			)}
		</View>
	);
}
