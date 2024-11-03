import { Suspense } from 'react'
import ResetFrom from './ResetFrom'

export default function Page() {
  return (
    <>
        <Suspense fallback={"loading...."}>
          <ResetFrom />
        </Suspense>
    </>
  )
}