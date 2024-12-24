# Simpify

A simplified web client for Spotify.

## Features

- Music Playback
- Music Browsing
- Music Control
- Liked Songs
- Followed Playlists
- Followed artists
- Liked albums

## Installation

Make sure you have [Node.js](https://nodejs.org/) installed.

Follow these steps to set up and run the project locally:

1. Clone the repository:

   ```bash
   git clone https://git@github.com:allan1in/simpify.git
   ```

2. Navigate into the project directory:

   ```bash
   cd simpify
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the project and record the project's running address, which will serve as **_your redirect URL_**. For example, if your project runs at `http://localhost:5173/`, then your redirect URL would be `https://localhost:5173/login`:

   ```bash
   npm run dev
   ```

5. [Create your Spotify app](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app), then populate the `.env` file with `VITE_CLIENT_ID` and `VITE_REDIRECT_URL`, corresponding to the client id and redirect URL in your [dashboard](https://developer.spotify.com/dashboard). The client ID will be generated automatically, and the redirect URL is referenced in step four:

   ```
   VITE_CLIENT_ID=your-client-id  # Replace with your actual client ID
   VITE_REDIRECT_URL=your-redirect-url  # Replace with your actual redirect URL
   ```

6. Restart your service by pressing `Ctrl + C`, then execute the command from step four.

## TODOS

- Adapt for mobile devices
- Playlist Management
- Profile Management

## License

This project is licensed under the [MIT License](LICENSE).
