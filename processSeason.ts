// @deno-types="npm:@types/cli-progress"
import { MultiBar } from "npm:cli-progress";
import { Season } from "./main.ts";
import { getEvents, getEventAllMatchData } from "./apiFunctions.ts";
import { processAlliance } from "./processAlliance.ts";

function fitStringLength(str: string, targetLength: number, padChar: string = " "): string {
    if (str.length > targetLength) {
        return str.slice(0, targetLength);
    } else if (str.length < targetLength) {
        return str + padChar.repeat(targetLength - str.length);
    }
    return str;
}

export async function processSeason<S extends Season>(season: S, multibar?: MultiBar) {
  const matchObjects = [];

  const getEventsResult = await getEvents({
    season: season,
  });

  const { status: allEventsStatus, data: allEventsData } = getEventsResult!;

  const eventBar = multibar?.create(allEventsData.eventCount!, 0, {}, {
    format: '[{bar}] {percentage}% | {eventName} ({eventCode}) | {eta}s left | {value}/{total}',
  });
  
  for (const event of allEventsData.events!) {
    eventBar?.increment(1, {
      eventCode: fitStringLength(event.code!, 10),
      eventName: fitStringLength(event.name!, 30),
    });

    const allMatchData = await getEventAllMatchData(event.code!, season);

    if (allMatchData === undefined) {
      continue;
    }

    const { matchScores, eventResults } = allMatchData;

    for (const match of matchScores) {
      const matchResults = eventResults.matches?.find((eventResultsMatch) => eventResultsMatch.matchNumber === match.matchNumber);

      const alliances = match.alliances;

      if (alliances === undefined || alliances === null) {
         continue;
      }

      const allianceObjects = alliances.map((alliance) => {

        return processAlliance(alliance);
      });

      matchObjects.push({
        ...Object.assign({}, ...allianceObjects),

        // Match information
        matchLevel: match.matchLevel!,
        matchNumber: match.matchNumber!,
        matchSeries: match.matchSeries!,
        matchRandomization: match.randomization!,
        matchStartTime: matchResults?.actualStartTime,
        matchDescription: matchResults?.description,
        matchMatchNumber: matchResults?.matchNumber,
        matchModifiedOn: matchResults?.modifiedOn,
        matchPostResultTime: matchResults?.postResultTime,
        matchScoreBlueAuto: matchResults?.scoreBlueAuto,
        matchScoreBlueFinal: matchResults?.scoreBlueFinal,
        matchScoreRedAuto: matchResults?.scoreRedAuto,
        matchScoreRedFinal: matchResults?.scoreRedFinal,
        matchScoreRedFoul: matchResults?.scoreRedFoul,
        matchTeams: matchResults?.teams,
        matchTournamentLevel: matchResults?.tournamentLevel,

        // Event information
        eventAddress: event.address!,
        eventCity: event.city!,
        eventCode: event.code!,
        eventCoordinates: event.coordinates!,
        eventCountry: event.country!,
        eventDateEnd: event.dateEnd!,
        eventDateStart: event.dateStart!,
        eventDistrictCode: event.districtCode!,
        eventDivisionCode: event.divisionCode!,
        eventEventId: event.eventId!,
        eventFieldCount: event.fieldCount!,
        eventHybrid: event.hybrid!,
        eventLeagueCode: event.leagueCode!,
        eventLiveStreamUrl: event.liveStreamUrl!,
        eventName: event.name!,
        eventPublished: event.published!,
        eventRegionCode: event.regionCode!,
        eventRemote: event.remote!,
        eventStateProv: event.stateprov!,
        eventTimezone: event.timezone!,
        eventType: event.type!,
        eventTypeName: event.typeName!,
        eventVenue: event.venue!,
        eventWebcasts: event.webcasts!,
        eventWebsite: event.website!,

        // Season information
        season: season,
      });
    }
  }

  return matchObjects;
}
