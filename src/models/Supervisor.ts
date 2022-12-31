export interface Supervisor {
	id: number;
	name: string;
	position: string;
	team: string;
}

export interface SupervisorMapEntry {
	contactId: number;
	supervisor: Supervisor;
}
