import { ApiError, Fetcher } from "openapi-typescript-fetch";
import { components, paths } from "./schema.d.ts";
import { Season } from "./main.ts";

const fetcher = Fetcher.for<paths>();

fetcher.configure({
    baseUrl: "https://ftc-api.firstinspires.org",
    init: {
        headers: {
            Authorization:
                "Basic bHRiMjcxOjU3REI0RTI1LTE4MDMtNDE1Qy1BOTRCLUUyNzFDNjc1QTkwQg==",
        },
    },
});

function createApiCallUntilSuccessFunction<F extends (...args: any[]) => any>(
    fn: F,
    maxRetries = 3,
    delay = 1000,
) {
    const attempt = async (
        retries: number,
        ...args: Parameters<typeof fn>
    ): Promise<undefined | Awaited<ReturnType<typeof fn>>> => {
        try {
            return await fn(...args);
        } catch (error) {
            if (error instanceof ApiError && error.status === 403) {
                return;
            } else if (retries < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                return attempt(retries + 1, ...args);
            } else {
                throw error;
            }
        }
    };

    return (
        ...args: Parameters<typeof fn>
    ): Promise<undefined | Awaited<ReturnType<typeof fn>>> =>
        attempt(0, ...args);
}

export const getEvents = createApiCallUntilSuccessFunction(
    fetcher.path("/v2.0/{season}/events").method("get").create(),
);

export const getMatchResults = createApiCallUntilSuccessFunction(
    fetcher.path("/v2.0/{season}/matches/{eventCode}").method("get").create(),
);

export const getScoreDetails = createApiCallUntilSuccessFunction(
    fetcher.path("/v2.0/{season}/scores/{eventCode}/{tournamentLevel}").method(
        "get",
    ).create(),
);

export async function getEventAllMatchData<S extends Season>(
    eventCode: string,
    season: S,
) {
    const eventResultsResponse = (await getMatchResults({
        season: season,
        eventCode: eventCode,
    }));

    
    const scoreDetailsResponse = await getScoreDetails({
        season: season,
        eventCode: eventCode,
        tournamentLevel: "qual",
    });
    
    if (eventResultsResponse === undefined || scoreDetailsResponse === undefined) {
        return;
    }

    const { data: eventResults } = eventResultsResponse;
    const { data } = scoreDetailsResponse!;

    return {
        eventResults,
        matchScores: data
            .matchScores as (S extends 2024
                ? components["schemas"]["ScoreDetailModel_2024"]
                : components["schemas"]["ScoreDetailModel_2023"])[],
    };
}
