"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignTwoLevelsDeep = void 0;
function assignTwoLevelsDeep(_dest, ...args) {
    const dest = _dest;
    for (const arg of args) {
        for (const [key, value] of Object.entries(arg ?? {})) {
            dest[key] = { ...dest[key], ...value };
        }
    }
    return dest;
}
exports.assignTwoLevelsDeep = assignTwoLevelsDeep;
