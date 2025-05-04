# 🎨 Skribbl Front-End (React & Socket.io)

A real-time multiplayer drawing and guessing game built with React and Socket.io. This project replicates the classic Skribbl.io experience, allowing players to sketch and guess words in a fun, interactive environment.

🔗 Live Demo: [skribbl.yagnik.dev](https://skribbl.yagnik.dev)

---

## 🧠 Why I Built This

I wanted to challenge myself by creating a real-time, interactive web application that combines drawing capabilities with multiplayer functionality. This project allowed me to delve deep into WebSocket communications, state management, and real-time data synchronization between clients.

---

## 🚀 Quick Start

> ⚠️ **Important:** Make sure the [backend server](https://github.com/Yagnik-Gohil/skribbl-server) is running before starting the frontend.

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Yagnik-Gohil/skribbl.git
   cd skribbl
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

---

## 📖 Usage

- **Create a Room**: Start a new game session and invite friends.
- **Join a Room**: Enter an existing room code to join a game.
- **Drawing Board**: Use the canvas to draw the given word.
- **Chat**: Guess the word by typing in the chat; correct guesses earn points.
- **Leaderboard**: Track scores and see who's leading the game.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m 'Add your feature'
   ```

4. Push to the branch:

   ```bash
   git push origin feature/YourFeatureName
   ```

5. Open a pull request.

---

## 🛠️ Built With

- [React](https://react.dev/)
- [Socket.io](https://socket.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vite.dev/)

---

## 📄 License

This project is licensed under the MIT License.