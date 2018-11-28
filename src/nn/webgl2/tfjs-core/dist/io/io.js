"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./indexed_db");
require("./local_storage");
var browser_files_1 = require("./browser_files");
exports.browserFiles = browser_files_1.browserFiles;
var browser_http_1 = require("./browser_http");
exports.browserHTTPRequest = browser_http_1.browserHTTPRequest;
var io_utils_1 = require("./io_utils");
exports.concatenateArrayBuffers = io_utils_1.concatenateArrayBuffers;
exports.decodeWeights = io_utils_1.decodeWeights;
exports.encodeWeights = io_utils_1.encodeWeights;
exports.getModelArtifactsInfoForJSON = io_utils_1.getModelArtifactsInfoForJSON;
var passthrough_1 = require("./passthrough");
exports.fromMemory = passthrough_1.fromMemory;
exports.withSaveHandler = passthrough_1.withSaveHandler;
var router_registry_1 = require("./router_registry");
var weights_loader_1 = require("./weights_loader");
exports.loadWeights = weights_loader_1.loadWeights;
var registerSaveRouter = router_registry_1.IORouterRegistry.registerSaveRouter;
exports.registerSaveRouter = registerSaveRouter;
var registerLoadRouter = router_registry_1.IORouterRegistry.registerLoadRouter;
exports.registerLoadRouter = registerLoadRouter;
var getSaveHandlers = router_registry_1.IORouterRegistry.getSaveHandlers;
exports.getSaveHandlers = getSaveHandlers;
var getLoadHandlers = router_registry_1.IORouterRegistry.getLoadHandlers;
exports.getLoadHandlers = getLoadHandlers;
var model_management_1 = require("./model_management");
exports.copyModel = model_management_1.copyModel;
exports.listModels = model_management_1.listModels;
exports.moveModel = model_management_1.moveModel;
exports.removeModel = model_management_1.removeModel;
//# sourceMappingURL=io.js.map