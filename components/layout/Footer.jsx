export default function Footer() {
    const footerLinks = [
        { href: "#", text: "Política de Privacidade" },
        { href: "#", text: "Termos de Uso" },
        { href: "#", text: "Contato" },
    ];

    return (
        <footer className="border-t bg-background px-4 py-6 md:px-6">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-center text-sm text-muted-foreground md:text-left">
                    © Arraiá Família Teixeira 2025.
                </p>
                <div className="flex gap-4">
                    {footerLinks.map((link) => (
                        <a
                            key={link.text}
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            {link.text}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
