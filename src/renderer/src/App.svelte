<script lang="ts">
    const { ipcRenderer } = window.require('electron');
    import type { 
        FccuStateFrame, 
        FccuHydrogenFrame, 
        FccuPowerFrame, 
        FccuEnvironmentFrame, 
        FccuCurrentsFrame 
    } from '../../shared/types';

	let selectedCanId = $state<number>(0x500);

    let activeTab = $state('can');

  
    let latestState = $state<FccuStateFrame | null>(null);
    let latestHydrogen = $state<FccuHydrogenFrame | null>(null);
    let latestPower = $state<FccuPowerFrame | null>(null);
    let latestEnvironment = $state<FccuEnvironmentFrame | null>(null);
    let latestCurrents = $state<FccuCurrentsFrame | null>(null);

    
    ipcRenderer.on('can-data-updated', (_event, data: any) => {
        if (data.canId === 0x500) {
            latestState = data as FccuStateFrame;
        } else if (data.canId === 0x501) {
            latestHydrogen = data as FccuHydrogenFrame;
        } else if (data.canId === 0x502) {
            latestPower = data as FccuPowerFrame;
        } else if (data.canId === 0x503) {
            latestEnvironment = data as FccuEnvironmentFrame;
        } else if (data.canId === 0x504) {
            latestCurrents = data as FccuCurrentsFrame;
        }
    });
</script>

