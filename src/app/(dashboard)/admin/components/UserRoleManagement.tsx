'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { UserRoles } from '@/types/constant';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  company?: { department: string };
  role: string;
  interviewStatus?: string;
};

type Props = {
  users: User[];
  onRoleChange?: (userId: number, newRole: string) => void;
};

export default function UserRoleManagementTable({
  users: initialUsers,
  onRoleChange,
}: Props) {
  const [users, setUsers] = React.useState<User[]>(initialUsers);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const handleRoleChange = (user: User, newRole: string) => {
    if (user.role === newRole) {
      toast.info(
        `${user.firstName} already has role ${
          UserRoles[newRole as keyof typeof UserRoles]
        }`
      );
      return;
    }

    // Optimistic local update
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
    );

    toast.success(
      `Updated ${user.firstName}'s role to ${
        UserRoles[newRole as keyof typeof UserRoles]
      }`
    );

    // Optional external callback
    if (onRoleChange) {
      onRoleChange(user.id, newRole);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='text-center'
        >
          ID <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => row.original.id,
    },
    {
      accessorKey: 'name',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: 'Name',
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Button
          variant='outline'
          className='capitalize w-32 justify-start'
          onClick={() => setSelectedUser(row.original)}
        >
          {UserRoles[row.original.role as keyof typeof UserRoles]}
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className='p-6 space-y-4 w-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Role Management</h1>
      </div>

      <div className='flex items-center gap-4'>
        <Input
          placeholder='Search name...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(e) => {
            table.getColumn('name')?.setFilterValue(e.target.value);
          }}
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuItem
                  key={col.id}
                  onSelect={() => col.toggleVisibility()}
                  className='capitalize'
                >
                  {col.id}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='rounded-md border overflow-hidden'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
                  className='text-center h-24'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-end py-4'>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <ChangeRoleModal
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleRoleChange={handleRoleChange}
      />
    </div>
  );
}

export function ChangeRoleModal({
  selectedUser,
  setSelectedUser,
  handleRoleChange,
}: {
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  handleRoleChange: (user: User, newRole: string) => void;
}) {
  const [role, setRole] = React.useState<string>('');

  React.useEffect(() => {
    if (selectedUser) {
      setRole(selectedUser.role); // preselect current role
    }
  }, [selectedUser]);

  const handleSave = () => {
    if (!selectedUser || !role) return;
    if (role === selectedUser.role) {
      toast.info('No role change detected.');
      setSelectedUser(null);
      return;
    }
    handleRoleChange(selectedUser, role);
    setSelectedUser(null);
  };

  return (
    <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
      <DialogTrigger hidden>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-center'>Change Role</DialogTitle>
          <DialogDescription className='flex flex-col items-center gap-4 mt-4 text-slate-200'>
            <p>
              Changing role for{' '}
              <span className='font-bold'>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>
            </p>
            <p className='flex items-center gap-2'>
              From
              <span className='font-bold'>
                {UserRoles[selectedUser?.role as keyof typeof UserRoles]}
              </span>
              to
              <span className='font-bold'>
                {UserRoles[role as keyof typeof UserRoles]}
              </span>
            </p>

            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className='w-[180px] capitalize'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(UserRoles).map((key) => (
                  <SelectItem key={key} value={key} className='capitalize'>
                    {UserRoles[key as keyof typeof UserRoles]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex sm:justify-center mt-5 gap-5'>
          <Button variant='outline' onClick={() => setSelectedUser(null)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
