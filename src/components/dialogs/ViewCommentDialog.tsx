import { getRole } from "@/utils/roleGetter";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Link,
	Typography,
	Divider
} from "@mui/material";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";

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

	const [commentList, setCommentList] = useState <Record<string, any>[]>([]);
	const [invoiceCommentList, setInvoiceCommentList] = useState <Record<string, any>[]>([]);

	if (["reviewer_1, reviewer_2"].includes(openCommentRole)) {
		showRoleList = [
			"col_dean"
		]
	}

	if (['grant_dep', 'grant_dir', 'finance'].includes(openCommentRole)) {
		showRoleList=[
			'grant_dep', 'grant_dir', 'finance', 'col_dean'
		]
	}

	useEffect(() => {
		if (openViewComment) {
			console.log(row.comment, "comments")
			console.log(openCommentRole, "open comment role")
			if (row.comment !== null && row.comment !== undefined) {
				const _commentList:Record<string, any>[]= [];
				const _invoiceCommentList:Record<string, any>[]= [];
				Object.keys(row.comment).map((key) => {
					if (showRoleList.includes(key)) {
						const _comments:any = [];
						const _invoiceComments:any = [];
						row.comment[key].forEach((log:any) => {
							// finance - invoice
							// if (key === 'finance') {
							// 	if (log.text || log.url) {
							// 		_invoiceCommentList.push(log)
							// 	}
							// 	return;
							// }

							if (log.commentType !== "settlement" ) {
								_comments.push(log);
							} else {
								_invoiceComments.push(log);
							}
						});
						if (_comments.length) {
							_commentList.push({[key]: _comments});
						}
						if (_invoiceComments.length) {
							_invoiceCommentList.push({[key]: _invoiceComments});
						}
					}
				});
				setCommentList(_commentList);
				setInvoiceCommentList(_invoiceCommentList);
			}
		}
	}, [openViewComment])

	const ViewComment = (data:any) => {
		const {comments} = data;
		return (
			comments.length > 0 ? (
				<>
					{
						comments.map((comment:any, idx: number) => {
							const key = Object.keys(comment)[0];
							const value = comment[key];
							return (
								<Box p={2} minWidth={300} key={idx}>
									<Typography variant="h6">{getRole(key.includes('reviewer') ? 'reviewer' : key)}</Typography>

									{
										value && value.map((commentData:any, idx: number) => (
											<Box key={idx}>
												<Typography variant="body1">
													{commentData.text}
												</Typography>
												{commentData.url && (
													<Link
														href={`${import.meta.env.VITE_BASE_URL}/reviews/${commentData.url
															}`}
														target="_blank"
													>
														View attached document
													</Link>
												)}
											</Box>
										))
									}
								</Box>
							)})
					}
				</>
			) : (
				<Typography variant="h6" color="info" textAlign={"center"}>
					No comment
				</Typography>
			)
		)
	}

	return (
		<Dialog open={openViewComment} onClose={handleCloseCommentDialog}>
			<DialogTitle mb={1}>Comment</DialogTitle>
			
			<DialogContent sx={{ minWidth: 300 }}>
				<ViewComment comments={commentList} />
				<Divider />
				<Typography variant="h6">Settlement</Typography>
				<ViewComment comments={invoiceCommentList} />
			</DialogContent>
			
			<Button onClick={() => cancelViewComment()} size="large">
				Close
			</Button>

		</Dialog>
	);
}
