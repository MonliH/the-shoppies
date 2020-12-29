import React, { ReactNode } from "react";
import { useSpring, animated } from "react-spring";

const AnimatedElement = ({
  visible,
  height,
  children,
}: {
  visible: boolean;
  height: string;
  children: ReactNode;
}) => {
  const opacityProp = useSpring({
    opacity: visible ? 1 : 0,
    config: { mass: 15, tension: 110, friction: 30 },
  });
  const heightProp = useSpring({
    height: visible ? height : "0px",
    config: { mass: 5, tension: 150, friction: 30 },
  });
  return (
    <animated.span
      style={
        { ...opacityProp, ...heightProp } as any
        // The `as any` cast is required because of a bug in react-spring.
        // See this https://github.com/react-spring/react-spring/issues/1102
      }
    >
      {children}
    </animated.span>
  );
};

export default AnimatedElement;
