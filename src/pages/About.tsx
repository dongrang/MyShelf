export default function About() {
  return (
    <div className="p-4 max-w-2xl mx-auto text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">About GameVault</h1>

      <p className="mb-3">
        GameVault is a personal tracker for your video game backlog. Add games
        you want to play, are currently playing, have finished, or gave up on;
        and keep notes and ratings for each one.
      </p>

      <p className="mb-3">
        Browse the full catalog, filter by status, and search by title. Open any
        game to change its status, jot down a note, or rate it from 1 to 5.
      </p>

      <p className="mb-3">
        You can switch between light and dark themes and toggle between compact
        and comfortable density — both preferences are saved and persist across
        reloads.
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Built with React, React Router, TanStack Query, Zustand, and Tailwind
        CSS, backed by json-server.
      </p>
    </div>
  );
}
