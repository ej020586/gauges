import { useEffect } from "react";
import { useAnimation } from "motion/react";

export const useNeedleAnimation = (angle: number) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      rotate: angle,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.5,
      },
    });
  }, [angle, controls]);

  return controls;
};