<div style="display: flex; min-height: 100vh; background-color: #0f0f0f; color: #ffff; font-family: sans-serif; padding: 0px;">
    
    
    <div style="display: flex; flex-direction: column; align-items: center; border-right: 1px solid #333; padding: 15px; gap: 15px;">
        <button
            onclick={() => activeTab = 'lora'}
            style="width: 80px; height: 80px; background: {activeTab === 'lora' ? '#575757' : '#333'}; color: #fff; font-family: sans-serif; border: none; border-radius: 8px; cursor: pointer; transition: background 0.3s;"
        >
            LoRa
        </button>

        <button
            onclick={() => activeTab = 'ethernet'}
            style="width: 80px; height: 80px; background: {activeTab === 'ethernet' ? '#575757' : '#333'}; color: #fff; font-family: sans-serif; border: none; border-radius: 8px; cursor: pointer; transition: background 0.3s;"
        >
            Ethernet
        </button>

        <button
            onclick={() => activeTab = 'can'}
            style="width: 80px; height: 80px; background: {activeTab === 'can' ? '#575757' : '#333'}; color: #fff; font-family: sans-serif; border: none; border-radius: 8px; cursor: pointer; transition: background 0.3s;"
        >
            CAN
        </button>

        <button
            onclick={() => activeTab = 'settings'}
            style="width: 80px; height: 80px; background: {activeTab === 'settings' ? '#575757' : '#333'}; color: #fff; border: none; border-radius: 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; transition: background 0.3s;"
        >
            <span style="font-size: 12px;">Settings</span>
        </button>
    </div>

    
    <div style="flex: 1; padding: 30px; overflow-y: auto;">
        
        {#if activeTab === 'can'}
	
            <h1 style="margin-top: 0; margin-bottom: 20px;">FCCU</h1>
            
            
            <div style="margin-bottom: 20px; background: #222; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
                <label for="frame-select" style="font-weight: bold;">Select CAN frame:</label>
                <select 
                    id="frame-select"
                    bind:value={selectedCanId}
                    style="background: #333; color: #fff; padding: 8px 12px; border-radius: 6px; border: 1px solid #555; cursor: pointer;"
                >
                    <option value={0x500}>0x500 - FCCU_STATE</option>
                    <option value={0x501}>0x501 - FCCU_HYDROGEN</option>
                    <option value={0x502}>0x502 - FCCU_POWER</option>
                    <option value={0x503}>0x503 - FCCU_ENVIRONMENT</option>
                    <option value={0x504}>0x504 - FCCU_CURRENTS</option>
                </select>
            </div>

            
            
            {#if selectedCanId === 0x500}
                <div style="background: #222; padding: 20px; border-radius: 8px;">
                    <h2 style="margin-top: 0; ">0x500 - FCCU_STATE</h2>
                    {#if latestState}
                        <p>STATE: {latestState.state}</p>
                        <p>FAN_DUTY: {latestState.fanDuty}%</p>
                        <p>FAN_MODE: {latestState.fanMode ? 'Auto' : 'Manual'}</p>
                        <p>MAIN_VALVE: {latestState.mainValve ? 'Open' : 'Closed'}</p>
                        <p>PURGE_MODE: {latestState.purgeMode}</p>
                        <p>PURGE_INTERVALS_S: {latestState.purgeIntervalS} s</p>
                    {:else}
                        <p style="color: #888;">Waiting for frame: 0x500...</p>
                    {/if}
                </div>

            {:else if selectedCanId === 0x501}
                <div style="background: #222; padding: 20px; border-radius: 8px;">
                    <h2 style="margin-top: 0; ">0x501 - FCCU_HYDROGEN</h2>
                    {#if latestHydrogen}
                        <p>H2_FLOW: {latestHydrogen.h2Flow.toFixed(3)} Ln/min</p>
                        <p>H2_LP_PRESSURE: {latestHydrogen.h2LpPressure.toFixed(3)} bar</p>
                        <p>H2_HP_PRESSURE: {latestHydrogen.h2HpPressure.toFixed(3)} bar</p>
                        <p>LEAKAGE_VOLTAGE: {latestHydrogen.leakageVoltage.toFixed(4)} V</p>
                    {:else}
                        <p style="color: #888;">Waiting for frame: 0x501...</p>
                    {/if}
                </div>

            {:else if selectedCanId === 0x502}
                <div style="background: #222; padding: 20px; border-radius: 8px;">
                    <h2 style="margin-top: 0; ">0x502 - FCCU_POWER</h2>
                    {#if latestPower}
                        <p>FC_VOLTAGE: {latestPower.fcVoltage.toFixed(3)} V</p>
                        <p>FC_CURRENT: {latestPower.fcCurrent.toFixed(3)} A</p>
                        <p>ACCESSORY_VOLTAGE: {latestPower.accessoryVoltage.toFixed(3)} V</p>
                    {:else}
                        <p style="color: #888;">Waiting for frame: 0x502...</p>
                    {/if}
                </div>

            {:else if selectedCanId === 0x503}
                <div style="background: #222; padding: 20px; border-radius: 8px;">
                    <h2 style="margin-top: 0; ">0x503 - FCCU_ENVIRONMENT</h2>
                    {#if latestEnvironment}
                        <p>FC_TEMP_C: {latestEnvironment.fcTempC.toFixed(1)} °C</p>
                        <p>AMBIENT_TEMP_C: {latestEnvironment.ambientTempC.toFixed(1)} °C</p>
                        <p>AMBIENT_HUMIDITY: {latestEnvironment.ambientHumidity.toFixed(1)} %</p>
                        <p>AMBIENT_PRESSURE: {latestEnvironment.ambientPressure.toFixed(1)} hPa</p>
                    {:else}
                        <p style="color: #888;">Waiting for frame: 0x503...</p>
                    {/if}
                </div>

            {:else if selectedCanId === 0x504}
                <div style="background: #222; padding: 20px; border-radius: 8px;">
                    <h2 style="margin-top: 0; ">0x504 - FCCU_CURRENTS</h2>
                    {#if latestCurrents}
                        <p>HO_CURRENT_0: {latestCurrents.hoCurrent0.toFixed(3)} A</p>
                        <p>HO_CURRENT_1: {latestCurrents.hoCurrent1.toFixed(3)} A</p>
                        <p>HO_CURRENT_2: {latestCurrents.hoCurrent2.toFixed(3)} A</p>
                        <p>HO_CURRENT_3: {latestCurrents.hoCurrent3.toFixed(3)} A</p>
                    {:else}
                        <p style="color: #888;">Waiting for frame: 0x504...</p>
                    {/if}
                </div>
            {/if}

        {:else if activeTab === 'ethernet'}
            <h1 style="margin-top: 0;">Ethernet</h1>
            <p style="color: #888;">Placeholder</p>

        {:else if activeTab === 'lora'}
            <h1 style="margin-top: 0;">LoRa</h1>
            <p style="color: #888;">Placeholder</p>

        {:else if activeTab === 'settings'}
            <h1 style="margin-top: 0;">Settings</h1>
            <p style="color: #888;">Placeholder</p>
        {/if}

    </div>
</div>