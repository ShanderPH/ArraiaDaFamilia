import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutoPocketPlayer } from "./auto-pocket-player";

// Configuration for the media player
const MEDIA_CONFIG = {
    // Choose one of these configurations

    // Spotify configuration
    spotify: {
        type: "spotify",
        // You can use a track, album, or playlist ID
        id: "track/4cOdK2wGLETKBW3PvgPWqT", // Example: Rick Astley - Never Gonna Give You Up
        autoPlay: true,
    },

    // YouTube configuration
    youtube: {
        type: "youtube",
        // YouTube video ID
        id: "qlK8e3T8Brg", // Example: Rick Astley - Never Gonna Give You Up
        autoPlay: true,
    },
};

// Choose which configuration to use
const ACTIVE_MEDIA = MEDIA_CONFIG.youtube; // or MEDIA_CONFIG.youtube

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

            <AutoPocketPlayer
                mediaType={ACTIVE_MEDIA.type}
                mediaId={ACTIVE_MEDIA.id}
                autoPlay={ACTIVE_MEDIA.autoPlay}
            />
        </header>
    );
}

function NavigationLinks() {
    const links = [
        { href: "/", text: "Pratos", active: true },
        { href: "/love-letter", text: "Correio Elegante", active: false },
        { href: "#", text: "Informações", active: false },
    ];

    return (
        <nav className="hidden md:flex md:items-center md:gap-6">
            {links.map((link) => (
                <Link
                    key={link.text}
                    href={link.href}
                    className={`text-sm font-medium ${
                        link.active
                            ? "text-white hover:text-black"
                            : "text-white hover:text-black"
                    }`}
                >
                    {link.text}
                </Link>
            ))}
        </nav>
    );
}
