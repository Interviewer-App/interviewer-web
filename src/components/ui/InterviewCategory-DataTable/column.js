"use client";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { MoreHorizontal } from "lucide-react";
import { deleteCategory } from "@/lib/api/interview-category";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import InterviewCategoryModal from "@/components/interviews/interviewCategoryModal";

const ActionCell = ({ interviewCategoryDetails }) => {
  // const router = useRouter();

        const [modalOpen,setModalOpen]= useState(false);

      const handleDelete = async () => {
        try {
          
          await deleteCategory(interviewCategoryDetails.categoryId);
          alert("Category Deleted: The interview category has been deleted successfully.");
        } catch (error) {
          console.error("Error deleting category:", error);
          toast({
            title: "Error",
            description: "Failed to delete the category. Please try again.",
          });
        }
      };
      
      const handleUpdate = async () => {
        setModalOpen(true)
        
      };

  return (
    <>
    <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete()}>Delete</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdate()}>Update</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {modalOpen && <InterviewCategoryModal setModalOpen={setModalOpen} isUpdated={true} interviewCategoryDetails={interviewCategoryDetails}/>}
        </>
  );
};


export const columns = [
  
  {
    accessorKey: "categoryId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        CategoryId
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "categoryName", 
    header: "Category Name",
  },
  {
    accessorKey: "description",  
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const interviewCategory = row.original;
      return <ActionCell interviewCategoryDetails={interviewCategory} />;
    },
  },
];