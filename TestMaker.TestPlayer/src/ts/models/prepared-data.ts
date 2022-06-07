import { IPreparedTest } from "./prepared-test";

export interface IPreparedData {
    eventId: string;
    eventCode: string;
    eventType: number;
    candidateId: string;
    candidateCode: string;
    test: IPreparedTest
}