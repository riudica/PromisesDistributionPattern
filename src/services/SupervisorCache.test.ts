import { SupervisorMapEntry } from "../models/Supervisor";
import { SupervisorCache } from "./SupervisorCache";

const mockGetSupervirors = jest.fn();
const mockSupervisorService = {
	getSupervisors: mockGetSupervirors,
};

let supervisorCache = new SupervisorCache(mockSupervisorService);

function addToCache(supervisorCache: SupervisorCache, supervisorMapEntry: SupervisorMapEntry) {
	const map: Map<number, Promise<SupervisorMapEntry | null>> = (supervisorCache as any).supervisorsMap;
	map.set(supervisorMapEntry.contactId, Promise.resolve(supervisorMapEntry));
}

function getExpectedResults(keys: number[]): SupervisorMapEntry[] {
	const expectedResults: SupervisorMapEntry[] = [
		{
			contactId: 0,
			supervisor: {
				id: 10,
				name: "Supervisor 10",
				position: "Position 10",
				team: "Team 10",
			},
		},
		{
			contactId: 1,
			supervisor: {
				id: 11,
				name: "Supervisor 11",
				position: "Position 11",
				team: "Team 11",
			},
		},
		{
			contactId: 2,
			supervisor: {
				id: 12,
				name: "Supervisor 12",
				position: "Position 12",
				team: "Team 12",
			},
		},
	];

	let results: SupervisorMapEntry[] = [];
	for (let key in keys) {
		const keyAsNumber = Number(key);
		const expectedResult = expectedResults.find((result) => result.contactId === keyAsNumber);
		if (expectedResult) {
			results.push(expectedResult);
		}
	}
	return results;
}

describe("SupervisorCache", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		supervisorCache = new SupervisorCache(mockSupervisorService);
	});

	it("should not call the supervisorService.getSupervisors when all the supervisors are cached", async () => {
		// Given
		const keys = [0, 1, 2];
		const expectedResult = getExpectedResults(keys);
		addToCache(supervisorCache, expectedResult[0]);
		addToCache(supervisorCache, expectedResult[1]);
		addToCache(supervisorCache, expectedResult[2]);

		// When
		const response = await supervisorCache.getSupervisors(keys);

		// Then
		expect(mockGetSupervirors).not.toHaveBeenCalled();
		expect(response).toStrictEqual(expectedResult);
	});
	it("should call the supervisorService.getSupervisors when some supervisors are not cached", async () => {
		// Given
		const keys = [0, 1, 2];
		const expectedResult = getExpectedResults(keys);
		addToCache(supervisorCache, expectedResult[0]);
		addToCache(supervisorCache, expectedResult[2]);
		mockGetSupervirors.mockReturnValue(Promise.resolve([expectedResult[1]]));

		// When
		const response = await supervisorCache.getSupervisors(keys);

		// Then
		expect(mockGetSupervirors).toHaveBeenCalledWith([keys[1]]);
		expect(response).toStrictEqual(expectedResult);
	});
	it("should add to cache the results of the supervisorService.getSupervisors", async () => {
		// Given
		const keys = [0, 1, 2];
		const expectedResult = getExpectedResults(keys);
		mockGetSupervirors.mockReturnValue(Promise.resolve(expectedResult));

		// When
		await supervisorCache.getSupervisors(keys);

		// Then
		await supervisorCache.getSupervisors([keys[0], keys[2]]);
		expect(mockGetSupervirors).toHaveBeenCalledTimes(1);
	});
	it("should add to cache only the results of the supervisorService.getSupervisors", async () => {
		// Given
		const keys = [0, 1, 2];
		const expectedResult = getExpectedResults(keys);
		mockGetSupervirors.mockReturnValue(Promise.resolve(expectedResult));

		// When
		await supervisorCache.getSupervisors(keys);

		// Then
		await supervisorCache.getSupervisors([keys[0], keys[2]]);
		expect(mockGetSupervirors).toHaveBeenCalledTimes(1);
	});
});

describe("SupervisorCache.getSupervisor", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		supervisorCache = new SupervisorCache(mockSupervisorService);
	});

	it("should return null when the supervisor is not cached", async () => {
		// Given
		const keys = [0, 1, 2];
		const expectedResult = getExpectedResults(keys);
		addToCache(supervisorCache, expectedResult[0]);
		addToCache(supervisorCache, expectedResult[1]);
		addToCache(supervisorCache, expectedResult[2]);

		// When
		const newKey = 3;
		const response = await supervisorCache.getSupervisor(newKey);

		// Then
		expect(response).toStrictEqual(null);
	});

	it("should return the correct supervisor when it is cached", async () => {
		// Given
		const keys = [0, 1, 2];
		const expectedResult = getExpectedResults(keys);
		addToCache(supervisorCache, expectedResult[0]);
		addToCache(supervisorCache, expectedResult[1]);
		addToCache(supervisorCache, expectedResult[2]);

		// When
		const response = await supervisorCache.getSupervisor(expectedResult[0].contactId);

		// Then
		expect(response).toStrictEqual(expectedResult[0].supervisor);
	});
});
