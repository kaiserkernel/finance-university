import React from "react";
import { Link, Typography } from "@mui/material";
import { MenuList, Popover } from "@mui/material";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";

import { getCurrentUser } from "@/services/authService";

type Props = {
  rowData: any;
  openPopover: HTMLButtonElement | null;
  handleClosePopover: () => void;
};

const DocPopover: React.FC<Props> = ({
  rowData,
  openPopover,
  handleClosePopover,
}) => {
  const userInfo = getCurrentUser();

  return (
    <Popover
      open={!!openPopover}
      anchorEl={openPopover}
      onClose={handleClosePopover}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
        <Typography variant="subtitle1" borderBottom={1} p={1} textAlign={'center'} color="primary">
            Application Documents
        </Typography>
      <MenuList
        disablePadding
        sx={{
          p: 0.5,
          gap: 0.5,
          display: "flex",
          overflowX: 'auto',
          flexDirection: "column",
          [`& .${menuItemClasses.root}`]: {
            px: 1,
            gap: 2,
            borderRadius: 0.75,
            [`&.${menuItemClasses.selected}`]: {
              bgcolor: "action.selected",
            },
          },
        }}
      >
        <MenuItem >
          <Link
            href={`${import.meta.env.VITE_BASE_URL}/applications/${
              rowData["application"]
            }`}
            color="info"
            target="_blank"
          >
            {rowData["application"]}
          </Link>
        </MenuItem>
        {
          (rowData["applicationOne"] && userInfo.role !== "reviewer") && (
            <MenuItem>
              <Link
                href={`${import.meta.env.VITE_BASE_URL}/applications/${
                  rowData["applicationOne"]
                }`}
                color="info"
                target="_blank"
              >
                {rowData["applicationOne"]}
              </Link>
            </MenuItem>
          )
        }
        {
          rowData["invoice"] && (
            <MenuItem>
              <Link
                href={`${import.meta.env.VITE_BASE_URL}/invoice/${
                  rowData["invoice"]
                }`}
                color="info"
                target="_blank"
              >
                {rowData["invoice"]}
              </Link>
            </MenuItem>
          )
        }
        {
          !!rowData["additionalDoc"]?.length && 
            rowData["additionalDoc"].map((doc: string) => (
              <MenuItem  key={doc}>
                <Link
                color="info"
                  href={`${import.meta.env.VITE_BASE_URL}/additional_doc/${doc}`}
                  target="_blank"
                >
                  {doc}
                </Link>
              </MenuItem>
            ))
        }
      </MenuList>
    </Popover>
  );
};

export default DocPopover;