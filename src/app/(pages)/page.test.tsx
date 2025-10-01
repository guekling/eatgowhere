import { render, screen, waitFor } from "@testing-library/react";
import { sendRequest } from "../utils/api";
import Home from "./page";
import { AuthResponse } from "../lib/interfaces";
import { UserRoles } from "../lib/types";
import { NewSessionProps } from "../components/NewSession";

// mock dependencies
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("../utils/api", () => ({
  ...jest.requireActual("../utils/api"),
  sendRequest: jest.fn(),
}));

// mock components
jest.mock("../components/LoadingPage", () => {
  return function MockLoadingPage() {
    return <div data-testid="loading-page">Loading...</div>;
  };
});

jest.mock("../components/CreateSessionUser", () => {
  return function MockCreateSessionUser({
    onUserCreated,
  }: {
    onUserCreated: (username: string) => void;
  }) {
    return (
      <div data-testid="create-session-user">
        <button onClick={() => onUserCreated(mockAuthResponse.username)}>
          Create User
        </button>
      </div>
    );
  };
});

jest.mock("../components/NewSession", () => {
  return function MockNewSession({ onSessionCreated }: NewSessionProps) {
    return (
      <div data-testid="new-session">
        <button onClick={() => onSessionCreated(mockAuthResponse.session_id)}>
          Create Session
        </button>
      </div>
    );
  };
});

jest.mock("../components/ShareSession", () => {
  return function MockShareSession() {
    return <div data-testid="share-session">Share Session</div>;
  };
});

// other mocks

const mockAuthResponse: AuthResponse = {
  session_id: "session-123",
  id: "user-123",
  username: "testuser",
  role: UserRoles.INITIATOR,
  created_at: new Date(),
  updated_at: new Date(),
};

describe("Home Page", () => {
  const mockSendRequest = sendRequest as jest.MockedFunction<
    typeof sendRequest
  >;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    render(<Home />);
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  it("should render NewSession component when user is not authenticated", async () => {
    mockSendRequest.mockRejectedValueOnce(undefined);
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByTestId("new-session")).toBeInTheDocument();
      expect(screen.queryByTestId("loading-page")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("create-session-user")
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId("share-session")).not.toBeInTheDocument();
    });
  });

  it("should redirect to session page when user is authenticated", async () => {
    mockSendRequest.mockResolvedValueOnce(mockAuthResponse);

    render(<Home />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        `/sessions/${mockAuthResponse.session_id}`
      );
      expect(screen.queryByTestId("loading-page")).toBeInTheDocument();
    });
  });

  it("should render CreateSessionUser when sessionId is set but username is not", async () => {
    mockSendRequest.mockResolvedValueOnce(undefined);

    render(<Home />);

    // wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId("loading-page")).toBeInTheDocument();
    });

    // simulate session creation
    const createSessionButton = screen.getByText("Create Session");
    createSessionButton.click();

    await waitFor(() => {
      expect(screen.getByTestId("create-session-user")).toBeInTheDocument();
      expect(screen.queryByTestId("loading-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("new-session")).not.toBeInTheDocument();
      expect(screen.queryByTestId("share-session")).not.toBeInTheDocument();
    });
  });

  it("should render ShareSession when both sessionId and username are set", async () => {
    mockSendRequest.mockResolvedValueOnce(undefined);

    render(<Home />);

    // wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId("loading-page")).toBeInTheDocument();
    });

    // simulate session creation
    const createSessionButton = screen.getByText("Create Session");
    createSessionButton.click();

    await waitFor(() => {
      expect(screen.getByTestId("create-session-user")).toBeInTheDocument();
      expect(screen.queryByTestId("loading-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("new-session")).not.toBeInTheDocument();
      expect(screen.queryByTestId("share-session")).not.toBeInTheDocument();
    });

    // simulate user creation
    const createUserButton = screen.getByText("Create User");
    createUserButton.click();

    await waitFor(() => {
      expect(screen.getByTestId("share-session")).toBeInTheDocument();
      expect(
        screen.queryByTestId("create-session-user")
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId("loading-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("new-session")).not.toBeInTheDocument();
    });
  });
});
