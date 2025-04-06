import Image from "next/image";
import Header from "@/components/layout/Header";

export default function LandingPage() {
    return (
        <>
            <Header />
            <div className="landing-page relative w-full max-w-3xl p-4 mx-auto">
                <div className="banner-container">
                    <Image
                        src="/icons/banner.svg"
                        alt="Banner Image"
                        width={1200} // Add appropriate width
                        height={300} // Add appropriate height
                        priority
                        className="banner-image"
                    />
                </div>

                {/* Rest of your landing page content */}
            </div>
        </>
    );
}
