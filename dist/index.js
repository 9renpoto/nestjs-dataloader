"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
/**
 * Context key where get loader function will be stored.
 * This class should be added to your module providers like so:
 * {
 *     provide: APP_INTERCEPTOR,
 *     useClass: DataLoaderInterceptor,
 * },
 */
const NEST_LOADER_CONTEXT_KEY = "NEST_LOADER_CONTEXT_KEY";
let DataLoaderInterceptor = class DataLoaderInterceptor {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    /**
     * @inheritdoc
     */
    intercept(context, next) {
        const graphqlExecutionContext = graphql_1.GqlExecutionContext.create(context);
        const ctx = graphqlExecutionContext.getContext();
        if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
            ctx[NEST_LOADER_CONTEXT_KEY] = {
                contextId: core_1.ContextIdFactory.create(),
                getLoader: (type) => {
                    if (ctx[type] === undefined) {
                        try {
                            ctx[type] = (() => __awaiter(this, void 0, void 0, function* () {
                                return (yield this.moduleRef.resolve(type, ctx[NEST_LOADER_CONTEXT_KEY].contextId, { strict: false }))
                                    .generateDataLoader();
                            }))();
                        }
                        catch (e) {
                            throw new common_1.InternalServerErrorException(`The loader ${type} is not provided` + e);
                        }
                    }
                    return ctx[type];
                }
            };
        }
        return next.handle();
    }
};
DataLoaderInterceptor = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], DataLoaderInterceptor);
exports.DataLoaderInterceptor = DataLoaderInterceptor;
/**
 * The decorator to be used within your graphql method.
 */
exports.Loader = common_1.createParamDecorator((data, context) => __awaiter(void 0, void 0, void 0, function* () {
    const ctx = graphql_1.GqlExecutionContext.create(context).getContext();
    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
        throw new common_1.InternalServerErrorException(`
            You should provide interceptor ${DataLoaderInterceptor.name} globally with ${core_1.APP_INTERCEPTOR}
          `);
    }
    return yield ctx[NEST_LOADER_CONTEXT_KEY].getLoader(data);
}));
//# sourceMappingURL=index.js.map