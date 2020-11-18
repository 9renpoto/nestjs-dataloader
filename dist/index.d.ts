import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import * as DataLoader from 'dataloader';
import { Observable } from 'rxjs';
/**
 * This interface will be used to generate the initial data loader.
 * The concrete implementation should be added as a provider to your module.
 */
export interface NestDataLoader<ID, Type> {
    /**
     * Should return a new instance of dataloader each time
     */
    generateDataLoader(): DataLoader<ID, Type>;
}
export declare class DataLoaderInterceptor implements NestInterceptor {
    private readonly moduleRef;
    constructor(moduleRef: ModuleRef);
    /**
     * @inheritdoc
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
/**
 * The decorator to be used within your graphql method.
 */
export declare const Loader: (...dataOrPipes: any[]) => ParameterDecorator;
