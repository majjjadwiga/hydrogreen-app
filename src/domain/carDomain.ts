import { FccuStateFrame, FccuHydrogenFrame, FccuPowerFrame, FccuEnvironmentFrame, FccuCurrentsFrame } from '../shared/types';

export function parseFccuState(buffer: ArrayBuffer): FccuStateFrame {
  const view = new DataView(buffer);
  const byte0 = view.getUint8(0);

  return {
    canId: 0x500,
    state: byte0 & 0x0F,
    mainValve: ((byte0 >> 4) & 0x01)===1,
    purgeMode: (byte0 >> 5) & 0x03,
    fanMode: ((byte0 >> 7) & 0x01)===1,
    fanDuty: view.getUint8(1),
    purgeIntervalS: view.getUint16(2, true)
  };
}

export function parseFccuHydrogen(buffer: ArrayBuffer): FccuHydrogenFrame {
  const view = new DataView(buffer);

  return {
    canId: 0x501,
    h2Flow: view.getUint16(0, true) * 0.001,
    h2LpPressure: view.getUint16(2, true) * 0.001,
    h2HpPressure: view.getUint16(4, true) * 0.001,
    leakageVoltage: view.getUint16(6, true) * 0.0001
  };
}

export function parseFccuPower(buffer: ArrayBuffer): FccuPowerFrame {
  const view = new DataView(buffer);

  return {
    canId: 0x502,
    fcVoltage: view.getInt16(0, true) * 0.001,
    fcCurrent: view.getInt16(2, true) * 0.001,
    accessoryVoltage: view.getInt16(4, true) * 0.001
  };
}

export function parseFccuEnvironment(buffer: ArrayBuffer): FccuEnvironmentFrame {
  const view = new DataView(buffer);

  return {
    canId: 0x503,
    fcTempC: view.getInt16(0, true) * 0.1,
    ambientTempC: view.getInt16(2, true) * 0.1,
    ambientHumidity: view.getUint16(4, true) * 0.1,
    ambientPressure: view.getUint16(6, true) * 0.1
  };
}

export function parseFccuCurrents(buffer: ArrayBuffer): FccuCurrentsFrame {
  const view = new DataView(buffer);

  return {
    canId: 0x504,
    hoCurrent0: view.getInt16(0, true) * 0.001,
    hoCurrent1: view.getInt16(2, true) * 0.001,
    hoCurrent2: view.getInt16(4, true) * 0.001,
    hoCurrent3: view.getInt16(6, true) * 0.001
  };
}