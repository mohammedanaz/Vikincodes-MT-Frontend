import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import useToast from "../Hooks/UseToast";
import CircleSpinner from '../components/Spinners/CircleSpinner'
import ProductApi from "../Api/Product";

export default function AddNewProductPage() {
    const navigate = useNavigate();
    const [variants, setVariants] = useState([{ name: "", options: [""] }]);
    const [errors, setErrors] = useState({ variants: [] });
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useToast();
    const location = useLocation();
    const productCodes = location.state?.productCodes || [[], []];


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: {
            TotalStock: 0,
        }
    });

    const validateVariants = () => {
        const newErrors = { variants: [] };

        variants.forEach((variant, index) => {
            if (!variant.name) {
                if (!newErrors.variants[index]) {
                    newErrors.variants[index] = {};
                }
                newErrors.variants[index].name = "Variant name is required";
            }

            if (variant.options.some(option => !option)) {
                if (!newErrors.variants[index]) {
                    newErrors.variants[index] = {};
                }
                newErrors.variants[index].options = "Sub-variants must be filled";
            }
        });

        setErrors(newErrors);
        return newErrors.variants.every(variant => !variant.name && !variant.options);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log("Image file is - ", file);
        
        if (file) {
            setValue("ProductImage", file);
        }
        else{
            console.log("No File image found...");
        }
    };

    const onSubmit = async (data) => {
        console.log("form data - ", data);

        if (!validateVariants()) return;

        console.log("productCodes, ProductID, ProductCode - ",productCodes[0], productCodes[1], data.ProductID, data.ProductCode);
        console.log(typeof productCodes[0][0], typeof data.ProductID);
        
        if (productCodes[0].includes(Number(data.ProductID))) {
            showToast(`Product ID ${data.ProductID} already exists.`, "error");
            return;
        }

        if (productCodes[1].includes(data.ProductCode)) {
            showToast(`Product Code ${data.ProductCode} already exists.`, "error");
            return;
        }

        const formData = new FormData();

        formData.append("ProductID", data.ProductID);
        formData.append("ProductCode", data.ProductCode);
        formData.append("name", data.ProductName);
        formData.append("TotalStock", data.TotalStock);
        formData.append("variants", JSON.stringify(variants));

        const productImage = data.ProductImage;
        if (productImage) {
            formData.append("ProductImage", productImage);
        }
        else{
            console.log("File image Issue in forn Data");
        }

        try {
            setIsLoading(true)
            const response = await ProductApi.addNewProduct(formData);
            console.log("response at login success -", response);
            setIsLoading(false)
            showToast("Product created successfully.", "success");
            navigate("/adminHome");
        } catch (error) {
            setIsLoading(false)
            console.log("Response error upon Login :", error);
            showToast("Some error while creating product.", "error");
        }

    };

    const addVariant = () => {
        setVariants([...variants, { name: "", options: [""] }]);
    };

    const addSubVariant = (variantIndex) => {
        const newVariants = [...variants];
        newVariants[variantIndex].options.push("");
        setVariants(newVariants);
    };

    const handleVariantChange = (index, value) => {
        const newVariants = [...variants];
        newVariants[index].name = value;
        setVariants(newVariants);
    };

    const handleSubVariantChange = (variantIndex, subVariantIndex, value) => {
        const newVariants = [...variants];
        newVariants[variantIndex].options[subVariantIndex] = value;
        setVariants(newVariants);
    };

    //Loader Component
    if (isLoading) {
        return <CircleSpinner />
    };

    return (
        <div className="w-[90%] md:w-[80%] mx-auto mt-8 my-10 p-6 bg-white rounded-md shadow">
            <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <Label htmlFor="ProductID">Product ID</Label>
                    <Input
                        id="ProductID"
                        type="number"
                        placeholder="Enter Product ID"
                        {...register("ProductID", { required: "Product ID is required" })}
                    />
                    {errors.ProductID && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.ProductID.message}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <Label htmlFor="ProductCode">Product Code</Label>
                    <Input
                        id="ProductCode"
                        placeholder="Enter Product Code"
                        {...register("ProductCode", { required: "Product Code is required" })}
                    />
                    {errors.ProductCode && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.ProductCode.message}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <Label htmlFor="ProductName">Product Name</Label>
                    <Input
                        id="ProductName"
                        placeholder="Enter Product Name"
                        {...register("ProductName", { required: "Product Name is required" })}
                    />
                    {errors.ProductName && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.ProductName.message}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <Label htmlFor="TotalStock">Product Stock</Label>
                    <Input
                        id="TotalStock"
                        placeholder="Enter Product Stock"
                        type="number"
                        defaultValue={0}
                        {...register("TotalStock")}
                    />
                    {errors.TotalStock && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.TotalStock.message}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <Label htmlFor="ProductImage">Product Image</Label>
                    <Input
                        id="ProductImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="mb-4">
                    <div className="flex items-center justify-start">
                        <h2 className="text-lg font-semibold mb-2">Variants</h2>
                        <Button
                            type="button"
                            variant="secondary"
                            className="bg-transparent border-none p-0"
                            onClick={addVariant}
                        >
                            <div className="ms-4 mb-2">
                                <CirclePlus style={{ width: "30px", height: "30px" }} />
                            </div>
                        </Button>
                    </div>
                    {variants.map((variant, index) => (
                        <div key={index} className="border-2 rounded-md p-3 mb-3 bg-slate-50">
                            <h2 className="text-lg font-semibold mb-2">{`Variant-${index + 1}`}</h2>
                            <div className="mb-2">
                                <Input
                                    placeholder={`Variant ${index + 1} Name`}
                                    value={variant.name}
                                    onChange={(e) => handleVariantChange(index, e.target.value)}
                                    className="flex-1"
                                />
                                {errors.variants[index] && errors.variants[index].name && (
                                    <p className="text-red-500 text-sm ml-2">
                                        {errors.variants[index].name}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center justify-start">
                                <h2 className="text-lg font-semibold mb-2">Sub Variants</h2>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="bg-transparent border-none p-0"
                                    onClick={() => addSubVariant(index)}
                                >
                                    <div className="ms-4 mb-2">
                                        <CirclePlus style={{ width: "30px", height: "30px" }} />
                                    </div>
                                </Button>
                            </div>
                            {variant.options.map((option, idx) => (
                                <div key={idx} className="mb-2">
                                    <Input
                                        placeholder={`Sub Variant ${idx + 1} Name`}
                                        value={option}
                                        onChange={(e) => handleSubVariantChange(index, idx, e.target.value)}
                                        className="flex-1"
                                    />
                                    {errors.variants[index] && errors.variants[index].options && (
                                        <p className="text-red-500 text-sm ml-2">
                                            {errors.variants[index].options}
                                        </p>
                                    )}
                                </div>

                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-1/2 mr-2"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>

                    <Button type="submit" className="w-1/2 ml-2">
                        Add Product
                    </Button>
                </div>
            </form>
        </div>
    );
}