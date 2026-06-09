import type { ComponentType } from 'react'
import { RecompositionScopeDemo } from './RecompositionScopeDemo'
import { HeavyCalcDemo } from './HeavyCalcDemo'
import { RememberKeyDemo } from './RememberKeyDemo'
import { DerivedStateDemo } from './DerivedStateDemo'
import { LazyKeyDemo } from './LazyKeyDemo'
import { ContentTypeDemo } from './ContentTypeDemo'
import { DeferStateReadDemo } from './DeferStateReadDemo'
import { PhasesDemo } from './PhasesDemo'
import { SkipDemo } from './SkipDemo'
import { StabilityDemo } from './StabilityDemo'
import { BackwardsWriteDemo } from './BackwardsWriteDemo'
import { SideEffectApiDemo } from './SideEffectApiDemo'
import { RememberUpdatedStateDemo } from './RememberUpdatedStateDemo'
import { ModifierLambdaDemo } from './ModifierLambdaDemo'
import { AnimationDemo } from './AnimationDemo'
import { BenchmarkDemo } from './BenchmarkDemo'

/** Maps a section id to its interactive demo component. */
export const DEMO_REGISTRY: Record<string, ComponentType> = {
  'nguyen-tac-nen-tang': RecompositionScopeDemo,
  'tinh-toan-nang': HeavyCalcDemo,
  remember: RememberKeyDemo,
  'derived-state-of': DerivedStateDemo,
  'lazy-key': LazyKeyDemo,
  'content-type': ContentTypeDemo,
  'defer-state-read': DeferStateReadDemo,
  'read-state-phase': PhasesDemo,
  'minimal-params': SkipDemo,
  stability: StabilityDemo,
  'backwards-write': BackwardsWriteDemo,
  'side-effect-api': SideEffectApiDemo,
  'remember-updated-state': RememberUpdatedStateDemo,
  'modifier-lambda': ModifierLambdaDemo,
  animation: AnimationDemo,
  'measure-first': BenchmarkDemo,
}
