import { Contact } from "../models/Contact";
import { contacts } from "./FakeData";

const FAKE_DELAY_MS = 1500;

class ContactService {
	public async getContacts(): Promise<Contact[]> {
		function retrieveContacts() {
			return contacts;
		}

		return new Promise((resolve) => {
			setTimeout(() => resolve(retrieveContacts()), FAKE_DELAY_MS);
		});
	}
}

const contactService = new ContactService();

export default contactService;
