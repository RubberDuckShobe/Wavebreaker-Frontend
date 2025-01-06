<!--https://github.com/SauravKanchan/svelte-chartjs/issues/158#issuecomment-2456212827
	Thank you!
-->
<script lang="ts">
	import { CharacterClass, characterList, getCharacterClass } from '$lib/utils/characterUtils';
	import type { Score } from '$lib/models/ScoreData';
	import Modal from '../common/Modal.svelte';
	import Line from '$lib/components/LineFix.svelte';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';
	import { DateTime } from 'luxon';
	import { parseXStats } from '$lib/utils/xStats';

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);
	ChartJS.defaults.font.family = 'Inter, sans-serif';
	ChartJS.defaults.color = '#C8D3F5';
	ChartJS.defaults.borderColor = '#2f334d';
	ChartJS.defaults.backgroundColor = '#009EFF';

	export let targetScore: Score;
	export let showModal: boolean;

	let formatter = Intl.NumberFormat();
	let timeSet = DateTime.fromISO(targetScore.rideTime);

	let trackShapeNumbers;
	let trackShapeData;

	trackShapeNumbers = targetScore.trackShape.split('x').map(function (item) {
		return Math.abs(parseInt(item) - 103);
	});
	trackShapeData = {
		labels: new Array(trackShapeNumbers.length - 1).fill(''),
		datasets: [
			{
				label: 'Height',
				data: trackShapeNumbers,
				borderColor: '#009EFF'
			}
		]
	};

	let parsedStats = parseXStats(targetScore.xstats);
	let characterClass = getCharacterClass(targetScore.vehicleId);
</script>

<Modal bind:showModal>
	<div class="flex flex-col space-y-4 w-full">
		<div class="grow">
			<h2 class="font-bold text-xl mb-3">Score details</h2>
			<Line
				data={trackShapeData}
				options={{
					responsive: true,
					animation: false,
					scales: {
						x: {
							border: {
								display: true
							},
							ticks: {
								stepSize: 5,
								maxTicksLimit: 51
							},
							max: 256
						},
						y: {
							border: {
								display: true
							},
							ticks: {
								display: false,
								maxTicksLimit: 9,
								stepSize: 13
							},
							max: 103
						}
					},
					elements: {
						point: {
							radius: 0
						}
					},
					plugins: {
						legend: { display: false }
					}
				}}
			/>
			<p>
				<b>Time submitted:</b>
				{timeSet.toLocaleString(DateTime.DATETIME_SHORT)} <br />
				<b>Skill Points:</b>
				{targetScore.skillPoints} <br />
				<b>Character:</b>
				{characterList[targetScore.vehicleId]} <br />
				<b>Feats:</b>
				{targetScore.feats} <br />
				<b>Density:</b>
				{targetScore.density} <br />
				<b>Gold threshold:</b>
				{formatter.format(targetScore.goldThreshold)} <br />
				<b>Total times played:</b>
				{targetScore.playCount} <br />
			</p>
		</div>
		<div class="grow">
			<h2 class="font-bold text-xl mb-3">Extended stats (WIP)</h2>
			<p>
				{#if characterClass == CharacterClass.Mono}
					<b>Grey blocks hit:</b>
					{parsedStats.characterSpecific1} <br />
					<b>% of colored blocks hit:</b>
					{parsedStats.characterSpecific2} <br />
				{/if}
				{#if characterClass == CharacterClass.Pointman}
					<b>Scooped blocks:</b>
					{parsedStats.characterSpecific1} <br />
					<b>Scooped powerups:</b>
					{parsedStats.characterSpecific2} <br />
				{/if}
				{#if characterClass == CharacterClass.DoubleVision}
					<b>Crossover matches:</b>
					{parsedStats.characterSpecific1} <br />
					<b>L/R score difference:</b>
					{parsedStats.characterSpecific2} <br />
				{/if}
				{#if characterClass == CharacterClass.Vegas}
					<b>Times shuffled:</b>
					{parsedStats.characterSpecific1} <br />
					<b>Avg. shuffle size:</b>
					{parsedStats.characterSpecific2} <br />
				{/if}
				{#if characterClass == CharacterClass.Pusher}
					<b>Left pushes:</b>
					{parsedStats.characterSpecific1} <br />
					<b>Right pushes:</b>
					{parsedStats.characterSpecific2} <br />
				{/if}
			</p>
			<p class="mt-2">
				<b>Overfills:</b>
				{parsedStats.overfills} <br />
				<b>Longest chain:</b>
				{parsedStats.longestChain} <br />
				<b>Dropped chains:</b>
				{parsedStats.droppedChains} <br />
				<b>Best cluster:</b>
				{formatter.format(parsedStats.bestCluster)} <br />
				<b>Avg. cluster size:</b>
				{formatter.format(parsedStats.avgClusterSize)} <br />
				<b>Avg. cluster color count:</b>
				{formatter.format(parsedStats.avgClusterColorCount)} <br />
				<b>Max. consecutive blocks dodged:</b>
				{parsedStats.maxConsecutiveBlocksDodged} <br />
				<b>Max. consecutive blocks collected:</b>
				{parsedStats.maxConsecutiveBlocksCollected} <br />
			</p>
		</div>
	</div>
</Modal>
