import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { PlaygroundPage } from './pages/PlaygroundPage'
import { QuizPage } from './pages/QuizPage'
import { ChecklistPage } from './pages/ChecklistPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
