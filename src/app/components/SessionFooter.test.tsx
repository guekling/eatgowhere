import { render, screen, waitFor } from "@testing-library/react";
import { HttpStatus, sendRequest } from "../utils/api";
import { API_CONFIG } from "../lib/api-config";
import SessionFooter from "./SessionFooter";
import { SessionStatus, UserRoles } from "../lib/types";
import { UpdateSessionResponse } from "../lib/interfaces";

const mockUpdatedSessionResponse: UpdateSessionResponse = {
  id: "session-123",
  status: SessionStatus.ENDED,
  created_at: new Date(),
  updated_at: new Date(),
  ended_at: new Date(),
};

jest.mock("../utils/api", () => ({
  ...jest.requireActual("../utils/api"),
  sendRequest: jest.fn(),
}));

describe("SessionFooter", () => {
  const mockOnSessionEnded = jest.fn();
  const defaultProps = {
    sessionId: "session-123",
    onSessionEnded: mockOnSessionEnded,
  };

  const mockSendRequest = sendRequest as jest.MockedFunction<
    typeof sendRequest
  >;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render End Session button for initiator when session is active", () => {
    render(
      <SessionFooter
        {...defaultProps}
        userRole={UserRoles.INITIATOR}
        sessionStatus={SessionStatus.ACTIVE}
      />
    );

    expect(screen.getByText("End Session")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "End Session" })
    ).toBeInTheDocument();
  });

  it("should not render End Session button for participant", () => {
    render(
      <SessionFooter
        {...defaultProps}
        userRole={UserRoles.PARTICIPANT}
        sessionStatus={SessionStatus.ACTIVE}
      />
    );

    expect(screen.queryByText("End Session")).not.toBeInTheDocument();
  });

  it("should not render End Session button if session has ended", () => {
    render(
      <SessionFooter
        {...defaultProps}
        userRole={UserRoles.INITIATOR}
        sessionStatus={SessionStatus.ENDED}
      />
    );

    expect(screen.queryByText("End Session")).not.toBeInTheDocument();
  });

  it("should display lunch location when session is ended", () => {
    const chosenRestaurant = "Sushi Tei";

    render(
      <SessionFooter
        {...defaultProps}
        userRole={UserRoles.PARTICIPANT}
        sessionStatus={SessionStatus.ENDED}
        chosenRestaurant={chosenRestaurant}
      />
    );

    expect(screen.getByText("Lunch Location:")).toBeInTheDocument();
    expect(screen.getByText(chosenRestaurant)).toBeInTheDocument();
  });

  it("should successfully end session when End Session button is clicked", async () => {
    mockSendRequest.mockResolvedValueOnce(mockUpdatedSessionResponse);

    render(
      <SessionFooter
        {...defaultProps}
        userRole={UserRoles.INITIATOR}
        sessionStatus={SessionStatus.ACTIVE}
      />
    );

    const endSessionButton = screen.getByRole("button", {
      name: "End Session",
    });
    expect(endSessionButton).toBeInTheDocument();

    await waitFor(async () => {
      endSessionButton.click();

      expect(mockSendRequest).toHaveBeenCalledWith(
        API_CONFIG.updateSession.url.replace(
          ":sessionId",
          defaultProps.sessionId
        ),
        API_CONFIG.updateSession.method,
        [HttpStatus.OK],
        {
          status: SessionStatus.ENDED,
          ended_at: expect.any(Date),
        }
      );

      expect(mockOnSessionEnded).toHaveBeenCalled();
    });
  });

  it("should display error message if ending session fails", async () => {
    mockSendRequest.mockRejectedValueOnce(undefined);

    render(
      <SessionFooter
        {...defaultProps}
        userRole={UserRoles.INITIATOR}
        sessionStatus={SessionStatus.ACTIVE}
      />
    );

    const endSessionButton = screen.getByRole("button", {
      name: "End Session",
    });
    expect(endSessionButton).toBeInTheDocument();

    await waitFor(async () => {
      endSessionButton.click();

      expect(mockSendRequest).toHaveBeenCalled();

      expect(
        await screen.findByText("Failed to end session. Please try again.")
      ).toBeInTheDocument();
    });
  });
});
