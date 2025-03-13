import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize(); // Check on initial load
    window.addEventListener("resize", checkScreenSize); 

    return () => window.removeEventListener("resize", checkScreenSize); 
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-block">
        <h1>🚫 Not Available on Mobile</h1>
        <p>Please use a PC or Laptop to access this platform.</p>
      </div>
    );
  }
  return <Component {...pageProps} />;
}
