"use client";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import CreateTeamModal from "@/components/company/create-team-modal";

const ActionCell = ({ companyTeam }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async () => {
    // try {
    //   await deleteCategory(companyTeam.teamId);
    //   alert("Category Deleted: The interview category has been deleted successfully.");
    // } catch (error) {
    //   console.error("Error deleting category:", error);
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete the category. Please try again.",
    //   });
    // }
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
        <CreateTeamModal
          setModalOpen={setModalOpen}
          isUpdated={true}
          companyTeam={companyTeam}
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
    accessorKey: "Email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const companyTeam = row.original;
      return <ActionCell companyTeam={companyTeam} />;
    },
  },
];
