import { getRole } from "@/utils/roleGetter";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Link,
	TextField,
	Typography,
} from "@mui/material";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

type Props = {
	row: any;
	openViewComment: boolean;
	handleCloseCommentDialog: (
		event: {},
		reason: "backdropClick" | "escapeKeyDown"
	) => void;
	cancelViewComment: Function;
	openCommentRole: string
};

export default function ViewCommentDialog({
	row,
	openViewComment,
	handleCloseCommentDialog,
	cancelViewComment,
	openCommentRole
}: Props) {
	let showRoleList = [
		"reviewer_1",
		"reviewer_2",
		"grant_dep",
		"grant_dir",
		"col_dean",
		"finance"
	]

	if (openCommentRole === 'grant_dep') {
		showRoleList = [
			'col_dean',
			'finance'
		]
	}

	if (openCommentRole === 'grant_dir') {
		showRoleList = [
			'grant_dep',
			'finance'
		]
	}

	if (openCommentRole === "finance") {
		showRoleList = [
			'grant_dir'
		]
	}

	// if (openCommentRole === 'reviewer') {
	// 	showRoleList
	// }

	return (
		<Dialog open={openViewComment} onClose={handleCloseCommentDialog}>
			<DialogTitle mb={1}>Comment</DialogTitle>
			
			<DialogContent sx={{ minWidth: 300 }}>
				{row.comment ? (
					Object.keys(row.comment)
						.filter((key) => showRoleList.includes(key)
						)
						.map((key: string) => (
							<Box p={2} minWidth={300} key={key}>
								<Typography variant="h6">{getRole(key.includes('reviewer') ? 'reviewer' : key)}</Typography>

								<Typography variant="body1">
									{row.comment[key].text}
								</Typography>
								{row.comment[key].url && (
									<Link
										href={`${import.meta.env.VITE_BASE_URL}/reviews/${row.comment[key].url
											}`}
										target="_blank"
									>
										View attached document
									</Link>
								)}
							</Box>
						))
				) : (
					<Typography variant="h6" color="info" textAlign={"center"}>
						No comment
					</Typography>
				)}
			</DialogContent>
			
			<Button onClick={() => cancelViewComment()} size="large">
				Close
			</Button>

		</Dialog>
	);
}
