import { useState } from "react";

import { NotificationValue } from "components/Notifications";

const useNotifications = (): [
  NotificationValue[],
  (notification: { message: string; duration: number }) => number,
  (idx: number) => void
] => {
  const [notifications, setNotifications] = useState<Array<NotificationValue>>(
    []
  );
  const [notificationIdx, setNotificationIdx] = useState(0);

  const addNotification = (notification: {
    message: string;
    duration: number;
  }): number => {
    setNotifications((notifications) => {
      setNotificationIdx((nIdx) => nIdx + 1);
      return [
        ...notifications,
        { ...notification, id: notificationIdx } as NotificationValue,
      ];
    });
    return notificationIdx;
  };

  const removeNotification = (idx: number) => {
    setNotifications((original) => original.filter(({ id }) => id !== idx));
  };

  return [notifications, addNotification, removeNotification];
};

export default useNotifications;
