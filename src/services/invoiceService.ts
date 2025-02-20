import axios from "axios";

export const getInvoiceList = (id: string) => axios.get("/api/grant-application/invoice/" + id);
export const addInvoice = (id: string, doc: File) => {
	const formData = new FormData();
	formData.append("document", doc);

	return axios
		.post("/api/grant-application/invoice/" + id, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
}
