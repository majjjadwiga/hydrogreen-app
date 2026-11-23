<script lang="ts">
    const { ipcRenderer } = window.require('electron');
    import type { 
        FccuStateFrame, 
        FccuHydrogenFrame, 
        FccuPowerFrame, 
        FccuEnvironmentFrame, 
        FccuCurrentsFrame 
    } from '../../shared/types';
    import uPlot from 'uplot'
    import FccuView from './components/FccuView.svelte';
    import McuView from './components/McuView.svelte';
    import LcuView from './components/LcuView.svelte';
    import SwuView from './components/SwuView.svelte';

type CanModule = 'fccu' | 'mcu' | 'lcu' | 'swu';
let selectedModule = $state<CanModule>('fccu');

    const maxPoints = 20;
    let voltageHistory = $state<uPlot.AlignedData>([
        [], // x axis
        [], //fc_voltage
        [] //accessory_voltage
    ])

    let currentsHistory = $state<uPlot.AlignedData>([
        [], //x axis
        [], //hoCurrent0
        [], //hoCurrent1
        [], //hoCurrent2
        [] //hoCurrent3
    ])

    let environmentTempHistory = $state<uPlot.AlignedData>([
        [], //x axis
        [], //fc_temp_c
        [], //ambient_temp_c
       
    ])

    let h2PressureHistory = $state<uPlot.AlignedData>(
        [
            [], //x axis
            [], //h2_lp_pressure
            [] //h2_hp_pressure
        ]
    )
    

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

            const currentSec = Date.now()/1000
            const nextTimeS = [...h2PressureHistory[0],currentSec].slice(-maxPoints)
            const nextH2HpPressure = [...h2PressureHistory[1],latestHydrogen.h2HpPressure].slice(-maxPoints)
            const nextH2LpPressure = [...h2PressureHistory[2],latestHydrogen.h2LpPressure].slice(-maxPoints)
            
            h2PressureHistory = [nextTimeS, nextH2LpPressure, nextH2HpPressure]
        } else if (data.canId === 0x502) {
            latestPower = data as FccuPowerFrame;

            
                const currentSec = Date.now()/1000;
                const nextTimeS = [...voltageHistory[0], currentSec].slice(-maxPoints);
                const nextFcVolt = [...voltageHistory[1], latestPower.fcVoltage].slice(-maxPoints);
                const nextAccVolt = [...voltageHistory[2], latestPower.accessoryVoltage].slice(-maxPoints);  

                voltageHistory = [nextTimeS, nextFcVolt, nextAccVolt ]

            
            
        } else if (data.canId === 0x503) {
            latestEnvironment = data as FccuEnvironmentFrame;

            const currentSec = Date.now()/1000;
            const nextTimeS = [...environmentTempHistory[0],currentSec].slice(-maxPoints);
            const nextFcTempC = [...environmentTempHistory[1],latestEnvironment.fcTempC].slice(-maxPoints);
            const nextAmbientTempC = [...environmentTempHistory[2],latestEnvironment.ambientTempC].slice(-maxPoints);

            environmentTempHistory = [nextTimeS,nextFcTempC,nextAmbientTempC]
           
        } else if (data.canId === 0x504) {
            latestCurrents = data as FccuCurrentsFrame;
            

            const currentSec = Date.now()/1000
            const nextTimeS = [...currentsHistory[0],currentSec].slice(-maxPoints);
            const nextC0 = [...currentsHistory[1], latestCurrents.hoCurrent0].slice(-maxPoints);
            const nextC1 = [...currentsHistory[2], latestCurrents.hoCurrent1].slice(-maxPoints);
            const nextC2 = [...currentsHistory[3], latestCurrents.hoCurrent2].slice(-maxPoints);
            const nextC3 = [...currentsHistory[4], latestCurrents.hoCurrent3].slice(-maxPoints);

            currentsHistory = [nextTimeS, nextC0, nextC1, nextC2, nextC3];

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
            <div style="margin-bottom: 20px; background: #222; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
               

                {#each ['fccu', 'mcu', 'lcu', 'swu'] as mod}
                    <button
                        type="button"
                        onclick={() => selectedModule = mod as CanModule}
                        style="background: {selectedModule === mod ? '#575757' : '#333'}; color: #fff; border: none; border-radius: 6px; padding: 8px 14px; cursor: pointer; text-transform: uppercase; font-weight: bold;"
                    >
                        {mod}
                    </button>
                {/each}
            </div>

            {#if selectedModule === 'fccu'}
                <FccuView
                    {latestState}
                    {latestHydrogen}
                    {latestPower}
                    {latestEnvironment}
                    {latestCurrents}
                    {h2PressureHistory}
                    {voltageHistory}
                    {environmentTempHistory}
                    {currentsHistory}
                />
            {:else if selectedModule === 'mcu'}
                <McuView />
            {:else if selectedModule === 'lcu'}
                <LcuView />
            {:else if selectedModule === 'swu'}
                <SwuView />
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