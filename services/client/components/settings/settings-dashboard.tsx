"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  BarChart2,
  CheckCircle,
  ChevronDown,
  MoreHorizontal,
  Percent,
  Star,
  TrendingUp,
  XCircle,
  Youtube,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { mockVideos as videos } from "@/mocks/mocks";
import { Video } from "@/lib/types/types";

export const columns: ColumnDef<Video>[] = [
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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => <div>{row.getValue("duration")}</div>,
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const progress = row.getValue("progress") as number;
      return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      );
    },
  },
  {
    accessorKey: "completed",
    header: "Status",
    cell: ({ row }) => {
      const completed = row.getValue("completed") as boolean;
      return (
        <div
          className={`flex items-center ${
            completed ? "text-green-500" : "text-red-500"
          }`}
        >
          {completed ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {/* Hide the text on small screens */}
          <span className="ml-2 hidden sm:inline">
            {completed ? "Completed" : "Incomplete"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastWatched",
    header: "Last Watched",
    cell: ({ row }) => <div>{row.getValue("lastWatched")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const video = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(video.id)}
            >
              Copy video ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View video details</DropdownMenuItem>
            <DropdownMenuItem>
              Mark as {video.completed ? "incomplete" : "complete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function VideoStatistics() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: videos,
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

  const completedVideos = videos.filter((video) => video.completed).length;
  const totalVideos = videos.length;
  const incompleteVideos = totalVideos - completedVideos;
  const overallProgress = Math.round(
    (videos.reduce((sum, video) => sum + video.progress, 0) /
      (totalVideos * 100)) *
      100,
  );
  const averageProgress = Math.round(
    videos.reduce((sum, video) => sum + video.progress, 0) / totalVideos,
  );
  const completionRate = Math.round((completedVideos / totalVideos) * 100);
  const latestVideo = videos.reduce((latest, video) =>
    new Date(video.lastWatched) > new Date(latest.lastWatched) ? video : latest,
  );

  const totalPages = table.getPageCount();

  return (
    <div className="w-full space-y-4 p-4 sm:p-6 lg:p-8">
      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<CheckCircle className="h-10 w-10 text-green-500" />}
          title="Completed Videos"
          value={`${completedVideos} / ${totalVideos}`}
        />
        <StatCard
          icon={<XCircle className="h-10 w-10 text-red-500" />}
          title="Incomplete Videos"
          value={incompleteVideos.toString()}
        />
        <StatCard
          icon={<BarChart2 className="h-10 w-10 text-blue-500" />}
          title="Overall Progress"
          value={`${overallProgress}%`}
        />
        <StatCard
          icon={<Youtube className="h-10 w-10 text-purple-500" />}
          title="Total Videos"
          value={totalVideos.toString()}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<TrendingUp className="h-10 w-10 text-yellow-500" />}
          title="Average Progress"
          value={`${averageProgress}%`}
        />
        <StatCard
          icon={<Percent className="h-10 w-10 text-indigo-500" />}
          title="Completion Rate"
          value={`${completionRate}%`}
        />
        <StatCard
          icon={<Star className="h-10 w-10 text-orange-500" />}
          title="Latest Video Watched"
          value={latestVideo.title}
        />
      </div>

      {/* Search and Sort Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-4">
        {/* Search Input */}
        <Input
          placeholder="Filter titles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mb-4 sm:mb-0"
        />
        {/* Columns Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Section - Hidden on Small Screens */}
      <div className="rounded-md border overflow-hidden hidden sm:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-2 py-3 text-xs sm:px-4 sm:py-4 sm:text-sm"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
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
                    <TableCell
                      key={cell.id}
                      className="px-2 py-3 text-xs sm:px-4 sm:py-4 sm:text-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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

      {/* Alternative Content for Small Screens */}
      <div className="block sm:hidden">
        {table.getRowModel().rows.map((row) => {
          const video = row.original;
          return (
            <Card key={row.id} className="mb-4">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="ml-2 font-medium">{video.title}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${video.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{video.progress}%</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Last Watched: {video.lastWatched}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination Section - Hidden on Small Screens */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 py-4 hidden sm:flex">
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
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={
                  table.getState().pagination.pageIndex + 1 === index + 1
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => table.setPageIndex(index)}
              >
                {index + 1}
              </Button>
            ))}
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
      )}
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <Card className="flex items-center justify-center">
      <CardContent className="flex items-center justify-center p-6">
        {icon}
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-primary">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
