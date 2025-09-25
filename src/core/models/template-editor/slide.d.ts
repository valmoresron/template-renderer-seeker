import { Layer } from './layer';
import { SlideAnimations } from './animations';
import { Properties } from './properties';
export declare class Slide {
    id: string | number;
    type?: string;
    layers?: Layer[];
    animations?: SlideAnimations;
    properties?: Properties;
}
export declare class SlideProperties {
    animations: string[];
    properties: string[];
}
