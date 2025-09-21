import React from 'react'
import { cn } from '@/lib/utils'
function Blob({className}) {
  return (
    <div
     className={cn('rounded-full w-[30rem] aspect-square blur-[100px]', className)}
    />

  )
}

export default Blob