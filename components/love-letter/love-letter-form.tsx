"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import Bunting from "@/components/love-letter/bunting";
import { database } from "@/firebaseconfig";
import { ref, push, serverTimestamp } from "firebase/database";
import { toast } from "sonner";

export default function LoveLetterForm() {
    const [sender, setSender] = useState("");
    const [recipient, setRecipient] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 640);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create a reference to the 'loveLetters' collection in your database
            const loveLettersRef = ref(database, "loveLetters");

            // Create a new letter entry with the form data and timestamp
            await push(loveLettersRef, {
                sender,
                recipient,
                message,
                createdAt: serverTimestamp(),
            });

            console.log("Love letter saved successfully!");
            toast.success("Carta enviada com sucesso!", {
                description: `Sua mensagem para ${recipient} foi enviada.`,
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Error saving love letter:", error);
            toast.error("Erro ao enviar carta", {
                description:
                    "Ocorreu um erro ao salvar sua carta. Por favor, tente novamente.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const characterCount = message.length;
    const maxCharacters = 1000;

    if (submitted) {
        return (
            <div className="relative w-full max-w-3xl px-4 mx-auto">
                <Bunting />
                <div className="bg-orange-100 p-4 sm:p-8 rounded-lg shadow-lg text-center mt-10 sm:mt-16 mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-rose-700 mb-4">
                        Carta enviada com sucesso!
                    </h2>
                    <p className="text-base sm:text-lg mb-6">
                        Sua mensagem de amor foi enviada para {recipient}.
                    </p>
                    <Button
                        onClick={() => {
                            setSubmitted(false);
                            setSender("");
                            setRecipient("");
                            setMessage("");
                        }}
                        className="bg-rose-700 hover:bg-rose-800 w-full sm:w-auto"
                    >
                        Enviar outra carta
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-3xl px-4 mx-auto pb-16">
            <Bunting />

            <div className="flex justify-center mb-4 sm:mb-6 mt-10 sm:mt-16">
                <div className="bg-amber-900 py-3 sm:py-4 px-4 sm:px-8 rounded-md transform rotate-0 shadow-lg">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white text-center tracking-wider">
                        {isMobile ? "CORREIO" : "CORREIO DO AMOR"}
                    </h1>
                    {isMobile && (
                        <h2 className="text-2xl font-bold text-white text-center tracking-wider">
                            DO AMOR
                        </h2>
                    )}
                </div>
            </div>

            <Card className="bg-orange-100 p-4 sm:p-6 md:p-8 shadow-lg">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="sender"
                                className="text-base sm:text-lg font-medium text-rose-700"
                            >
                                De (Remetente)
                            </Label>
                            <Input
                                id="sender"
                                value={sender}
                                onChange={(e) => setSender(e.target.value)}
                                className="border-rose-300 focus:border-rose-500 h-10 sm:h-12"
                                placeholder="Seu nome"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="recipient"
                                className="text-base sm:text-lg font-medium text-rose-700"
                            >
                                Para (Destinatário)
                            </Label>
                            <Input
                                id="recipient"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="border-rose-300 focus:border-rose-500 h-10 sm:h-12"
                                placeholder="Nome do destinatário"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="message"
                            className="text-base sm:text-lg font-medium text-rose-700"
                        >
                            Sua mensagem de amor
                        </Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[150px] sm:min-h-[200px] border-rose-300 focus:border-rose-500"
                            placeholder="Escreva sua carta de amor aqui..."
                            maxLength={maxCharacters}
                            required
                            disabled={isSubmitting}
                        />
                        <div className="text-right text-xs sm:text-sm text-gray-500">
                            {characterCount}/{maxCharacters} caracteres
                        </div>
                    </div>

                    <div className="flex justify-center pt-2 sm:pt-4">
                        <Button
                            type="submit"
                            className="bg-rose-700 hover:bg-rose-800 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>Enviando...</>
                            ) : (
                                <>
                                    <Send className="mr-2 h-5 w-5" /> Enviar
                                    Carta
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Decorative elements with adjusted positioning for mobile */}
            <div className="absolute -bottom-10 left-0 w-12 sm:w-20 h-12 sm:h-20 bg-green-500 rounded-full transform -translate-y-1/2 opacity-80"></div>
            <div className="absolute -bottom-6 right-0 w-10 sm:w-16 h-10 sm:h-16 bg-blue-500 rounded-full transform -translate-y-1/2 opacity-80"></div>
        </div>
    );
}
