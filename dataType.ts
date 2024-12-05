export type DataType2024 = {
    // --Red Alliance-- //

    // Auto
    redAutoPoints: number;
    redAutoSampleHigh: number;
    redAutoSampleLow: number;
    redAutoSampleNet: number;
    redAutoSamplePoints: number;
    redAutoSpecimenHigh: number;
    redAutoSpecimenLow: number;
    redAutoSpecimenPoints: number;
    redRobotOneAuto: "NONE" | "OBSERVATION_ZONE" | "ASCENT";
    redRobotTwoAuto: "NONE" | "OBSERVATION_ZONE" | "ASCENT";

    // Teleop
    redTeleopPoints: number;
    redTeleopSampleHigh: number;
    redTeleopSampleLow: number;
    redTeleopSampleNet: number;
    redTeleopSamplePoints: number;
    redTeleopSpecimenHigh: number;
    redTeleopSpecimenLow: number;
    redTeleopSpecimenPoints: number;
    redTeleopAscentPoints: number;
    redTeleopParkPoints: number;
    redRobotOneTeleop:
        | "NONE"
        | "OBSERVATION_ZONE"
        | "ASCENT_1"
        | "ASCENT_2"
        | "ASCENT_3";
    redRobotTwoTeleop:
        | "NONE"
        | "OBSERVATION_ZONE"
        | "ASCENT_1"
        | "ASCENT_2"
        | "ASCENT_3";

    // Fouls
    redFoulPointsCommited: number;
    redMajorFouls: number;
    redMinorFouls: number;
    redPreFoulTotal: number;

    // Endgame
    redEndgamePoints: number;

    // Alliance information
    redTotalPoints: number;
    // --Blue Alliance-- //

    // Auto
    blueAutoPoints: number;
    blueAutoSampleHigh: number;
    blueAutoSampleLow: number;
    blueAutoSampleNet: number;
    blueAutoSamplePoints: number;
    blueAutoSpecimenHigh: number;
    blueAutoSpecimenLow: number;
    blueAutoSpecimenPoints: number;
    blueRobotOneAuto: "NONE" | "OBSERVATION_ZONE" | "ASCENT";
    blueRobotTwoAuto: "NONE" | "OBSERVATION_ZONE" | "ASCENT";

    // Teleop
    blueTeleopPoints: number;
    blueTeleopSampleHigh: number;
    blueTeleopSampleLow: number;
    blueTeleopSampleNet: number;
    blueTeleopSamplePoints: number;
    blueTeleopSpecimenHigh: number;
    blueTeleopSpecimenLow: number;
    blueTeleopSpecimenPoints: number;
    blueTeleopAscentPoints: number;
    blueTeleopParkPoints: number;
    blueRobotOneTeleop:
        | "NONE"
        | "OBSERVATION_ZONE"
        | "ASCENT_1"
        | "ASCENT_2"
        | "ASCENT_3";
    blueRobotTwoTeleop:
        | "NONE"
        | "OBSERVATION_ZONE"
        | "ASCENT_1"
        | "ASCENT_2"
        | "ASCENT_3";

    // Fouls
    blueFoulPointsCommited: number;
    blueMajorFouls: number;
    blueMinorFouls: number;
    bluePreFoulTotal: number;

    // Endgame
    blueEndgamePoints: number;

    // Alliance information
    blueTotalPoints: number;

    // --Season-- //
    matchLevel: "OTHER" | "QUALIFICATION" | "SEMIFINAL" | "FINAL" | "PLAYOFF";
    matchNumber: number;
    matchSeries: number;
    matchRandomization: number;
    matchStartTime: string;
    matchDescription: string;
    matchMatchNumber: number;
    matchModifiedOn: string;
    matchPostResultTime: string;
    matchScoreBlueAuto: number;
    matchScoreBlueFinal: number;
    matchScoreRedAuto: number;
    matchScoreRedFinal: number;
    matchScoreRedFoul: number;
    matchTeams: {
        teamNumber?: number;
        station?: string | null;
        dq?: boolean;
        onField?: boolean;
    }[];
    matchTournamentLevel: string;

    // Event information
    eventAddress: string;
    eventCity: string;
    eventCode: string;
    eventCoordinates: {
        type: "Point";
        coordinates: [number, number];
    };
    eventCountry: string;
    eventDateEnd: string;
    eventDateStart: string;
    eventDistrictCode: string;
    eventDivisionCode: string;
    eventEventId: string;
    eventFieldCount: number;
    eventHybrid: boolean;
    eventLeagueCode: string;
    eventLiveStreamUrl: string;
    eventName: string;
    eventPublished: boolean;
    eventRegionCode: string;
    eventRemote: boolean;
    eventStateProv: string;
    eventTimezone: string;
    eventType: string;
    eventTypeName: string;
    eventVenue: string;
    eventWebcasts: string[];
    eventWebsite: string;

    // Season information
    season: 2024;
};
