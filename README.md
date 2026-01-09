# Game Collection Tracker

A local-first web application for tracking your personal video game collection and backlog, inspired by Letterboxd/IMDb but focused on personal progress.

## Features

- Track owned games with status management (Backlog, Playing, Paused, Completed, Dropped, Wishlist, Replaying)
- Search and add games via RAWG API
- Rate games (1-10 stars)
- Tag games with descriptive tags
- Visualize progress with timeline view
- Upload custom box art
- Full offline support (local-first architecture)
- Export/import data as JSON

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Database**: Dexie.js (IndexedDB wrapper)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- RAWG API key (get one free at https://rawg.io/apidocs)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_RAWG_API_KEY=your_rawg_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # React components
│   ├── common/      # Shared components (CoverImage, StatusBadge)
│   ├── game/        # Game-related components
│   ├── layout/      # Layout components (Navigation, AppLayout)
│   ├── stats/       # Statistics components
│   └── timeline/    # Timeline visualization components
├── data/            # Seed data (tags)
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # Services (database, API, export/import)
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Usage

### Adding Games

1. Navigate to "Add Game" from the navigation
2. Search for a game using the RAWG API
3. Click on a game to add it to your collection
4. Games are added with "Backlog" status by default

### Managing Games

- View all games in the "Library" page
- Click on any game to view details and edit:
  - Change status
  - Add rating (1-10 stars)
  - Add/remove tags
  - Upload custom cover art
  - View status history

### Timeline View

- View games organized by status in timeline lanes
- See timeline spans for currently playing games
- Expand/collapse lanes to see games in each status

### Export/Import Data

- Go to Settings to export your data as JSON
- Import previously exported data (will replace existing data)
- All data is stored locally in your browser

## Data Storage

All data is stored locally in your browser using IndexedDB. No data is sent to any server except when searching for games (RAWG API calls).

## License

MIT
