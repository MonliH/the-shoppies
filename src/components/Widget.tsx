import React, { HTMLAttributes, ReactNode, useState, useEffect } from "react";
import styled from "styled-components";
import { animated, useSpring } from "react-spring";

import { fontSans } from "components/Text";

const shared = `
  width: fit-content;
  height: fit-content;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 5px 3px 7px 1px #F2F2F2;
  margin-bottom: 15px;
`;

export const Paper = styled.div`
  ${shared}
  background-color: ${(props) => props.theme.backgroundOne};
`;

// For use with react spring
export const AnimatedPaper = styled(animated.div)`
  ${shared}
  background-color: ${(props) => props.theme.backgroundOne};
`;

const ButtonStyle = styled(animated.button)`
  width: fit-content;
  height: fit-content;
  padding: 6px 7px;
  margin-top: 5px;
  background-color: white;
  border: 1px solid #b3b3b3;
  border-radius: 1px;
  font: 13px ${fontSans};
  cursor: pointer;
`;

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled?: boolean;
  hoverColor?: [string, string];
}

export const Button = ({
  children,
  disabled,
  hoverColor = ["#EFEFEF", "#F9F9F9"],
  style,
  ...props
}: ButtonProps) => {
  const [hover, setHover] = useState<boolean>(false);

  const hoverShadow = hover ? 7 : 4;

  const hoverStyles = useSpring({
    backgroundColor: hover || disabled ? hoverColor[1] : hoverColor[0],
    color: disabled ? "#6A6A6A" : "black",
    shadow: disabled ? 0.5 : hoverShadow,
  });

  useEffect(() => {
    if (!disabled && hover) {
      setHover(false);
    }
  }, [disabled]);

  return (
    <ButtonStyle
      disabled={disabled}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      style={
        {
          ...style,
          ...hoverStyles,
          boxShadow: hoverStyles.shadow.to(
            (s) => `${s / 2}px ${s / 2}px ${s}px ${s / 4}px #ebebeb`
          ),
        } as any // Again, a bug in react spring: https://github.com/react-spring/react-spring/issues/1102
      }
    >
      {children}
    </ButtonStyle>
  );
};

interface RemoveButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  marginTop: number;
  marginRight: number;
}

export const RemoveButton = styled.button`
  border: none;
  background: transparent;
  position: absolute;
  top: 0;
  right: 0;
  margin-top: ${(props: RemoveButtonProps) => props.marginTop}px;
  margin-right: ${(props: RemoveButtonProps) => props.marginRight}px;
  cursor: pointer;
`;

export const BigButton = styled(Button)`
  font-size: 20px;
`;
