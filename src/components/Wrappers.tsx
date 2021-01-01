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

export const HorizontalWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FullHorizontalWrapper = styled(HorizontalWrapper)`
  height: 100%;
  width: 100%;
`;
