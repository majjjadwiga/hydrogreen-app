export function generateMockCanFrame(canId: number):{canId: number; buffer: ArrayBuffer}{

    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);

    switch(canId){
        case 0x500:{
            const fanMode = Math.random()<0.5 ? 0 : 1;
            const purgeMode = Math.floor(Math.random()*4);
            const mainValve  = Math.random()<0.5 ? 0 : 1;
            const state = Math.floor(Math.random()*16);
            const byte0 = state | (mainValve<<4) | (purgeMode<<5) | (fanMode<<7);
            view.setUint8(0,byte0);

            const fanDuty = Math.floor(Math.random()*101);
            const byte1 = fanDuty;
            view.setUint8(1,byte1);

            const purgeIntervalS = Math.floor(Math.random()*65536);
            const byte23 = purgeIntervalS;
            view.setUint16(2, byte23, true);
            break;
        }

        case 0x501:{
            const h2FlowPhys = Math.random()*10.0;
            const h2FlowRaw = Math.round(h2FlowPhys/0.001);
            view.setUint16(0, h2FlowRaw, true);

            const h2LpPressurePhys = Math.random()*10.0;
            const h2LpPressureRaw = Math.round(h2LpPressurePhys/0.001);
            view.setUint16(2, h2LpPressureRaw, true);

            const h2HpPressurePhys = Math.random()*10.0;
            const h2HpPressureRaw = Math.round(h2HpPressurePhys/0.001);
            view.setUint16(4, h2HpPressureRaw, true);

            const leakageVoltagePhys = Math.random()*5.0;
            const leakageVoltageRaw = Math.round(leakageVoltagePhys/0.0001);
            view.setUint16(6,leakageVoltageRaw,true);

            break;
        }

        case 0x502:{
            const fcVoltagePhys = Math.random()*60;
            const fcVoltageRaw = Math.floor(fcVoltagePhys/0.001);
            view.setUint16(0,fcVoltageRaw,true);

            const fcCurrentPhys = Math.random()*40;
            const fcCurrentRaw = Math.floor(fcCurrentPhys/0.001);
            view.setUint16(2,fcCurrentRaw,true);

            const accessoryVoltagePhys = Math.random()*20.0;
            const accessoryVoltageRaw = Math.round(accessoryVoltagePhys/0.001);
            view.setUint16(4,accessoryVoltageRaw,true);

            break;
        }

        case 0x503:{
            const fcTempCPhys = Math.random()*250-50;
            const fcTempCRaw = Math.floor(fcTempCPhys/0.1);
            view.setUint16(0,fcTempCRaw,true);

            const ambientTempCPhys = Math.random()*201-50;
            const ambientTempCRaw = Math.floor(ambientTempCPhys/0.1);
            view.setUint16(2,ambientTempCRaw,true);

            const ambientHumidityPhys = Math.random()*100;
            const ambientHumidityRaw = Math.floor(ambientHumidityPhys/0.1);
            view.setUint16(4,ambientHumidityRaw,true);

            const ambientPressurePhys = Math.random()*1200;
            const ambientPressureRaw = Math.floor(ambientPressurePhys/0.1);
            view.setUint16(6,ambientPressureRaw,true);

            break;
        }

        case 0x504:{
            const hoCurrent0Phys = Math.random()*80-40;
            const hoCurrent0Raw = Math.floor(hoCurrent0Phys/0.001);
            view.setUint16(0,hoCurrent0Raw,true);

            const hoCurrent1Phys = Math.random()*80-40;
            const hoCurrent1Raw = Math.floor(hoCurrent1Phys/0.001);
            view.setUint16(2,hoCurrent1Raw,true);

            const hoCurrent2Phys = Math.random()*80-40;
            const hoCurrent2Raw = Math.floor(hoCurrent2Phys/0.001);
            view.setUint16(4,hoCurrent2Raw,true);

            const hoCurrent3Phys = Math.random()*80-40;
            const hoCurrent3Raw = Math.floor(hoCurrent3Phys/0.001);
            view.setUint16(6,hoCurrent3Raw,true);
            break;
        }
    }
    
    return {canId, buffer};
}

