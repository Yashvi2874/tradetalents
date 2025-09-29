# Trade Talents Frontend

A web-based peer-learning platform designed exclusively for verified university students to teach and learn practical skills from one another.

## Features

- **Skill-based session booking**: Students can browse and book sessions based on specific skills they want to learn or teach.
- **Real-time chat**: Integrated messaging system for students to connect with peers.
- **Certificate generation**: Earn certificates for completed sessions to showcase skills.
- **Gamification**: Credit exchange system to encourage participation.

## Tech Stack

- **Frontend**: React, Vite, React Router
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Styling**: CSS Modules

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── pages/          # Page components
├── services/       # API service files
├── utils/          # Utility functions
└── assets/         # Static assets
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run serve`

Preview the production build locally.

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Components

### Authentication
- Login and Registration forms with validation
- Protected routes for authenticated users

### Main Pages
- **Home Page**: Landing page with hero section, features, and how-it-works
- **Dashboard**: Student overview with statistics, sessions, and skills
- **Sessions**: Manage upcoming and past sessions
- **Skills**: Manage and add new skills
- **Profile**: View and edit user profile

### UI Components
- Header and Footer
- Hero Section
- Features Section
- How It Works Section
- Dashboard Header
- Stats Cards
- Session Lists and Items
- Skills Section
- Search Bar
- Notification system

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:5000/api
```

## Learn More

This project was bootstrapped with [Vite](https://vitejs.dev/).