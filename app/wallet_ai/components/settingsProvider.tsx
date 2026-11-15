"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Theme = "dark" | "light";
export type SaveState = "idle" | "saving" | "saved" | "error";

interface SettingsContextValue {
    theme: Theme
    setTheme: (theme: Theme) => void
    temperature: number
    setTemperature: (temperature: number) => void
    saveState: SaveState
}

const SettingsContext = createContext<SettingsContextValue>({
    theme: "dark",
    setTheme: () => {},
    temperature: 0.5,
    setTemperature: () => {},
    saveState: "idle",
});

export function useSettings () {
    return useContext(SettingsContext);
}

const THEME_CACHE_KEY = "wallet_ai_theme";

/**
 * Settings live in the backend (table user_settings) so they follow the user across devices
 * and the AI agent can use the temperature. The theme is also cached in localStorage so the
 * page does not flash the wrong colors while the request is in flight.
 */
export default function SettingsProvider ({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");
    const [temperature, setTemperatureState] = useState<number>(0.5);
    const [saveState, setSaveState] = useState<SaveState>("idle");

    const current = useRef({ theme: "dark" as Theme, temperature: 0.5 });
    const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {

        async function loadSettings () {

            const cachedTheme = localStorage.getItem(THEME_CACHE_KEY);

            if (cachedTheme === "light" || cachedTheme === "dark") {
                current.current.theme = cachedTheme;
                setThemeState(cachedTheme);
            }

            const token = localStorage.getItem("token");

            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/settings/getSettings`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`,
                    }
                })

                const data = await response.json();

                if (response.status != 200) {
                    console.log("Error to get settings: ", data.detail)
                    return
                }

                current.current = { theme: data.theme, temperature: data.temperature };
                setThemeState(data.theme);
                setTemperatureState(data.temperature);
                localStorage.setItem(THEME_CACHE_KEY, data.theme);

            } catch (error) {
                console.log("Error in loadSettings: ", error)
            }
        }

        loadSettings();

        return () => clearTimeout(saveTimer.current);

    }, [])

    function saveSettings (delay: number) {

        clearTimeout(saveTimer.current);
        setSaveState("saving");

        saveTimer.current = setTimeout(async () => {

            const token = localStorage.getItem("token");

            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/settings/updateSettings`, {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(current.current)
                })

                setSaveState(response.status == 200 ? "saved" : "error");

            } catch (error) {
                console.log("Error in saveSettings: ", error)
                setSaveState("error");
            }
        }, delay)
    }

    function setTheme (newTheme: Theme) {
        current.current.theme = newTheme;
        setThemeState(newTheme);
        localStorage.setItem(THEME_CACHE_KEY, newTheme);
        saveSettings(0);
    }

    // The slider fires continuously, so the request is debounced.
    function setTemperature (newTemperature: number) {
        current.current.temperature = newTemperature;
        setTemperatureState(newTemperature);
        saveSettings(500);
    }

    return (
        <SettingsContext.Provider value={{ theme, setTheme, temperature, setTemperature, saveState }}>
            {children}
        </SettingsContext.Provider>
    )
}

/** Wraps the page content: "theme-light" remaps the color tokens (see globals.css). */
export function ThemedArea ({ children }: { children: ReactNode }) {
    const { theme } = useSettings();

    return (
        <div className={"flex min-w-0 flex-1 bg-app-bg text-white transition-colors duration-200 " + (theme === "light" ? "theme-light [color-scheme:light]" : "[color-scheme:dark]")}>
            {children}
        </div>
    )
}
