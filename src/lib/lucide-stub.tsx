// Re-export icons from lucide-react so the UI shows real SVG icons instead of stubs.
// This file exists so components can import icons from '@/lib/lucide-stub' without
// changing many import sites. lucide-react is included in package.json.
export * from 'lucide-react';

// Also provide a default export to keep existing default-import usage safe.
import * as _lucide from 'lucide-react';
export default _lucide as any;
