"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuCard from "./MenuCard";
import NewPlate from "./InputItems";
import {
    menuCategories,
    menuProducts as initialMenuProducts,
} from "@/data/menu";
import { database } from "@/firebaseconfig";
import { ref, onValue, get } from "firebase/database";

export default function MenuTabs() {
    const [activeTab, setActiveTab] = useState("especiais");
    const [menuProducts, setMenuProducts] = useState(initialMenuProducts);

    // Function to reload menu items from Firebase
    const loadMenuItems = async () => {
        try {
            // Reference to all menu items categories
            const menuItemsRef = ref(database, "menuItems");

            // Get the static data first
            const menuData = { ...initialMenuProducts };

            // Get any custom items from Firebase
            const snapshot = await get(menuItemsRef);
            if (snapshot.exists()) {
                const firebaseMenuItems = snapshot.val();

                // Merge Firebase data with static data for each category
                Object.keys(firebaseMenuItems).forEach((category) => {
                    const categoryItems = firebaseMenuItems[category];
                    if (categoryItems) {
                        // Convert object of objects to array
                        const itemsArray = Object.values(categoryItems);

                        // If category exists in static data, append items; otherwise create new array
                        if (menuData[category]) {
                            menuData[category] = [
                                ...menuData[category],
                                ...itemsArray,
                            ];
                        } else {
                            menuData[category] = itemsArray;
                        }
                    }
                });
            }

            setMenuProducts(menuData);
        } catch (error) {
            console.error("Error loading menu items:", error);
        }
    };

    // Load menu items on first render
    useEffect(() => {
        loadMenuItems();

        // Set up a real-time listener for menu items
        const menuItemsRef = ref(database, "menuItems");
        const unsubscribe = onValue(menuItemsRef, () => {
            // Reload items when database changes
            loadMenuItems();
        });

        return () => unsubscribe();
    }, []);

    // Handle tab change
    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    // Handler for when a new item is added
    const handleItemAdded = () => {
        // This will trigger the Firebase listener and reload items
        loadMenuItems();
    };

    return (
        <>
            <NewPlate
                title="Cardápio"
                description="Selecione ou adicione um dos pratos típicos da nossa lista"
                onItemAdded={handleItemAdded}
            />

            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="mb-6 w-full justify-start overflow-auto">
                    {menuCategories.map((category) => (

                        <TabsTrigger
                            key={category.value}
                            value={category.value}
                            className="text-sm"
                        >
                            {category.label}
                        </TabsTrigger>
                    ))}
                </TabsList>


                {menuCategories.map((category) => (
                    <TabsContent
                        key={category.value}
                        value={category.value}
                        className="mt-0"
                    >
                        <h2 className="mb-6 text-2xl font-bold">
                            {category.label}
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {menuProducts[category.value]?.map((product) => (
                                <MenuCard key={product.id} item={product} />
                            ))}
                            {!menuProducts[category.value] ||
                            menuProducts[category.value].length === 0 ? (
                                <p className="text-muted-foreground col-span-full text-center py-8">
                                    Nenhum item disponível nesta categoria.
                                    Adicione um novo prato!
                                </p>
                            ) : null}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </>
    );
}
