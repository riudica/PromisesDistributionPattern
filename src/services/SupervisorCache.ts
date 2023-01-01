import { Supervisor, SupervisorMapEntry } from "../models/Supervisor";
import supervisorService from "./SupervisorService";

class SupervisorCache {
	private supervisorsMap: Map<number, Promise<Supervisor | null>> = new Map();

	public async getSupervisors(contactIds: number[]): Promise<Supervisor[]> {
		const idsToFetch: number[] = contactIds.filter((contactId) => {
			return !this.supervisorsMap.has(contactId);
		});

		if (idsToFetch.length > 0) {
			const getSupervisorsPromise = supervisorService.getSupervirors(idsToFetch);
			this.initializeSupervisorsMap(idsToFetch, getSupervisorsPromise);
			await getSupervisorsPromise;
		}

		const entriesPromise = this.getEntriesFromSupervisorsMap(contactIds);

		const results = Promise.allSettled(entriesPromise)
			.then((settledPromises) =>
				settledPromises
					.filter((settledPromise) => settledPromise.status === "fulfilled")
					.map((settledPromise) => (settledPromise as PromiseFulfilledResult<Supervisor>).value)
			)
			.catch((error) => {
				console.log(error);
			});

		return results as Promise<Supervisor[]>;
	}

	private initializeSupervisorsMap(idsToFetch: number[], getSupervisorsPromise: Promise<SupervisorMapEntry[]>) {
		idsToFetch.forEach((contactId) => {
			this.supervisorsMap.set(
				contactId,
				new Promise<Supervisor | null>((resolve, reject) => {
					getSupervisorsPromise
						.then((supervisorMapEntryArray) => {
							const supervisorMapEntry = supervisorMapEntryArray.find(
								(supervisorMapEntry) => contactId === supervisorMapEntry.contactId
							);
							if (supervisorMapEntry) {
								resolve(supervisorMapEntry.supervisor);
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

	private getEntriesFromSupervisorsMap(contactIds: number[]): Promise<Supervisor | null>[] {
		const result: Promise<Supervisor | null>[] = [];
		contactIds.forEach((contactId) => {
			const cachedEntry = this.supervisorsMap.get(contactId);
			if (cachedEntry) {
				result.push(cachedEntry);
			}
		});

		return result;
	}

	public async getSupervisor(contactId: number): Promise<Supervisor | null | undefined> {
		return this.supervisorsMap.get(contactId);
	}
}

const supervisorCache = new SupervisorCache();

export default supervisorCache;
