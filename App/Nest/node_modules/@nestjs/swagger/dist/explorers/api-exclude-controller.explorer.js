"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exploreApiExcludeControllerMetadata = void 0;
const constants_1 = require("../constants");
const exploreApiExcludeControllerMetadata = (metatype) => Reflect.getMetadata(constants_1.DECORATORS.API_EXCLUDE_CONTROLLER, metatype)?.[0] ===
    true;
exports.exploreApiExcludeControllerMetadata = exploreApiExcludeControllerMetadata;
