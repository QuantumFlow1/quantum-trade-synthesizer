
import React from 'react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const AudioProcessorDiagram = () => {
  return (
    <Card className="p-6 w-full max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Audio Processor Hooks Architecture</h3>
      
      <div className="relative bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
        {/* Main container with useEdriziAudioProcessor at the top */}
        <div className="flex flex-col items-center">
          {/* useEdriziAudioProcessor (Facade) */}
          <div className="bg-blue-100 dark:bg-blue-950 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-4 w-full max-w-md text-center mb-8 relative z-10">
            <h4 className="font-bold">useEdriziAudioProcessor</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">Facade Hook</p>
            <div className="text-xs mt-2 text-slate-500 dark:text-slate-400">
              Selects appropriate processor based on user type
            </div>
          </div>

          {/* Connected lines */}
          <div className="absolute top-[5.5rem] w-px h-12 bg-slate-400 left-1/2 transform -translate-x-1/2"></div>
          
          {/* Branching line */}
          <div className="w-4/5 h-px bg-slate-400 mb-4"></div>
          
          {/* Left and right downward lines */}
          <div className="flex w-full justify-between px-12 relative">
            <div className="w-px h-12 bg-slate-400"></div>
            <div className="w-px h-12 bg-slate-400"></div>
          </div>
          
          {/* Processing Hooks level */}
          <div className="flex flex-wrap justify-center gap-8 mb-8 w-full">
            {/* useRegularUserProcessor */}
            <div className="bg-green-100 dark:bg-green-950 border-2 border-green-400 dark:border-green-600 rounded-lg p-4 w-full max-w-xs text-center">
              <h4 className="font-bold">useRegularUserProcessor</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">For standard users</p>
              <div className="text-xs mt-2 text-slate-500 dark:text-slate-400">
                Handles trading advice generation
              </div>
            </div>
            
            {/* useSuperAdminProcessor */}
            <div className="bg-purple-100 dark:bg-purple-950 border-2 border-purple-400 dark:border-purple-600 rounded-lg p-4 w-full max-w-xs text-center">
              <h4 className="font-bold">useSuperAdminProcessor</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">For admins</p>
              <div className="text-xs mt-2 text-slate-500 dark:text-slate-400">
                Uses Grok3 advanced capabilities
              </div>
            </div>
          </div>
          
          {/* Connecting lines to base */}
          <div className="flex w-full justify-center relative mb-4">
            <div className="w-px h-8 bg-slate-400 absolute left-1/4"></div>
            <div className="w-px h-8 bg-slate-400 absolute right-1/4"></div>
            <div className="w-1/2 h-px bg-slate-400 absolute top-8"></div>
            <div className="w-px h-8 bg-slate-400 absolute top-8 left-1/2 transform -translate-x-1/2"></div>
          </div>
          
          {/* Base Hook */}
          <div className="bg-amber-100 dark:bg-amber-950 border-2 border-amber-400 dark:border-amber-600 rounded-lg p-4 w-full max-w-md text-center mt-8">
            <h4 className="font-bold">useBaseAudioProcessor</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">Core functionality</p>
            <div className="text-xs mt-2 text-slate-500 dark:text-slate-400">
              Shared audio processing, state management, and helper functions
            </div>
          </div>
        </div>
        
        {/* Integration Hooks */}
        <div className="mt-12">
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3">
              <h5 className="font-semibold text-sm">useAudioRecorder</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Handles microphone recording functionality
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3">
              <h5 className="font-semibold text-sm">useAudioPlayback</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manages audio playback functions
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3">
              <h5 className="font-semibold text-sm">useAudioPreview</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Handles preview of recorded audio
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3">
              <h5 className="font-semibold text-sm">useStopRecording</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manages the stop recording flow
              </p>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-4">
          <h5 className="font-semibold text-sm mb-2">Legend</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 dark:bg-blue-950 border border-blue-400 dark:border-blue-600 mr-2"></div>
              <span>Facade Pattern</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-100 dark:bg-amber-950 border border-amber-400 dark:border-amber-600 mr-2"></div>
              <span>Base Implementation</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 dark:bg-green-950 border border-green-400 dark:border-green-600 mr-2"></div>
              <span>Regular User Processing</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-100 dark:bg-purple-950 border border-purple-400 dark:border-purple-600 mr-2"></div>
              <span>Admin Processing</span>
            </div>
          </div>
        </div>

        {/* Data Flow */}
        <div className="mt-6 text-xs text-slate-600 dark:text-slate-300">
          <h5 className="font-semibold text-sm mb-2">Data Flow</h5>
          <ol className="list-decimal pl-4 space-y-1">
            <li>App components use the <span className="font-mono text-xs">useEdriziAudioProcessor</span> hook</li>
            <li>The facade hook selects the appropriate processor based on user type</li>
            <li>Both specialized processors inherit from the base processor</li>
            <li>The base processor provides common functionality and state management</li>
            <li>Supporting hooks handle specific functions like recording and playback</li>
          </ol>
        </div>
      </div>
    </Card>
  )
}
