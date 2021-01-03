import React, { ReactNode, useState, useEffect } from "react";
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

export const StyledPadding = styled.div`
  ${shared}
  background-color: ${(props) => props.theme.backgroundOne};
`;

// For use with react spring
export const AnimatedStyledPadding = styled(animated.div)`
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
  box-shadow: 2px 2px 5px 1px #EBEBEB;
  border-radius: 1px;
  font: 13px ${fontSans};
`;

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled?: boolean;
  hoverColor?: [string, string];
}

export const Button = ({
  children,
  disabled,
  hoverColor,
  ...props
}: ButtonProps) => {
  const [hover, setHover] = useState<boolean>(false);

  const style = useSpring({
    backgroundColor: hoverColor
      ? hover
        ? hoverColor[1]
        : hoverColor[0]
      : hover
      ? "#DEDEDE"
      : "#F7F7F7",
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
      {...props}
      style={
        { ...props.style, ...style } as any // Again, a bug in react spring: https://github.com/react-spring/react-spring/issues/1102
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
