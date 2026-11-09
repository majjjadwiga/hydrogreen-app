declare global {
    interface Window {
        electronAPI: {
            onCanData: (callback: (data: FccuStateFrame) => void) => void;
        };
    }
}


export interface FccuStateFrame {
    canId: number;
    fanDuty: number;
    fanMode: boolean;
    mainValve: boolean;
    purgeIntervalS: number;
    purgeMode: number;
    state: number;
}

export interface FccuHydrogenFrame {
    canId: number;
    h2Flow: number;
    h2HpPressure: number;
    h2LpPressure: number;
    leakageVoltage:number;

}
export interface FccuPowerFrame {
    canId: number;
    accessoryVoltage: number;
    fcCurrent: number;
    fcVoltage: number;
}

export interface FccuEnvironmentFrame{
    canId: number;
    ambientHumidity: number;
    ambientPressure: number;
    ambientTempC: number;
    fcTempC: number;
}
export interface FccuCurrentsFrame{
    canId: number;
    hoCurrent0: number;
    hoCurrent1: number;
    hoCurrent2: number;
    hoCurrent3: number;

}

