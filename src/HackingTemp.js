/** @param {NS} ns **/
export async function main(ns) {
    var T = ns.args[0]
    var A = ns.args[1]
    if (A == 'weaken'){
        await Weak(ns,T)
    }else if (A == 'grow'){
        await Grow(ns,T);
    }else if (A == 'hack'){
        await Hak(ns,T);
    }
    else{
        await Start(ns,T);
    }
}

async function Start(ns,target) {
    var moneyThresh = ns.getServerMaxMoney(target) * 0.50;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            // If the server's security level is above our threshold, weaken it
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            // If the server's money is less than our threshold, grow it
            await ns.grow(target);
        } else {
            // Otherwise, hack it
            await ns.hack(target);
        }
    }
}
async function Weak(ns,target){
    var A = ns.getWeakenTime(target) - ns.getGrowTime(target)
    ns.tprint(A)
    await ns.weaken(target);
    await ns.sleep(A)
}
async function Grow(ns,target){
    var A = ns.getWeakenTime(target) - ns.getGrowTime(target)
    ns.tprint(A)
    await ns.grow(target);
    await ns.sleep(A)
}
async function Hak(ns,target){

}
// Hack , Weaken, and Grow based on times (run multiple)