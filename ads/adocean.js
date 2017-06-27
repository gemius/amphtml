import {writeScript, validateData} from '../3p/3p';

/**
 * @param {!Window} global
 * @param {!Object} data
 */
export function adocean(global, data) {
    validateData(data, ['aoSrv', 'aoZid'], []);

    let url = "https://" + data.aoSrv + "/_" + (new Date()).getTime() + "/ad.js?id=" + data.aoZid; // todo dimenssions etc.

    writeScript(global, url); // zaladowanie zewnetrznego skryptu
}
