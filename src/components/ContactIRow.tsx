import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Contact } from "../models/Contact";
import { ContactSupervisor } from "./ContactSupervisor";

export function ContactRow(contact: Contact) {
	return (
		<TableRow key={contact.id}>
			<TableCell align="right">{contact.id}</TableCell>
			<TableCell align="right">{contact.name}</TableCell>
			<TableCell align="right">{contact.details}</TableCell>
			<TableCell align="right">{contact.phoneNumber}</TableCell>
			<TableCell align="right">
				<ContactSupervisor contactId={contact.id} />
			</TableCell>
		</TableRow>
	);
}
