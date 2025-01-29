type XStatsGeneral = {
	characterSpecific1: number;
	characterSpecific2: number;
	overfills: number;
	longestChain: number;
	droppedChains: number;
	bestCluster: number;
	avgClusterSize: number; //divide by 10 when setting
	avgClusterColorCount: number; //divide by 10 when setting
	maxConsecutiveBlocksDodged: number;
	maxConsecutiveBlocksCollected: number;
	skillRating: number;
};

type XStatsBlocks = {
	collectedPurple: number;
	collectedPurplePercent: number;
	collectedPurpleTotal: number;
	collectedBlue: number;
	collectedBluePercent: number;
	collectedBlueTotal: number;
	collectedGreen: number;
	collectedGreenPercent: number;
	collectedGreenTotal: number;
	collectedYellow: number;
	collectedYellowPercent: number;
	collectedYellowTotal: number;
	collectedRed: number;
	collectedRedPercent: number;
	collectedRedTotal: number;
	collectedWhite: number;
	collectedWhitePercent: number;
	collectedWhiteTotal: number;
};

export type XStats = XStatsGeneral & XStatsBlocks;

export function parseXStats(statArray: number[]): XStats {
	const parsedStats = <XStatsGeneral>{};
	parsedStats.characterSpecific1 = statArray[0];
	parsedStats.characterSpecific2 = statArray[1];
	parsedStats.overfills = statArray[2];
	parsedStats.longestChain = statArray[3];
	parsedStats.droppedChains = statArray[4];
	parsedStats.bestCluster = statArray[5];
	parsedStats.avgClusterSize = statArray[6] / 10;
	parsedStats.avgClusterColorCount = statArray[7] / 10;
	parsedStats.maxConsecutiveBlocksDodged = statArray[8];
	parsedStats.maxConsecutiveBlocksCollected = statArray[9];
	parsedStats.skillRating = statArray[10];

	const parsedBlockStats = <XStatsBlocks>{};
	Object.entries(parsedBlockStats).forEach(([key], index) => {
		parsedBlockStats[key] = statArray[11 + index];
	});

	return { ...parsedStats, ...parsedBlockStats };
}
