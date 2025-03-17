import {
	TextField,
	Typography,
} from "@mui/material";
import { Box, Button } from "@mui/material";

import { InputFileUpload } from "../fileUpload";

type Props = {
	// row: any;
	comment: string;
	uploadedFile?: File | null;
	setComment: Function;
	// submitComment: Function;
	// cancelAddComment: Function;
	onUploadFile?: (pa: any) => void;
	onRemove?: Function;
};

export default function AddComment({
	// row,
	comment,
	uploadedFile,
	setComment,
	// submitComment,
	// cancelAddComment,
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
                        height: 0
                    }}
                ></TextField>
                {
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
            </Box>
		</>
	);
}
