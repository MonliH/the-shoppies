import React, { useState } from "react";
import styled from "styled-components";
import { animated, useTransition } from "react-spring";
import { X } from "react-feather";

import { fontSans } from "components/Text";
import { RemoveButton } from "components/Widget";

const Counter = styled(animated.div)`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: auto;
  background-image: linear-gradient(130deg, #00b4e6, #00f0e0);
  height: 5px;
`;

const Notification = styled(animated.div)`
  background-color: #1a1a1a;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  width: 500px;
  position: relative;
  @media (max-width: 600px) {
    width: 90%;
  }
  border-radius: 4px;
  overflow: hidden;
  margin-top: 15px;
`;

const NotificationContent = styled.div`
  height: auto;
  padding: 15px 10px;
  color: white;
  font: 15px ${fontSans};
  display: flex;
  flex-direction: row;
`;

const NotificationContainer = styled.div`
  position: absolute;
  z-index: 50;
  display: flex;
  /* The notifications should come in from the top */
  flex-direction: column-reverse;
  align-items: center;
  width: 100%;
  top: 0;
  left: 0;
`;

export interface NotificationValue {
  id: number;
  message: string;
  duration: number;
}

const NotificationCenter = ({
  notifications,
  setNotifications,
}: {
  notifications: Array<NotificationValue>;
  setNotifications: (
    mutate: (original: Array<NotificationValue>) => Array<NotificationValue>
  ) => void;
}) => {
  const [cancelMap] = useState(() => new Map());
  const [refMap] = useState(() => new Map());

  const transitions = useTransition(notifications, {
    from: {
      opacity: 0,
      height: 0,
      time: "100%",
    },
    enter: (item) => async (next) =>
      await next({
        opacity: 1,
        height: refMap.get(item.id).offsetHeight,
      }),
    leave: (item) => async (next, cancel) => {
      // We're mutating directly because we don't need to rerender
      cancelMap.set(item.id, cancel);
      await next({
        time: "0%",
        config: { duration: item.duration },
      });
      await next({ opacity: 0 });
      await next({ height: 0 });
    },
    onRest: (_, item) =>
      setNotifications((original) =>
        original.filter(({ id }) => id !== item.item.id)
      ),
    config: { tension: 125, friction: 20, precision: 0.1 },
    keys: (item: NotificationValue) => item.id,
  });

  return (
    <NotificationContainer>
      {transitions(({ time, ...style }, item: NotificationValue) => (
        <Notification style={style as any}>
          <NotificationContent ref={(ref) => ref && refMap.set(item.id, ref)}>
            {item.message}
            <Counter style={{ right: time }} />
            <RemoveButton
              onClick={
                () => cancelMap.get(item.id)("time") // Remove notification
              }
              marginTop={15}
              marginRight={10}
            >
              <X size={23} color="white" />
            </RemoveButton>
          </NotificationContent>
        </Notification>
      ))}
    </NotificationContainer>
  );
};

export default NotificationCenter;
