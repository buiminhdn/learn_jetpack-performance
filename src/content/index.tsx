import type { ReactNode } from 'react'
import { foundationContent } from './foundationContent'
import { stateContent } from './stateContent'
import { lazyContent } from './lazyContent'
import { stabilityContent } from './stabilityContent'
import { effectsContent } from './effectsContent'
import { modifierContent } from './modifierContent'
import { animationContent } from './animationContent'
import { architectureContent } from './architectureContent'
import { measureContent } from './measureContent'

/** Vietnamese explanatory content for every section, keyed by section id. */
export const SECTION_CONTENT: Record<string, ReactNode> = {
  ...foundationContent,
  ...stateContent,
  ...lazyContent,
  ...stabilityContent,
  ...effectsContent,
  ...modifierContent,
  ...animationContent,
  ...architectureContent,
  ...measureContent,
}
