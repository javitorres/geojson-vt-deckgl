# geojson-vt-deckgl

Example on using geojson-vt to stream heavy geojsons (hundreds of MB) to Deck.gl

# Usage

## Build Docker image

docker build -t geojson-vt-deckgl .

## Run Docker container

docker run -p 3000:3000 --name geojsonvtdeckgl geojson-vt-deckgl

## Access the app

http://localhost:3000/