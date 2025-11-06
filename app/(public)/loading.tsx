import {Loader2 } from "lucide-react"
 
export default function Loading() {
  return (

    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-4 text-gray-500">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <p className="text-lg font-medium">Loading....</p>
      </div>
    </div>
  )
}
