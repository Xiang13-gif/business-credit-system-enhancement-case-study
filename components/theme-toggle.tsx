"use client";

import { Moon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui";

const STORAGE_KEY = "gccm-theme";

export function ThemeToggle() {
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  const toggle = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    window.localStorage.setItem(STORAGE_KEY, nextDark ? "dark" : "light");
  };

  return (
    <Button onClick={toggle} variant="secondary">
      <Moon className="h-4 w-4" />
      Theme
    </Button>
  );
}
