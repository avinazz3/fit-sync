import React, { Suspense, useRef } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

interface BodyModelViewerProps {
  modelUrl: string;
}

const Model = ({ url }: { url: string }) => {
  console.log("[BodyModelViewer] Model component rendering. URL:", url);
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    const dracoLoader = new DRACOLoader();
    // Path to the Draco decoder files. Using a common CDN path.
    // You might need to host these files yourself or ensure this path is accessible.
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/");
    loader.setDRACOLoader(dracoLoader);
  });
  console.log("[BodyModelViewer] GLTF loaded successfully:", gltf);
  const modelRef = useRef<THREE.Group>(null);
  // It's good practice to clone the scene if you might reuse the loaded gltf object elsewhere
  // or if you're applying modifications that shouldn't affect a cached version.
  const scene = React.useMemo(() => gltf.scene.clone(), [gltf]);

  React.useEffect(() => {
    console.log("[BodyModelViewer] Model useEffect for centering/scaling triggered.");
    if (scene) {
      console.log("[BodyModelViewer] Scene exists. Proceeding with centering/scaling.");
      // Ensure the model is visible and centered
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      let scale = 1;
      if (maxDim > 0) { // Prevent division by zero or NaN if model is empty or flat
        scale = 2 / maxDim; // Scale to fit a 2x2x2 box for consistent sizing
      }
      console.log("[BodyModelViewer] Calculated scale:", scale, "maxDim:", maxDim);

      scene.position.sub(center); 
      scene.scale.set(scale, scale, scale); 
      console.log("[BodyModelViewer] Scene position after centering:", scene.position);
      console.log("[BodyModelViewer] Scene scale after setting:", scene.scale);
    } else {
      console.log("[BodyModelViewer] Scene missing for centering/scaling.");
    }
  }, [scene]);

  React.useEffect(() => {
    console.log("[BodyModelViewer] Model useEffect for material properties and mesh logging triggered.");
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log("[BodyModelViewer] Traversing mesh - Name:", child.name, "; ID:", child.uuid, "; Material:", child.material.name || child.material.type);
          child.castShadow = true;
          child.receiveShadow = true; 

          if (child.name === "Cube") {
            console.log("[BodyModelViewer] Hiding 'Cube' mesh.");
            child.visible = false;
          } else if (child.name === "ecorche-by-Dmitry-Fedorov") {
            console.log("[BodyModelViewer] Applying MeshBasicMaterial (red) to ecorche-by-Dmitry-Fedorov");
            child.material = new THREE.MeshBasicMaterial({ color: "red" });
          }
          
          if (Array.isArray(child.material)) {
            console.log("[BodyModelViewer] Mesh has an array of materials:", child.name);
            child.material.forEach((material, index) => {
              // (material as THREE.MeshStandardMaterial).metalness = 0.2;
            });
          } else {
            // (child.material as THREE.MeshStandardMaterial).metalness = 0.2;
          }
        }
      });
    }
  }, [scene]);

  return <primitive object={scene} ref={modelRef} />;
};

const BodyModelViewer: React.FC<BodyModelViewerProps> = ({ modelUrl }) => {
  console.log("[BodyModelViewer] BodyModelViewer component rendering. URL:", modelUrl);
  return (
    <Canvas 
        camera={{ position: [0, 0.5, 3], fov: 50 }} 
        style={{ background: "#f0f0f0" }} 
        shadows 
    >
      <ambientLight intensity={3.0} /> {/* Strong ambient light only */}
      {/* <directionalLight 
        position={[1, 2, 1.5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      /> 
      <directionalLight 
        position={[-1, 1, -1.5]} 
        intensity={0.8} 
        color="blue" 
      /> */}
      <Suspense fallback={<Html center><p className="text-foreground">Loading 3D Model...</p></Html>}>
        <ErrorBoundary fallback={<Html center><p className={'text-red-500 text-center'}>Model Error.<br/>Check console.</p></Html>}>
          <Model url={modelUrl} />
        </ErrorBoundary>
      </Suspense>
      <OrbitControls 
        enableZoom={true}
        enablePan={true} 
        minDistance={1} 
        maxDistance={10} 
      />
    </Canvas>
  );
};

export default BodyModelViewer;
