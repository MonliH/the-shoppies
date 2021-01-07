import { HTMLAttributes } from "react";
import styled from "styled-components";

export const CenteredWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const VerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface HorizontalWrapperProps extends HTMLAttributes<HTMLDivElement> {
  breakpoint?: string;
}

export const HorizontalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${(props: HorizontalWrapperProps) =>
    props.breakpoint
      ? `@media (max-width: ${props.breakpoint}) {
    /* Make it work on small screens */
    flex-direction: column;
  }`
      : ""}
`;

export const FullHorizontalWrapper = styled(HorizontalWrapper)`
  height: 100%;
  width: 100%;
`;

export const CenteredHorizontalWrapper = styled(HorizontalWrapper)`
  justify-content: center;
  align-items: center;
`;
