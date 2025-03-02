# Disc Golf Tournament Podium Generator

A TypeScript-based web application for creating professional disc golf tournament podium images with dynamic player details and visual customization.

## Features

- Create tournament podium images with customizable details
- Upload player photos that are automatically cropped into circular avatars
- Medal placements (🥇, 🥈, 🥉) for top 3 positions
- Dynamic image generation with player scores and tournament information
- Responsive web interface for tournament organizers

## Prerequisites

- Node.js 20 or later
  - v20.18.1 (does not work with v22.12.0)
- npm (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Getting the Code

### From Replit
1. If you're viewing this on Replit, click the three dots (...) next to "Files"
2. Select "Download as zip"
3. Extract the downloaded zip file to your desired location

### From Version Control
1. Clone the repository:
```bash
git clone <your-repository-url>
cd disc-golf-podium-generator
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create an `uploads` directory in the project root:
```bash
mkdir uploads
```

## Development

To start the development server:

```bash
npm run dev
```

This will start both the frontend and backend servers. The application will be available at `http://localhost:5000`.

## Project Structure

```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Page components
├── server/                 # Backend Express server
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage interface
├── shared/                # Shared TypeScript types
└── uploads/              # Uploaded images storage
```

## Usage

1. Open the application in your browser
2. Fill in the tournament details:
   - Tournament name 
   - Date
   - Website URL
3. For each podium position (1st, 2nd, 3rd):
   - Enter player name
   - Enter final score
   - Upload player photo (supported formats: JPEG, PNG)
4. Click "Generate Podium Image" to create the podium visualization
5. The generated image will appear in the preview section
6. Right-click on the preview to save the image

## Troubleshooting

### Image Upload Issues
- Ensure the `uploads` directory exists in the project root
- Image file size must be under 5MB
- Supported formats: JPEG, PNG
- If images don't appear in preview, try refreshing the page

### Development Server Issues
- Ensure port 5000 is not in use by another application
- Check if Node.js version is 20 or later using `node -v`
- Try deleting `node_modules` and running `npm install` again

## Built With

- React + TypeScript
- Express.js
- shadcn/ui
- Canvas API for image generation
- Tailwind CSS for styling

## Recommended Development Tools

- Visual Studio Code with TypeScript support
- React Developer Tools browser extension
- Chrome DevTools for debugging
