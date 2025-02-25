
import React from 'react'
import { AudioProcessorDiagram } from './AudioProcessorDiagram'

export const AudioProcessorArchitecture = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Audio Processor Architecture</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        This diagram illustrates the relationships between the refactored audio processor hooks
        and how they work together to process audio in the application.
      </p>
      
      <AudioProcessorDiagram />
      
      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-2">Architecture Description</h3>
        <p className="text-sm mb-4">
          The audio processing system uses a <strong>Facade Pattern</strong> with <code>useEdriziAudioProcessor</code> 
          acting as the main entry point that selects the appropriate specialized processor based on user role.
        </p>
        
        <h4 className="font-semibold mt-4">Key Components:</h4>
        <ul className="list-disc pl-6 space-y-2 text-sm mt-2">
          <li>
            <strong>useEdriziAudioProcessor:</strong> Facade hook that determines which processor to use based on user role.
          </li>
          <li>
            <strong>useBaseAudioProcessor:</strong> Core implementation with shared functionality for both user types.
          </li>
          <li>
            <strong>useRegularUserProcessor:</strong> Specialized processing for regular users, focused on trading advice.
          </li>
          <li>
            <strong>useSuperAdminProcessor:</strong> Enhanced processing for admin users with Grok3 integration.
          </li>
        </ul>
        
        <h4 className="font-semibold mt-4">Supporting Hooks:</h4>
        <ul className="list-disc pl-6 space-y-2 text-sm mt-2">
          <li>
            <strong>useAudioRecorder:</strong> Manages audio recording from the microphone.
          </li>
          <li>
            <strong>useAudioPlayback:</strong> Handles playing AI-generated speech.
          </li>
          <li>
            <strong>useAudioPreview:</strong> Controls playback of recorded audio before processing.
          </li>
          <li>
            <strong>useStopRecording:</strong> Manages the flow when stopping audio recording.
          </li>
        </ul>
      </div>
    </div>
  )
}
