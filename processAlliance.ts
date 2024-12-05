import { Season } from "./main.ts";
import { components } from "./schema.d.ts"

type AllianceScoreDetail = components["schemas"]["ScoreDetailAllianceModel_2023"] | components["schemas"]["ScoreDetailAllianceModel_2024"];

const is2024 = (alliance: AllianceScoreDetail): alliance is components["schemas"]["ScoreDetailAllianceModel_2024"] => Object.keys(alliance).includes("autoSampleHigh");
const is2023 = (alliance: AllianceScoreDetail): alliance is components["schemas"]["ScoreDetailAllianceModel_2023"] => Object.keys(alliance).includes("autoBackdropPoints");

export function processAlliance(alliance: AllianceScoreDetail) {
    const allianceName = alliance.alliance?.toLowerCase()!;

    return is2024(alliance) ? {
        // Auto
        [`${allianceName}AutoPoints`]: alliance.autoPoints!,
        [`${allianceName}AutoSampleHigh`]: alliance.autoSampleHigh!,
        [`${allianceName}AutoSampleLow`]: alliance.autoSampleLow!,
        [`${allianceName}AutoSampleNet`]: alliance.autoSampleNet!,
        [`${allianceName}AutoSamplePoints`]: alliance.autoSamplePoints!,
        [`${allianceName}AutoSpecimenHigh`]: alliance.autoSpecimenHigh!,
        [`${allianceName}AutoSpecimenLow`]: alliance.autoSpecimenLow!,
        [`${allianceName}AutoSpecimenPoints`]: alliance.autoSpecimenPoints!,
        [`${allianceName}RobotOneAuto`]: alliance.robot1Auto!,
        [`${allianceName}RobotTwoAuto`]: alliance.robot2Auto!,

        // Teleop
        [`${allianceName}TeleopPoints`]: alliance.teleopPoints!,
        [`${allianceName}TeleopSampleHigh`]: alliance.teleopSampleHigh!,
        [`${allianceName}TeleopSampleLow`]: alliance.teleopSampleLow!,
        [`${allianceName}TeleopSampleNet`]: alliance.teleopSampleNet!,
        [`${allianceName}TeleopSamplePoints`]: alliance.teleopSamplePoints!,
        [`${allianceName}TeleopSpecimenHigh`]: alliance.teleopSpecimenHigh!,
        [`${allianceName}TeleopSpecimenLow`]: alliance.teleopSpecimenLow!,
        [`${allianceName}TeleopSpecimenPoints`]: alliance.teleopSpecimenPoints!,
        [`${allianceName}TeleopAscentPoints`]: alliance.teleopAscentPoints!,
        [`${allianceName}TeleopParkPoints`]: alliance.teleopParkPoints!,
        [`${allianceName}RobotOneTeleop`]: alliance.robot1Teleop!,
        [`${allianceName}RobotTwoTeleop`]: alliance.robot2Teleop!,

        // Fouls
        [`${allianceName}FoulPointsCommited`]: alliance.foulPointsCommitted!,
        [`${allianceName}MajorFouls`]: alliance.majorFouls!,
        [`${allianceName}MinorFouls`]: alliance.minorFouls!,
        [`${allianceName}PreFoulTotal`]: alliance.preFoulTotal!,

        // Endgame
        [`${allianceName}EndgamePoints`]: alliance.endGamePoints!,

        // Alliance information
        [`${allianceName}TotalPoints`]: alliance.totalPoints!,
    } : {
        // Auto
        [`${allianceName}AutoPoints`]: alliance.autoPoints!,
        [`${allianceName}AutoNavigatingPoints`]: alliance.autoNavigatingPoints!,
        [`${allianceName}AutoRandomizationPoints`]: alliance.autoRandomizationPoints!,
        [`${allianceName}AutoBackstagePoints`]: alliance.autoBackstagePoints!,
        [`${allianceName}AutoBackdropPoints`]: alliance.autoBackdropPoints!,
        [`${allianceName}RobotOneAuto`]: alliance.robot1Auto!,
        [`${allianceName}RobotTwoAuto`]: alliance.robot2Auto!,
    
        // Teleop
        [`${allianceName}TeleopPoints`]: alliance.dcPoints!,
        [`${allianceName}TeleopBackdropPoints`]: alliance.dcBackdropPoints!,
        [`${allianceName}TeleopBackstagePoints`]: alliance.dcBackstagePoints!,
        [`${allianceName}MosaicPoints`]: alliance.mosaicPoints!,
        [`${allianceName}SetBonusPoints`]: alliance.setBonusPoints!,
    
        // Endgame
        [`${allianceName}EndgamePoints`]: alliance.endgamePoints!,
        [`${allianceName}EndgameLocationPoints`]: alliance.egLocationPoints!,
        [`${allianceName}EndgameDronePoints`]: alliance.egDronePoints!,
        [`${allianceName}EndgameRobotOne`]: alliance.egRobot1!,
        [`${allianceName}EndgameRobotTwo`]: alliance.egRobot2!,
    
        // Penalties
        [`${allianceName}PenaltyPointsCommited`]: alliance.penaltyPointsCommitted!,
        [`${allianceName}MajorPenalties`]: alliance.majorPenalties!,
        [`${allianceName}MinorPenalties`]: alliance.minorPenalties!,
        [`${allianceName}PrePenaltyTotal`]: alliance.prePenaltyTotal!,
    
        // Alliance Information
        [`${allianceName}TotalPoints`]: alliance.totalPoints!,
    };
}
