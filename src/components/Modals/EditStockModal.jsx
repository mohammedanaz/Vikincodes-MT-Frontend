import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import ProductApi from "../../Api/Product";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditStockModal({ stockValue = 0, rowId, onStockUpdate  }) {
    const [inputValue, setInputValue] = useState(stockValue)
    const [open, setOpen] = useState(false);

    const handleSubmit = async () => {
        try {
            console.log(inputValue, rowId);
            const response = await ProductApi.editStock(inputValue, rowId);
            console.log('edit product stock data success- ', response);
            onStockUpdate(inputValue);
            setOpen(false);
        } catch (error) {
            console.error("Error editing product stock data:", error);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                asChild
                onClick={() => setInputValue(stockValue)}
            >
                <Button variant="outline" onClick={() => setOpen(true)}>
                    Edit Stock
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Stock</DialogTitle>
                    <DialogDescription>
                        Make changes to your product stock here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stock" className="text-right">
                            New Stock
                        </Label>
                        <Input
                            id="stock"
                            type="number"
                            value={inputValue}
                            className="col-span-3"
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => handleSubmit()}
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
