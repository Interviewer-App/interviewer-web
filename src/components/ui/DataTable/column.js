"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { Checkbox } from "../checkbox";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { deleteUser } from "@/lib/api/users";

const ActionCell = ({ user }) => {
  const router = useRouter();
  const { toast } = useToast();


  const handleDelete = async () => {
    try {
      const response = await deleteUser(
        user.userID
      );
      if (response.status === 200) {
        toast({
          title: "Sucess",
          description: "User Deleted sucessfully",
        });
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `User deleting Faild: ${data.message}`,
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

  return (
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
          {/* <DropdownMenuItem onClick={() => handleUpdate()}>
            Update
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role", 
    header: "Role",
  },
  {
    accessorKey: "userID",  
    header: "User ID",
  },
  {
    accessorKey: "createdAt", 
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt); // Parse the date string
      // const options = { year: 'numeric', month: 'long', day: 'numeric', };
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true // Use 12-hour format (AM/PM)
      };
      return createdAt.toLocaleDateString('en-US', options); // Formats it to "January 16, 2025"
    },
  },
  {
    accessorKey: "updatedAt", 
    header: "Updated At",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.updatedAt); // Parse the date string
      // const options = { year: 'numeric', month: 'long', day: 'numeric', };
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true // Use 12-hour format (AM/PM)
      };
      return createdAt.toLocaleDateString('en-US', options); // Formats it to "January 16, 2025"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return <ActionCell user={user} />;
    },
  },
];
