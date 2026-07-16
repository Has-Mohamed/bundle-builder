import type { StepId } from '../types/domain';
import { makeLineKey } from '../lib/lineKey';

/**
 * Matches the design exactly: Wyze Cam v4 (White, x1) and Wyze Cam Pan v3
 * (Black, x2) selected in step 1, plus the sensors/accessory/plan items that
 * the review panel shows pre-populated even though their own cards live in
 * steps that start collapsed.
 */
export const seedQuantities: Record<string, number> = {
  [makeLineKey('wyze-cam-v4', 'white')]: 1,
  [makeLineKey('wyze-cam-pan-v3', 'black')]: 2,
  [makeLineKey('cam-unlimited')]: 1,
  [makeLineKey('wyze-sense-motion-sensor')]: 2,
  [makeLineKey('wyze-sense-hub')]: 1,
  [makeLineKey('wyze-microsd-256')]: 2,
};

export const seedActiveVariant: Record<string, string> = {
  'wyze-cam-v4': 'white',
  'wyze-cam-pan-v3': 'black',
  'wyze-cam-floodlight-v2': 'white',
  'wyze-battery-cam-pro': 'white',
};

export const seedOpenStep: StepId = 'cameras';
