import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddMenuItemDialog from "./AddMenuItemDialog";

export default function NewPlate({ title, description, onItemAdded }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddButtonClick = () => {
        setIsDialogOpen(true);
    };

    return (
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="flex w-full items-center gap-2 md:w-auto">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddButtonClick}
                >
                    Adicionar Prato
                </Button>
            </div>

            {/* Add Menu Item Dialog */}
            <AddMenuItemDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onItemAdded={onItemAdded}
            />
        </div>
    );
}
