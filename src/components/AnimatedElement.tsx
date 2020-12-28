import React, { ReactNode } from "react";
import { useSpring, animated } from "react-spring";

const AnimatedElement = ({
  visible,
  children,
}: {
  visible: boolean;
  children: ReactNode;
}) => {
  const style = useSpring({
    opacity: visible ? 1 : 0,
    height: visible ? "fit-content" : 0,
    config: { mass: 15, tension: 110, friction: 30 },
  });
  return (
    <animated.span
      style={
        style as any
        // The `as any` cast is required because of a bug in react-spring.
        // See this https://github.com/react-spring/react-spring/issues/1102
      }
    >
      {children}
    </animated.span>
  );
};

export default AnimatedElement;
