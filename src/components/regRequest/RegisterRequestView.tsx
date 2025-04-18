import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from '@/layouts/dashboard';

import { Scrollbar } from '@/components/scrollbar';

import { TableNoData } from '@/sections/tableUtils/table-no-data';
import { UserTableRow } from '@/sections/tableUtils/user-table-row';
import { UserTableHead } from '@/sections/tableUtils/user-table-head';
import { TableEmptyRows } from '@/sections/tableUtils/table-empty-rows';
import { UserTableToolbar } from '@/sections/tableUtils/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '@/sections/tableUtils/utils';

import { PendingUser } from '@/types/userInfo';

import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { fetchPendingUser } from '@/redux/slices/pendingUserSlice';
import { allowPendingUsers, rejectPendingUsers } from '@/services/userService';
import { userList } from '@/constants/userTable';

// ----------------------------------------------------------------------

export default function RegRequestView() {
  // const user = getCurrentUser
  const table = useTable();
  const [filterName, setFilterName] = useState('');

  const pendingUserData = useAppSelector((state) => state.pendingUser.pendingUsers)
  const dispatch = useAppDispatch()

  const dataFiltered: PendingUser[] = applyFilter({
    inputData: pendingUserData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleSelectedUsers = (state: boolean) => {
    if(state) {
      allowPendingUsers(table.selected, dispatch(fetchPendingUser()))
    } else {
      rejectPendingUsers(table.selected, dispatch(fetchPendingUser()))
    }
    table.onSelectAllRows(false, []);
  }

  useEffect(() => {
    dispatch(fetchPendingUser())
  }, [])

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}> 
        <Typography variant="h4" flexGrow={1}>
          User list
        </Typography>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onButtonAction={handleSelectedUsers}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={pendingUserData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    pendingUserData.filter((user: any) => !user.allowed && !user.rejected).map((user: any) => user.id)
                  )
                }
                checkableCount={pendingUserData.filter((user: any) => !user.allowed && !user.rejected).map((user: any) => user.id).length}
                headLabel={userList}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      headList={userList}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, pendingUserData.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={pendingUserData.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
