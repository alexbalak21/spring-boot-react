# Application Structure

This document outlines the structure of the React application and describes the purpose of each TypeScript/TSX file.

## Directory Tree

```
.
├── public/
│   └── react.svg
├── src/
│   ├── components/
│   │   ├── Avatar.tsx
│   │   ├── Button.tsx
│   │   ├── Confirm.tsx
│   │   ├── EditableField.tsx
│   │   ├── Input.tsx
│   │   ├── Navbar.tsx
│   │   ├── NavbarOld.tsx
│   │   ├── ProfileAvatar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Toast.tsx
│   │   ├── ToastContainer.tsx
│   │   ├── UploadProfileImage.tsx
│   │   └── UserMenu.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── UserContext.tsx
│   ├── hooks/
│   │   ├── useAuthorizedApi.ts
│   │   ├── useAuthToken.ts
│   │   ├── useCsrf.ts
│   │   └── useLogout.ts
│   ├── layouts/
│   │   └── UserLayout.tsx
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── ApiDemo.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── User.tsx
│   │   └── User/
│   │       ├── Profile.tsx
│   │       ├── UpdateProfile.tsx
│   │       └── UpdateUserPassword.tsx
│   ├── App.tsx
│   ├── main.css
│   ├── main.tsx
│   └── types.ts
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Project Overview

This is a React application built with:
- React 19
- TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (routing)
- Axios (HTTP client)
- Headless UI (UI components)

## Directory Structure

### `/src`
Main source directory containing all application code.

#### `/src/context`
React context providers for global state management.

- **AuthContext.tsx**: Manages authentication state and provides authentication-related functions.
- **UserContext.tsx**: Manages user-related state and provides user data to the application.

#### `/src/hooks`
Custom React hooks for reusable logic.

- **useAuthToken.ts**: Manages authentication token storage and retrieval.
- **useAuthorizedApi.ts**: Provides an Axios instance with authentication headers.
- **useCsrf.ts**: Handles CSRF token management for secure requests.
- **useLogout.ts**: Provides logout functionality.

#### `/src/components`
Reusable UI components.

- **Avatar.tsx**: Displays user avatars.
- **Button.tsx**: Reusable button component.
- **Confirm.tsx**: Confirmation dialog component.
- **EditableField.tsx**: Inline editable field component.
- **Input.tsx**: Reusable input field component.
- **Navbar.tsx** / **NavbarOld.tsx**: Main navigation bar (Navbar.tsx is the current version).
- **ProfileAvatar.tsx**: Component for displaying and managing profile avatars.
- **Sidebar.tsx**: Application sidebar navigation.
- **Toast.tsx** / **ToastContainer.tsx**: Notification system components.
- **UploadProfileImage.tsx**: Handles profile image uploads.
- **UserMenu.tsx**: Dropdown menu for user-related actions.

#### `/src/pages`
Page components for different routes.

- **About.tsx**: About page.
- **ApiDemo.tsx**: Demo page for API testing.
- **Home.tsx**: Home/landing page.
- **Login.tsx**: User login page.
- **Register.tsx**: User registration page.
- **User.tsx**: Main user profile page.
- **/User/Profile.tsx**: User profile display and management.
- **/User/UpdateProfile.tsx**: Form for updating user profile.
- **/User/UpdateUserPassword.tsx**: Form for changing user password.

#### `/src/layouts`
Layout components for page structure.

- **UserLayout.tsx**: Layout for authenticated user pages.

### `/public`
Static assets served directly by the web server.

### `/node_modules`
Dependencies installed via npm/yarn (not included in version control).

## Configuration Files

- **vite.config.ts**: Vite configuration for development server and build process.
- **tsconfig.json**: TypeScript configuration.
- **package.json**: Project metadata and dependency management.
- **tailwind.config.js**: Tailwind CSS configuration.
- **eslintrc.json**: ESLint configuration for code linting.

## Development Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## Type Definitions

- **types.ts**: Contains TypeScript type definitions used throughout the application.

## Authentication Flow

The application uses a token-based authentication system with the following flow:
1. User logs in via `/login`
2. Auth token is stored and used for subsequent API requests
3. Protected routes are wrapped in authentication checks
4. User session is managed via context providers

## API Integration

- The application communicates with a backend API using Axios
- API calls are wrapped in custom hooks for authentication and error handling
- CSRF protection is implemented for secure form submissions
