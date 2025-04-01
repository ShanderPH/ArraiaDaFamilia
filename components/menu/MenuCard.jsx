import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MenuCard({ item }) {
    const { name, description, price, image, isNew = false } = item;

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
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                    <span className="font-medium">{price}</span>
                    <Button size="sm" variant="secondary">
                        Selecionar
                    </Button>
                </div>
            </div>
        </div>
    );
}
