import mongoose from "mongoose";
import { ROOM } from "./ROOM.js";

let isConnected = false;

export async function dbConnect() {
	if (isConnected) return;

	try {
		const port = process.env.MONGO_URI || "mongodb://mongo:27017/BLITZIT";
		console.log({ mongoPort: port });

		const db = await mongoose.connect(port); // connecting to the db

		if (!mongoose.models.ROOM) mongoose.model("ROOM", ROOM.schema);
		// the contiguous lines above ensure the initialization of all the models used. This will prevent the crash which happens when we try to do some operation which involves reffering to another schema while accessing a schema. Ig that mongoose automatically initializes a schema when used but doesn't when another schema's ref is given which leads to an app-level-crash. Initializing all in advance solves this problem

		isConnected = db.connections[0].readyState === 1; // marks the connection var to true, preventing the whole "connecting to the db and initializing schemas" everytime they've been already performed

		console.log("Mongo DB connected at", port);
	} catch (error) {
		console.error("Could not connect to MongoDB", error);
		throw new Error("Could not connect to MongoDB");
	}
}
