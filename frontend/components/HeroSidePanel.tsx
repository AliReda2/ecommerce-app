"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const HeroSidePanel = () => {
  const [isRight, setIsRight] = useState(false);

  return (
    <motion.div
      className="absolute top-0 h-full w-1/2"
      animate={{ left: isRight ? "50%" : "0%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="relative h-full w-full">
        <Image
          src="/globe.svg"
          alt="Authentication Visual"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button onClick={() => setIsRight(!isRight)}>
            {isRight ? "Register?" : "Sign In?"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSidePanel;
