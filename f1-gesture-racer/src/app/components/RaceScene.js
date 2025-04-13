import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { Physics } from "@react-three/rapier";


const BahrainTrack = () => {
    const { scene } = useGLTF("/models/bahrain.glb");
    return <RigidBody type="fixed" colliders="trimesh">
        <primitive object={scene} scale={1.5} position={[75, 0.5, -20]} rotation={[0, 23.5, 0]} />
    </RigidBody>
};

const F1Car = ({ speed, steering }) => {
    const { scene } = useGLTF("/models/f1car.glb");
    const rigidRef = useRef();
    const { camera } = useThree();

    useFrame(() => {
        const body = rigidRef.current;
        if (!body || !body.rotation || !body.translation) return;

        // Get car transform
        const pos = body.translation();
        const rot = body.rotation();

        if (!rot || isNaN(rot.x)) return; // safety guard

        // Compute forward direction from quaternion
        const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quat);

        // Apply forward movement via impulse
        if (speed > 0.5) {
            const velocity = forward.multiplyScalar(speed / 10); // or /40, tune to feel
            body.setLinvel(velocity, true);
        }

        // Apply turning
        body.setAngvel({ x: 0, y: steering / 30, z: 0 }, true);

        // Camera positioning
        const chaseOffset = new THREE.Vector3(0, 3, 10).applyQuaternion(quat);
        const camTarget = new THREE.Vector3(pos.x, pos.y, pos.z).add(chaseOffset);

        if (!isNaN(camTarget.x)) {
            camera.position.lerp(camTarget, 0.1);
            camera.lookAt(new THREE.Vector3(pos.x, pos.y, pos.z));
        }
    });

    return (
        <RigidBody
            ref={rigidRef}
            type="dynamic"
            colliders="cuboid"
            mass={1}
            linearDamping={1.5}
            angularDamping={1.5}
            enabledRotations={[false, true, false]}
            position={[10, 12.5, 60]}
        >
            <primitive object={scene} scale={0.05} />
        </RigidBody>
    );
};

const RaceScene = ({ speed, steering }) => {
    return (
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>

            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <Physics gravity={[0, -9.81, 0]}>
                <BahrainTrack />
                <F1Car speed={speed} steering={steering} />
            </Physics>

            <OrbitControls />
        </Canvas>
    );
};

export default RaceScene;
