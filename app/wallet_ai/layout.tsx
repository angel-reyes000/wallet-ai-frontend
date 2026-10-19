import Menu from "./components/menu";

export default function Layout ({ children }: LayoutProps<"/wallet_ai"> ) {
    return (
        <>
            <div className="flex flex-row h-dvh w-full max-w-full bg-gray-200">
                <Menu />
                {children}
            </div>
        </>
    )
}