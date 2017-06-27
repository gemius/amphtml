import {writeScript, validateData} from '../3p/3p';

const EMITTER_DOMAIN = '.adocean.pl';
const ADO_JS_PATH = '/files/js/ado.js';

function getBoolFromString(str) {
    return str === 'true';
}

function setAdoConfig(global, data) {
    if (global.ado) {
        global.ado.config({
            mode: data.adoMode,
            xml: getBoolFromString(data.xml),
            characterEncoding: getBoolFromString(data.characterEncoding)
        });
    }
}

function appendPlacement(global, data) {
    console.log('placement', data);
    let placement = global.document.createElement('div');
    placement.id = data.placementId;

    let dom = global.document.getElementById('c');
    dom.appendChild(placement);

    if (global.ado) {
        global.ado.placement({
            id: data.placementId,
            server: data.emitter + EMITTER_DOMAIN
        });
    }
}

function appendMasterSlave(global, data) {
    console.log('master-slave', data);
    let slave = global.document.createElement('div');
    slave.id = data.slaveId;

    let dom = global.document.getElementById('c');
    dom.appendChild(slave);

    if (global.ado) {
        global.ado.master({
            id: data.masterId,
            server: data.emitter + EMITTER_DOMAIN
        });

        global.ado.slave(data.slaveId, {
            myMaster: data.masterId
        });
    }
}

/**
 * @param {!Window} global
 * @param {!Object} data
 */
export function adocean(global, data) {
    validateData(data, [
        'adoMode',
        'xml',
        'characterEncoding',
        'emitter',
        'type'
    ]);

    const emitter = data.emitter;

    let adoUrl = 'https://' + emitter + EMITTER_DOMAIN + ADO_JS_PATH;

    writeScript(global, adoUrl, () => {
        setAdoConfig(global, data);

        if (typeof data.placementId !== 'undefined') {
            appendPlacement(global, data);
        } else {
            appendMasterSlave(global, data);
        }
    });
}