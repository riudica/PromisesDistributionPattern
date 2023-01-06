import { useEffect, useState } from "react";
import { Contact } from "../models/Contact";
import { ContactRow } from "./ContactIRow";
import { TableSkeleton } from "./TableSkeleton";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import contactService from "../services/ContactService";
import supervisorCache from "../services/ServicesFactory";

// using the docs in https://mui.com/material-ui/react-list/ and https://mui.com/material-ui/api/list/
// https://mui.com/material-ui/react-table/

export function ContactTable() {
	const [contacts, setContacts] = useState([] as Contact[]);

	useEffect(() => {
		async function fetchData() {
			const retrievedContacts = await contactService.getContacts();
			const contactIds = retrievedContacts.map((contact) => contact.id);
			supervisorCache.getSupervisors(contactIds);
			setContacts(retrievedContacts);
		}
		fetchData();
	}, []);

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table" size="medium">
				<TableHead>
					<TableRow>
						<TableCell align="right">Contact Id</TableCell>
						<TableCell align="right">Name</TableCell>
						<TableCell align="right">Details</TableCell>
						<TableCell align="right">Phone Number</TableCell>
						<TableCell align="right">Supervisor</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{contacts.length ? contacts.map(ContactRow) : <TableSkeleton numberOfRows={5} numberOfColumns={5} />}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
