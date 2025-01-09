import React, { useEffect, useState } from "react"
import ProductApi from "../../Api/Product";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import CircleSpinner from '../Spinners/CircleSpinner'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Link, useNavigate } from "react-router-dom";
import EditStockModal from "../Modals/EditStockModal";

export default function ProductListTable() {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [productData, setProductData] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "ProductName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("ProductName")}</div>,
    },
    {
      accessorKey: "ProductID",
      header: "Product ID",
      cell: ({ row }) => (
        <div>{row.getValue("ProductID")}</div>
      ),
    },
    {
      accessorKey: "ProductCode",
      header: "Product Code",
      cell: ({ row }) => (
        <div>{row.getValue("ProductCode")}</div>
      ),
    },
    {
      id: "productImage",
      header: "Product Image",
      cell: ({ row }) => {
        const { ProductImage } = row.original;
        return (
          <div>
            <img
              src={ProductImage?.thumbnail}
              alt="Product Thumbnail"
              className="w-16 h-16 object-cover cursor-pointer"
              onClick={() => handleImageClick(ProductImage?.medium)}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "TotalStock",
      header: "Total Stock",
      cell: ({ row }) => {
        const value = row.getValue("TotalStock");
        return (
          <div className="">{value ? Number(value).toFixed(2) : "0.00"}</div>
        );
      },
    },
    {
      accessorKey: "CreatedUser",
      header: "Created by",
      cell: ({ row }) => (
        <div className="">{row.getValue("CreatedUser")}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { id } = row.original;
        return (
          <EditStockModal
            stockValue={row.getValue("TotalStock")}
            rowId={id}
            onStockUpdate={(newStock) => handleStockUpdate(id, newStock)}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const table = useReactTable({
    data: productData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true)
        const response = await ProductApi.listProduct();
        console.log('fetch products data success- ', response);
        setProductData(response || []);
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, []);

  const handleStockUpdate = (id, newStock) => {
    setProductData((prevData) =>
      prevData.map((product) =>
        product.id === id
          ? { ...product, TotalStock: newStock }
          : product
      )
    );
  };

  function handleAddProduct() {
    console.log("handleAddProduct() called...");
    const productCodes = [[], []]
    productData.forEach((data) => {
      productCodes[0].push(data.ProductID);
      productCodes[1].push(data.ProductCode);
    });
    navigate("/addNewProduct", { state: { productCodes } });
  };

  function handleImageClick(imageUrl) {
    if (imageUrl) {
      window.open(imageUrl, "_blank");
    }
    else {
      return;
    }
  }

  //Loader Component
  if (isLoading) {
    return <CircleSpinner />
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filters..."
          value={(table.getColumn("ProductName")?.getFilterValue() || "")}
          onChange={(event) =>
            table.getColumn("ProductName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          onClick={() => handleAddProduct()}
        >
          Add New
        </Button>
      </div>
      <div className="rounded-md border p-3 md:p-10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
