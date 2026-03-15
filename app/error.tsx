'use client'
import st from './styles/error.module.scss'

export default function RootError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className={st.Error}>
      <h1>Oops! Something went wrong.</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()} className={st.Error__resetButton}>
        Try again
      </button>
    </div>
  )
}
