"use client";
import React, { useEffect } from "react";

// Apply theme to the document root
export const applyTheme = (theme) => {
    // setVariableCSS(theme)
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    if (theme === "auto") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }
};

export default function ThemeProvider({ children }) {
    useEffect(() => {
        const savedTheme = (localStorage.getItem("theme")) || "auto";
        applyTheme(savedTheme);
    }, []);

    return children;
}
