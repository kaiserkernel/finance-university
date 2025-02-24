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
import { useEffect, useMemo, useState } from "react";

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

	if (['grant_dep', 'grant_dir', 'finance'].includes(openCommentRole)) {
		showRoleList=[
			'grant_dep', 'grant_dir', 'finance'
		]
	}

	useEffect(() => {
		if (openViewComment) {
			if (row.comment !== null && row.comment !== undefined) {
				const _commentList:Record<string, any>[]= [];
				const _invoiceCommentList:Record<string, any>[]= [];
				Object.keys(row.comment).map((key) => {
					if (showRoleList.includes(key)) {
						const _comments:any = [];
						const _invoiceComments:any = [];
						row.comment[key].forEach((log:any) => {
							// finance - invoice
							if (key === 'finance') {
								if (log.text || log.url) {
									_invoiceCommentList.push(log)
								}
								return;
							}
							if (!log.url.includes('invoice')) {
								console.log(log.url, 'no invoice url')
								_comments.push(log);
							} else {
								console.log(log.url, 'invoice url')
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
						comments.map((comment:any) => {
							const key = Object.keys(comment)[0];
							const value = comment[key];
							return (
								<Box p={2} minWidth={300} key={key}>
									<Typography variant="h6">{getRole(key.includes('reviewer') ? 'reviewer' : key)}</Typography>

									{
										value.map((commentData:any) => (
											<>
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
											</>
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
				<Typography variant="h6">Invoice</Typography>
				<ViewComment comments={invoiceCommentList} />
			</DialogContent>
			
			<Button onClick={() => cancelViewComment()} size="large">
				Close
			</Button>

		</Dialog>
	);
}
