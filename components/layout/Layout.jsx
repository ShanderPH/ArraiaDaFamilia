import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">{children}</div>
            </main>
            <Footer />
        </div>
    );
}
