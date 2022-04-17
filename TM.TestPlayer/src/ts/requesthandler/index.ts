import { IPreparedData } from "../models/prepared-data";

interface indexedDBObject<T> {
    key: string;
    data: T;
    LastUpdate: Date;
}

interface RequestHandlerParams {
    isOnline: boolean;
    version: number;
    requestClone: Request;
    cache: Cache;
}

export class RequestHandler {
    private DB_NAME = 'TestPlayer';
    private CANDIDATES_TABLE = 'Candidates';
    private CANDIDATE_ANSWER_TABLE = 'CandidateAnswers';

    constructor(private params: RequestHandlerParams) {

    }

    get url() {
        return this.params.requestClone.url;
    }

    get path() {
        return (new URL(this.url)).pathname;
    }

    get isPost(): boolean {
        return this.params.requestClone.method == 'POST';
    }

    async handleAsync(): Promise<Response> {
        if (this.params.isOnline) {
            switch (this.path) {
                case '/Events/GetPublicEventsAndCandidates':
                    if (!this.isPost) {
                        let response = await fetch(this.params.requestClone);
                        let data: IPreparedData[] = await response.clone().json();

                        let dataFromIndexdDB = await this.getAllObjectAsync<IPreparedData>(this.CANDIDATES_TABLE);

                        dataFromIndexdDB.forEach(itemFromIndexdDB => {
                            let items = data.filter(i => i.eventCode == itemFromIndexdDB.data.eventCode && i.candidateCode == itemFromIndexdDB.data.candidateCode)

                            if (items.length == 1) {
                                items[0].test = itemFromIndexdDB.data.test;
                            }
                            else {
                                data.push(itemFromIndexdDB.data);
                            }
                        })

                        return new Response(JSON.stringify(data), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                    return null;
                case '/TestPlayer/Events/Prepare':
                    if (this.isPost) {
                        let response = await fetch(this.params.requestClone);
                        let data: IPreparedData = await response.clone().json();

                        if (data) {
                            this.addOrPutObjectAsync(this.CANDIDATES_TABLE, {
                                key: `${data.eventCode}_${data.candidateCode}`,
                                data: data,
                                LastUpdate: new Date()
                            });
                        }

                        return response;
                    }
                    return null;
                case '/TestPlayer/SubmitQuestion':
                    if (this.isPost) {
                        let candidateAnswer = await this.params.requestClone.clone().formData();

                        await this.addOrPutObjectAsync(this.CANDIDATE_ANSWER_TABLE, {
                            key: `${candidateAnswer.get('candidateId').toString()}_${candidateAnswer.get('questionId').toString()}`,
                            data: {
                                candidateId: candidateAnswer.get('candidateId').toString(),
                                questionId: candidateAnswer.get('questionId').toString(),
                                answerAsJson: candidateAnswer.get('answerAsJson').toString()
                            },
                            LastUpdate: new Date()
                        })

                        return await fetch(this.params.requestClone);
                    }
                    else {
                        return null;
                    }
                default:
                    return null;
            };
        }
        else {
            switch (this.path) {
                case '/TestPlayer/GetPreparedCandidateByCode':
                    let text = await this.params.requestClone.text();
                    let eventCode = text.split('&')[0].split('=')[1];
                    let candidateCode = text.split('&')[1].split('=')[1];

                    let data = await this.getObjectAsync(this.CANDIDATES_TABLE, `${eventCode}_${candidateCode}`);

                    return new Response(JSON.stringify(data.data), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                case '/Events/GetPublicEventsAndCandidates':
                    if (!this.isPost) {
                        let dataFromIndexdDB = await this.getAllObjectAsync<IPreparedData>(this.CANDIDATES_TABLE);

                        return new Response(JSON.stringify(dataFromIndexdDB.map(i => i.data)), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                    return null;
                case '/TestPlayer/SubmitQuestion':
                    if (this.isPost) {
                        let candidateAnswer = await this.params.requestClone.formData();

                        let candidateId = candidateAnswer.get('candidateId').toString();
                        let questionId = candidateAnswer.get('questionId').toString();
                        let answerAsJson = candidateAnswer.get('answerAsJson').toString();

                        var answers = await this.getObjectAsync<{
                            questionId: string;
                            answerAsJson: string;
                        }[]>(this.CANDIDATE_ANSWER_TABLE, candidateId);

                        if (answers) {
                            let answer = answers.data.filter(x => x.questionId == questionId);
                            if (answer.length == 0) {
                                answers.data.push({
                                    questionId: questionId,
                                    answerAsJson: answerAsJson
                                })
                            }
                            else {
                                answer[0].answerAsJson = answerAsJson;
                            }
                        }
                        else {
                            answers = {
                                key: candidateId,
                                data: [{
                                    questionId: questionId,
                                    answerAsJson: answerAsJson
                                }],
                                LastUpdate: new Date()
                            }
                        }

                        await this.addOrPutObjectAsync(this.CANDIDATE_ANSWER_TABLE, answers)

                        return new Response(JSON.stringify(null), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                    else {
                        return null;
                    }
                case '/TestPlayer/GetAnswer':
                    if (this.isPost) {
                        return null;
                    }
                    else {
                        let url = new URL(this.params.requestClone.clone().url);
                        let candidateId = url.searchParams.get('candidateId');
                        let questionId = url.searchParams.get('questionId');

                        let data = await this.getObjectAsync<{
                            questionId: string;
                            answerAsJson: string;
                        }[]>(this.CANDIDATE_ANSWER_TABLE, candidateId)
                        if (data) {
                            let answerAsJson = data.data.filter(x => x.questionId == questionId);
                            if (answerAsJson.length == 1) {
                                return new Response(JSON.stringify(answerAsJson[0].answerAsJson), {
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            }
                            else {
                                return new Response(JSON.stringify(null), {
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            }
                        }
                        else {
                            return new Response(JSON.stringify(null), {
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                    }
                case '/TestPlayer/GetAnswers':
                    if (this.isPost) {
                        return null;
                    }
                    else {
                        let url = new URL(this.params.requestClone.clone().url);
                        let candidateId = url.searchParams.get('candidateId');

                        let indexedDBObject = await this.getObjectAsync<{
                            questionId: string;
                            answerAsJson: string;
                        }[]>(this.CANDIDATE_ANSWER_TABLE, candidateId)
                        if (indexedDBObject) {
                            return new Response(JSON.stringify(indexedDBObject.data.map(indexedDBObject => {
                                return {
                                    candidateId: candidateId,
                                    questionId: indexedDBObject.questionId,
                                    answerAsJson: indexedDBObject.answerAsJson
                                }
                            })), {
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                        else {
                            return new Response(JSON.stringify(null), {
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                    }
                default:
                    return null;
            };
        }
    }
    
    private openIndexdDBAsync (): Promise<IDBDatabase> {
        return new Promise((resolve, error) => {
            var request = indexedDB.open(this.DB_NAME, this.params.version);

            request.onerror = function (message) {
                error(message);
            }

            request.onupgradeneeded = function (event) {
                let database = (<IDBOpenDBRequest>event.target).result;

                database.createObjectStore("Candidates", { keyPath: "key" });
                database.createObjectStore("CandidateAnswers", { keyPath: "key" });
            }

            request.onsuccess = function (event) {
                resolve((<IDBOpenDBRequest>event.target).result);
            };
        });
    }

    private addOrPutObjectAsync<T>(tableName: string, object: indexedDBObject<T>): Promise<indexedDBObject<T>> {
        return new Promise((resolve, reject) => {
            this.openIndexdDBAsync().then(database => {
                let transaction = database.transaction(tableName, "readwrite");

                let objectStore = transaction.objectStore(tableName);

                objectStore.get(object.key).onsuccess = (getEvent) => {
                    var savedObject = (<IDBRequest<indexedDBObject<T>>>getEvent.target).result;
                    if (savedObject) {
                        objectStore.put(object).onsuccess = () => {
                            resolve(object);
                        };
                    }
                    else {
                        objectStore.add(object).onsuccess = () => {
                            resolve(object);
                        };
                    }
                };
            });
        });
    }

    private getObjectAsync<T>(tableName: string, key: string): Promise<indexedDBObject<T>> {
        return new Promise((resolve, reject) => {
            this.openIndexdDBAsync().then(database => {
                let transaction = database.transaction(tableName, "readonly");

                transaction.objectStore(tableName).get(key).onsuccess = (event) => {
                    resolve((<IDBRequest<indexedDBObject<T>>>event.target).result);
                };
            });
        });
    }

    private getAllObjectAsync<T>(tableName: string, index?: string,query?: IDBValidKey | IDBKeyRange | null, count?: number): Promise<indexedDBObject<T>[]> {
        return new Promise(resolve => {
            this.openIndexdDBAsync().then(database => {
                let transaction = database.transaction(tableName, "readonly");
                if (index) {
                    transaction.objectStore(tableName).getAll(query, count).onsuccess = (event) => {
                        resolve((<IDBRequest<indexedDBObject<T>[]>>event.target).result);
                    };
                }
                else {
                    transaction.objectStore(tableName).getAll(query, count).onsuccess = (event) => {
                        resolve((<IDBRequest<indexedDBObject<T>[]>>event.target).result);
                    };
                }
            });
        });
    }
}