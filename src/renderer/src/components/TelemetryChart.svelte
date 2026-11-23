<script lang="ts">
    import uPlot from "uplot";
    import 'uplot/dist/uPlot.min.css'
    import { untrack } from 'svelte';

    interface Props {
        title: string;
        labels: string[];
        colors: string[];
        data: uPlot.AlignedData;
        height?: number;
        
    }

    let {title, labels, colors, data, height = 300}: Props = $props();

    let chartContainer = $state<HTMLDivElement | null>(null);
    let chartInstance: uPlot | null = null;

  

    $effect(()=> {
        if (!chartContainer) {
            return () => {};
        }
        const container = chartContainer;
        const initialLabels = untrack(() => labels);
        const initialColors = untrack(() => colors);
        const initialData = untrack(() => data);

        const chartSeries: uPlot.Series[] = [
            {},
            ...initialLabels.slice(1).map((label, idx) => ({
                label,
                stroke: initialColors[idx] ?? '#4af'
            }))
        ];

        const options: uPlot.Options = {
            width: container.clientWidth || 500,
            height,
            axes: [
                {
                    stroke: '#ccc',
                    grid: {
                        stroke: 'rgba(255, 255, 255, 0.12)',
                        width: 0.5
                    }
                },
                {
                    stroke: '#ccc',
                    grid: {
                        stroke: 'rgba(255, 255, 255, 0.12)',
                        width: 0.5
                    }
                }
            ],
            series: chartSeries,
            cursor: {
                drag: {
                    x: false,
                    y: false
                }
            }
        };

        const instance = new uPlot(options, initialData, container);
        chartInstance = instance;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const nextWidth = Math.floor(entry.contentRect.width);
                if (nextWidth > 0) {
                    instance.setSize({ width: nextWidth, height });
                }
            }
        });

        observer.observe(container);

        return () => {
            instance.destroy();
            chartInstance = null;
        };
        
    });

    $effect(()=>{
        chartInstance?.setData(data)
    });

</script>

<div
    style="background: #222; padding: 16px; border-radius: 8px;"
>
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <h3 style="margin: 0;">
            {title}
        </h3>

    
    </div>

    <div bind:this={chartContainer}></div>
</div>