import { useEffect, useState } from "react";
import Login from '@/src/components/login';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", () => setIsMobile(window.innerWidth < 1024));
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-black text-white">
        <h1 className="text-3xl">🚫 Not Available on Mobile</h1>
        <p className="text-gray-400">Please use a PC or Laptop.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-animated">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-70"></div>

      {/* Calling Login Component */}
      <Login />

      <style jsx global>{`
        body {
          background: radial-gradient(circle, rgba(255, 0, 0, 0.2) 0%, rgba(0, 0, 0, 1) 80%);
        }
      `}</style>
    </div>
  );
}