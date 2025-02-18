import { submitAdditionalDoc } from "@/services/grantService";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  styled,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  applicationId: string;
  openDialog: boolean;
  handleDialogClose: () => void;
};

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

interface InputFileUploadProps {
	onUploadFile: (pa: any) => void;
}

const InputFileUpload: React.FC<InputFileUploadProps> = ({ onUploadFile }) => {
	return (
		<Button component="label" variant="text" color="info">
			Upload file:
			<VisuallyHiddenInput
				type="file"
				accept="application/pdf"
				onChange={(e) => {
					if (e.target.files) {
						onUploadFile(e.target.files[0]);
					}
				}}
				hidden
			/>
		</Button>
	);
};

const FileInput = styled("input")({
  border: "1px solid grey",
  borderRadius: 5,
  padding: 2,
});

const AddDocDialog: React.FC<Props> = ({
  applicationId,
  openDialog,
  handleDialogClose,
}) => {
  const [doc, setDoc] = useState<File | null>();

  const uploadFile = (file: File | null) => {
    if (!file) return;
    setDoc(file);
  };

  const submitDoc = () => {
    if (!doc) return;
    submitAdditionalDoc(applicationId, doc)
      .then(() => {
        toast.success("Submitted successfully");
      })
      .catch((error) => {
        console.error("Error submitting doc: ", error);
        toast.error("Failed to submit");
      });
  };
  const closeDialog = () => {
    handleDialogClose();
    setDoc(null);
  };

  return (
    <Dialog open={openDialog} onClose={handleDialogClose}>
      <DialogTitle mb={1}>Upload additional Document</DialogTitle>
      <DialogContent>
        {/* <Box>
          <FileInput
            type="file"
            name="document"
            accept="application/pdf"
            onChange={(e) => uploadFile(e.target.files)}
          ></FileInput>
        </Box> */}
        <Box display={"flex"}>
          {doc ? (
            <Button
                component="label"
                onClick={() => {
                    setDoc(null);
                }}
                variant="text"
                color="error"
            >
                Remove:
            </Button>
          ) : (
            <InputFileUpload onUploadFile={uploadFile}></InputFileUpload>
          )}
          {doc && (
              <Typography lineHeight={2}>{doc.name}</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={submitDoc} color="primary">
          Submit
        </Button>
        <Button onClick={closeDialog} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDocDialog;
