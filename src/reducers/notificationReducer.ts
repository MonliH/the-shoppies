import { NotificationValue } from "components/Notifications";

export const notificationInitialState = {
  notifications: [],
  idx: 0,
};

export interface NotificationsStore {
  idx: number;
  notifications: Array<NotificationValue>;
}

export enum NotificationActionTypes {
  ADD = 1,
  REMOVE = 2,
}

export type NominationsAction =
  | {
      type: NotificationActionTypes.ADD;
      notification: { message: string; duration: number };
    }
  | { type: NotificationActionTypes.REMOVE; notificationId: number };

const notificationReducer = (
  state: NotificationsStore,
  action: NominationsAction
  // eslint-disable-next-line consistent-return
): NotificationsStore => {
  switch (action.type) {
    case NotificationActionTypes.ADD:
      return {
        idx: state.idx + 1,
        notifications: [
          ...state.notifications,
          { ...action.notification, id: state.idx },
        ],
      };
    case NotificationActionTypes.REMOVE:
      return {
        idx: state.idx,
        notifications: state.notifications.filter(
          ({ id }) => id !== action.notificationId
        ),
      };
    // All cases specified
  }
};
export default notificationReducer;
