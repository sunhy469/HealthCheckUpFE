import {instance} from "./instace.ts";

// test
export function handleTest(data :any) {
    return instance.post("/home",data);
}
