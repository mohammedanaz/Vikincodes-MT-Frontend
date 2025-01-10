import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import ProductApi from "../../Api/Product";
import useToast from "../../Hooks/UseToast";
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
    const [inputValue, setInputValue] = useState(0)
    const [open, setOpen] = useState(false);
    const showToast = useToast();

    const handleSubmit = async (action) => {
        try {
            const response = await ProductApi.editStock(inputValue, rowId, action);
            console.log('edit product stock data success- ', response);
            const newStock = response.TotalStock
            onStockUpdate(newStock);
            setOpen(false);
            showToast(`Stock edited successfully.`, "success");
        } catch (error) {
            const {response} = error
            console.error("Error editing product stock data:", response);
            const errMsg = response.data?.newStock ? response.data?.newStock[0] :  response.data[0] || "Some error from server"
            showToast(errMsg, "error");    
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
                        Sell or buy product stock here.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stock" className="text-right">
                            Quantity
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
                        onClick={() => handleSubmit("deduct")}
                    >
                        Sell Stock
                    </Button>
                    <Button
                        onClick={() => handleSubmit("add")}
                    >
                        Buy Stock
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
