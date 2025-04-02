"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";

export function CandidateDataTable({ columns, data, interviewId }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();
  const { toast } = useToast();

  const table = useReactTable({
    data,
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

  const exportToPDF = () => {
    // Initialize jsPDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add a title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Candidate Interview Report", 14, 20);

    // Add metadata (e.g., Interview ID and Date)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Interview ID: ${interviewId}`, 14, 30);
    doc.text(`Generated on: ${currentDate}`, 14, 36);

    // Get visible columns
    const visibleColumns = table
      .getAllColumns()
      .filter((column) => column.getIsVisible());

    // Define headers based on visible columns
    const headers = visibleColumns.map((column) => {
      switch (column.id) {
        case "email":
          return "Candidate Email";
        case "candidateName":
          return "Candidate Name";
        case "startDate":
          return "Interview Date";
        case "startTime":
          return "Start Time";
        case "EndTime":
          return "End Time";
        case "status":
          return "Interview Status";
        default:
          return "";
      }
    });

    // Extract and format data for each row and visible column
    const body = table.getRowModel().rows.map((row) => {
      return visibleColumns.map((column) => {
        switch (column.id) {
          case "email":
            return row.original.candidate.email;
          case "candidateName":
            return row.original.candidate.fullName;
          case "startDate":
            const startDate = new Date(row.original.startTime);
            return startDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          case "startTime":
            const startTime = new Date(row.original.startTime);
            return startTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          case "EndTime":
            const endTime = new Date(row.original.endTime);
            return endTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          case "status":
            return row.original.invitationStatus.status;
          default:
            return "";
        }
      });
    });

    // Define column widths (in mm) for better layout control
    const columnWidths = visibleColumns.map((column) => {
      switch (column.id) {
        case "email":
          return 50; // Wider for email
        case "candidateName":
          return 40;
        case "startDate":
          return 30;
        case "startTime":
          return 25;
        case "EndTime":
          return 25;
        case "status":
          return 25;
        default:
          return 20;
      }
    });

    // Add the table with custom styling
    autoTable(doc, {
      startY: 40, // Start table below the header
      head: [headers],
      body: body,
      columnStyles: {
        0: { cellWidth: columnWidths[0] }, // Apply custom widths
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4] },
        5: { cellWidth: columnWidths[5] },
      },
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: "linebreak", // Handle long text
      },
      headStyles: {
        fillColor: [41, 128, 185], // Blue header background
        textColor: [255, 255, 255], // White text
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternate rows
      },
      margin: { top: 40, left: 14, right: 14 },
      didDrawPage: (data) => {
        // Add footer with page number
        const pageCount = doc.internal.getNumberOfPages();
        const pageNumber = data.pageNumber;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${pageNumber} of ${pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          "Generated by Coullax Interview System",
          doc.internal.pageSize.width - 60,
          doc.internal.pageSize.height - 10
        );
      },
    });

    // Add a summary section (optional)
    const finalY = doc.lastAutoTable.finalY || 40; // Position after the table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, finalY + 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Candidates: ${body.length}`, 14, finalY + 16);

    // Save the PDF
    doc.save(`Candidate_Report_${interviewId}.pdf`);
    toast({
      title: "Exported to PDF",
      description: "The candidate report has been exported to PDF.",
    });
  };

  const handleCandidateDetail = (row) => {
    router.push(
      `/interviews/${interviewId}/candidate-details?candidateId=${encodeURIComponent(
        row.original.candidate.candidateId
      )}&sessionId=${encodeURIComponent(
        row.original?.interviewSession?.sessionId
      )}`
    );
  };

  return (
    <div className="px-6">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter candidate by their email..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="max-w-[120px]"
            onClick={exportToPDF}
          >
            Export PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="max-w-[120px] ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-black bg-opacity-100 shadow-lg"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        setColumnVisibility((prev) => ({
                          ...prev,
                          [column.id]: value,
                        }));
                        column.toggleVisibility(!!value);
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="p-4 text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.filter((row) => row.original.interviewSession !== null)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCandidateDetail(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="p-4 border-b md:border-none"
                      >
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
    </div>
  );
}
