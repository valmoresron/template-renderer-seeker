import { Keyframe } from './animations';
import { Properties } from './properties';
export declare class Layer {
    id: string | number;
    name: string;
    type?: 'Text' | 'Image' | 'Video' | 'Rectangle' | 'Circle' | 'Triangle';
    properties: Properties;
    resolutions?: LayerResolution;
}
export declare class LayerResolution {
    hidden: boolean;
    animate: boolean;
    keyframes: Keyframe[];
    timeframes: number[];
    properties: Properties;
}
export declare class LayerProperties {
    name: string;
    icon: string;
    type: string;
    animations: string[];
    properties: string[];
    decoupled?: string[];
    key?: string;
}
