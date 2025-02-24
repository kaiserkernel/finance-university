import { useState, useCallback, useEffect, useMemo } from "react";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';

import { Iconify } from "@/components/iconify";
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	Typography,
	Tooltip,
	Box
} from "@mui/material";
import { getCurrentUser } from "@/services/authService";
import { postComment } from "@/services/grantService";
import ViewCommentDialog from "../dialogs/ViewCommentDialog";
import { connectSocket, updateRequestRealtime, closeSocketAPI } from "@/services/realtimeUpdateService";
import AssignDialog from "../dialogs/AssignDialog";
import { useAppDispatch } from "@/redux/hooks";
import AddDocDialog from "../dialogs/AddDocDialog";
import DocPopover from "../dialogs/DocPopover";
import AddComment from "./AddComment";
import { toast } from "react-toastify";
// ----------------------------------------------------------------------

type UserTableRowProps = {
	row: any;
	headList: string[];
	selected: boolean;
	onAskInfo: (...value: any) => void;
	onAccept: (id: string, prevState?: string) => Promise<boolean>;
	onDeny: (...value: any) => void;
};

export function UserTableRow({
	headList,
	row,
	selected,
	onAskInfo,
	onAccept,
	onDeny,
}: UserTableRowProps) {
	const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
		null
	);
	const [state, setState] = useState<boolean | null>(null);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [openViewComment, setOpenViewComment] = useState<boolean>(false);
	const [openAssign, setOpenAssignDialog] = useState<boolean>(false)
	const [openAskInfo, setOpenAskInfo] = useState<boolean>(false)
	const [docModal, setDocModal] = useState<boolean>(false)
	const [applicationView, setApplicationView] = useState<HTMLButtonElement | null>(null)
	const [comment, setComment] = useState("");
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const user = getCurrentUser();
	const [openCommentRole, setOpenCommentRole] = useState<string>("");

	const dispatch = useAppDispatch()

	useEffect(() => {
		connectSocket()
		const cleanup = updateRequestRealtime(dispatch)

		return () => {
			cleanup && cleanup()
			closeSocketAPI()
		}
	}, [])

	const handleAcceptClick = useCallback(() => {
		setState(true);
		setOpenDialog(true);
	}, []);

	const handleDenyClick = useCallback(() => {
		setState(false);
		setOpenDialog(true);
	}, []);

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setState(null);
	};
	const confirmState = async (id: string) => {
		if (openDialog) {
			if (state) {
				if (!uploadedFile && user.role !== 'finance') {
					toast.error("Pleas input upload comment file");
					return;
				}

				const accepted = await onAccept(id, prevState);
				if (accepted) {
					submitComment(row.id);
				}
			}
			state !== null && !state && onDeny(id);
			setOpenDialog(false);
			setState(null);
		}
	};

	const cancelAction = () => {
		setOpenDialog(false);
		setState(null);
	};

	const handleOpenPopover = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			setOpenPopover(event.currentTarget);
		},
		[]
	);

	const handleClose = useCallback(() => {
		setOpenPopover(null);
	}, []);

	// Comment dialog
	const handleCloseCommentDialog = () => {
		setOpenViewComment(false);
	};
	const viewComment = (role: string) => {
		setOpenViewComment(true);
		setOpenCommentRole(role);
	};
	const submitComment = (id: string) => {
		postComment(id, comment, uploadedFile);
		setOpenViewComment(false);
		setComment("");
		if (uploadedFile) setUploadedFile(null);
	};
	const cancelViewComment = () => {
		setOpenViewComment(false);
	};
	// const cancelAddComment = () => {
	// 	setComment("");
	// }

	// Assign dialog
	const openAssignDialog = () => {
		setOpenAssignDialog(true);
	};

	// Handlers ask more info
	const openAskInfoDialog = () => {
		setOpenAskInfo(true);
	};
	const confirmAskInfo = (id: string) => {
		onAskInfo(id, true)
		setOpenAskInfo(false)
	};

	const uploadFile = (file: File) => {
		setUploadedFile(file)
	}
	const removeFile = () => {
		if (uploadedFile) {
			setUploadedFile(null)
		}
	}

	// Add information doc
	const openAddDocDialog = () => {
		setDocModal(true)
	}

	const openApplicationDoc = (event: React.MouseEvent<HTMLButtonElement>) => {
		setApplicationView(event.currentTarget)
	}
	const closeViewPopover = useCallback(() => {
		setApplicationView(null);
	}, []);

	const checkStatus = (column: any, status: string) => {
		if (column?.status) {
			return column?.status === status
		} else {
			return column === status
		}
	}

	const rowKeys = [
		"reviewer_1",
		"reviewer_2",
		"assigned",
		"col_dean",
		"grant_dep",
		"grant_dir",
		"finance",
	]

	const prevState = useMemo(() => {
		if (user.role === 'col_dean') {
			return row['reviewed']
		} else {
			const prevIndex = rowKeys.indexOf(user.role) - 1;
			const prevRole = rowKeys[prevIndex];
			return row[prevRole];
		}
	}, []);

	return (
		<>
			<TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
				{headList.map((headItem: any, i) => (
					<TableCell
						key={row.id + row[headItem.id] + i}
						align={
							rowKeys.includes(headItem.id)
								? "center"
								: "left"
						}
					>
						<>
							{headItem.id === "announcement" ? (
								row["announcement"].title
							) : rowKeys.includes(headItem.id) ? (
								checkStatus(row[headItem.id], "reviewed") ? (
									<>
										<Iconify
											width={22}
											icon="solar:check-circle-bold"
											sx={{ color: "success.main" }}
										/>
										<Iconify
											width={22}
											icon="solar:check-circle-bold"
											sx={{ color: "warning.main" }}
										/>
									</>
								): checkStatus(row[headItem.id], "approved") ? (
									<Iconify
										width={22}
										icon="solar:check-circle-bold"
										sx={{ color: "success.main" }}
									/>
								) : checkStatus(row[headItem.id], "rejected") ? (
									<Iconify
										width={22}
										icon="solar:close-circle-bold-duotone"
										sx={{ color: "error.main" }}
									/>
								) : (
									(headItem.id == 'reviewer_1' || headItem.id == 'reviewer_2') && row[headItem.id]?.user?.email ?
										<Tooltip title={row[headItem.id]?.user.email}>
											<Typography>{`${row[headItem.id].user.firstName} ${row[headItem.id].user.lastName}`.trim()}</Typography>
										</Tooltip>
										:
										(checkStatus(row[headItem.id], "pending"))
											&& (row["askMoreInfo"] && headItem.id == "assigned")
											? <Typography color="primary">Info asked</Typography>
											: <> - </>
								)
							) : headItem.id == "application" ? (
								<Button 
									variant="text" color={row['reviewed'] === 'reviewed' ? "warning" : 'primary'}
									onClick={(e) => openApplicationDoc(e)}
								>
									View
								</Button>
							) : (
								row[headItem.id]
							)}
						</>{" "}
					</TableCell>
				))}

				<TableCell align="right">
					<IconButton onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</TableCell>
				<Dialog
					open={!!openPopover}
					onClose={handleClose}
					fullWidth
					sx={{
					  '& .MuiPaper-root': {
						padding: "1em"
					  }
					}}
				>
					<DialogTitle sx={{ m: 0, p: 2 }}>
						Application
					</DialogTitle>
					<IconButton
						aria-label="close"
						onClick={handleClose}
						sx={(theme) => ({
							position: 'absolute',
							right: 8,
							top: 8,
							color: theme.palette.grey[500],
						})}
					>
						<CloseIcon />
					</IconButton>
					<Divider/>
					<DialogContent>
					{(user.role !== "user") && (
						<AddComment
							// row={row}
							comment={comment}
							uploadedFile={uploadedFile}
							setComment={setComment}
							// submitComment={submitComment}
							// cancelAddComment={cancelAddComment}
							onUploadFile={uploadFile}
							onRemove={removeFile}
						/>
					)}
					<Box 
						px={3}
						sx={{
							display: "flex",
							justifyContent: "flex-end"
						}}
					>
						{user?.role != "user" && (row[user?.role] == "pending" || prevState === 'reviewed' || row.reviewer_1.status == "pending" || row.reviewer_2.status == "pending") && (
							<>
								<Button
									onClick={handleAcceptClick}
									color="success"
									sx={{ marginLeft: "5px" }}
									size="small"
									variant="outlined"
								>
									<Iconify icon="solar:check-circle-broken" />
									Accept {(prevState === 'reviewed' && user.role !== 'finance') && `Inovice`}
								</Button>

								{
									prevState !== 'reviewed' && (
										<Button
											onClick={handleDenyClick}
											color="error"
											sx={{ marginLeft: "5px" }}
											size="small"
											variant="outlined"
										>
											<Iconify icon="solar:forbidden-circle-broken" />
											Deny
										</Button>
									)
								}
							</>
						)}

						{/* {user.role !== "user" && (
							<Button
								onClick={() => setOpenViewComment((pre) => !pre)}
								sx={{ color: "info.main" }}
							>
								<Iconify icon="solar:paperclip-outline" />
								Comment
							</Button>
						)} */}

						{/* {(user?.role == "col_dean" || user?.role == "user" || user?.role == "grant_dep" && row["grant_dir"] == "approved") && ( */}
						{(
							// user?.role == "col_dean" ||
							// user?.role == "user" ||
							// // user?.role == "reviewer" ||
							// (user?.role == "grant_dep" && (["approved", 'reviewed'].includes(row["col_dean"]))) ||
							// (user?.role == 'grant_dir' && (["approved", 'reviewed'].includes(row["grant_dep"]))) ||
							// (user?.role === 'finance' && (["approved", 'reviewed'].includes(row["grant_dir"])))
							['col_dean', 'grant_dep', 'grant_dir', 'finance'].includes(user.role)
						) && (
								<Button 
									onClick={() => viewComment(user?.role)} 
									color="success"
									sx={{ marginLeft: "5px" }}
									size="small"
									variant="outlined"
								>
									<Iconify icon="solar:paperclip-outline" />
									View Comments
								</Button>
							)}
						{user?.role == "col_dean" && row.assigned == 'pending' && (
							<>
								{
									row.milestone === 1 && (
										<Button 
											sx={{ marginLeft: "5px" }} 
											color="success"
											size="small"
											onClick={openAssignDialog}
											variant="outlined"
										>
											<Iconify icon="solar:check-circle-linear" />
											Assign
										</Button>
									)
								}
								{
									!row.askMoreInfo && (
										<Button 
											sx={{ marginLeft: "5px" }} 
											size="small"
											onClick={openAskInfoDialog}
											variant="outlined"
										>
											<Iconify icon="solar:info-circle-broken" />
											Ask more Info
										</Button>
									)
								}
							</>
						)}
						{
							user?.role == "user" && row["askMoreInfo"] && (
								<Button 
									sx={{ color: "info.main", marginLeft: "5px" }} 
									size="small"
									onClick={openAddDocDialog}
									variant="outlined"
								>
									<Iconify icon="solar:clapperboard-edit-broken" />
									Add More Information
								</Button>
							)
						}
					</Box>
					{/* </MenuList> */}
					</DialogContent>
				</Dialog>
				{/* </Popover> */}

				{/* assign dialog */}
				<AssignDialog
					applicationId={row._id}
					openDialog={openAssign}
					handleCloseDialog={() => { setOpenAssignDialog(false) }}
				></AssignDialog>

				{/* Add doc */}
				<AddDocDialog
					applicationId={row.id}
					openDialog={docModal}
					handleDialogClose={() => setDocModal(false)}
				></AddDocDialog>

				{/* View doc */}
				<DocPopover
					openPopover={applicationView}
					rowData={row}
					handleClosePopover={closeViewPopover}
				></DocPopover>

				{/* Ask more info confirm */}
				<Dialog open={openAskInfo} onClose={() => setOpenAskInfo(false)}>
					<DialogTitle mb={1}>Confirm action</DialogTitle>
					<Typography p={2}>
						Ask more information for applicant
					</Typography>
					<DialogActions>
						<Button onClick={() => confirmAskInfo(row.id)} color="primary">
							Yes
						</Button>
						<Button onClick={() => setOpenAskInfo(false)} color="secondary">
							No
						</Button>
					</DialogActions>
				</Dialog>

				{/* confirm dialog */}
				<Dialog open={openDialog} onClose={handleCloseDialog}>
					<DialogTitle mb={1}>Confirm action</DialogTitle>
					<Typography p={2}>
						Are you sure you want to{" "}
						{state ? "accept" : "deny"} this application?
					</Typography>
					<DialogActions>
						<Button onClick={() => confirmState(row.id)} color="primary">
							Yes
						</Button>
						<Button onClick={() => cancelAction()} color="secondary">
							No
						</Button>
					</DialogActions>
				</Dialog>

				<ViewCommentDialog
					row={row}
					openViewComment={openViewComment}
					handleCloseCommentDialog={handleCloseCommentDialog}
					cancelViewComment={cancelViewComment}
					openCommentRole={openCommentRole}
				></ViewCommentDialog>
			</TableRow>
		</>
	);
}