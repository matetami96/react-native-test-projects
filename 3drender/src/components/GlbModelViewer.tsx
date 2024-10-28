import * as THREE from "three";
import { View } from "react-native";
import { useGLTF } from "@react-three/drei/native";
import useControls from "r3f-native-orbitcontrols";
import { Canvas } from "@react-three/fiber/native";
import React, { Suspense, forwardRef } from "react";

import modelPath from "../../assets/glbModel1.glb";

const Model = forwardRef<THREE.Object3D>(({ ...rest }, ref) => {
	// console.log("rendering model");
	const gltf = useGLTF(modelPath);

	React.useEffect(() => {
		// Function to recursively traverse and apply material to meshes
		const applyMaterial = (object: THREE.Object3D) => {
			if (object instanceof THREE.Mesh) {
				object.material = new THREE.MeshStandardMaterial({ color: "#9A9A9A" });
			}
			if (object.children) {
				object.children.forEach((child) => applyMaterial(child));
			}
		};

		// Traverse the GLTF scene and apply material to meshes
		if (gltf.scene) {
			applyMaterial(gltf.scene);
		}
	}, [gltf]);

	// console.log("rendered model", { gltf });
	return <primitive {...rest} ref={ref} object={gltf.scene} />;
});

const GlbModelViewer = () => {
	const [OrbitControls, events] = useControls();

	return (
		<View style={{ flex: 1 }} {...events}>
			<Canvas camera={{ fov: 10 }}>
				<color attach="background" args={["white"]} />
				<ambientLight intensity={Math.PI / 2} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
				<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
				<Suspense fallback={null}>
					<Model />
				</Suspense>
				<OrbitControls enableZoom={true} enableRotate={true} enablePan={true} />
			</Canvas>
		</View>
	);
};

export default GlbModelViewer;
