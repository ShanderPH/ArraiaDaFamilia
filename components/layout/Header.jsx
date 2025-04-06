"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Home, Info } from "lucide-react";
import { AutoPocketPlayer } from "./auto-pocket-player";
import { useState, useEffect } from "react";

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
    const [isMobile, setIsMobile] = useState(false);

    // Check if the screen is mobile size
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkIfMobile();

        // Add event listener
        window.addEventListener("resize", checkIfMobile);

        // Clean up
        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    return (
        <>
            {/* Standard Header for all devices */}
            <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-primary px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <Image
                        src="/logo-arraia.svg"
                        width={100}
                        height={70}
                        alt="Arraiá"
                    />
                </div>

                {/* Desktop Navigation */}
                <DesktopNavigation />

                <AutoPocketPlayer
                    mediaType={ACTIVE_MEDIA.type}
                    mediaId={ACTIVE_MEDIA.id}
                    autoPlay={ACTIVE_MEDIA.autoPlay}
                />
            </header>

            {/* Mobile Bottom Navigation Bar */}
            {isMobile && <MobileNavigation />}
        </>
    );
}

function DesktopNavigation() {
    const links = [
        { href: "/", text: "Pratos", active: true },
        { href: "/love-letter", text: "Correio Elegante", active: false },
        { href: "/landing", text: "Informações", active: false },
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

function MobileNavigation() {
    const navItems = [
        {
            href: "/",
            text: "Pratos",
            icon: <Home className="h-6 w-6" />,
            active: true,
        },
        {
            href: "/love-letter",
            text: "Correio Elegante",
            icon: <Mail className="h-6 w-6" />,
            active: false,
        },
        {
            href: "/landing",
            text: "Informações",
            icon: <Info className="h-6 w-6" />,
            active: false,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-primary px-4 md:hidden">
            {navItems.map((item) => (
                <Link
                    key={item.text}
                    href={item.href}
                    className={`flex flex-col items-center justify-center ${
                        item.active ? "text-white" : "text-gray-300"
                    }`}
                >
                    {item.icon}
                    <span className="mt-1 text-xs">{item.text}</span>
                </Link>
            ))}
        </nav>
    );
}
