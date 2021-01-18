import React from "react";
import { render, screen } from "@testing-library/react";
import Notifications from "components/Notifications";

describe("Notfications", () => {
  it("should show notifications", () => {
    render(
      <Notifications
        notifications={[{ id: 0, message: "Hello, there!", duration: 3000 }]}
        removeNotification={() => {}}
      />
    );
    const notification = screen.queryByText(/Hello, there!/i);
    setTimeout(() => expect(notification).toBeVisible(), 1000);
  });

  it("notifications should disappear", () => {
    render(
      <Notifications
        notifications={[{ id: 0, message: "Hello, there!", duration: 500 }]}
        removeNotification={() => {}}
      />
    );
    const notification = screen.queryByText(/Hello, there!/i);
    setTimeout(() => expect(notification).toBeVisible(), 1500);
  });

  it("notifications call a remove notification function", (done) => {
    render(
      <Notifications
        notifications={[{ id: 0, message: "Hello, there!", duration: 500 }]}
        removeNotification={() => done()}
      />
    );
  });
});
