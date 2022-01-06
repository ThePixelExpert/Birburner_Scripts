/** @param {NS} ns **/
export async function main(ns) {
	ns.tprint("Working...");


	var choice = ns.args[0];


	if (choice == 1) {
		var Var1 = await FullScan(ns);
		var Var2 = await checkStatus(ns, Var1);
		var Pservs = ns.getPurchasedServers();
		var servers = await Pservs.concat(Var2);
		await Deploy(ns, ns.args[1], servers);

	} else if (choice == 2) {
		var Var1 = await FullScan(ns);
		var Var2 = await checkStatus(ns, Var1);
		await ns.tprint(getValues(ns, Var2));
		await ns.sleep(10000)

	} else if (choice == 3) {
		// Deploys Pservers : # Of servers max worth >= 100m / # of Pservers
		// then the result of that is the number of Pservers Per Target Server > 100m worth

		await SmartDeploy(ns, 300000000000)
	} else if (choice == 4) {
		ns.tprint(await FullScan(ns));

	} else if (choice == 5) {
		await WeakenExp(ns, 12);

	} else if (choice == '-h') {
		ns.tprint("1: Deploy Script");
		ns.tprint("2: Get Server Values");
		ns.tprint("3: Smart Deploy");
		ns.tprint("4: Returns Full Scan");
		ns.tprint("5: Runs 4 Pservers to weaken Foodnstuff (to gain Hacking Exp)");
	}

}

async function checkStatus(ns, localServers) {
	ns.tprint("Checking Access on Servers...");
	var conServers = [];
	for (var i = 0; i < localServers.length; i++) {

		var a = localServers[i];
		var ports = ns.getServerNumPortsRequired(a);
		//NO OTHER TOOL
		if (ports == 0) {
			if (await CheckPortLevel(ns, 0)) {
				if (!ns.hasRootAccess(a)) {
					await ns.nuke(a);
					conServers.push(a);
					ns.tprint("Had No Root Access w/ 0 ports: " + a);
				} else {
					ns.tprint("Had Root Access w/ 0 ports: " + a);
					conServers.push(a);
				}
			}
			//SSH
		} else if (ports == 1) {
			if (await CheckPortLevel(ns, 1)) {
				if (!ns.hasRootAccess(a)) {

					ns.brutessh(a);
					await ns.nuke(a);
					ns.tprint("Had No Root Access w/ 1 port: " + a);
					conServers.push(a);
				}


				else {
					ns.tprint("Had Root Access w/ 1 port: " + a);
					conServers.push(a);
				}
			}
			//FTP
		} else if (ports == 2) {
			if (await CheckPortLevel(ns, 2)) {
				if (!ns.hasRootAccess(a)) {

					ns.brutessh(a);
					ns.ftpcrack(a);
					await ns.nuke(a);
					ns.tprint("Had No Root Access w/ 2 ports: " + a);
					conServers.push(a);


				}
				else {
					ns.tprint("Had Root Access w/ 2 ports: " + a);
					conServers.push(a);
				}
			}
			//SMTP
		} else if (ports == 3) {
			if (await CheckPortLevel(ns, 3)) {
				if (!ns.hasRootAccess(a)) {

					ns.brutessh(a);
					ns.ftpcrack(a);
					ns.relaysmtp(a);
					await ns.nuke(a)
					ns.tprint("Had No Root Access w/ 3 ports: " + a);
					conServers.push(a);

				}
				else {
					ns.tprint("Had Root Access w/ 3 ports: " + a);
					conServers.push(a);
				}
			}
			//HTTP
		} else if (ports == 4) {
			if (await CheckPortLevel(ns, 4)) {
				if (!ns.hasRootAccess(a)) {

					ns.brutessh(a);
					ns.ftpcrack(a);
					ns.relaysmtp(a);
					ns.httpworm(a);
					await ns.nuke(a)
					ns.tprint("Had No Root Access w/ 4 ports: " + a);
					conServers.push(a);


				}
				else {
					ns.tprint("Had Root Access w/ 4 port: " + a);
					conServers.push(a);
				}
			}
			//SQL
		} else if (ports == 5) {
			if (await CheckPortLevel(ns, 5)) {
				if (!ns.hasRootAccess(a)) {

					ns.brutessh(a);
					ns.ftpcrack(a);
					ns.relaysmtp(a);
					ns.httpworm(a);
					ns.sqlinject(a);
					await ns.nuke(a);
					ns.tprint("Had No Root Access w/ 5 ports: " + a);
					conServers.push(a);

				}
				else {
					ns.tprint("Had Root Access w/ 5 port: " + a);
					conServers.push(a);
				}
			}

		} else {
			ns.tprint("Has More Than 5 ports: " + a);
		}

	}

	return conServers;
}
export async function FullScan(ns) {
	ns.tprint("Scanning subnets...");
	var ServerChecked = [];
	var CheckList = [];
	var dict = [];
	var DDDDDD = ['home'];
	var target = 'home';
	var Scan1 = await ns.scan('home');

	for (var server in Scan1) {
		if (!CheckList.includes(Scan1[server])) {
			CheckList.push(Scan1[server]);
		}
	}
	ServerChecked.push(target);
	var flag = true;
	while (flag) {
		flag = false;
		for (var i = 0; i < CheckList.length; i++) {
			var servers = await ns.scan(CheckList[i]);
			if (!ServerChecked.includes(CheckList[i])) {
				ServerChecked.push(CheckList[i]);
			}
			for (var server in servers) {
				if (!CheckList.includes(servers[server])) {
					CheckList.push(servers[server]);
				}
			}
		}
	}

	return CheckList
}

