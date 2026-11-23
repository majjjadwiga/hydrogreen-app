<script lang="ts">
    import type uPlot from 'uplot';
    import type {
        FccuStateFrame,
        FccuHydrogenFrame,
        FccuPowerFrame,
        FccuEnvironmentFrame,
        FccuCurrentsFrame
    } from '../../../shared/types';
    import TelemetryChart from './TelemetryChart.svelte';

    interface Props {
        latestState: FccuStateFrame | null;
        latestHydrogen: FccuHydrogenFrame | null;
        latestPower: FccuPowerFrame | null;
        latestEnvironment: FccuEnvironmentFrame | null;
        latestCurrents: FccuCurrentsFrame | null;
        h2PressureHistory: uPlot.AlignedData;
        voltageHistory: uPlot.AlignedData;
        environmentTempHistory: uPlot.AlignedData;
        currentsHistory: uPlot.AlignedData;
    }

    let {
        latestState,
        latestHydrogen,
        latestPower,
        latestEnvironment,
        latestCurrents,
        h2PressureHistory,
        voltageHistory,
        environmentTempHistory,
        currentsHistory
    }: Props = $props();

    let selectedCanId = $state<number>(0x501);
</script>

<div>
    

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
            <h2 style="margin-top: 0;">0x500 - FCCU_STATE</h2>
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
            <h2 style="margin-top: 0;">0x501 - FCCU_HYDROGEN</h2>
            {#if latestHydrogen}
                <p>H2_FLOW: {latestHydrogen.h2Flow.toFixed(3)} Ln/min</p>
                <p>H2_LP_PRESSURE: {latestHydrogen.h2LpPressure.toFixed(3)} bar</p>
                <p>H2_HP_PRESSURE: {latestHydrogen.h2HpPressure.toFixed(3)} bar</p>
                <p>LEAKAGE_VOLTAGE: {latestHydrogen.leakageVoltage.toFixed(4)} V</p>
            {:else}
                <p style="color: #888;">Waiting for frame: 0x501...</p>
            {/if}

            <div style="margin-top: 20px;">
                <TelemetryChart
                    title="H2 Pressure (0x501)"
                    labels={['Time', 'H2_LP_PRESSURE', 'H2_HP_PRESSURE']}
                    colors={['#F00', '#0F0']}
                    data={h2PressureHistory}
                />
            </div>
        </div>

    {:else if selectedCanId === 0x502}
        <div style="background: #222; padding: 20px; border-radius: 8px;">
            <h2 style="margin-top: 0;">0x502 - FCCU_POWER</h2>
            {#if latestPower}
                <p>FC_VOLTAGE: {latestPower.fcVoltage.toFixed(3)} V</p>
                <p>FC_CURRENT: {latestPower.fcCurrent.toFixed(3)} A</p>
                <p>ACCESSORY_VOLTAGE: {latestPower.accessoryVoltage.toFixed(3)} V</p>
            {:else}
                <p style="color: #888;">Waiting for frame: 0x502...</p>
            {/if}

            <div style="margin-top: 20px;">
                <TelemetryChart
                    title="Voltage (0x502)"
                    labels={['Time', 'FC_VOLTAGE', 'ACCESSORY_VOLTAGE']}
                    colors={['#F00', '#0F0']}
                    data={voltageHistory}
                />
            </div>
        </div>

    {:else if selectedCanId === 0x503}
        <div style="background: #222; padding: 20px; border-radius: 8px;">
            <h2 style="margin-top: 0;">0x503 - FCCU_ENVIRONMENT</h2>
            {#if latestEnvironment}
                <p>FC_TEMP_C: {latestEnvironment.fcTempC.toFixed(1)} °C</p>
                <p>AMBIENT_TEMP_C: {latestEnvironment.ambientTempC.toFixed(1)} °C</p>
                <p>AMBIENT_HUMIDITY: {latestEnvironment.ambientHumidity.toFixed(1)} %</p>
                <p>AMBIENT_PRESSURE: {latestEnvironment.ambientPressure.toFixed(1)} hPa</p>
            {:else}
                <p style="color: #888;">Waiting for frame: 0x503...</p>
            {/if}

            <div style="margin-top: 20px;">
                <TelemetryChart
                    title="Temperature (0x503)"
                    labels={['Time', 'FC_TEMP_C', 'AMBIENT_TEMP_C']}
                    colors={['#F00', '#0F0']}
                    data={environmentTempHistory}
                />
            </div>
        </div>

    {:else if selectedCanId === 0x504}
        <div style="background: #222; padding: 20px; border-radius: 8px;">
            <h2 style="margin-top: 0;">0x504 - FCCU_CURRENTS</h2>
            {#if latestCurrents}
                <p>HO_CURRENT_0: {latestCurrents.hoCurrent0.toFixed(3)} A</p>
                <p>HO_CURRENT_1: {latestCurrents.hoCurrent1.toFixed(3)} A</p>
                <p>HO_CURRENT_2: {latestCurrents.hoCurrent2.toFixed(3)} A</p>
                <p>HO_CURRENT_3: {latestCurrents.hoCurrent3.toFixed(3)} A</p>
            {:else}
                <p style="color: #888;">Waiting for frame: 0x504...</p>
            {/if}

            <div style="margin-top: 20px;">
                <TelemetryChart
                    title="Currents (0x504)"
                    labels={['Time', 'HO_CURRENT0', 'HO_CURRENT1', 'HO_CURRENT2', 'HO_CURRENT3']}
                    colors={['#F00', '#0F0', '#00F', '#F0F']}
                    data={currentsHistory}
                />
            </div>
        </div>
    {/if}
</div>