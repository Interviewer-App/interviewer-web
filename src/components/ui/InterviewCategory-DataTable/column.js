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
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import InterviewCategoryModal from "@/components/interviews/interviewCategoryModal";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const ActionCell = ({ interviewCategoryDetails }) => {
  // const router = useRouter();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await deleteCategory(
        interviewCategoryDetails.categoryId
      );
      if (response.status === 200) {
        toast({
          title: "Sucess",
          description: "Interview Category Deleted sucessfully",
        });
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Category deleting Faild: ${data.message}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unexpected error occurred. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  const handleUpdate = async () => {
    setModalOpen(true);
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
          <DropdownMenuItem onClick={() => handleDelete()}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUpdate()}>
            Update
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {modalOpen && (
        <InterviewCategoryModal
          setModalOpen={setModalOpen}
          isUpdated={true}
          interviewCategoryDetails={interviewCategoryDetails}
        />
      )}
    </>
  );
};

export const columns = [
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
    accessorKey: "categoryName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        categoryName
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "created At",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt); // Parse the date string
      const options = { year: "numeric", month: "long", day: "numeric" };
      return createdAt.toLocaleDateString("en-US", options); // Formats it to "January 16, 2025"
    },
  },
  {
    accessorKey: "color", // New column for color
    header: "Color",
    cell: ({ row }) => {
      const color = row.original.color;
      return (
        <div
          style={{
            backgroundColor: color || "#07090b", // Default to white if no color is provided
            height: "30px",
            width: "30px",
            borderRadius: "50%",
            margin: "auto"
          }}
        ></div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const interviewCategory = row.original;
      return <ActionCell interviewCategoryDetails={interviewCategory} />;
    },
  },
];
