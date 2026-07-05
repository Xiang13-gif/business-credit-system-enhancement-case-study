"use client";

import { Moon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui";

export function ThemeToggle() {
  useEffect(() => {
    const stored = window.localStorage.getItem("creditflow-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  const toggle = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    window.localStorage.setItem("creditflow-theme", nextDark ? "dark" : "light");
  };

  return (
    <Button onClick={toggle} variant="secondary">
      <Moon className="h-4 w-4" />
      Theme
    </Button>
  );
}
