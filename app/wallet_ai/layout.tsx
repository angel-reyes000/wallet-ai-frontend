import Menu from "./components/menu";
import ChatAgent from "./components/chatAgent";

export default function Layout ({ children }: LayoutProps<"/wallet_ai"> ) {
    return (
        <>
            <div className="flex flex-row h-auto w-full max-w-full bg-gray-200">
                <Menu />
                {children}
                <ChatAgent />
            </div>
        </>
    )
}