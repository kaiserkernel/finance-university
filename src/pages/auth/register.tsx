import * as React from "react";
import {
	Button,
	FormControl,
	InputLabel,
	OutlinedInput,
	TextField,
	InputAdornment,
	IconButton,
	Box,
	Typography,
	Select,
	MenuItem,
	SelectChangeEvent,
	Link,
	Grid2 as Grid,
} from "@mui/material";
import z from "zod";
import { register } from "@/services/authService";
import { useNavigate } from "react-router";
import { Iconify } from "@/components/iconify";
import { withAuthRedirect } from "./withAuthRedirect";
import { Helmet } from "react-helmet-async";
import { CONFIG } from "@/config-global";
import { FormHelperText } from "@mui/material";
import { toast } from "react-toastify";
import { ROLE } from "@/constants/info";
import { collegeList } from "@/constants/collegeList";

export default withAuthRedirect(function Register() {
	const [showPassword, setShowPassword] = React.useState(false);
	const [firstName, setFirstName] = React.useState<string>("");
	const [lastName, setLastName] = React.useState<string>("");
	const [email, setEmail] = React.useState<string>("");
	const [password, setPwd] = React.useState<string>("");
	const [re_pwd, setRe_pwd] = React.useState<string>("");
	const [college, setCollege] = React.useState<string | undefined>("");
	const [role, setRole] = React.useState<string>("user");
	const [enrollment, setEnrollment] = React.useState<string>("");

	const EmailVali = z.string().email();
	const PassVali = z.string().min(6);
	const FirstNameVali = z.string().min(3, 'Name must be at least 3 characters long.');

	const emailMessage = EmailVali.safeParse(email).error?.errors[0].message;
	const pasMessage = PassVali.safeParse(password).error?.errors[0].message;
	const firstNameMessage = FirstNameVali.safeParse(firstName).error?.errors[0].message;

	const navigate = useNavigate();

	React.useEffect(() => {
		if (role === "grant_dep") {
			setCollege("");
		} else if (college == undefined) {
			setCollege("");
		}
	}, [role]);

	const handleCollegeChange = (event: SelectChangeEvent) => {
		setCollege(event.target.value);
	};
	const handleRoleChange = (event: SelectChangeEvent) => {
		setRole(event.target.value);
	};

	const registerTrigger = () => {
		if (role !== 'grant_dep' && role !== 'finance' && !college) {
			toast.warn('Please select college.')
			return;
		}
		if (!role) {
			toast.warn('Please select your role.')
			return;
		}
		if (!enrollment && role == 'user') {
			toast.warn('Please input the enrollment number.')
			return;
		}
		if (re_pwd !== password || !password || !role || !firstName) {
			toast.warn('Please note the all fields')
			return;
		}

		const collegeValue = role === "grant_dep" ? undefined : college;
		const tempCollege = role === "user" ? enrollment : undefined;

		register(
			{
				firstName,
				lastName,
				email,
				password,
				college: collegeValue,
				role,
				enrollment: tempCollege,
			},
			navigate
		);
	};

	return (
		<>
			<Helmet>
				<title> {`Register - ${CONFIG.appName}`}</title>
			</Helmet>

			<Box
				display="flex"
				flexDirection="column"
				className="w-50"
				alignItems="center"
			>
				<Typography
					variant="h3"
					sx={{ fontWeight: "bold", textAlign: "center" }}
				>
					Register
				</Typography>
				<Typography variant="subtitle1" component="h6" sx={{ top: "50%" }}>
					Welcome
				</Typography>
				<Grid container spacing={2} className="my-4">
					<Grid size={6}>
						<TextField
							label="Fist Name"
							type="text"
							variant="outlined"
							error={!!firstName && !!firstNameMessage}
							helperText={!!firstName && !!firstNameMessage ? firstNameMessage : undefined}
							fullWidth
							name="fist_name"
							value={firstName}
							onChange={(val) => setFirstName(val.target.value)}
						></TextField>
					</Grid>
					<Grid size={6}>
						<TextField
							label="Last Name"
							type="text"
							variant="outlined"
							fullWidth
							name="last_name"
							value={lastName}
							onChange={(val) => setLastName(val.target.value)}
						></TextField>
					</Grid>
				</Grid>
				<TextField
					id="input-with-icon-textfield"
					label="Email"
					name="email"
					type="email"
					required
					fullWidth
					error={!!(emailMessage && email)}
					helperText={email ? emailMessage : undefined}
					value={email}
					onChange={(val) => setEmail(val.target.value)}
				/>
				<FormControl sx={{ my: 2 }} fullWidth variant="outlined">
					<InputLabel
						htmlFor="outlined-adornment-password"
						error={!!(pasMessage && password)}
					>
						Password
					</InputLabel>
					<OutlinedInput
						id="outlined-adornment-password"
						type={showPassword ? "text" : "password"}
						name="password"
						value={password}
						onChange={(val) => setPwd(val.target.value)}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									onClick={() => setShowPassword(!showPassword)}
									edge="end"
								>
									<Iconify
										icon={
											showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"
										}
									/>
								</IconButton>
							</InputAdornment>
						}
						label="Password"
					/>
					{!!(pasMessage && password) && (
						<FormHelperText error={!!(pasMessage && password)}>
							{pasMessage}
						</FormHelperText>
					)}
				</FormControl>

				<FormControl sx={{ mb: 2 }} fullWidth variant="outlined">
					<InputLabel
						error={!!re_pwd && re_pwd !== password}
						htmlFor="outlined-adornment-password"
					>
						Confirm Password
					</InputLabel>
					<OutlinedInput
						id="outlined-adornment-confirm-password"
						type={showPassword ? "text" : "password"}
						name="password-confirm"
						value={re_pwd}
						error={!!re_pwd && re_pwd !== password}
						onChange={(val) => setRe_pwd(val.target.value)}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									onClick={() => setShowPassword(!showPassword)}
									edge="end"
								>
									<Iconify
										icon={
											showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"
										}
									/>
								</IconButton>
							</InputAdornment>
						}
						label="Confirm Password"
					/>
					{re_pwd && re_pwd !== password && (
						<FormHelperText error={!!(pasMessage && password)}>
							Passwords don't match
						</FormHelperText>
					)}
				</FormControl>
				{role !== "grant_dep" && role !== "finance" && (
					<FormControl fullWidth>
						<InputLabel id="college-select-label">College</InputLabel>
						<Select
							labelId="college-select-label"
							id="college-select"
							className="text-start"
							value={college}
							label="College"
							onChange={handleCollegeChange}
						>
							{
								collegeList.map((log, index) => (
									<MenuItem value={log.value} key={index}>
										{log.value}
									</MenuItem>
								))
							}
						</Select>
					</FormControl>
				)}

				<Grid container spacing={2} width={"100%"}>
					<Grid size={role == "user" ? 6 : 12}>
						<FormControl fullWidth sx={{ mt: 2 }}>
							<InputLabel id="role-select-label">Role</InputLabel>
							<Select
								labelId="role-select-label"
								id="role-select"
								value={role}
								label="Role"
								className="text-start"
								onChange={handleRoleChange}
							>
								{
									ROLE.filter(role => role.id != 'grant_dir').map((role: any) => (
										<MenuItem key={role.id} value={role.id}>
											{role?.name}
										</MenuItem>
									))
								}
							</Select>
						</FormControl>
					</Grid>
					{role == "user" && (
						<Grid size={6} mt={2}>
							<TextField
								label="enrollment number"
								fullWidth
								type="number"
								slotProps={{
									inputLabel: {
										shrink: true,
									},
								}}
								value={enrollment}
								onChange={(e) => setEnrollment(e.target.value)}
							></TextField>
						</Grid>
					)}
				</Grid>

				<Button
					type="submit"
					variant="contained"
					color="info"
					disableElevation
					size="large"
					fullWidth
					sx={{ my: 2 }}
					onClick={registerTrigger}
				>
					Register
				</Button>
				<Link href="/login" variant="body2">
					Do you have an account already?
				</Link>
			</Box>
		</>
		//   </Container>
		// </Box>
	);
});
