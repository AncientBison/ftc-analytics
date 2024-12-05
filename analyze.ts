import { Season } from './main.ts';
import { DataType2024 } from './dataType.ts';
const NUMBER_OF_SCORE_DISTRIBUTION_BUCKETS = 10;

const average = (array: number[]) => array.reduce((a, b) => a + b, 0) / array.length;

const getAverageAutoEndPointsOfMatch = (match: DataType2024) => {
    const redAutoEndPoints = (match.redRobotOneAuto !== "NONE" ? 3 : 0) + (match.redRobotTwoAuto !== "NONE" ? 3 : 0);
    const blueAutoEndPoints = (match.blueRobotOneAuto !== "NONE" ? 3 : 0) + (match.blueRobotTwoAuto !== "NONE" ? 3 : 0);

    return average([redAutoEndPoints, blueAutoEndPoints]);
}

type TeleopType = "NONE" | "OBSERVATION_ZONE" | "ASCENT_1" | "ASCENT_2" | "ASCENT_3";
type AutoType = "NONE" | "OBSERVATION_ZONE" | "ASCENT";

const getPercentAutoTeleopType = <P extends "auto" | "teleop">(matches: DataType2024[], type: P extends "auto" ? (AutoType) : (TeleopType), autoTeleop: P) => {
    return average(matches.map(match => {
        let percent = 0;

        if (autoTeleop === "auto") {
            percent += match.redRobotOneAuto === type ? 0.25 : 0;
            percent += match.redRobotTwoAuto === type ? 0.25 : 0;
            percent += match.blueRobotOneAuto === type ? 0.25 : 0;
            percent += match.blueRobotTwoAuto === type ? 0.25 : 0;
        } else if (autoTeleop === "teleop") {
            percent += match.redRobotOneTeleop === type ? 0.25 : 0;
            percent += match.redRobotTwoTeleop === type ? 0.25 : 0;
            percent += match.blueRobotOneTeleop === type ? 0.25 : 0;
            percent += match.blueRobotTwoTeleop === type ? 0.25 : 0;
        }

        return percent;
    }));
};


function calculateAveragePreFoulTotalsOverTime(data: { date: string, preFoulTotal: number }[]) {
    const allDates = Array.from(new Set(data.map(match => match.date)));

    const averagePreFoulTotalsOverTime: [number, number][] = [];
    
    for (const date of allDates) {
        const matchesOnDate = data.filter(match => match.date === date);

        const averagePreFoulTotals = average(matchesOnDate.map(match => match.preFoulTotal));

        averagePreFoulTotalsOverTime.push([new Date(date).getTime(), averagePreFoulTotals]);
    }

    return averagePreFoulTotalsOverTime;
  }

const teleopToPoints = (teleop: TeleopType) => {
    switch (teleop) {
        case "NONE":
            return 0;
        case "OBSERVATION_ZONE":
            return 3;
        case "ASCENT_1":
            return 3;
        case "ASCENT_2":
            return 15;
        case "ASCENT_3":
            return 30;
        default:
            return 0;
    }
}


const calculateEndgamePoints = (match: DataType2024) => {
    const teleops = [match.redRobotOneTeleop, match.redRobotTwoTeleop, match.blueRobotOneTeleop, match.blueRobotTwoTeleop];

    const totalTeleopPoints = teleops.reduce((acc, teleop) => acc + teleopToPoints(teleop), 0);

    return totalTeleopPoints / 2;
}

