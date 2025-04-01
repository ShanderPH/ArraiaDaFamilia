import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuCard from "./MenuCard";
import SearchAndFilter from "./SearchAndFilter";
import { menuCategories, menuProducts } from "@/data/menu";

export default function MenuTabs() {
    // Usando os dados importados do arquivo de dados
    const categories = menuCategories;
    const specialProducts = menuProducts.especiais;
    const dessertProducts = menuProducts.sobremesas;

    return (
        <>
            <SearchAndFilter
                title="Cardápio"
                description="Selecione um dos pratos típicos da nossa lista"
            />

            <Tabs defaultValue="especiais" className="w-full">
                <TabsList className="mb-6 w-full justify-start overflow-auto">
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category.value}
                            value={category.value}
                            className="text-sm"
                        >
                            {category.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Conteúdo para "Sanduíches Especiais" */}
                <TabsContent value="especiais" className="mt-0">
                    <h2 className="mb-6 text-2xl font-bold">Pratos Salgados</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {specialProducts.map((product) => (
                            <MenuCard key={product.id} item={product} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="sobremesas" className="mt-0">
                    <h2 className="mb-6 text-2xl font-bold">Sobremesas</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {dessertProducts.map((product) => (
                            <MenuCard key={product.id} item={product} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}
