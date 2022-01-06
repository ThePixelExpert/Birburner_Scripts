/** @param {NS} ns **/
export async function main(ns) {
    await BuyServers(ns, ns.args[0])
}
async function BuyServers(ns, ram) {
    var i = ns.getPurchasedServers.length;
    while (i < ns.getPurchasedServerLimit()) {

        if (ns.getServerMoneyAvailable("home") >= (24 * ns.getPurchasedServerCost(ram))) {
            DeleteServers(ns)
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Copy our hacking script onto the newly-purchased server
            //  3. Run our hacking script on the newly-purchased server with 3 threads
            //  4. Increment our iterator to indicate that we've bought a new server
            for (var a = 0; a < 25; a++) {
                var name = ("pserv-" + a)
                var hostname = ns.purchaseServer(name, ram);
                await ns.scp("HackingTemp.js", hostname);
                var D = Math.round(ns.getServerMaxRam(hostname) / ns.getScriptRam("HackingTemp.js")) - 1
                if(D==0) continue;
                ns.exec("HackingTemp.js", name, D, ns.args[1]);
                i++
            }

        }
        ns.tprint((24 * ns.getPurchasedServerCost(ram)))
        await ns.sleep(1000)
    }
}

async function DeleteServers(ns) {
    var a = ns.getPurchasedServers()
    for (var i = 0; i < a.length; i++) {
        ns.scriptKill("HackingTemp.js", a[i])
        ns.deleteServer(a[i])
    }
}