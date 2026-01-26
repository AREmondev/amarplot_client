"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, Text, Box } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw, Settings, Home, Bed, Bath } from "lucide-react"
import type * as THREE from "three"

interface ModelViewer3DProps {
  modelUrl: string
}

// 3D House Component
function House({ position = [0, 0, 0] }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Foundation */}
      <Box args={[4, 0.2, 3]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#8B7355" />
      </Box>

      {/* Main Structure */}
      <Box args={[4, 2, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#E8E8E8" />
      </Box>

      {/* Roof */}
      <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[2.5, 1.5, 4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Door */}
      <Box args={[0.8, 1.5, 0.1]} position={[0, -0.25, 1.55]}>
        <meshStandardMaterial color="#654321" />
      </Box>

      {/* Windows */}
      <Box args={[0.8, 0.8, 0.1]} position={[-1.2, 0.3, 1.55]}>
        <meshStandardMaterial color="#87CEEB" />
      </Box>
      <Box args={[0.8, 0.8, 0.1]} position={[1.2, 0.3, 1.55]}>
        <meshStandardMaterial color="#87CEEB" />
      </Box>

      {/* Side Windows */}
      <Box args={[0.1, 0.8, 0.8]} position={[2.05, 0.3, 0]}>
        <meshStandardMaterial color="#87CEEB" />
      </Box>
      <Box args={[0.1, 0.8, 0.8]} position={[-2.05, 0.3, 0]}>
        <meshStandardMaterial color="#87CEEB" />
      </Box>

      {/* Property Info Labels */}
      <Html position={[0, 2.5, 0]} center>
        <div className="bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <Bed className="h-4 w-4" />
            <span>3 Beds</span>
            <Bath className="h-4 w-4" />
            <span>2 Baths</span>
          </div>
        </div>
      </Html>
    </group>
  )
}

// Room Interior Component
function RoomInterior() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Floor */}
      <Box args={[3.8, 0.1, 2.8]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#D2B48C" />
      </Box>

      {/* Furniture - Sofa */}
      <Box args={[1.5, 0.4, 0.8]} position={[-1, -0.2, 0.5]}>
        <meshStandardMaterial color="#4682B4" />
      </Box>

      {/* Table */}
      <Box args={[0.8, 0.6, 0.5]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Bed */}
      <Box args={[1.2, 0.3, 2]} position={[1, -0.35, -0.5]}>
        <meshStandardMaterial color="#DC143C" />
      </Box>
    </group>
  )
}

// Loading Component
function LoadingSpinner() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.05
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1, 0.3, 8, 20]} />
      <meshStandardMaterial color="#0ea5e9" />
    </mesh>
  )
}

export function ModelViewer3D({ modelUrl }: ModelViewer3DProps) {
  const [showInterior, setShowInterior] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  const resetCamera = () => {
    // Reset camera position logic would go here
    console.log("Resetting camera position")
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-br from-sky-100 to-blue-50 h-96 rounded-lg overflow-hidden">
          <Canvas camera={{ position: [8, 5, 8], fov: 60 }} shadows>
            <Suspense fallback={<LoadingSpinner />}>
              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[-10, -10, -10]} intensity={0.3} />

              {/* Environment */}
              <Environment preset="city" />

              {/* 3D Model */}
              <House />

              {/* Interior (conditionally rendered) */}
              {showInterior && <RoomInterior />}

              {/* Ground */}
              <mesh receiveShadow position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#90EE90" />
              </mesh>

              {/* Controls */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={autoRotate}
                autoRotateSpeed={1}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
              />

              {/* Property Information */}
              <Text
                position={[0, 4, 0]}
                fontSize={0.5}
                color="#1e40af"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Inter_Regular.json"
              >
                3BHK Luxury Apartment
              </Text>
            </Suspense>
          </Canvas>

          {/* 3D Controls */}
          <div className="absolute top-4 right-4">
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={resetCamera}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={() => setAutoRotate(!autoRotate)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={() => setShowInterior(!showInterior)}
              >
                <Home className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Model Info */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-black/70 backdrop-blur rounded-lg px-3 py-2 text-white text-sm">
              <div>Click and drag to rotate</div>
              <div>Scroll to zoom • Double-click to focus</div>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-white hover:bg-white/20"
                  onClick={() => setShowInterior(!showInterior)}
                >
                  {showInterior ? "Hide Interior" : "Show Interior"}
                </Button>
              </div>
            </div>
          </div>

          {/* Loading Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center opacity-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <div className="text-sm font-medium">Loading 3D Model...</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
