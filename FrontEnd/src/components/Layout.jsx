import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <Navbar />
      </header>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
