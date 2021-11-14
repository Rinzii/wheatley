import * as Discord from "discord.js";
import * as moment from "moment";
import * as chalk from "chalk";
import * as fs from "fs";
import { MINUTE, zelis_id } from "./common";
import { assert } from "console";

export class M {
	static get_timestamp() {
		return moment().format("MM.DD.YY HH:mm:ss")
	}
	static log(...args: any[]) {
		process.stdout.write(`[${M.get_timestamp()}] [log]   `);
		console.log(...args);
	}
	static debug(...args: any[]) {
		process.stdout.write(`${chalk.gray(`[${M.get_timestamp()}] [debug]`)} `);
		console.log(...args);
	}
	static info(...args: any[]) {
		process.stdout.write(`${chalk.blueBright(`[${M.get_timestamp()}] [info] `)} `);
		console.log(...args);
	}
	static warn(...args: any[]) {
		process.stdout.write(`${chalk.yellowBright(`[${M.get_timestamp()}] [warn] `)} `);
		console.log(...args);
	}
	static error(...args: any[]) {
		process.stdout.write(`${chalk.redBright(`[${M.get_timestamp()}] [error]`)} `);
		console.log(...args);
		console.trace();
	}
};

export function send_long_message(channel: Discord.TextChannel, msg: string) {
	if(msg.length > 2000) {
		let lines = msg.split("\n");
		let partial = "";
		let queue: string[] = [];
		while(lines.length > 0) {
			if(partial.length + lines[0].length + 1 <= 2000) {
				if(partial != "") partial += "\n";
				partial += lines.shift();
			} else {
				queue.push(partial);
				partial = "";
			}
		}
		if(partial != "") queue.push(partial);
		let send_next = () => {
			if(queue.length > 0) {
				channel.send(queue.shift()!)
				       .then(send_next)
					   .catch(M.error);
			}
		};
		send_next();
	} else {
		channel.send(msg)
				.catch(M.error);
	}
}

function round(n: number, p: number) {
	return Math.round(n * Math.pow(10, p)) / Math.pow(10, p);
}

function pluralize(n: number, word: string) {
	if(n == 1) {
		return `${round(n, 2)} ${word}`;
	} else {
		return `${round(n, 2)} ${word}s`;
	}
}

export function diff_to_human(diff: number) {
	if(diff >= MINUTE) {
		return `${pluralize(Math.floor(diff / MINUTE), "minute")} ${pluralize(diff % MINUTE / 1000, "second")}`;
	} else {
		return `${pluralize(diff / 1000, "second")}`;
	}
}

const code_re = /`[^\`]+`(?!`)/gi;
const code_block_re = /```(?:[^\`]|`(?!``))+```/gi;

export function parse_out(message: string) {
	message = message.replace(code_re, message);
	message = message.replace(code_block_re, message);
	return message;
}

export function exists_sync(path: string) {
	let exists = true;
	try{
		fs.accessSync(path, fs.constants.F_OK);
	} catch(e) {
		exists = false;
	}
	return exists;
}

type PotentiallyPartial = Discord.AllowedPartial | Discord.Partialize<Discord.AllowedPartial>;

export async function departialize<T extends PotentiallyPartial, R extends ReturnType<T["fetch"]>>(thing: T): Promise<R> {
	if(thing.partial) {
		return thing.fetch();
	} else {
		return thing as R;
	}
};

let client: Discord.Client;
let zelis : Discord.User;
let has_tried_fetch_zelis = false;

async function get_zelis() {
	if(!has_tried_fetch_zelis) {
		zelis = await client.users.fetch(zelis_id);
		has_tried_fetch_zelis = true;
	}
	return zelis != undefined && zelis != null;
}

export function init_debugger(_client: Discord.Client) {
	client = _client;
}

export async function critical_error(...args: any[]) {
	M.error(...args);
	try {
		if(await get_zelis()) {
			let strs = [];
			for(let arg of args) {
				try {
					strs.push(arg.toString());
				} catch {
					try {
						strs.push(String(arg));
					} catch {}
				}
			}
			zelis.send(`Critical error occurred: ${strs.join(" ")}`);
		}
	} catch {}
}
