import type { ComponentType } from 'react'

/** A high-level group of rules shown as a sidebar section header. */
export interface SectionGroup {
  id: string
  title: string
  /** Inclusive range of rule numbers belonging to this group. */
  icon: string
}

/** Metadata for a single rule/section — drives navigation, search and progress. */
export interface SectionMeta {
  /** URL slug + anchor id. */
  id: string
  /** Rule number as it appears in the source document (0 for the intro). */
  number: number
  /** Vietnamese title. */
  title: string
  /** Group id this section belongs to. */
  group: string
  /** Short one-line summary used by search and cards. */
  summary: string
  /** Keywords (English technical terms) to improve search recall. */
  keywords: string[]
  /** Whether this section ships an interactive demo. */
  hasDemo: boolean
}

/** Props passed to every section content component. */
export interface SectionComponentProps {
  meta: SectionMeta
}

export type SectionComponent = ComponentType<SectionComponentProps>

export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  /** Related rule number, for "ôn lại" deep-links. */
  rule: number
  question: string
  options: QuizOption[]
  correct: string
  explanation: string
}

export interface ChecklistItem {
  id: string
  label: string
}

export interface ChecklistCategory {
  id: string
  title: string
  icon: string
  items: ChecklistItem[]
}

export type ComposePhase = 'composition' | 'layout' | 'draw'
