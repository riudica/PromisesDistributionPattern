import { Supervisor, SupervisorMapEntry } from "../models/Supervisor";
import { SupervisorService } from "./SupervisorService";

export class SupervisorCache {
	private supervisorsMap: Map<number, Promise<SupervisorMapEntry | null>> = new Map();

	constructor(private readonly supervisorService: SupervisorService) {}

	public async getSupervisors(contactIds: number[]): Promise<(SupervisorMapEntry | null)[]> {
		const idsToFetch: number[] = contactIds.filter((contactId) => {
			return !this.supervisorsMap.has(contactId);
		});

		if (idsToFetch.length > 0) {
			const getSupervisorsPromise = this.supervisorService.getSupervisors(idsToFetch);
			this.initializeSupervisorsMap(idsToFetch, getSupervisorsPromise);
			await getSupervisorsPromise;
		}

		return Promise.all(this.getEntriesFromSupervisorsMap(contactIds));
	}

	private initializeSupervisorsMap(idsToFetch: number[], getSupervisorsPromise: Promise<SupervisorMapEntry[]>) {
		idsToFetch.forEach((contactId) => {
			this.supervisorsMap.set(
				contactId,
				new Promise<SupervisorMapEntry | null>((resolve, reject) => {
					getSupervisorsPromise
						.then((supervisorMapEntryArray) => {
							const supervisorMapEntry = supervisorMapEntryArray.find(
								(supervisorMapEntry) => contactId === supervisorMapEntry.contactId
							);
							if (supervisorMapEntry) {
								resolve(supervisorMapEntry);
							}
							resolve(null);
						})
						.catch((error) => {
							console.log(`An error occurred: ${error}`);
							reject(error);
						});
				})
			);
		});
	}

	private getEntriesFromSupervisorsMap(contactIds: number[]): Promise<SupervisorMapEntry | null>[] {
		const result: Promise<SupervisorMapEntry | null>[] = [];
		contactIds.forEach((contactId) => {
			const cachedEntry = this.supervisorsMap.get(contactId);
			if (cachedEntry) {
				result.push(cachedEntry);
			}
		});
		return result;
	}

	public async getSupervisor(contactId: number): Promise<Supervisor | null> {
		const supervisorMapEntryPromise = this.supervisorsMap.get(contactId);

		if (supervisorMapEntryPromise) {
			const supervisorMapEntry = await supervisorMapEntryPromise;

			return supervisorMapEntry !== null ? supervisorMapEntry.supervisor : null;
		}

		return null;
	}
}
