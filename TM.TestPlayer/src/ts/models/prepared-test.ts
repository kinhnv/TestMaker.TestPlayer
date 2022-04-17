import { ISection } from './section';

export interface IPreparedTest {
    testId: string;
    name: string;
    sections: ISection[];
}