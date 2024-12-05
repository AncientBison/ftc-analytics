// @deno-types="@types/cli-progress"
import { MultiBar, Presets } from "cli-progress";
import { processSeason } from "./processSeason.ts";
import { make2024Analysis } from "./analyze.ts";
const SEASONS = [2023, 2024] as const;

export type Season = typeof SEASONS[number];

const multibar = new MultiBar({
  clearOnComplete: true,
  hideCursor: true,
}, Presets.shades_grey);

const getAllKeys = (objArray: Array<any>) => {
  return Array.from(
    objArray.reduce((keySet, obj) => {
        Object.keys(obj).forEach(key => keySet.add(key));
        return keySet;
    }, new Set())
  )
};

await Promise.all(SEASONS.map(async (season) => {
  const matches = await processSeason(season, multibar);

  await Deno.writeTextFile(`data${season}.json`, JSON.stringify(matches));
}));

console.log("Finished processing all events");

await make2024Analysis();