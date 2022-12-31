import { Supervisor, SupervisorMapEntry } from "../models/Supervisor";
import supervisorService from "./SupervisorService";

class SupervisorCache {
	private supervisorsMap: Map<number, Promise<Supervisor | null>> = new Map();

	public async getSupervisors(contactIds: number[]): Promise<Supervisor[]> {
		const notFoundInCacheIds: number[] = contactIds.filter((contactId) => {
			return !this.supervisorsMap.has(contactId);
		});

		if (notFoundInCacheIds.length > 0) {
			const getMultiplePromise = supervisorService.getSupervirors(notFoundInCacheIds);
			this.populateCache(notFoundInCacheIds, getMultiplePromise);
			await getMultiplePromise;
		}

		const entriesPromise = this.getEntriesFromPromiseMap(contactIds);

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

	private populateCache(notFoundInCacheIds: number[], getMultiplePromise: Promise<SupervisorMapEntry[]>) {
		notFoundInCacheIds.forEach((contactId) => {
			this.supervisorsMap.set(
				contactId,
				new Promise<Supervisor | null>((resolve, reject) => {
					getMultiplePromise
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

	private getEntriesFromPromiseMap(contactIds: number[]): Promise<Supervisor | null>[] {
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