export async function Deploy(ns, target, servers, bool) {
	ns.tprint("Deploying Script To Servers...");
	if (bool == 'weaken') {
		for (var i = 0; i < servers.length; i++) {
			var a = servers[i];
			if (a == undefined) return;
			var serverRam = ns.getServerMaxRam(a);
			var scriptRam = ns.getScriptRam("HackingTemp.js");
			// how many threads can run
			var b = Math.round(serverRam / scriptRam);
			if (b == 0) continue;
			
			await ns.scp("HackingTemp.js", a);
			ns.scriptKill("HackingTemp.js", target);
			ns.exec("HackingTemp.js", a, b - 1, target, 'weaken');


		}
	} else {
		for (var i = 0; i < servers.length; i++) {
			var a = servers[i];
			if (a == undefined) return;
			var serverRam = ns.getServerMaxRam(a);
			var scriptRam = ns.getScriptRam("HackingTemp.js");
			// how many threads can run
			var b = Math.round(serverRam / scriptRam);
			if (b == 0) {
				continue;
			} else {
				await ns.scp("HackingTemp.js", a);
				ns.scriptKill("HackingTemp.js", target);
				ns.exec("HackingTemp.js", a, b - 1, target);
			}

		}
	}
}
export async function SmartDeploy(ns, money) {
	var Var1 = await FullScan(ns);
	var Pservs = await checkStatus(ns, Var1)
	ns.tprint("Starting Smart Deploy...");
	var numOfPservs = Pservs.length;
	var values = await getValues(ns, Pservs);
	var GoodServers = [];
	ns.tprint("Rich Servers: ");
	for (var i = 0; i < values.length; i++) {
		// i is the name of the Server
		// values[i] is the worth of the server at %
		if (values[i] >= money) {
			ns.tprint(i + ": " + values[i]);
			GoodServers.push(i);
		}
		else {

		}
	}
	// # of Pservs PER Target Server
	var DeployableServers = Math.round(numOfPservs / GoodServers.length);
	// Goes through Every Target Server
	var v1 = 0;
	var i = 0;

	while (i < GoodServers.length) {
		var CurrentPservers = [];
		i += 1;
		var a = 0;
		while (a < DeployableServers) {
			a += 1;
			var b = (a + v1);
			CurrentPservers.push(Pservs[b]);

		}
		// last iteration of "b" 
		v1 = b;
		var D = i - 1;
		ns.tprint("Smart Deploying: " + GoodServers[D] + ": " + CurrentPservers);
		await Deploy(ns, GoodServers[D], CurrentPservers);
	}
	ns.tprint("Script Finished!");

}
export async function WeakenExp(ns, numofServers) {
	var V1 = ns.getPurchasedServers()
	var V2 = []
	for (var i = 0; i < numofServers + 1; i++) {
		V2.push(V1[i])
	}
	await Deploy(ns, 'foodnstuff', V2, 'weaken')
}
export async function getValues(ns, servers) {
	ns.tprint("Getting Server Values...");
	var ServersWorth = {};
	for (var i = 0; i < servers.length; i++) {
		var dd = servers[i];
		var moneyThresh = ns.getServerMaxMoney(dd) * 0.80;
		ServersWorth[dd] = moneyThresh;
	}
	return ServersWorth;
}
// check if the required files for the port level are installed
// returns True if the required Files are installed for the "RequiredPorts"
async function CheckPortLevel(ns, RequiredPorts) {

	if (RequiredPorts == 0) {
		return true;
		//SSH
	} else if (RequiredPorts == 1) {

		if (!ns.fileExists("BruteSSH.exe", "home")) return false;
		return true;


		//FTP
	} else if (RequiredPorts == 2) {

		if (!(ns.fileExists("BruteSSH.exe", "home")) || (!(ns.fileExists("FTPCrack.exe", "home")))) return false;
		return true;
	}
	//SMTP
	else if (RequiredPorts == 3) {

		if (!(ns.fileExists("BruteSSH.exe", "home")) || (!(ns.fileExists("FTPCrack.exe", "home"))) || (!(ns.fileExists("relaySMTP.exe", "home")))) return false;
		return true;
	}
	//HTTP
	else if (RequiredPorts == 4) {

		if (!(ns.fileExists("BruteSSH.exe", "home")) || (!(ns.fileExists("FTPCrack.exe", "home"))) || (!(ns.fileExists("relaySMTP.exe", "home"))) || (!(ns.fileExists("HTTPWorm.exe", "home")))) return false;
		return true;

	}
	//SQL
	else if (RequiredPorts == 5) {

		if (!(ns.fileExists("BruteSSH.exe", "home")) || (!(ns.fileExists("FTPCrack.exe", "home"))) || (!(ns.fileExists("relaySMTP.exe", "home"))) || (!(ns.fileExists("HTTPWorm.exe", "home"))) || (!(ns.fileExists("SQLInject.exe", "home")))) return false;
		return true;
	}

	else {
		return false;
	}
}
