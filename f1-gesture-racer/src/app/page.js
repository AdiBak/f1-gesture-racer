import HandTracker from "./components/HandTracker";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">F1 Gesture Racer</h1>
      <div className="w-[640px] h-[480px] border-2 border-white">
        <HandTracker />
      </div>
    </main>
  );
}
