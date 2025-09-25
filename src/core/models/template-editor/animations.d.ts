export declare class SlideAnimations {
    in?: string;
    out?: string;
    keyframes?: Keyframe[];
}
export declare class Keyframe {
    property: string;
    from: string;
    to: string;
}
export declare const AnimationDefaults: {
    element: string;
    defaults: ({
        property: string;
        values: number[];
    } | {
        property: string;
        values: string[];
    })[];
}[];
