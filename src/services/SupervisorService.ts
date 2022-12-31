import { SupervisorMapEntry } from "../models/Supervisor";
import { supervisors } from "./FakeData";

const FAKE_DELAY_MS = 1500;

class SupervisorService {
	public async getSupervirors(contactIds: number[]): Promise<SupervisorMapEntry[]> {
		function retrieveSupervisors() {
			const supervisorsArray: SupervisorMapEntry[] = [];

			contactIds.forEach((contactId) => {
				const supervisor = supervisors.get(contactId);
				if (supervisor) {
					supervisorsArray.push({ contactId, supervisor });
				}
			});

			return supervisorsArray;
		}

		return new Promise((resolve) => {
			setTimeout(() => resolve(retrieveSupervisors()), FAKE_DELAY_MS);
		});
	}
}

const supervisorService = new SupervisorService();

export default supervisorService;
