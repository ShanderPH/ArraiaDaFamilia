import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { database } from "@/firebaseconfig";
import { ref, push, set } from "firebase/database";
import { menuCategories } from "@/data/menu";

export default function AddMenuItemDialog({ isOpen, setIsOpen, onItemAdded }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        userName: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            category: value,
        }));
    };

    const handleSubmit = async () => {
        // Validate form
        if (
            !formData.name ||
            !formData.description ||
            !formData.category ||
            !formData.userName
        ) {
            alert("Por favor, preencha todos os campos");
            return;
        }

        setIsSubmitting(true);

        try {
            // Get category value for storing in the database
            const categoryValue = formData.category;

            // Reference to menu items
            const menuItemsRef = ref(database, `menuItems/${categoryValue}`);
            const newItemRef = push(menuItemsRef);

            // Create new item
            const newItem = {
                id: newItemRef.key,
                name: formData.name,
                description: formData.description,
                image: "/icons/input-menu.svg", // Default placeholder image
                timestamp: Date.now(),
            };

            // Save the menu item
            await set(newItemRef, newItem);

            // Also create a selection for this item by the creator
            const selectionsRef = ref(database, "menuSelections");
            const newSelectionRef = push(selectionsRef);

            await set(newSelectionRef, {
                menuItemId: newItemRef.key,
                menuItemName: formData.name,
                userName: formData.userName,
                timestamp: Date.now(),
            });

            // Reset form
            setFormData({
                name: "",
                description: "",
                category: "",
                userName: "",
            });

            // Close dialog
            setIsOpen(false);

            // Notify parent component
            if (onItemAdded) {
                onItemAdded();
            }
        } catch (error) {
            console.error("Error adding new menu item:", error);
            alert("Falha ao adicionar novo item. Por favor, tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Prato</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Nome do Prato
                        </label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nome do prato"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium"
                        >
                            Descrição
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Descrição do prato"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="category"
                            className="text-sm font-medium"
                        >
                            Categoria
                        </label>
                        <Select
                            value={formData.category}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                {menuCategories.map((category) => (
                                    <SelectItem
                                        key={category.value}
                                        value={category.value}
                                    >
                                        {category.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="userName"
                            className="text-sm font-medium"
                        >
                            Seu Nome
                        </label>
                        <Input
                            id="userName"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            placeholder="Seu nome"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isSubmitting}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Salvando..." : "Adicionar Prato"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
