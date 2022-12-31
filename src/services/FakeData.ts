import { Contact } from "../models/Contact";
import { Supervisor } from "../models/Supervisor";

export const contacts: Contact[] = [
	{
		id: 1,
		name: "Contact 1",
		details: "Details 1",
		phoneNumber: "+12345611",
	},
	{
		id: 2,
		name: "Contact 2",
		details: "Details 2",
		phoneNumber: "+12345612",
	},
	{
		id: 3,
		name: "Contact 3",
		details: "Details 3",
		phoneNumber: "+12345613",
	},
	{
		id: 4,
		name: "Contact 4",
		details: "Details 4",
		phoneNumber: "+12345614",
	},
	{
		id: 5,
		name: "Contact 5",
		details: "Details 5",
		phoneNumber: "+12345615",
	},
];

export const supervisors: Map<number, Supervisor> = new Map([
	[
		1,
		{
			id: 1,
			name: "Supervisor 1",
			position: "Position 1",
			team: "Team 1",
		},
	],
	[
		2,
		{
			id: 2,
			name: "Supervisor 2",
			position: "Position 2",
			team: "Team 2",
		},
	],
	[
		3,
		{
			id: 2,
			name: "Supervisor 2",
			position: "Position 2",
			team: "Team 2",
		},
	],
	[
		4,
		{
			id: 3,
			name: "Supervisor 3",
			position: "Position 3",
			team: "Team 3",
		},
	],
]);
