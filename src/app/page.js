"use client";
import './page.css'
import React from 'react';
import { motion } from "framer-motion"
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useRef, useLayoutEffect } from "react";
import { useTransform, useScroll, useTime } from "framer-motion";
import { degreesToRadians, progress, mix } from "popmotion";
import toast from "./toast.png";
import Image from 'next/image'

  const color = "#111111";
  const Icosahedron = () => (
    <mesh rotation-x={0.35}>
      <torusKnotGeometry args={[1, 0]} />
      <meshBasicMaterial wireframe color={color} />
    </mesh>
  );

  const Star = ({ p }) => {
    const ref = useRef(null);
  
    useLayoutEffect(() => {
      const distance = mix(2, 3.5, Math.random());
      const yAngle = mix(
        degreesToRadians(80),
        degreesToRadians(100),
        Math.random()
      );
      const xAngle = degreesToRadians(360) * p;
      ref.current.position.setFromSphericalCoords(distance, yAngle, xAngle);
    });
  
    return (
      React.createElement("mesh", { ref: ref },
        React.createElement("boxGeometry", { args: [0.05, 0.05, 0.05] }),
        React.createElement("meshBasicMaterial", { wireframe: true, color: color })
      )
    );
  };
  
  function Scene({ numStars = 100 }) {
    const gl = useThree((state) => state.gl);
    const { scrollYProgress } = useScroll();
    const yAngle = useTransform(
      scrollYProgress,
      [0, 1],
      [0.001, degreesToRadians(180)]
    );
    const distance = useTransform(scrollYProgress, [0, 1], [10, 3]);
    const time = useTime();
  
    useFrame(({ camera }) => {
      camera.position.setFromSphericalCoords(
        distance.get(),
        yAngle.get(),
        time.get() * 0.0005
      );
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);
    });
  
    useLayoutEffect(() => gl.setPixelRatio(0.3));
  
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push(React.createElement(Star, { p: progress(0, numStars, i) }));
    }
  
    return (
      React.createElement(React.Fragment, null,
        React.createElement(Icosahedron, null),
        stars
      )
    );
  }
  export default function Home() {
  return (
    <main className='main'>
      <motion.div 
        initial={{opacity:0, y:-50}}
        animate={{opacity:1, y:0}}
        transition={{duration:2}}>
        <div className='title'>my tummy rlly hurts</div>
      </motion.div>


    <div className="container">
      <Canvas gl={{ antialias: false }}>
        <Scene />
      </Canvas>
    </div>
    <a href="https://mrasco.cool/" target="_blank" rel="noreferrer">
            <Image className='icon'
               src={toast}
               alt="toast"
                width={75}
                height={75}
              />
      </a>

    </main>
  )
}
