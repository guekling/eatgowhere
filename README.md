# eatgowhere

Not sure where to eat for lunch? Fret not, let our app decide for you!

## Introduction

### Stack

- NextJS (bootstrapped with `create-next-app`)
- Typescript
- PostgreSQL
- Sequelize as the ORM
- TailwindCSS as CSS framework
- Jest as the testing framework

## Table of Contents

- [Project Structure](#project-structure)
- [Local Project Setup](#local-project-setup)
  - [Pre-Requisites](#pre-requisites)
  - [Running the Application](#running-the-application)
  - [Running the Tests](#running-the-tests)
  - [Working with Sequelize ORM](#working-with-sequelize-orm)
- [Requirements](#requirements)
- [User Flow](#user-flow)
- [Technical Specs](#technical-specs)
  - [Database](#database)
  - [API Endpoints](#api-endpoints)
- [Technical Considerations](#technical-considerations)
  - [User Authentication](#user-authentication)
  - [User Authorisation](#user-authorisation)
  - [Invite Link](#invite-link)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
  - [Tech Debt](#tech-debt)
  - [Features](#features)

## Project Structure

<details>

```
eatgowhere/
├── .env.*
├── .gitignore
├── README.md
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── public/                    # Static assets
│   ├── auth_flow.png
│   ├── database.png
│   ├── user_flow.png
│   └── *.svg
├── scripts/                   # Build and deployment scripts
│   └── run-local.sh
└── src/
    └── app/                   # Next.js App Router directory
        ├── globals.css
        ├── layout.tsx
        ├── (pages)/           # Pages
        │   ├── page.tsx
        │   ├── page.test.tsx
        │   └── sessions/
        ├── api/               # API route handlers
        │   ├── auth/
        │   └── sessions/
        ├── components/        # Reusable React components
        ├── database/          # Database configuration and models
        │   ├── config/
        │   ├── migrations/
        │   ├── models/
        │   └── seeders/
        ├── lib/               # Shared utilities and types
        │   ├── api-config.ts
        │   ├── interfaces.ts
        │   ├── types.ts
        │   └── validators.ts
        ├── services/          # Business logic layer
        │   ├── auth.ts
        │   ├── restaurant.ts
        │   ├── session.ts
        │   └── user.ts
        └── utils/             # Utility functions
            └── api.ts
```

</details>

## Local Project Setup

### Pre-Requisites

<details>

#### 1. Get a version manager

This project runs on **Node v22.18.0**.

We recommend downloading a node version manager for the management of different node versions across projects.

#### 2. Docker & Container Runtime

We recommend using `colima` over Docker Desktop.

Assuming that you are using Mac and use `homebrew` as your package manager:

```shell
brew_install "colima"
brew_install "docker"
brew_install "docker-compose"
brew_install "qemu"  # Ensures Colima can run x86 containers on Apple Silicon
```

<blockquote>
Some useful commands for `colima`:

```shell
colima stop                      # Stop Colima
colima start --memory 8 --cpu 4  # Start Colima with 4 CPU cores and 8GB RAM (for running tests)
```

If you prefer having some visuals, you may check out [`lazydocker`](https://github.com/jesseduffield/lazydocker).

</blockquote>

#### 3. Setup the Repository

```shell
npm install
npx sequelize-cli db:migrate # Run the migration files
```

#### 4. Add Environment Files

You will need to create the `.env.local` and `.env.test` files.

You may copy the following environment variables and their values for the `.env.test` file.

```
# .env.test

DB_NAME=eatgowhere_test
DB_USER=admin
DB_PASSWORD=admin
DB_HOST=localhost
DB_DIALECT=postgres
DB_PORT=5433

JWT_SECRET=your_jwt_secret_key
ACCESS_TOKEN_EXPIRY=7d
```

For the `.env.local` file,

- Database information can be retrieved from the [docker-compose.yml](./docker-compose.yml) file. The values to change are `DB_PORT=5432`, `DB_NAME=eatgowhere` and `DB_HOST=db`.
- The `JWT_SECRET` can be randomly generated and updated.
- You may change the `ACCESS_TOKEN_EXPIRY` as you wish. Do note the limitations of the access token in our application. See our [Known Limitations](#known-limitations) and [User Authentication](#user-authentication) for more information.

```
# .env.local

DB_NAME=eatgowhere
DB_USER=admin
DB_PASSWORD=admin
DB_HOST=db
DB_DIALECT=postgres
DB_PORT=5432

JWT_SECRET={YOUR_JWT_SECRET}
ACCESS_TOKEN_EXPIRY={YOUR_ACCESS_TOKEN_EXPIRY}
```

</details>

### Running the Application

<details>

Run the following script in your terminal:

```shell
./scripts/run-local.sh
```

This will bring up all the Docker containers in development mode. This includes:

- The client/server at `http://localhost:3000/`
- The database at `postgres://admin:admin@localhost:5432/eatgowhere`
- The test database at `postgres://admin:admin@localhost:5433/eatgowhere_test`

</details>

### Running the Tests

<details>

Run the following command in your terminal:

```shell
npm run test
```

This command runs both frontend and backend tests. Currently, this repository only has:

- Backend
  - API tests
- Frontend
  - Component tests
  - Page tests

</details>

### Working with Sequelize ORM

<details>

We use the Sequelize ORM to facilitate interaction with our PostgreSQL database.

The Sequelize CLI is the official command-line interface tool, designed to support and work with the Sequelize ORM.

Some useful commands includes:

```shell
# Creating a new table (model)
npx sequelize-cli model:generate --name <ModelName> --attributes <attribute1>:<type>,<attribute2>:<type>...

# Running the migration files
npx sequelize-cli db:migrate

# Undo-ing the previous migration
npx sequelize-cli db:migrate:undo
```

</details>

## Requirements

<details>

1. A user can initiate a session and invite others to join it.

2. Other users who have joined the session may submit a restaurant of their choice.

3. All users in the session are able to see restaurants that others have submitted.

4. The user who initiated the session is able to end the session.

   a. At the end of the session, a restaurant is randomly picked from all the submitted restaurants for that session. All users in the session are then able to see the picked restaurant.

   b. A user should not be able to join a session that has already ended.

</details>

## User Flow

<details>

The following user flows can be viewed in the diagram below:

- Creating a new session (as an initiator/host)
- Joining a session (as a participant)
- Ending a session (as an initiator/host)

![User Flow](./public/user_flow.png)

</details>

## Technical Specs

### Database

<details>

![Database Schema](./public/database.png)

#### `users` Table

| Column     | Type        | Description                                                         |
| ---------- | ----------- | ------------------------------------------------------------------- |
| id         | UUID        | Primary key. Generated by `gen_random_uuid()`.                      |
| username   | STRING      | Username of the user.                                               |
| session_id | UUID        | Foreign key to `sessions.id`.                                       |
| role       | TEXT (enum) | User role in session. One of: `initiator`, `participant`.           |
| created_at | DATE        | Timestamp when user was created. (auto-generated by Sequelize)      |
| updated_at | DATE        | Timestamp when user was last updated. (auto-generated by Sequelize) |

#### `sessions` Table

| Column     | Type        | Description                                                            |
| ---------- | ----------- | ---------------------------------------------------------------------- |
| id         | UUID        | Primary key. Generated by `gen_random_uuid()`.                         |
| status     | TEXT (enum) | Session status. One of: `active`, `ended`. Default: `active`.          |
| created_by | UUID        | Foreign key to `users.id`. User who created the session.               |
| ended_at   | DATE        | Timestamp when session was ended. Nullable.                            |
| created_at | DATE        | Timestamp when session was created. (auto-generated by Sequelize)      |
| updated_at | DATE        | Timestamp when session was last updated. (auto-generated by Sequelize) |

#### `restaurants` Table

| Column       | Type    | Description                                                               |
| ------------ | ------- | ------------------------------------------------------------------------- |
| id           | UUID    | Primary key. Generated by `gen_random_uuid()`.                            |
| name         | STRING  | Name of the restaurant.                                                   |
| submitted_by | UUID    | Foreign key to `users.id`. User who submitted the restaurant.             |
| session_id   | UUID    | Foreign key to `sessions.id`.                                             |
| chosen       | BOOLEAN | Whether this restaurant was chosen for the session. Default: `false`.     |
| created_at   | DATE    | Timestamp when restaurant was submitted. (auto-generated by Sequelize)    |
| updated_at   | DATE    | Timestamp when restaurant was last updated. (auto-generated by Sequelize) |

</details>

### API Endpoints

| Endpoint                        | Method | Description                            |                              |
| ------------------------------- | ------ | -------------------------------------- | ---------------------------- |
| `/api/sessions`                 | POST   | Create a new session                   | [More Info](#create-session) |
| `/api/sessions/:id`             | GET    | Retrieve session details               | [More Info](#get-session)    |
| `/api/sessions/:id`             | HEAD   | Check session validity                 | [More Info](#check-session)  |
| `/api/sessions/:id`             | PATCH  | Update session                         | [More Info](#update-session) |
| `/api/sessions/:id/users`       | POST   | Add a user to a session                | [More Info](#add-user)       |
| `/api/sessions/:id/restaurants` | POST   | Add a restaurant to a session          | [More Info](#add-restaurant) |
| `/api/auth`                     | GET    | Authenticate user & Retrieve user info | [More Info](#authenticate)   |

#### Create Session

<details>

**POST** `/api/sessions`

Create a new session

**Request Body:**

None

**Response (201):**

```typescript
{
  id: string;
  status: 'active' | 'ended';
  created_at: Date;
  updated_at: Date;
  created_by: string;
  ended_at?: Date;
}
```

**Error Responses:**

- `500` - Internal server error

</details>

#### Get Session

<details>

**GET** `/api/sessions/:id`

Retrieve session details

**Request Body:**

None

**Response (200):**

```typescript
{
  id: string;
  status: 'active' | 'ended';
  created_at: Date;
  updated_at: Date;
  created_by: string;
  ended_at?: Date;
  chosen_restaurant?: string;
  users: Record<string, {
    id: string;
    username: string;
    session_id: string;
    role: 'initiator' | 'participant';
    created_at: Date;
    updated_at: Date;
    restaurant?: string;
  }>;
}
```

**Error Responses:**

- `400` - Invalid session
- `401` - Unauthorized
- `422` - Validation error
- `500` - Internal server error

</details>

#### Check Session

<details>

**HEAD** `/api/sessions/:id`

Check session validity

**Request Body:**

None

**Response (204):**

No content

**Error Responses:**

- `400` - Invalid session
- `422` - Validation error
- `500` - Internal server error

</details>

#### Update Session

<details>

**PATCH** `/api/sessions/:id`

Update session

**Request Body:**

```typescript
{
  status: "active" | "ended";
  ended_at: string; // ISO date string
}
```

**Response (200):**

```typescript
{
  id: string;
  status: 'active' | 'ended';
  created_at: Date;
  updated_at: Date;
  created_by: string;
  ended_at?: Date;
}
```

**Error Responses:**

- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `422` - Validation error
- `500` - Internal server error

</details>

#### Add User

<details>

**POST** `/api/sessions/:id/users`

Add a user to a session

**Request Body:**

```typescript
{
  username: string;
  role: "initiator" | "participant";
}
```

**Response (201):**

```typescript
{
  id: string;
  username: string;
  session_id: string;
  role: "initiator" | "participant";
  created_at: Date;
  updated_at: Date;
}
```

**Error Responses:**

- `400` - Invalid session
- `409` - Initiator already exists
- `422` - Validation error
- `500` - Internal server error

</details>

#### Add Restaurant

<details>

**POST** `/api/sessions/:id/restaurants`

Add a restaurant to a session

**Request Body:**

```typescript
{
  name: string;
}
```

**Response (201):**

```typescript
{
  id: string;
  name: string;
  submitted_by: string;
  session_id: string;
  chosen: boolean;
  created_at: Date;
  updated_at: Date;
}
```

**Error Responses:**

- `401` - Unauthorized
- `409` - Restaurant already exists
- `422` - Validation error
- `500` - Internal server error

</details>

#### Authenticate

<details>

**GET** `/api/auth`

Authenticate user & Retrieve user info

**Request Body:**

None

**Response (200):**

```typescript
{
  id: string;
  username: string;
  session_id: string;
  role: "initiator" | "participant";
  created_at: Date;
  updated_at: Date;
}
```

**Error Responses:**

- `401` - Unauthorized
- `500` - Internal server error

</details>

## Technical Considerations

### User Authentication

<details>
This project uses JWT (JSON Web Tokens) stored in HTTP-only cookies for user authentication.

Our implementation is kind of a hybrid between **session-based authentication** and **JWT token authentication**.

- Unlike traditional JWT token authentication, we perform a database lookup on every request for authentication. This is because our `accessToken` cookie is long-lived, as we did not implement refresh tokens.
- However, unlike session-based authentication, there is no additional data storage of our sessions.

![User Flow](./public/auth_flow.png)

We chose this approach because,

- It is straightforward to implement;
- The `httpOnly` and `sameSite` settings provide some protection against common web vulnerabilities; and
- Our use case, helping a group decide on a lunch location, should typically take no more than a day. While a 1-day expiry for the access token isn't particularly short, we think that it should be short enough to suit our needs.

</details>

### User Authorisation

<details>

This project implements a simplified version of Role-Based Access Control.

There are two roles defined in this project:

- **Initiator**: the session creator/host
- **Participant**: a regular session member

**Permission Matrix**

| Resource   | Action   | Initiator | Participant |
| ---------- | -------- | --------- | ----------- |
| session    | create   |           |             |
| session    | validate |           |             |
| session    | get      | ✅        | ✅          |
| session    | update   | ❌        | ✅          |
| user       | create   |           |             |
| restaurant | add      | ✅        | ✅          |
| auth       | verify   |           |             |

#### Potential Enhancements

A potential enhancement is to,

- define the permissions,
- map these permissions to roles, and
- implement a middleware to manage the access control.

This would make it easier to manage the roles and permissions should the application scales, and provide a more flexible and maintainable access control system.

</details>

### Invite Link

<details>

This project generates shareable invite links using the Session ID. The invite link is in the format, `/sessions/:session_id/join`.

This current approach was compared against using invite tokens (URL example: `/sessions/:session_id/join?invite_token=xxx`). However, we opted for the simpler Session ID implementation because,

- The Session ID is in UUIDv4 format, which is harder to enumerate; and
- Though less secure, the data sensitivity in our application is low as we are simply displaying restaurant preferences.

#### Potential Enhancements

That said, we can consider using invite tokens as a potential enhancement as they offer several advantages:

- Greater flexibility for implementing future features. For example,
  - Configurable expiration, allowing for time-limited access;
  - Usage tracking, which could help monitor how links are shared;
  - Access limits, such as restricting the number of times a link can be used; and
  - Personalised tokens, enabling multiple invite links for the same session, each tied to a specific user.

</details>

## Known Limitations

<details>

- A user is tied to the browser they are using. Therefore:
  - They are unable to view information about the session they have joined from another browser on the same device; and
  - They are unable to join more than 1 session at a time.
- There is no auto refresh of the Session Details page. Users are expected to manually refresh to check if,
  - New users have joined the session; or
  - The session has ended and a restaurant has been chosen.
- Joining a new session, as a participant, will overwrite the browser's existing session without prior warning.
- The session will expire when the access token expires, regardless of the session status and/or outcome. Therefore:
  - A session may expire before it has ended; or
  - A session may expire before users are able to view the chosen restaurant.
- Due to the current frontend flow, users are **required** add a restaurant before the Session Details page is displayed.
  - Therefore, there is an assumption that every session will have at least one restaurant added by the time the session ends.
  - Should there be no restaurant added, the session can still be ended without a restaurant chosen.
- The table in the Session Details page, displaying the session's users and restaurants, does not cater for many users.
  - The table is non-scrollable and there is no pagination.

</details>

## Future Improvements

<details>

### Tech Debt

| Ticket                                 | Priority  | Description                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Comprehensive Test Coverage            | Very High | Currently, backend and frontend tests are not extensive enough. Manual testing is required when refactoring any parts of the application. We should improve test coverage by: <br>• Adding API tests for all endpoints <br>• Creating component and page tests for all UI components <br>• Implementing unit tests for backend services                             |
| Environment Variables Management       | High      | There is currently no validation of environment variables. The application may suddenly fail if required environment variables are missing. We should: <br>• Validate all required environment variables on application startup <br>• Implement environment-specific configuration management <br>• Add error messages for missing or invalid environment variables |
| API Middleware Management              | Medium    | NextJS supports only a single middleware function, which could become bloated as we add different types of middleware. We should: <br>• Create a helper function that can help to manage and chain multiple middleware functions <br>• Separate concerns (auth, validation) into individual middleware functions                                                    |
| Refactor Backend Tests                 | Medium    | Current API tests contain significant code duplication and repetitive patterns, leading to reduced readability. We should refactor the test suites by: <br>• Creating reusable helper functions for common test operations <br>• Implementing shared assertion utilities                                                                                            |
| Pre-Commit Hooks                       | Low       | Code quality checks are not enforced before commits, which can lead to inconsistent code style and failing builds. We should implement pre-commit hooks that will automatically run. Some checks include: <br>• Prettier formatting checks <br>• ESLint validation <br>• Automated test execution                                                                   |
| Enhanced Access Control Implementation | Low       | Current role-based access control is basic and may not scale well. For better management of roles and permissions, we should: <br>• Define permissions for each resource and action <br>• Create a permission-to-role mapping system <br>• Implement middleware to handle access control checks                                                                     |

### Features

| Ticket                         | Priority  | Problem Statement                                                                                                                                                                                                   | Solution                                                                                                                                                         |
| ------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High Volume User Support       | Very High | The session details table does not handle large numbers of users and restaurants effectively. Current limitations include: <br>• Non-scrollable table layout <br>• No pagination support                            | We should implement: <br>• Scrolling for large datasets; or <br>• Pagination                                                                                     |
| Optional Restaurant Submission | High      | Some users might not want to submit a restaurant but still want to know the results. Currently, all users are required to add a restaurant before accessing the Session Details page.                               | <br>• Make restaurant submission optional for participants <br>• Handle edge cases where no restaurants are submitted but the initiator wants to end the session |
| Real-Time Session Updates      | High      | Users must manually refresh the page to see session updates. Without refreshing, they remain unaware of important session changes such as new participants joining, restaurants being added, or the session ending. | <br>• Browser notifications for critical session events (e.g. session ended, restaurant chosen) <br>• Real-time synchronisation of users and restaurants         |

</details>
