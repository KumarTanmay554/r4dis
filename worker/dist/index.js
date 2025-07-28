"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
function submission(submit) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, code, lang } = JSON.parse(submit);
        console.log(`Received submission: ID=${id}, Language=${lang} code=${code}`);
        yield new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing delay
        console.log(`Processed submission: ID=${id}, Language=${lang} code=${code}`);
    });
}
function startworker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Redis client connected successfully");
            while (true) {
                try {
                    const submit = yield client.brPop("problems", 0);
                    // @ts-ignore
                    yield submission(submit.element);
                }
                catch (error) {
                    console.log('Error processing submission:', error);
                }
            }
        }
        catch (error) {
            console.log('Error connecting redis:', error);
        }
    });
}
startworker();
