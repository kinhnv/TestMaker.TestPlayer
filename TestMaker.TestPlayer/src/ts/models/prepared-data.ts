import { IPreparedTest } from "./prepared-test";

export interface IPreparedData {
    eventId: string;
    eventName: string;
    eventCode: string;
    eventScopeType: number;
    eventContentQuestionType: number;
    eventMarkingType: number;
    candidateId: string;
    candidateCode: string;
    test: IPreparedTest
}