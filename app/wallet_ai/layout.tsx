import Menu from "./components/menu";
import ChatAgent from "./components/chatAgent";

export default function Layout ({ children }: LayoutProps<"/wallet_ai"> ) {
    return (
        <>
            <div className="flex min-h-dvh w-full flex-1 flex-row bg-app-bg text-white [color-scheme:dark]">
                <Menu />
                {children}
                <ChatAgent />
            </div>
        </>
    )
}
