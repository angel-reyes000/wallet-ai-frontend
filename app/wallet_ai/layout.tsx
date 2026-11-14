import Menu from "./components/menu";
import ChatAgent from "./components/chatAgent";

export default function Layout ({ children }: LayoutProps<"/wallet_ai"> ) {
    return (
        <>
            <div className="flex flex-row h-auto w-auto bg-[rgb(0,30,0)]">   
                <Menu />
                {children}
                <ChatAgent />
            </div>
        </>
    )
}