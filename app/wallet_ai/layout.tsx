import Menu from "./components/menu";
import ChatAgent from "./components/chatAgent";
import SettingsProvider, { ThemedArea } from "./components/settingsProvider";

export default function Layout ({ children }: LayoutProps<"/wallet_ai"> ) {
    return (
        <>
            <SettingsProvider>
                <div className="flex min-h-dvh w-full flex-1 flex-row bg-app-bg text-white [color-scheme:dark]">
                    <Menu />
                    <ThemedArea>
                        {children}
                    </ThemedArea>
                    <ChatAgent />
                </div>
            </SettingsProvider>
        </>
    )
}
