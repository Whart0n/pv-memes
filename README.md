# PV Meme Generator

A React-based meme generator application with text editing capabilities and an admin panel.

## Features

- Browse and select from various meme templates
- Add and edit text boxes with customizable:
  - Font size and family
  - Text color with simple color palette
  - Text outline color with option to remove outline
- Admin panel for template management (accessible via /admin URL)
- Responsive design for various screen sizes

## Technology Stack

- Frontend: React, React Router
- Backend: Node.js (Express)
- Styling: CSS

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Usage

- Main application: http://localhost:3000
- Admin panel: http://localhost:3000/admin

## Project Structure

- `/src` - React application source code
  - `/components` - React components
  - `/App.js` - Main application component
  - `/App.css` - Application styles
- `/public` - Static assets including meme templates

## License

MIT