function analyzeMatches(matchesOfCountry: DataType2024[], collectionName: string, type: "country" | "province" | "overall") {
        const preFoulTotals: number[] = [];
        const preFoulTotalsOverTime: {
            date: string,
            preFoulTotal: number
        }[] = [];

        for (const match of matchesOfCountry) {
            preFoulTotals.push(match.redPreFoulTotal, match.bluePreFoulTotal);
            preFoulTotalsOverTime.push({
                date: match.eventDateStart,
                preFoulTotal: average([match.redPreFoulTotal, match.bluePreFoulTotal])
            });
        }

        const minPreFoulTotal = Math.min(...preFoulTotals);
        const maxPreFoulTotal = Math.max(...preFoulTotals);

        const preFoulTotalRange = maxPreFoulTotal - minPreFoulTotal;
        const preFoulTotalBucketDifference = preFoulTotalRange / NUMBER_OF_SCORE_DISTRIBUTION_BUCKETS;

        const buckets: {
            [key: string]: number
        } = {};

        const bucketStarts: number[] = [];
        const bucketEnds: number[] = [];

        for (let scoreDistributionMultiplier = 0; scoreDistributionMultiplier < NUMBER_OF_SCORE_DISTRIBUTION_BUCKETS; scoreDistributionMultiplier++) {
            bucketStarts.push(minPreFoulTotal + (preFoulTotalBucketDifference * scoreDistributionMultiplier));
            bucketEnds.push(minPreFoulTotal + (preFoulTotalBucketDifference * (scoreDistributionMultiplier + 1)));
        }

        for (const bucketIndex in bucketStarts) {
            buckets[`${bucketStarts[bucketIndex]}-${bucketEnds[bucketIndex]}`] = preFoulTotals.filter(preFoulTotal => preFoulTotal >= bucketStarts[bucketIndex] && preFoulTotal < bucketEnds[bucketIndex]).length;
        }

        buckets[`${bucketStarts.at(-1)}-${bucketEnds.at(-1)}`] += 1;

        return {
            type,
            collectionName,
            averagePreFoulTotal: average(preFoulTotals),
            averagePreFoulTotalOverTime: calculateAveragePreFoulTotalsOverTime(preFoulTotalsOverTime),
            distribution: buckets,
            "pointBreakdown": {
                "averageTeleopPoints": average(matchesOfCountry.map(match => average([match.redTeleopPoints, match.blueTeleopPoints]))),
                "averageAutoPoints": average(matchesOfCountry.map(match => average([match.redAutoPoints, match.blueAutoPoints]))),
                "averageEndgamePoints": average(matchesOfCountry.map(match => average([match.redEndgamePoints, match.blueEndgamePoints]))),
                "averageAutoSamples": {
                    "low": average(matchesOfCountry.map(match => average([match.redAutoSampleLow, match.blueAutoSampleLow]))),
                    "high": average(matchesOfCountry.map(match => average([match.redAutoSampleHigh, match.blueAutoSampleHigh]))),
                    "net": average(matchesOfCountry.map(match => average([match.redAutoSampleNet, match.blueAutoSampleNet]))),
                    "points": average(matchesOfCountry.map(match => average([match.redAutoSamplePoints, match.blueAutoSamplePoints]))),
                },
                "averageAutoSpecimen": {
                    "low": average(matchesOfCountry.map(match => average([match.redAutoSpecimenLow, match.blueAutoSpecimenLow]))),
                    "high": average(matchesOfCountry.map(match => average([match.redAutoSpecimenHigh, match.blueAutoSpecimenHigh]))),
                    "points": average(matchesOfCountry.map(match => average([match.redAutoSpecimenPoints, match.blueAutoSpecimenPoints]))),
                },
                "autoEnd": {
                    "averagePoints": average(matchesOfCountry.map(match => getAverageAutoEndPointsOfMatch(match))),
                    "percentAscent": getPercentAutoTeleopType(matchesOfCountry, "ASCENT", "auto"),
                    "percentObservationZone": getPercentAutoTeleopType(matchesOfCountry, "OBSERVATION_ZONE", "auto"),
                    "percentNone": getPercentAutoTeleopType(matchesOfCountry, "NONE", "auto"),
                },
                "averageTeleopSamples": {
                    "low": average(matchesOfCountry.map(match => average([match.redTeleopSampleLow, match.blueTeleopSampleLow]))),
                    "high": average(matchesOfCountry.map(match => average([match.redTeleopSampleHigh, match.blueTeleopSampleHigh]))),
                    "net": average(matchesOfCountry.map(match => average([match.redTeleopSampleNet, match.blueTeleopSampleNet]))),
                    "points": average(matchesOfCountry.map(match => average([match.redTeleopSamplePoints, match.blueTeleopSamplePoints]))),
                },
                "averageTeleopSpecimen": {
                    "low": average(matchesOfCountry.map(match => average([match.redTeleopSpecimenLow, match.blueTeleopSpecimenLow]))),
                    "high": average(matchesOfCountry.map(match => average([match.redTeleopSpecimenHigh, match.blueTeleopSpecimenHigh]))),
                    "points": average(matchesOfCountry.map(match => average([match.redTeleopSpecimenPoints, match.blueTeleopSpecimenPoints]))),
                },
                "teleopEnd": {
                    "averagePoints": average(matchesOfCountry.map(match => calculateEndgamePoints(match))),
                    "percentAscent1": getPercentAutoTeleopType(matchesOfCountry, "ASCENT_1", "teleop"),
                    "percentAscent2": getPercentAutoTeleopType(matchesOfCountry, "ASCENT_2", "teleop"),
                    "percentAscent3": getPercentAutoTeleopType(matchesOfCountry, "ASCENT_3", "teleop"),
                    "percentObservationZone": getPercentAutoTeleopType(matchesOfCountry, "OBSERVATION_ZONE", "teleop"),
                    "percentNone": getPercentAutoTeleopType(matchesOfCountry, "NONE", "teleop"),
                },
                "averageFouls": {
                    "points": average(matchesOfCountry.map(match => average([match.redFoulPointsCommited, match.blueFoulPointsCommited]))),
                    "major": average(matchesOfCountry.map(match => average([match.redMajorFouls, match.blueMajorFouls]))),
                    "minor": average(matchesOfCountry.map(match => average([match.redMinorFouls, match.blueMinorFouls]))),
                },
            },
        };
}

async function analyzeSeason<S extends Season>(season: S) {
    if (season !== 2024) {
        throw Error("Unimplemented");
    }

    const data: DataType2024[] = JSON.parse(await Deno.readTextFile("data2024.json"));

    const countries = Array.from(new Set(data.map(match => match.eventCountry)));

    const analysis = [];

    analysis.push(analyzeMatches(data, "overall", "overall"));

    for (const country of countries) {
        const matchesInCountry = data.filter(match => match.eventCountry === country);
        analysis.push(analyzeMatches(matchesInCountry, country, "country"));

        const provincesInCountry = Array.from(new Set(matchesInCountry.map(match => match.eventStateProv)));

        for (const province of provincesInCountry) {
            const matchesInProvince = matchesInCountry.filter(match => match.eventStateProv === province);
            analysis.push(analyzeMatches(matchesInProvince, `${country}:${province}`, "province"));
        }

        console.log("finished processing: ", country)
    }

    return analysis;
}

export async function make2024Analysis() {
    Deno.writeTextFile(`analysis2024.json`, JSON.stringify(await analyzeSeason(2024)));
}