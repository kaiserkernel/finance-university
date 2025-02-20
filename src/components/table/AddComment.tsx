import {
	TextField,
	Typography,
} from "@mui/material";
import { Box, Button } from "@mui/material";

import { InputFileUpload } from "../fileUpload";

type Props = {
	row: any;
	comment: string;
	uploadedFile?: File | null;
	setComment: Function;
	submitComment: Function;
	cancelAddComment: Function;
	onUploadFile?: (pa: any) => void;
	onRemove?: Function;
};

export default function AddComment({
	row,
	comment,
	uploadedFile,
	setComment,
	submitComment,
	cancelAddComment,
	onUploadFile,
	onRemove
}: Props) {

	return (
		<>
            <Box px={3} pt={5}>
                <TextField
                    label="Comment"
                    variant="outlined"
                    minRows={3}
                    fullWidth
                    multiline
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></TextField>
                <TextField
                    fullWidth
                    hidden
                    sx={{
                        visibility: "hidden",
                        height: 0,
                        // m: 0,
                        // p: 0,
                    }}
                ></TextField>
                {/* <Box> */}
                {
                    // 	(user.role === "reviewer" ||
                    // user.role === "col_dean") &&
                    onUploadFile ? (
                        <Box display={"flex"}>
                            {uploadedFile ? (
                                <Button
                                    component="label"
                                    onClick={() => {
                                        if (onRemove) onRemove();
                                    }}
                                    variant="text"
                                    color="error"
                                >
                                    Remove:
                                </Button>
                            ) : (
                                <InputFileUpload onUploadFile={onUploadFile}></InputFileUpload>
                            )}
                            {uploadedFile && (
                                <Typography lineHeight={2}>{uploadedFile.name}</Typography>
                            )}
                        </Box>
                    ) : (
                        ""
                    )}
                {/* </Box> */}
            </Box>
            <Box display={"flex"} justifyContent={"end"} px={2} pb={2}>
                <Box>
                    <Button onClick={() => submitComment(row.id)} color="primary">
                        Submit
                    </Button>
                    <Button onClick={() => cancelAddComment()} color="secondary">
                        Cancel
                    </Button>
                </Box>
            </Box>
		</>
	);
}
