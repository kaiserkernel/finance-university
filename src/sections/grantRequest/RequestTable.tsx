import { DashboardContent } from "@/layouts/dashboard";
import { getCurrentUser } from "@/services/authService";
import {
  approveRequest,
  askMoreInfo,
  rejectRequest,
  reviewRequest,
} from "@/services/grantService";
import {
  Box,
  Card,
  Table,
  TableContainer,
  TablePagination,
  Typography
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Scrollbar } from "@/components/scrollbar";
import { UserTableHead } from "@/components/table/request-table-head";
import { UserTableToolbar } from "@/components/table/request-table-toolbar";
import { TableBody } from "@mui/material";
import { UserTableRow } from "@/components/table/request-table-row";
import { TableEmptyRows } from "@/components/table/request-empty-rows";
import { TableNoData } from "@/components/table/request-no-data";
import { applyFilter, emptyRows, getComparator } from "../tableUtils/utils";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { getAnnouncements } from "@/services/announcementServices";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchRequestData } from "@/redux/slices/requestSlice";
import { columns } from "@/constants/requestTableColumns";

type Props = {};

export default function RequestTable({ }: Props) {
  const userInfo = getCurrentUser();

  const [announcements, setAnnouncements] = useState<any>([]);
  const [tableData, setFilteredData] = useState<any>([]);
  const [filterName, setFilterName] = useState("");

  const dispatch = useAppDispatch()
  const requestData = useAppSelector(state => state.request.data)

  const table = useTable();

  const dataFiltered: any[] = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleAccept = async (id: string, prevState?: string) => {
    try {
      // if (prevState === 'reviewed' && userInfo.role !== "finance") {
      if (prevState === 'reviewed') {
        await reviewRequest(id);
        toast.success("Application approved");
      } else {
        await approveRequest(id);
        toast.success("Application approved");
      }
  
      dispatch(fetchRequestData());
      return true; // Return true if successful
    } catch (error) {
      if (isAxiosError(error)) {
        error.response?.data.msg.forEach((str: string) => {
          toast.error(str);
        });
      } else {
        toast.error("Error occurred. Please try again");
      }
      return false; // Return false on error
    }
  };

  const handleDeny = (id: string) => {
    rejectRequest(id)
      .then((_) => {
        toast.success("Application rejected");
        dispatch(fetchRequestData())
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          error.response?.data.msg.map((str: string) => {
            toast.error(str);
          });
        }
        else
          toast.error("Error occured. Please try again");
      });
  };

  const handleAskInfo = (id: string, value: boolean) => {
    askMoreInfo(id, value, () => dispatch(fetchRequestData()))
  }

  const selecteAnnouncement = (ann: string) => {
    setFilteredData(
      requestData.filter((item: any) => ann == "" || item.announcement._id == ann)
    );
  };

  useEffect(() => {
    let filterData = requestData;
    if (userInfo.role === "col_dean") {
      filterData = requestData.filter((item: any) => item.college === userInfo.college);
    }
    setFilteredData(filterData);
  }, [requestData]);

  useEffect(() => {
    dispatch(fetchRequestData())
    getAnnouncements()
      .then((res) => {
        setAnnouncements(res.data);
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          error.response?.data.msg.map((str: string) => {
            toast.error(str);
          });
        }
        else
          toast.error("Error occured. Please try again");
      });
  }, []);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          {userInfo.role === "user" ? "My Request" : "Request list"}
        </Typography>
        <Typography variant="h5">{ }</Typography>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          announcements={announcements}
          filterByAnnouncement={selecteAnnouncement}
          onFilterName={(name: string) => {
            setFilterName(name);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={requestData?.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    requestData?.map((user: any) => user?.id)
                  )
                }
                headLabel={columns}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      headList={columns}
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onAccept={handleAccept}
                      onDeny={handleDeny}
                      onAskInfo={handleAskInfo}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    requestData?.length
                  )}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={requestData?.length}
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
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback(
    (checked: boolean, newSelecteds: string[]) => {
      if (checked) {
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    },
    []
  );

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
