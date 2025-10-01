import { render, screen } from "@testing-library/react";
import { UserRestaurantAttributes } from "../lib/interfaces";
import { UserRoles } from "../lib/types";
import SessionUsersTable from "./SessionUsersTable";

const userOne: UserRestaurantAttributes = {
  id: "user-1",
  username: "John Host",
  role: UserRoles.INITIATOR,
  restaurant: "McDonald's",
  session_id: "session-123",
  created_at: new Date(),
  updated_at: new Date(),
};

const userTwo: UserRestaurantAttributes = {
  id: "user-2",
  username: "Amy Participant",
  role: UserRoles.PARTICIPANT,
  restaurant: "KFC",
  session_id: "session-123",
  created_at: new Date(),
  updated_at: new Date(),
};

const userThree: UserRestaurantAttributes = {
  id: "user-3",
  username: "Bob NoChoice",
  role: UserRoles.PARTICIPANT,
  restaurant: undefined,
  session_id: "session-123",
  created_at: new Date(),
  updated_at: new Date(),
};

const mockUsers: Record<string, UserRestaurantAttributes> = {
  [userOne.id]: userOne,
  [userTwo.id]: userTwo,
  [userThree.id]: userThree,
};

describe("SessionUsersTable", () => {
  it("should render table with users", () => {
    render(
      <SessionUsersTable users={mockUsers} chosenRestaurant={undefined} />
    );

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Restaurant")).toBeInTheDocument();
    expect(screen.getByText(userOne.username)).toBeInTheDocument();
    expect(screen.getByText(userTwo.username)).toBeInTheDocument();
    expect(screen.getByText(userThree.username)).toBeInTheDocument();
  });

  it("should highlight the chosen restaurant correctly", () => {
    render(
      <SessionUsersTable
        users={mockUsers}
        chosenRestaurant={userTwo.restaurant}
      />
    );

    const chosenRow = screen.getByText(userTwo.username).closest("tr");
    expect(chosenRow).toHaveClass("bg-green-100");
    expect(chosenRow).toHaveClass("border-l-4");
    expect(chosenRow).toHaveClass("border-l-green-500");

    // ensure other rows do not have the highlight
    const noHighlightUsers = [userOne, userThree];
    noHighlightUsers.forEach((u) => {
      const row = screen.getByText(u.username).closest("tr");
      expect(row).not.toHaveClass("bg-green-100");
      expect(row).not.toHaveClass("border-l-4");
      expect(row).not.toHaveClass("border-l-green-500");
    });
  });

  it("should display HOST badge for initiator", () => {
    render(
      <SessionUsersTable users={mockUsers} chosenRestaurant={undefined} />
    );

    const userElement = screen.getByText(userOne.username);
    const hostBadge = userElement.parentElement?.querySelector("span");
    expect(hostBadge).toHaveTextContent("HOST");

    // ensure host badge is not displayed for other users
    const nonHostUsernames = [userTwo.username, userThree.username];
    nonHostUsernames.forEach((username) => {
      const userElement = screen.getByText(username);
      const hostBadgeInUser = userElement.parentElement?.querySelector("span");
      expect(hostBadgeInUser).not.toHaveTextContent("HOST");
    });
  });

  it("should display CHOSEN badge for chosen restaurant", () => {
    render(
      <SessionUsersTable
        users={mockUsers}
        chosenRestaurant={userTwo.restaurant}
      />
    );

    const restaurantElement = screen.getByText(userTwo.restaurant || "");
    const chosenBadge =
      restaurantElement.parentElement?.querySelectorAll("span")[1];
    expect(chosenBadge).toHaveTextContent("✓ Chosen");

    // ensure chosen badge is not displayed for other users
    const nonChosenRestaurants = [userOne.restaurant, userThree.restaurant];
    nonChosenRestaurants.forEach((restaurant) => {
      const userElement = screen.getByText(
        restaurant || "No Restaurant Selected"
      );
      const spans = userElement.parentElement?.querySelectorAll("span");
      expect(spans?.length).toBe(1); // only the restaurant name span
    });
  });

  it("should display 'No Restaurant Selected' for users without a restaurant, without CHOSEN badge", () => {
    render(
      <SessionUsersTable users={mockUsers} chosenRestaurant={undefined} />
    );

    const userElement = screen.getByText(userThree.username);
    const row = userElement.closest("tr");
    const restaurantCell = row?.querySelectorAll("td")[1];
    expect(restaurantCell).toHaveTextContent("No Restaurant Selected");
  });

  it("should handle empty users", () => {
    render(<SessionUsersTable users={{}} chosenRestaurant={undefined} />);

    // table headers should still be present
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Restaurant")).toBeInTheDocument();
  });

  it("should handle undefined users", () => {
    render(
      <SessionUsersTable users={undefined} chosenRestaurant={undefined} />
    );

    // table headers should still be present
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Restaurant")).toBeInTheDocument();
  });
});
