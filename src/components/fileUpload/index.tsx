import {
    Button,
    styled,
} from "@mui/material";
  
interface InputFileUploadProps {
	onUploadFile: (pa: any) => void;
}

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

export const InputFileUpload: React.FC<InputFileUploadProps> = ({ onUploadFile }) => {
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