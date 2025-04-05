import { Button } from "@/components/ui/button";

export default function SearchAndFilter({ title, description }) {
    return (
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="flex w-full items-center gap-2 md:w-auto">
                <Button variant="outline" size="sm">
                    Adicionar Prato
                </Button>
            </div>
        </div>
    );
}
