import Link from "next/link";
import LoveLetterForm from "@/components/love-letter/love-letter-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";

export default function LoveLetter() {
    return (
        <>
            <Header />
            <main className="min-h-screen flex flex-col">
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <Button
                            variant="secondary"
                            className="bg-transparent flex gap-1 hover:bg-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                        </Button>
                    </Link>
                </div>
                <div className="flex justify-center mb-6 mt-16">
                    <LoveLetterForm />
                </div>
            </main>
        </>
    );
}
