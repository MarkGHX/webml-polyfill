import { MemoryInfo, TimingInfo } from '../engine';
import { Conv2DInfo } from '../ops/conv_util';
import { DataId, Scalar, Tensor, Tensor1D, Tensor2D, Tensor3D, Tensor4D } from '../tensor';
import { DataType, Rank, RecursiveArray, ShapeMap, TypedArray } from '../types';
import { DataMover, KernelBackend } from './backend';
import { GPGPUContext } from './webgl/gpgpu_context';
import { GPGPUProgram } from './webgl/gpgpu_math';
import { TextureManager } from './webgl/texture_manager';
declare type KernelInfo = {
    name: string;
    query: Promise<number>;
};
export declare type TimerNode = RecursiveArray<KernelInfo> | KernelInfo;
export interface CPUTimerQuery {
    startMs: number;
    endMs?: number;
}
export interface WebGLMemoryInfo extends MemoryInfo {
    numBytesInGPU: number;
    unreliable: boolean;
}
export interface WebGLTimingInfo extends TimingInfo {
    uploadWaitMs: number;
    downloadWaitMs: number;
}
export interface TensorHandle {
    dataId: DataId;
    shape: number[];
    dtype: DataType;
}
export declare const SIZE_UPLOAD_UNIFORM = 4;
export declare class MathBackendWebGL implements KernelBackend {
    private gpgpu?;
    private delayedStorage;
    private texData;
    private pendingRead;
    private pendingDisposal;
    private lruDataGPU;
    private numBytesInGPU;
    private NUM_BYTES_BEFORE_PAGING;
    private canvas;
    private fromPixels2DContext;
    private programTimersStack;
    private activeTimers;
    private uploadWaitMs;
    private downloadWaitMs;
    private cpuBackend;
    register(dataId: DataId, shape: number[], dtype: DataType): void;
    setDataMover(dataMover: DataMover): void;
    fromPixels(pixels: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, numChannels: number): Tensor3D;
    private makeTensorHandle;
    write(dataId: DataId, values: TypedArray): void;
    readSync(dataId: DataId): TypedArray;
    read(dataId: DataId): Promise<TypedArray>;
    private getValuesFromTexture;
    time(f: () => void): Promise<WebGLTimingInfo>;
    memory(): WebGLMemoryInfo;
    private startTimer;
    private endTimer;
    private getQueryTime;
    disposeData(dataId: DataId): void;
    getTexture(dataId: DataId): WebGLTexture;
    private textureManager;
    private binaryCache;
    private gpgpuCreatedLocally;
    constructor(gpgpu?: GPGPUContext, delayedStorage?: boolean);
    private getCPUBackend;
    private shouldExecuteOnCPU;
    getGPGPUContext(): GPGPUContext;
    getCanvas(): HTMLCanvasElement;
    complex<T extends Tensor>(real: T, imag: T): T;
    real<T extends Tensor>(input: T): T;
    imag<T extends Tensor>(input: T): T;
    slice<T extends Tensor>(x: T, begin: number[], size: number[]): T;
    stridedSlice<T extends Tensor>(x: T, begin: number[], end: number[], strides: number[], beginMask: number, endMask: number, ellipsisMask: number, newAxisMask: number, shrinkAxisMask: number): T;
    reverse<T extends Tensor>(x: T, axis: number[]): T;
    private concat2Tensors;
    concat(tensors: Tensor[], axis: number): Tensor;
    neg<T extends Tensor>(x: T): T;
    batchMatMul(a: Tensor3D, b: Tensor3D, transposeA: boolean, transposeB: boolean): Tensor3D;
    multiply(a: Tensor, b: Tensor): Tensor;
    batchNormalization(x: Tensor4D, mean: Tensor4D | Tensor1D, variance: Tensor4D | Tensor1D, varianceEpsilon: number, scale?: Tensor4D | Tensor1D, offset?: Tensor4D | Tensor1D): Tensor4D;
    localResponseNormalization4D(x: Tensor4D, radius: number, bias: number, alpha: number, beta: number): Tensor4D;
    LRNGrad(dy: Tensor4D, inputImage: Tensor4D, outputImage: Tensor4D, depthRadius: number, bias: number, alpha: number, beta: number): Tensor4D;
    tile<T extends Tensor>(x: T, reps: number[]): T;
    pad<T extends Tensor>(x: T, paddings: Array<[number, number]>, constantValue: number): T;
    transpose<T extends Tensor>(x: T, perm: number[]): T;
    gather<T extends Tensor>(x: T, indices: Tensor1D, axis: number): T;
    batchToSpaceND<T extends Tensor>(x: T, blockShape: number[], crops: number[][]): T;
    spaceToBatchND<T extends Tensor>(x: T, blockShape: number[], paddings: Array<[number, number]>): T;
    private reduce;
    private argReduce;
    sum(x: Tensor, axes: number[]): Tensor;
    prod(x: Tensor, axes: number[]): Tensor;
    unsortedSegmentSum<T extends Tensor>(x: T, segmentIds: Tensor1D, numSegments: number): Tensor;
    private segOpCompute;
    argMin(x: Tensor, axis: number): Tensor;
    argMax(x: Tensor, axis: number): Tensor;
    cumsum(x: Tensor, axis: number, exclusive: boolean, reverse: boolean): Tensor;
    equal(a: Tensor, b: Tensor): Tensor;
    notEqual(a: Tensor, b: Tensor): Tensor;
    less(a: Tensor, b: Tensor): Tensor;
    lessEqual(a: Tensor, b: Tensor): Tensor;
    greater(a: Tensor, b: Tensor): Tensor;
    greaterEqual(a: Tensor, b: Tensor): Tensor;
    logicalNot<T extends Tensor>(x: T): T;
    logicalAnd(a: Tensor, b: Tensor): Tensor;
    logicalOr(a: Tensor, b: Tensor): Tensor;
    select(condition: Tensor, a: Tensor, b: Tensor): Tensor;
    where(condition: Tensor): Tensor2D;
    topk<T extends Tensor>(x: T, k: number, sorted: boolean): [T, T];
    min(x: Tensor, axes: number[]): Tensor;
    minimum(a: Tensor, b: Tensor): Tensor;
    mod(a: Tensor, b: Tensor): Tensor;
    max(x: Tensor, axes: number[]): Tensor;
    maximum(a: Tensor, b: Tensor): Tensor;
    all(x: Tensor, axes: number[]): Tensor;
    any(x: Tensor, axes: number[]): Tensor;
    squaredDifference(a: Tensor, b: Tensor): Tensor;
    realDivide(a: Tensor, b: Tensor): Tensor;
    floorDiv(a: Tensor, b: Tensor): Tensor;
    add(a: Tensor, b: Tensor): Tensor;
    private complexSeparableBinaryOp;
    private makeComplexComponentTensorHandle;
    addN<T extends Tensor>(tensors: T[]): T;
    subtract(a: Tensor, b: Tensor): Tensor;
    pow<T extends Tensor>(a: T, b: Tensor): T;
    ceil<T extends Tensor>(x: T): T;
    floor<T extends Tensor>(x: T): T;
    sign<T extends Tensor>(x: T): T;
    round<T extends Tensor>(x: T): T;
    exp<T extends Tensor>(x: T): T;
    expm1<T extends Tensor>(x: T): T;
    log<T extends Tensor>(x: T): T;
    log1p<T extends Tensor>(x: T): T;
    sqrt<T extends Tensor>(x: T): T;
    rsqrt<T extends Tensor>(x: T): T;
    square<T extends Tensor>(x: T): T;
    reciprocal<T extends Tensor>(x: T): T;
    relu<T extends Tensor>(x: T): T;
    elu<T extends Tensor>(x: T): T;
    eluDer<T extends Tensor>(dy: T, y: T): T;
    selu<T extends Tensor>(x: T): T;
    int<T extends Tensor>(x: T): T;
    clip<T extends Tensor>(x: T, min: number, max: number): T;
    abs<T extends Tensor>(x: T): T;
    complexAbs<T extends Tensor>(x: T): T;
    sigmoid<T extends Tensor>(x: T): T;
    softplus<T extends Tensor>(x: T): T;
    sin<T extends Tensor>(x: T): T;
    cos<T extends Tensor>(x: T): T;
    tan<T extends Tensor>(x: T): T;
    asin<T extends Tensor>(x: T): T;
    acos<T extends Tensor>(x: T): T;
    atan<T extends Tensor>(x: T): T;
    atan2<T extends Tensor>(a: T, b: T): T;
    sinh<T extends Tensor>(x: T): T;
    cosh<T extends Tensor>(x: T): T;
    tanh<T extends Tensor>(x: T): T;
    asinh<T extends Tensor>(x: T): T;
    acosh<T extends Tensor>(x: T): T;
    atanh<T extends Tensor>(x: T): T;
    erf<T extends Tensor>(x: T): T;
    step<T extends Tensor>(x: T, alpha: number): T;
    conv2dWithIm2Row(x: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    conv2d(x: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    conv2dDerInput(dy: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    conv2dDerFilter(x: Tensor4D, dy: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    depthwiseConv2D(x: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    depthwiseConv2DDerInput(dy: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    depthwiseConv2DDerFilter(x: Tensor4D, dy: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    maxPool(x: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    avgPool(x: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    maxPoolBackprop(dy: Tensor4D, x: Tensor4D, y: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    avgPoolBackprop(dy: Tensor4D, x: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    cast<T extends Tensor>(x: T, dtype: DataType): T;
    reshape<R extends Rank>(x: Tensor, shape: ShapeMap[R]): Tensor<R>;
    resizeBilinear(x: Tensor4D, newHeight: number, newWidth: number, alignCorners: boolean): Tensor4D;
    resizeBilinearBackprop(dy: Tensor4D, x: Tensor4D, alignCorners: boolean): Tensor4D;
    resizeNearestNeighbor(x: Tensor4D, newHeight: number, newWidth: number, alignCorners: boolean): Tensor4D;
    resizeNearestNeighborBackprop(dy: Tensor4D, x: Tensor4D, alignCorners: boolean): Tensor4D;
    multinomial(logits: Tensor2D, normalized: boolean, numSamples: number, seed: number): Tensor2D;
    oneHot(indices: Tensor1D, depth: number, onValue: number, offValue: number): Tensor2D;
    nonMaxSuppression(boxes: Tensor2D, scores: Tensor1D, maxOutputSize: number, iouThreshold: number, scoreThreshold: number): Tensor1D;
    cropAndResize(image: Tensor4D, boxes: Tensor2D, boxIndex: Tensor1D, cropSize: [number, number], method: 'bilinear' | 'nearest', extrapolationValue: number): Tensor4D;
    depthToSpace(x: Tensor4D, blockSize: number, dataFormat: 'NHWC' | 'NCHW'): Tensor4D;
    split<T extends Tensor>(x: T, sizeSplits: number[], axis: number): T[];
    scatterND<R extends Rank>(indices: Tensor, updates: Tensor, shape: ShapeMap[R]): Tensor<R>;
    sparseToDense<R extends Rank>(sparseIndices: Tensor, sparseValues: Tensor, outputShape: ShapeMap[R], defaultValue: Scalar): Tensor<R>;
    fft(x: Tensor2D): Tensor2D;
    ifft(x: Tensor2D): Tensor2D;
    private fftImpl;
    gatherND(x: Tensor, indices: Tensor): Tensor<Rank>;
    private makeOutputArray;
    private makePackedTensor;
    private unpackTensor;
    private getBatchDim;
    private getRowsCols;
    private packedReshape;
    compileAndRun<K extends {
        dtype: DataType;
        size: number;
        dataId: {};
        shape: number[];
    }>(program: GPGPUProgram, inputs: TensorHandle[], output?: K, customSetup?: (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) => void, pageToCpu?: boolean): K;
    private getAndSaveBinary;
    getTextureManager(): TextureManager;
    private disposed;
    dispose(): void;
    floatPrecision(): number;
    private uploadToGPU;
    private convertAndCacheOnCPU;
    private releaseTexture;
    private acquireTexture;
    private computeBytes;
}
export {};
