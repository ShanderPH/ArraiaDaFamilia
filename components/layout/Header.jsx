import Image from "next/image";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-primary px-4 md:px-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Arraiá</span>
                </Button>
                <Image
                    src="/logo-arraia.svg"
                    width={100}
                    height={70}
                    alt="Arraiá"
                />
            </div>
            <NavigationLinks />

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
                <Button variant="ghost" size="icon">
                    <ShoppingBag className="h-5 w-5" />
                    <span className="sr-only">Cart</span>
                </Button>
            </div>
        </header>
    );
}

function NavigationLinks() {
    const links = [
        { href: "#", text: "Pratos", active: true },
        { href: "#", text: "Correio do Amor", active: false },
        { href: "#", text: "Informações", active: false },
    ];

    return (
        <nav className="hidden md:flex md:items-center md:gap-6">
            {links.map((link) => (
                <a
                    key={link.text}
                    href={link.href}
                    className={`text-sm font-medium ${
                        link.active
                            ? "text-white hover:text-black"
                            : "text-white hover:text-black"
                    }`}
                >
                    {link.text}
                </a>
            ))}
        </nav>
    );
}
