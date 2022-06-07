import { IPreparedQuestion } from './question';

export interface ISection {
    sectionId: string;
    name: string;
    questions: IPreparedQuestion[];
}