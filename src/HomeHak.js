/** @param {NS} ns **/
export async function main(ns) {
    await RunHack(ns,ns.args[0]);
}
async function RunHack(ns, target) {
	var A = ns.getServerMaxRam("home")
	var B = ns.getScriptRam("HackingTemp.js", 'home')
	var C = (A / B ) *0.97
	ns.run("HackingTemp.js", C, target)
}
async function FvX(ns){
	ns.tprint(ns.getScriptIncome("HackingTemp.js", "home"))
	ns.tprint(ns.getScriptExpGain("HackingTemp.js", "home"))
}