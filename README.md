# Uber Eats Menu Scraper

A Node.js application that scrapes menu data from Uber Eats using BullMQ for job queue management and Redis for persistence.

## Features

- **Queue-based scraping**: Uses BullMQ to manage scraping jobs with Redis backend
- **Menu item extraction**: Scrapes individual menu items with detailed information
- **Customization parsing**: Extracts nested customization options and pricing
- **CSV export**: Generates structured CSV files for analysis
- **Error handling**: Robust error handling and job failure tracking

## Project Structure

```
uber-eats/
├── index.mjs              # Main application entry point
├── data.mjs               # Menu item data configuration
├── download.mjs           # Download/scraping logic
├── client.js              # Browser-based scraping client
├── db/                    # Raw JSON files from scraping
├── db.processed/          # Processed JSON files
├── output/                # Generated CSV files
├── jsons.ref/             # Reference JSON files
└── package.json           # Dependencies and scripts
```

## Prerequisites

- Node.js (v16 or higher)
- Redis server running locally or remotely
- npm or yarn package manager

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd uber-eats
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Redis server** (if not already running):
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start redis-server
   
   # On macOS with Homebrew
   brew services start redis
   
   # Or run directly
   redis-server
   ```

## Configuration

### Data Configuration (`data.mjs`)

The `data.mjs` file contains the menu items to scrape. Each item requires:

```javascript
{
  menuItemUuid: "unique-uuid",
  sectionUuid: "section-uuid", 
  storeUuid: "store-uuid",
  subsectionUuid: "subsection-uuid"
}
```

To get the above data, go to the respective uber eats website and run:

```javascript
$$(<classname>).map(ele=>extractUberEatsContext(ele.href))
```
extractUberEatsContext function is implemented in client.js

Load the extracted data into data.mjs

## Usage

### Running the Scraper

1. **Start the application**:
   ```bash
   node index.mjs
   ```

2. **Monitor progress**: The application will:
   - Add jobs to the queue
   - Process each menu item
   - Download JSON data to `db/` folder
   - Generate CSV files in `output/` folder

### Output Files

The application generates two CSV files:

#### 1. `output/items.csv`
Contains basic menu item information:
- `id`: Item UUID
- `itemname`: Item name
- `price`: Base price (in cents)
- `popular`: Whether item is marked as popular
- `itemDescription`: Item description
- `imageUrl`: Item image URL

#### 2. `output/customizations.csv`
Contains detailed customization options:
- `itemname`: Parent item name
- `item_uuid`: Parent item UUID
- `item_price`: Parent item price
- `customization_title`: Customization category
- `option_title`: Specific option name
- `option_price`: Option price (if any)
- `option_uuid`: Option UUID
