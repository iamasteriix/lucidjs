import type { PlatformFlags, } from '@/types';
import { findProjectRoot, resolveTargetPlatform } from '@/utils';
import { updateFonts } from './update';
import fs from 'fs';
import path from 'path';


/**
 * Locates fonts in core package dynamically
 */
export const locateInitFonts = () => {
  const corePackageEntry = require.resolve('@lucidjs/core');
  const corePackageDir = path.dirname(corePackageEntry);
  return path.join(corePackageDir, 'assets/fonts');
}


export const initFonts = (platforms: PlatformFlags) => {
  const { isTargetWeb, } = resolveTargetPlatform(platforms);
  const coreFontsPath = locateInitFonts();

  if (isTargetWeb) {
    const localFontsDir = path.resolve(findProjectRoot(process.cwd()), 'assets/fonts');
    fs.mkdirSync(localFontsDir, { recursive: true, });
    fs.cpSync(coreFontsPath, localFontsDir, { recursive: true, });
  }

  // default fonts work out of the box
  updateFonts(platforms);
}
