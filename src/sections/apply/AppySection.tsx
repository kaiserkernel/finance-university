import { DashboardContent } from "@/layouts/dashboard";
import {
	Typography,
	Grid2 as Grid,
	Paper,
	Button,
	styled,
	Box,
	LinearProgress,
	TextField,
	Popover
} from "@mui/material";

import { CloudUpload, Publish } from "@mui/icons-material";
import React from "react";
import PDFPreview from "@/components/PdfPreviewer";
import { requestGrant } from "@/services/grantService";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { Autocomplete } from "@mui/material";
import { currencyTypes } from "@/constants/currencyType";
import { isAxiosError } from "axios";
import { useRouter } from "@/routes/hooks";
import { getAnnouncementById } from "@/services/announcementServices";

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

export default function ApplySection() {
	const router = useRouter();
	const [file, setFile] = React.useState<File | null>(null);
	const [fileOne, setFileOne] = React.useState<File | null>(null);
	const [fileUrl, setFileUrl] = React.useState<string>();
	const [fileUrlOne, setFileUrlOne] = React.useState<string>();
	const [currentSelectedFileUrl, setCurrentSelectedFileUrl] = React.useState<string>();
	const [loading, setLoading] = React.useState<boolean>(false);
	const [budget, setBudget] = React.useState<any>({
		budget: "",
		milestone: "",
	});
	const [budgetLimitation, setBudgetLimitation] = React.useState(0);
	const [currencyType, setCurrencyType] = React.useState<{
		value: string;
		label: string;
	} | null>({
		value: "birr",
		label: "Birr",
	});
	const [budgetAlertEl, setBugetAlertEl] = React.useState<null | HTMLElement>(null);
	const openBudgetAlert = React.useMemo(() => {
		return Boolean(budgetAlertEl)
	}, [budgetAlertEl])
	const openBudgetAlertId = React.useMemo(() => {
		return openBudgetAlert ? 'simple-popover' : undefined
	}, [openBudgetAlert])

	const params = useParams();

	React.useEffect(() => {
		if (params.id) {
			getAnnouncementById(params.id)
				.then((res) => {
					const { budget } = res.data;
					setBudgetLimitation(budget);
					setBudget((prev:any) => ({
						...prev,
						milestone: res.data.stage + 1
					}));
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
		}
	}, []);

	

	const upload = (files: FileList | null, flag?: Boolean) => {
		if (files && files.length > 0) {
			const filePath = URL.createObjectURL(files[0]);
			setCurrentSelectedFileUrl(filePath);

			switch (flag) {
				case true:
					setFileOne(files[0]);

					setFileUrlOne(filePath);		
					break;
			
				default:
					setFile(files[0]);

					setFileUrl(filePath);
					break;
			}
		}
	};

	const publishApplication = () => {
		if (!budget) {
			toast.warn("Please select budget.");
			return;
		}
		if (!budget.milestone) {
			toast.warn("Please select milestone.");
		}
		if (!file) {
			toast.warn("Please select a file to upload");
			return;
		}
		if (!currencyType) {
			toast.warn("Please select a currency type.");
			return;
		}
		if (!fileOne && budget.milestone === 1) {
			toast.warn("Please select second file to upload");
			return;
		}

		if (params?.id) {
			setLoading(true);
			
			requestGrant(
				file,
				fileOne,
				params.id,
				budget.budget,
				budget.milestone,
				currencyType.value
			)
				.then((_) => {
					setFile(null);
					setFileOne(null);
					setBudget({
						budget: "",
						milestone: "",
					});
					if (fileUrl) {
						URL.revokeObjectURL(fileUrl);
					}
					setFileUrl("");
					setFileUrlOne("");
					toast.success("Application submitted");
					router.push("/");
				})
				.catch((error) => {
					if (isAxiosError(error)) {
					  error.response?.data.msg.map((str: string) => {
						toast.error(str);
					  });
					}
					else
					  toast.error("Error occured. Please try again");
				})
				.finally(() => {
					setLoading(false);
				});
			return;
		}
		toast.warn("Please select announcement");
	};

	const handleBudgetChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (Number(e.target.value) <= budgetLimitation) {
			setBudget((pre: any) => ({
				...pre,
				budget: e.target.value,
			}));
			setBugetAlertEl(null);
		} else {
			setBugetAlertEl(e.currentTarget);
		}
	};

	const handleCloseBudgetLimitAlert = () => {
		setBugetAlertEl(null);
	}

	return (
		<DashboardContent maxWidth="xl">
			<Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
				Apply
			</Typography>

			<Paper elevation={1} className="p-4">
				<Grid container spacing={4}>
					<Grid
						size={12}
						display={"flex"}
						justifyContent={"center"}
						borderBottom={1}
						borderColor={"lightgray"}
					>
						<Typography variant="h6" my={2} color="info">
							Apply with your documentation
						</Typography>
					</Grid>

					<Grid container size={12} spacing={2}>
						<Grid container size={{ md: 5, xs: 12 }}>
							<Grid size={7}>
								<TextField
									label="Budget"
									variant="outlined"
									fullWidth
									type="number"
									value={budget.budget}
									// onChange={(e) => setBudget((prev: any) => ({
									// 	...prev,
									// 	budget: e.target.value
									// }))}
									onChange={handleBudgetChange}
									aria-describedby={openBudgetAlertId}
								/>
								<Popover
									id={openBudgetAlertId}
									open={openBudgetAlert}
									anchorEl={budgetAlertEl}
									onClose={handleCloseBudgetLimitAlert}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
								>
									<Typography color={'error'} sx={{ p: 2 }}>
										Budget limited : {budgetLimitation}
									</Typography>
								</Popover>
							</Grid>
							<Grid size={5}>
								<Autocomplete
									disablePortal
									options={currencyTypes}
									value={currencyType}
									fullWidth
									onChange={(e, nv) => setCurrencyType(nv)}
									renderInput={(params) => (
										<TextField
											{...params}
											slotProps={{
												inputLabel: {
													shrink: true,
												},
											}}
											label="Currency Type"
										/>
									)}
								/>
							</Grid>
						</Grid>
						<Grid size={{ md: 5, xs: 12 }}>
							<TextField
								label="Milestone"
								variant="outlined"
								slotProps={{
									inputLabel: {
										shrink: true,
									},
								}}
								value={budget.milestone}
								disabled
							></TextField>
						</Grid>
						<Grid size={2}></Grid>
					</Grid>

					<Grid size={12} container justifyContent={"center"}>
						<Grid
							size={{ sm: 6, xs: 12 }}
							display="flex"
							justifyContent={"center"}
						>
							{
								budget.milestone === 1 && (
									<Button
										component="label"
										role={undefined}
										variant="contained"
										tabIndex={-1}
										color={fileOne ? "error" : "info"}
										startIcon={<CloudUpload />}
										sx={{
											marginRight: "10px"
										}}
									>
										Personal Info {fileOne && `: ${fileOne.name}`}
										<VisuallyHiddenInput
											accept="application/pdf"
											type="file"
											onChange={(event) => upload(event.target.files, true)}
										/>
									</Button>
								)
							}
							<Button
								component="label"
								role={undefined}
								variant="contained"
								tabIndex={-1}
								color={file ? "error" : "info"}
								startIcon={<CloudUpload />}
							>
								Proposal {file && `: ${file.name}`}
								<VisuallyHiddenInput
									accept="application/pdf"
									type="file"
									onChange={(event) => upload(event.target.files)}
								/>
							</Button>
						</Grid>
						{((budget.milestone !== 1 && fileUrl) || (budget.milestone === 1 && fileUrl && fileUrlOne)) && (
							<Grid
								size={{ sm: 6, xs: 12 }}
								display="flex"
								justifyContent={"center"}
							>
								<Button
									variant="contained"
									startIcon={<Publish />}
									onClick={publishApplication}
									disabled={loading}
								>
									Publish Application
								</Button>
							</Grid>
						)}
					</Grid>

					<Grid size={12} display={"flex"} justifyContent={"center"}>
						{loading ? (
							<Box sx={{ width: "70%" }}>
								<LinearProgress />
							</Box>
						) : currentSelectedFileUrl ? (
							<PDFPreview file={currentSelectedFileUrl}></PDFPreview>
						) : (
							<Typography color="textSecondary" variant="subtitle1">
								No file uploaded
							</Typography>
						)}
					</Grid>
				</Grid>
			</Paper>
			{/* </Container> */}
		</DashboardContent>
	);
}
