import React from 'react'
import { File } from 'lucide-react'
import Link from 'next/link'

function DocBlock({id, name, date}) {
  return (
    <Link href={`/case/${id}/doc/${name}`} className='w-fit'>
        <div className='flex items-center justify-between gap-3 w-fit min-w-1/5 border border-[#e5e7eb] rounded-md py-2 px-3 hover:cursor-pointer hover:shadow-md transition-shadow'>
            <div className='bg-[#f3f4f6] p-2 rounded-lg'>
                <File size={24} color="#6b7280" />
            </div>

            <div className='flex flex-col'>
                <p className='text-sm font-medium'>{name}</p>
                <p className='text-xs text-gray-500'>Uploaded on {date}</p>
            </div>
        </div>
    </Link>
  )
}

export default DocBlock