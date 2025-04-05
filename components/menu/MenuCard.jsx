"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { database } from "@/firebaseconfig";
import {
    ref,
    push,
    set,
    onValue,
    query,
    orderByChild,
    equalTo,
    get,
} from "firebase/database";

export default function MenuCard({ item }) {
    const { id, name, description, price, image, isNew = false } = item;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [selectedBy, setSelectedBy] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch current selection data and set up real-time listener
    useEffect(() => {
        // Reference to menu selections filtered by this menu item's ID
        const menuItemSelectionsRef = query(
            ref(database, "menuSelections"),
            orderByChild("menuItemId"),
            equalTo(id)
        );

        // Set up real-time listener for changes
        const unsubscribe = onValue(menuItemSelectionsRef, (snapshot) => {
            if (snapshot.exists()) {
                // Get the most recent selection for this menu item
                const selectionsData = snapshot.val();
                const selections = Object.values(selectionsData);

                // Sort by timestamp (descending) to get the most recent selection
                const mostRecentSelection = selections.sort(
                    (a, b) => b.timestamp - a.timestamp
                )[0];

                // Update the selectedBy state
                if (mostRecentSelection) {
                    setSelectedBy(mostRecentSelection.userName);
                }
            } else {
                // No selections found for this menu item
                setSelectedBy(null);
            }
        });

        // Clean up the listener when component unmounts
        return () => unsubscribe();
    }, [id]);

    const handleSelect = () => {
        setIsDialogOpen(true);
    };

    const handleSaveSelection = async () => {
        if (!userName.trim()) return;

        setIsSubmitting(true);

        try {
            // Create a reference to menu selections
            const selectionsRef = ref(database, "menuSelections");
            // Create a new entry with a unique key
            const newSelectionRef = push(selectionsRef);

            // Save the data
            await set(newSelectionRef, {
                menuItemId: id,
                menuItemName: name,
                userName: userName,
                timestamp: Date.now(),
            });

            // The real-time listener will update the UI automatically
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error saving to Firebase:", error);
            alert("Failed to save your selection. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="group relative overflow-hidden rounded-xl bg-background transition-all hover:shadow-lg">
            <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                    src={image || "/placeholder.svg?height=300&width=300"}
                    alt={name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                />
                {isNew && (
                    <Badge className="absolute left-2 top-2 bg-red-600 text-white hover:bg-red-700">
                        Tradicional
                    </Badge>
                )}


                {/* Display user name in the center of the image if selected */}
                {selectedBy && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-md bg-white p-2 text-center">
                            <p className="text-sm font-semibold">
                                Selecionado por
                            </p>
                            <p className="text-lg font-bold">{selectedBy}</p>
                        </div>
                    </div>
                )}

            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                    <span className="font-medium">{price}</span>
                    <Button
                        size="sm"
                        variant={selectedBy ? "outline" : "secondary"}
                        onClick={handleSelect}
                        disabled={isSubmitting}
                    >
                        {selectedBy ? "Alterar" : "Selecionar"}
                    </Button>
                </div>
            </div>

            {/* Dialog for entering name */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Selecionar {name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="mb-4">
                            Por favor, insira seu nome para selecionar este
                            item:
                        </p>
                        <Input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Seu nome"
                            className="w-full"
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isSubmitting}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={handleSaveSelection}
                            disabled={!userName.trim() || isSubmitting}
                        >
                            {isSubmitting ? "Salvando..." : "Confirmar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
