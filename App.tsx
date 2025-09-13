
import React, { useState, useCallback, useMemo } from 'react';
import { EventType, ColorSuggestion } from './types';
import { WEDDING_EVENTS, DRESS_CODES } from './constants';
import { generateColorSuggestions, generateWeddingImage } from './services/geminiService';
import ColorInput from './components/ColorInput';
import Loader from './components/Loader';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [eventType, setEventType] = useState<EventType>(EventType.Baraat);
  const [brideColor, setBrideColor] = useState<string>('');
  const [groomColor, setGroomColor] = useState<string>('');
  const [colorSuggestions, setColorSuggestions] = useState<ColorSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<ColorSuggestion | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const isBrideColorEntered = brideColor.trim() !== '';
  const isGroomColorEntered = groomColor.trim() !== '';

  const handleGenerateCombinations = useCallback(async () => {
    if (!isBrideColorEntered && !isGroomColorEntered) {
      setError('Please enter a color for either the bride or the groom.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Finding perfect color matches...');
    setColorSuggestions([]);
    setSelectedSuggestion(null);
    setGeneratedImage(null);

    try {
      const inputColor = isBrideColorEntered ? brideColor : groomColor;
      const personWearingColor = isBrideColorEntered ? 'bride' : 'groom';
      const suggestionsJson = await generateColorSuggestions(inputColor, personWearingColor, eventType);
      const parsedSuggestions = JSON.parse(suggestionsJson);
      setColorSuggestions(parsedSuggestions);
    } catch (e) {
      console.error(e);
      setError('Could not generate color suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [brideColor, groomColor, eventType, isBrideColorEntered, isGroomColorEntered]);

  const handleGenerateImage = useCallback(async () => {
    if (!selectedSuggestion) {
      setError('Please select a suggested color first.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Creating your wedding preview...');

    try {
      const finalBrideColor = isBrideColorEntered ? brideColor : selectedSuggestion.name;
      const finalGroomColor = isGroomColorEntered ? groomColor : selectedSuggestion.name;
      const dressCode = DRESS_CODES[eventType];
      const imageBytes = await generateWeddingImage(finalBrideColor, finalGroomColor, eventType, dressCode);
      setGeneratedImage(`data:image/jpeg;base64,${imageBytes}`);
    } catch (e) {
      console.error(e);
      setError('Could not generate the image. The model might be unavailable.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSuggestion, brideColor, groomColor, eventType, isBrideColorEntered, isGroomColorEntered]);

  const dressCode = useMemo(() => DRESS_CODES[eventType], [eventType]);

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-pink-800 tracking-wider">Pakistani Wedding Color Stylist</h1>
          <SparklesIcon className="text-pink-500 w-8 h-8" />
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Panel: Controls */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-100">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">1. Choose The Event</h2>
                <p className="text-gray-500 mb-3">Each event has its own traditional attire.</p>
                <select 
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
                >
                  {WEDDING_EVENTS.map(event => (
                    <option key={event} value={event}>{event}</option>
                  ))}
                </select>
                <div className="mt-3 text-sm bg-pink-100 text-pink-800 p-3 rounded-lg">
                  <p><strong>Bride:</strong> {dressCode.bride}</p>
                  <p><strong>Groom:</strong> {dressCode.groom}</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-1">2. Enter a Known Color</h2>
                <p className="text-gray-500 mb-3">Enter the dress color for either the bride or groom.</p>
                <div className="space-y-4">
                  <ColorInput id="brideColor" label="Bride's Dress Color" value={brideColor} onChange={setBrideColor} disabled={isGroomColorEntered}/>
                  <div className="text-center text-gray-500 font-bold">OR</div>
                  <ColorInput id="groomColor" label="Groom's Dress Color" value={groomColor} onChange={setGroomColor} disabled={isBrideColorEntered}/>
                </div>
              </div>

              <div>
                <button
                  onClick={handleGenerateCombinations}
                  disabled={!isBrideColorEntered && !isGroomColorEntered}
                  className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-700 transition-transform transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  <SparklesIcon />
                  Generate Color Combinations
                </button>
              </div>

              {colorSuggestions.length > 0 && (
                <div className="border-t pt-6">
                  <h2 className="text-2xl font-semibold mb-3">3. Select a Complementary Color</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {colorSuggestions.map((suggestion) => (
                      <div key={suggestion.hex} className="text-center" onClick={() => setSelectedSuggestion(suggestion)}>
                        <div
                          className={`w-full h-16 rounded-lg cursor-pointer border-4 transition-all ${selectedSuggestion?.hex === suggestion.hex ? 'border-pink-500 ring-4 ring-pink-200' : 'border-white hover:border-pink-200'}`}
                          style={{ backgroundColor: suggestion.hex }}
                        />
                        <p className="text-xs mt-1 font-medium text-gray-600">{suggestion.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedSuggestion && (
                 <div className="border-t pt-6">
                  <h2 className="text-2xl font-semibold mb-3">4. Create Your Preview</h2>
                  <button
                    onClick={handleGenerateImage}
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Generate Image Preview
                  </button>
                 </div>
              )}
              
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
          </div>

          {/* Right Panel: Image Preview */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-100 flex items-center justify-center min-h-[600px] relative overflow-hidden">
            {isLoading && <Loader message={loadingMessage} />}
            {!generatedImage && !isLoading && (
              <div className="text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <h3 className="mt-2 text-xl font-semibold">Image Preview</h3>
                <p className="mt-1 text-sm">Your generated wedding attire will appear here.</p>
              </div>
            )}
            {generatedImage && (
              <img src={generatedImage} alt="Generated wedding attire" className="w-full h-full object-cover rounded-lg animate-fade-in" />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

// Simple fade-in animation using Tailwind config (won't work in this setup but shows intent)
// In a real project with a tailwind.config.js, you'd add this:
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
*/
// For this single-file setup, a style tag in index.html or inline style could be used if needed.
// However, the component re-render provides a subtle enough effect.
