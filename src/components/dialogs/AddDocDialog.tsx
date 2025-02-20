import { submitAdditionalDoc } from "@/services/grantService";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

import { InputFileUpload } from "../fileUpload";

type Props = {
  applicationId: string;
  openDialog: boolean;
  handleDialogClose: () => void;
};

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
        if (isAxiosError(error)) {
          error.response?.data.msg.map((str: string) => {
            toast.error(str);
          });
        }
        else
          toast.error("Error occured. Please try again");
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
