import {writeScript, validateData} from '../3p/3p';

const EMITTER_DOMAIN = '.adocean.pl';
const ADO_JS_PATH = '/files/js/ado.FIF.test.js';

function getBoolFromString(str) {
    return str === 'true';
}

function setAdoConfig(global, data) {
    if (global.ado) {
        let config = {
            mode: data.adoMode,
            xml: getBoolFromString(data.xml),
            characterEncoding: getBoolFromString(data.characterEncoding)
        };

        if (data.adoMode === 'new' && getBoolFromString(data.fifEnabled)) {
            config.fif = {
                enabled: data.fifEnabled || false,
                force: data.fifForce || false,
                sequential: data.fifSequential || false
            }
        }

        console.log('config', config);

        global.ado.config(config);
    }
}

function appendPlacement(global, data) {
    let placement = global.document.createElement('div');
    placement.id = data.placementId;

    const dom = global.document.getElementById('c');
    dom.appendChild(placement);

    if (global.ado) {
        global.ado.placement({
            id: data.placementId,
            server: data.emitter + EMITTER_DOMAIN
        });
    }
}

function appendMasterSlave(global, data) {
    let slave = global.document.createElement('div');
    slave.id = data.slaveId;

    let dom = global.document.getElementById('c');
    dom.appendChild(slave);

    if (global.ado) {
        ado.onEmit(function(masterlikeId, masterlikeInstanceId) {
            console.log("recived emiter response for master with id " + masterlikeId + " ; master isntance id: " + masterlikeInstanceId);
        });

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