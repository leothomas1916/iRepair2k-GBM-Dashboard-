import { useEffect, useRef, useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap, 
  useMapsLibrary, 
  useAdvancedMarkerRef 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Compass, 
  Star, 
  Info, 
  Route as RouteIcon, 
  Clock, 
  Car, 
  Check, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Shop constant details
const SHOP_LAT_LNG = { lat: 12.9785, lng: 77.6285 };
const SHOP_NAME = "iRepair2k - Bengaluru";
const SHOP_ADDRESS = "Shop No. 2, Sai Cambridge Residency, 1st Main Rd, 2nd Cross Rd, Saraswathi Puram, Halasuru, Bengaluru, Karnataka 560008";

// Simulated sandbox fallbacks for robust local SEO prototyping
const MOCK_PLACES = [
  {
    id: "mock-1",
    displayName: "Apple Repair Halasuru (Simulated)",
    formattedAddress: "Saraswathi Puram, Halasuru, Bengaluru, Karnataka 560008",
    rating: 4.8,
    userRatingCount: 142,
    location: {
      lat: 12.9790,
      lng: 77.6320,
      toJSON: () => ({ lat: 12.9790, lng: 77.6320 })
    }
  },
  {
    id: "mock-2",
    displayName: "Indiranagar Laptop Clinic (Simulated)",
    formattedAddress: "100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038",
    rating: 4.6,
    userRatingCount: 89,
    location: {
      lat: 12.9716,
      lng: 77.6412,
      toJSON: () => ({ lat: 12.9716, lng: 77.6412 })
    }
  },
  {
    id: "mock-3",
    displayName: "MG Road Metro Hub Repair (Simulated)",
    formattedAddress: "MG Road, Bengaluru, Karnataka 560001",
    rating: 4.5,
    userRatingCount: 210,
    location: {
      lat: 12.9754,
      lng: 77.6068,
      toJSON: () => ({ lat: 12.9754, lng: 77.6068 })
    }
  },
  {
    id: "mock-4",
    displayName: "Saraswathi Puram Temple Landmark",
    formattedAddress: "2nd Cross Rd, Saraswathi Puram, Halasuru, Bengaluru 560008",
    rating: 4.9,
    userRatingCount: 340,
    location: {
      lat: 12.9780,
      lng: 77.6290,
      toJSON: () => ({ lat: 12.9780, lng: 77.6290 })
    }
  },
  {
    id: "mock-5",
    displayName: "Sai Cambridge Residency (Simulated)",
    formattedAddress: "1st Main Rd, Halasuru, Bengaluru, Karnataka 560008",
    rating: 4.2,
    userRatingCount: 18,
    location: {
      lat: 12.9785,
      lng: 77.6280,
      toJSON: () => ({ lat: 12.9785, lng: 77.6280 })
    }
  }
];

interface GoogleMapsExplorerProps {
  onUseRouteForSEO?: (snippet: string) => void;
}

export default function GoogleMapsExplorer({ onUseRouteForSEO }: GoogleMapsExplorerProps) {
  if (!hasValidKey) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-sm text-zinc-300">
        <div className="max-w-md mx-auto text-center space-y-5">
          <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
            <Compass className="w-6 h-6 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h3 className="text-xl font-display font-medium text-white">Google Maps API Key Required</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Real-time local analysis, competitor lookup, and route optimization require a Google Maps Platform API key.
          </p>
          
          <div className="text-left bg-zinc-950/60 p-5 rounded-xl border border-zinc-800/80 space-y-3.5 text-xs">
            <p className="font-semibold text-zinc-200">How to activate Google Maps Integration:</p>
            <ol className="list-decimal list-inside space-y-2.5 text-zinc-400">
              <li>
                <a 
                  href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:underline font-medium inline-flex items-center gap-0.5"
                >
                  Get a Google Maps API Key
                </a>
              </li>
              <li>
                Open the <span className="font-semibold text-zinc-200">Settings</span> (⚙️ gear icon, top-right corner)
              </li>
              <li>
                Select <span className="font-semibold text-zinc-200">Secrets</span>
              </li>
              <li>
                Add secret named <code className="bg-zinc-900 px-1 py-0.5 rounded text-orange-400 font-mono">GOOGLE_MAPS_PLATFORM_KEY</code>
              </li>
              <li>
                Paste your API key and save. The app will auto-rebuild!
              </li>
            </ol>
          </div>
          
          <div className="text-xs text-zinc-500 italic pt-1">
            Note: AIS secrets are applied at build-time. No manual page refresh is needed.
          </div>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl flex flex-col h-[750px]">
        
        {/* Header / Config Bar */}
        <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div>
            <h3 className="text-lg font-display font-medium text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-500" />
              Geo-Signals & Competitor Maps Explorer
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Pull live places, directions, and competitor metrics directly from Google Maps Platform APIs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              GMP API Connect Active
            </span>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Controls Panel (Left side of map) */}
          <div className="w-full lg:w-[350px] border-r border-zinc-800/80 p-5 flex flex-col gap-5 overflow-y-auto shrink-0 bg-zinc-950/20">
            <MapControls onUseRouteForSEO={onUseRouteForSEO} />
          </div>

          {/* Interactive Map Component (Fills the rest) */}
          <div className="flex-1 relative h-full">
            <InteractiveMap />
          </div>
        </div>

      </div>
    </APIProvider>
  );
}

// Global maps sharing context state using event listener or a global state since we want controls and maps to communicate.
// For simplicity in a single file React component, we use a simple singleton or custom window properties,
// since components within APIProvider need access to Map instances, libraries, and triggers.
const mapStateListeners = new Set<() => void>();
let globalState = {
  searchQuery: "",
  searchResults: [] as google.maps.places.Place[],
  selectedPlace: null as google.maps.places.Place | null,
  activeRoute: null as {
    origin: google.maps.LatLngLiteral | string;
    destination: google.maps.LatLngLiteral | string;
    distanceText: string;
    durationText: string;
    steps: string[];
    originName: string;
  } | null,
  isSearching: false,
  isRouting: false,
  travelMode: 'DRIVING' as 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT',
  triggerSearch: null as ((query: string) => void) | null,
  triggerRoute: null as ((place: google.maps.places.Place) => void) | null,
  mapCenter: SHOP_LAT_LNG,
  mapZoom: 13,
  apiError: null as { message: string; link?: string; code?: string } | null,
  sandboxMode: false,
};

function updateGlobalState(updater: Partial<typeof globalState>) {
  Object.assign(globalState, updater);
  mapStateListeners.forEach(listener => listener());
}

function useGlobalMapState() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const handleUpdate = () => setTick(t => t + 1);
    mapStateListeners.add(handleUpdate);
    return () => {
      mapStateListeners.delete(handleUpdate);
    };
  }, []);
  return globalState;
}

// --- Map Controls Subcomponent ---
interface MapControlsProps {
  onUseRouteForSEO?: (snippet: string) => void;
}

function MapControls({ onUseRouteForSEO }: MapControlsProps) {
  const state = useGlobalMapState();
  const [localSearch, setLocalSearch] = useState("Apple Repair Halasuru");
  const [customOrigin, setCustomOrigin] = useState("");
  const [activeTab, setActiveTab] = useState<'search' | 'route'>('search');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim() && state.triggerSearch) {
      state.triggerSearch(localSearch.trim());
    }
  };

  const handleQuickSearch = (term: string) => {
    setLocalSearch(term);
    if (state.triggerSearch) {
      state.triggerSearch(term);
    }
  };

  const calculateCustomRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (customOrigin.trim() && state.triggerSearch) {
      updateGlobalState({ isRouting: true });
      // We will search for this custom origin to get its coordinates or route directly to it.
      state.triggerSearch(customOrigin.trim() + " Bengaluru");
      setActiveTab('search');
    }
  };

  const handleExportSEO = () => {
    if (!state.activeRoute) return;
    const snippet = `📍 Live Directions to iRepair2k Halasuru:
We are located just ${state.activeRoute.distanceText} (${state.activeRoute.durationText}) from ${state.activeRoute.originName}!
Key Routing: ${state.activeRoute.steps.slice(0, 3).map(s => s.replace(/<[^>]*>/g, '')).join(' → ')}. Come visit us at Shop No. 2, Saraswathi Puram!`;
    
    if (onUseRouteForSEO) {
      onUseRouteForSEO(snippet);
    }
    
    // Copy to clipboard as helper
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 3000);
  };

  return (
    <div className="space-y-5 h-full flex flex-col justify-start">
      
      {/* Tab Selectors */}
      <div className="flex p-1 bg-zinc-950 rounded-xl border border-zinc-800/80 shrink-0">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'search' 
              ? 'bg-zinc-900 text-white border border-zinc-800' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Competitor Search
        </button>
        <button
          onClick={() => setActiveTab('route')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'route' 
              ? 'bg-zinc-900 text-white border border-zinc-800' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Local SEO Routes
        </button>
      </div>

      {state.apiError && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2 text-[11px] text-zinc-300">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Live GMP API Key Warning
          </div>
          <p className="leading-relaxed">
            Your key doesn't have the <span className="font-semibold text-white">Places (New) or Routes API</span> enabled. Please activate them in your Cloud Console.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href={state.apiError.link || "https://console.cloud.google.com/google/maps-apis/start"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold underline flex items-center gap-0.5"
            >
              Activate APIs ↗
            </a>
            <span className="text-zinc-700">|</span>
            <span className="text-emerald-400 font-medium font-mono">Sandbox Active</span>
          </div>
        </div>
      )}

      {activeTab === 'search' ? (
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="space-y-2 shrink-0">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Places / Competitor Lookup
            </label>
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="e.g., iPhone repair Halasuru"
                className="w-full bg-zinc-950/80 border border-zinc-800/80 focus:border-orange-500/50 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={state.isSearching}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-orange-400 transition-colors disabled:opacity-50"
              >
                {state.isSearching ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="shrink-0">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
              Suggested Local Hotspots
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "iPhone repair Halasuru",
                "MacBook service Saraswathi Puram",
                "Laptop repair Indiranagar",
                "Saraswathi Puram Temple",
                "Sai Cambridge Residency"
              ].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleQuickSearch(term)}
                  className="text-[11px] bg-zinc-900 hover:bg-zinc-800/80 hover:text-orange-400 text-zinc-400 border border-zinc-800/50 px-2 py-1 rounded-md transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Search results */}
          <div className="flex-1 overflow-y-auto space-y-2.5 min-h-0 border-t border-zinc-800/50 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Search Results ({state.searchResults.length})
              </span>
              {state.isSearching && (
                <span className="text-[10px] font-mono text-orange-400 animate-pulse">
                  Querying live GMP API...
                </span>
              )}
            </div>

            {state.searchResults.length === 0 && !state.isSearching ? (
              <div className="p-8 text-center text-zinc-600 text-xs italic border border-dashed border-zinc-800/80 rounded-xl">
                No active query results. Search for local competitor spots or repair shops to map.
              </div>
            ) : (
              state.searchResults.map((place) => {
                const isSelected = state.selectedPlace?.id === place.id;
                return (
                  <motion.div
                    key={place.id}
                    onClick={() => {
                      updateGlobalState({ 
                        selectedPlace: place,
                        mapCenter: place.location?.toJSON() || SHOP_LAT_LNG,
                        mapZoom: 15
                      });
                    }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-orange-500/5 border-orange-500/40 shadow-md shadow-orange-500/5' 
                        : 'bg-zinc-950/40 border-zinc-800/60 hover:border-zinc-700/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5 mb-1.5">
                      <h4 className="text-xs font-semibold text-zinc-200 line-clamp-1">
                        {place.displayName || "Unknown Location"}
                      </h4>
                      {place.rating && (
                        <div className="flex items-center gap-0.5 shrink-0 bg-orange-500/10 px-1 py-0.5 rounded text-[10px] font-bold text-orange-400">
                          <Star className="w-2.5 h-2.5 fill-orange-400 stroke-none" />
                          {place.rating}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-2.5">
                      {place.formattedAddress}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (state.triggerRoute) state.triggerRoute(place);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 hover:text-white rounded-md text-[11px] font-medium text-zinc-300 border border-zinc-800 transition-colors"
                      >
                        <Navigation className="w-3 h-3 text-orange-400" />
                        Directions Snippet
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          
          {/* Custom Route Starting Point Input */}
          <form onSubmit={calculateCustomRoute} className="space-y-2 shrink-0">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Origin (Starting Area)
            </label>
            <div className="relative">
              <input
                type="text"
                value={customOrigin}
                onChange={e => setCustomOrigin(e.target.value)}
                placeholder="e.g., Indiranagar, Bengaluru"
                className="w-full bg-zinc-950/80 border border-zinc-800/80 focus:border-orange-500/50 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-orange-400 transition-colors"
              >
                <RouteIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 leading-normal">
              Computes real route distances and step directions to improve GBP post SEO.
            </p>
          </form>

          {/* Quick Route Starters */}
          <div className="shrink-0">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">
              Suggested Starting Landmarks
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["Indiranagar", "Domlur", "MG Road Metro", "Ulsoor Lake", "Koramangala"].map((landmark) => (
                <button
                  key={landmark}
                  type="button"
                  onClick={() => {
                    setCustomOrigin(landmark);
                    updateGlobalState({ isRouting: true });
                    if (state.triggerSearch) {
                      state.triggerSearch(landmark + " Bengaluru");
                      setActiveTab('search');
                    }
                  }}
                  className="text-[11px] bg-zinc-900 hover:bg-zinc-800 hover:text-orange-400 text-zinc-400 border border-zinc-800/50 px-2 py-1 rounded-md transition-colors"
                >
                  {landmark}
                </button>
              ))}
            </div>
          </div>

          {/* Computed Route Details */}
          <div className="flex-1 overflow-y-auto space-y-3 pt-3 border-t border-zinc-800/50 min-h-0">
            {state.isRouting ? (
              <div className="p-8 text-center space-y-2">
                <RefreshCw className="w-5 h-5 text-orange-400 animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">Computing route via Routes API...</p>
              </div>
            ) : state.activeRoute ? (
              <div className="space-y-4">
                <div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded-xl space-y-3.5">
                  <div className="flex items-center gap-2">
                    <RouteIcon className="w-5 h-5 text-orange-500" />
                    <span className="text-xs font-semibold text-zinc-100 uppercase tracking-wider font-mono">
                      Target Geo Route
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-900">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Distance</span>
                      <p className="text-sm font-bold text-zinc-200">{state.activeRoute.distanceText}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Drive Duration</span>
                      <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {state.activeRoute.durationText}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-400 leading-relaxed pt-2 border-t border-zinc-900">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1">Origin Landmark</span>
                    <span className="font-medium text-zinc-300">{state.activeRoute.originName}</span>
                  </div>
                </div>

                {/* Import to SEO button */}
                <button
                  type="button"
                  onClick={handleExportSEO}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-orange-500/10 hover:scale-[1.01] active:scale-95"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="w-4 h-4" />
                      Applied & Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Inject Route SEO into Post
                    </>
                  )}
                </button>

                {/* Turn by turn */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">
                    Driving Route Directions
                  </span>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {state.activeRoute.steps.map((step, index) => (
                      <div key={index} className="flex gap-2.5 text-[11px] text-zinc-400 leading-normal border-b border-zinc-900 pb-1.5">
                        <span className="font-mono text-[10px] text-zinc-600 mt-0.5">{index + 1}.</span>
                        <div 
                          className="flex-1"
                          dangerouslySetInnerHTML={{ __html: step }} 
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-zinc-600 text-xs italic border border-dashed border-zinc-800/80 rounded-xl">
                No route generated yet. Enter a starting landmark or click "Directions Snippet" from search.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

// --- Interactive Map Subcomponent ---
function InteractiveMap() {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');
  const state = useGlobalMapState();

  const [shopMarkerRef, shopMarker] = useAdvancedMarkerRef();
  const [shopInfoOpen, setShopInfoOpen] = useState(false);
  const [placeInfoOpen, setPlaceInfoOpen] = useState(false);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // Simulated Sandbox Search fallback
  const executeSimulatedSearch = (query: string) => {
    updateGlobalState({ isSearching: true });
    
    // Simulate API network delay
    setTimeout(() => {
      const isIndiranagar = query.toLowerCase().includes("indira");
      const isMetro = query.toLowerCase().includes("metro") || query.toLowerCase().includes("mg");
      const isSaraswathi = query.toLowerCase().includes("saraswathi") || query.toLowerCase().includes("temple");
      
      let results = [...MOCK_PLACES];
      if (isIndiranagar) {
        results = [MOCK_PLACES[1], MOCK_PLACES[0], MOCK_PLACES[4]];
      } else if (isMetro) {
        results = [MOCK_PLACES[2], MOCK_PLACES[1], MOCK_PLACES[0]];
      } else if (isSaraswathi) {
        results = [MOCK_PLACES[3], MOCK_PLACES[4], MOCK_PLACES[0]];
      } else if (query !== "laptop repair near Halasuru") {
        // Build a beautiful custom simulated place based on what the user searched!
        results = [
          {
            id: "mock-custom",
            displayName: `${query} (Sandbox Sim)`,
            formattedAddress: `Near Halasuru Lake, Bengaluru, Karnataka 560008`,
            rating: 4.7,
            userRatingCount: 54,
            location: {
              lat: 12.9810,
              lng: 77.6350,
              toJSON: () => ({ lat: 12.9810, lng: 77.6350 })
            } as any
          },
          ...MOCK_PLACES.slice(0, 3)
        ];
      }

      updateGlobalState({
        searchResults: results as any,
        isSearching: false,
        selectedPlace: results[0] as any
      });

      if (globalState.isRouting && results[0]) {
        calculateRoute(results[0] as any);
      } else {
        const firstLoc = results[0]?.location;
        if (firstLoc && map) {
          map.setCenter(firstLoc.toJSON());
          map.setZoom(14);
        }
      }
    }, 600);
  };

  // Simulated Sandbox Route fallback
  const executeSimulatedRoute = (originPlace: google.maps.places.Place) => {
    if (!map || !originPlace.location) return;
    
    // Simulate routing engine delay
    setTimeout(() => {
      const originLatLng = originPlace.location.toJSON();
      
      // Clear previous polylines
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];

      // Draw a simulated polyline directly to our shop with a small curve to make it look realistic
      const midLat = (originLatLng.lat + SHOP_LAT_LNG.lat) / 2 + 0.001;
      const midLng = (originLatLng.lng + SHOP_LAT_LNG.lng) / 2 - 0.001;
      const pathCoordinates = [
        originLatLng,
        { lat: midLat, lng: midLng },
        SHOP_LAT_LNG
      ];

      const polyline = new google.maps.Polyline({
        path: pathCoordinates,
        strokeColor: '#f97316', // Orange-500
        strokeOpacity: 0.85,
        strokeWeight: 5.5,
      });
      polyline.setMap(map);
      polylinesRef.current = [polyline];

      // Calculate distance using simple spherical distance approximation
      const latDiff = originLatLng.lat - SHOP_LAT_LNG.lat;
      const lngDiff = originLatLng.lng - SHOP_LAT_LNG.lng;
      const rawDistanceKm = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // ~111km per degree
      
      const distanceText = `${rawDistanceKm.toFixed(1)} km`;
      const minutes = Math.ceil(rawDistanceKm * 2.5); // Approx 2.5 minutes per km driving in Bengaluru traffic
      const durationText = `${minutes} min${minutes !== 1 ? 's' : ''}`;

      const originName = originPlace.displayName || "Selected Origin";
      const steps = [
        `Depart from <b>${originName}</b> and head towards the nearest main arterial road.`,
        `Take the main road connected towards Halasuru/Ulsoor lake signal intersection.`,
        `Turn left onto 1st Main Rd, then immediate right onto 2nd Cross Rd, Saraswathi Puram.`,
        `Arrive at <b>iRepair2k</b> (Shop No. 2, Sai Cambridge Residency) on your left.`
      ];

      updateGlobalState({
        isRouting: false,
        activeRoute: {
          origin: originLatLng,
          destination: SHOP_LAT_LNG,
          distanceText,
          durationText,
          steps,
          originName
        }
      });

      // Fit map bounds manually
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(originLatLng);
      bounds.extend(SHOP_LAT_LNG);
      map.fitBounds(bounds);
    }, 600);
  };

  // Function to execute textual search in the places library
  const executeSearch = (query: string) => {
    if (!query) return;

    updateGlobalState({ isSearching: true });

    if (globalState.sandboxMode || !placesLib) {
      executeSimulatedSearch(query);
      return;
    }
    
    placesLib.Place.searchByText({
      textQuery: query,
      fields: ['displayName', 'location', 'formattedAddress', 'rating', 'userRatingCount', 'id'],
      locationBias: SHOP_LAT_LNG,
      maxResultCount: 6,
    }).then(({ places }) => {
      updateGlobalState({ 
        searchResults: places || [],
        isSearching: false,
        selectedPlace: places?.[0] || null
      });

      // If the search was triggered for a route calculation origin
      if (globalState.isRouting && places?.[0]) {
        calculateRoute(places[0]);
      } else if (places?.[0]?.location) {
        // Adjust map to center the first search item
        map?.setCenter(places[0].location.toJSON());
        map?.setZoom(14);
      }
    }).catch(err => {
      const errMsg = err?.message || String(err);
      console.warn("Places API (New) searchByText failed or is disabled. Trying legacy PlacesService fallback...", errMsg);

      // Attempt legacy PlacesService search as fallback which is almost always enabled
      if (map && google?.maps?.places?.PlacesService) {
        try {
          const service = new google.maps.places.PlacesService(map);
          service.textSearch({
            query: query,
            location: SHOP_LAT_LNG,
            radius: 5000
          }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
              // Map the legacy results to the interface that the component expects
              const mappedPlaces = results.map(p => ({
                id: p.place_id || `legacy-${Math.random()}`,
                displayName: p.name || "Unknown Location",
                formattedAddress: p.formatted_address || "",
                rating: p.rating,
                userRatingCount: p.user_ratings_total,
                location: p.geometry?.location ? {
                  lat: p.geometry.location.lat(),
                  lng: p.geometry.location.lng(),
                  toJSON: () => ({ lat: p.geometry!.location.lat(), lng: p.geometry!.location.lng() })
                } : null
              }));

              updateGlobalState({
                searchResults: mappedPlaces as any,
                isSearching: false,
                selectedPlace: mappedPlaces[0] as any
              });

              if (globalState.isRouting && mappedPlaces[0]) {
                calculateRoute(mappedPlaces[0] as any);
              } else if (mappedPlaces[0]?.location) {
                map.setCenter(mappedPlaces[0].location.toJSON());
                map.setZoom(14);
              }
            } else {
              triggerSandboxFallback(query, errMsg);
            }
          });
        } catch (fallbackErr) {
          console.warn("Legacy PlacesService fallback failed:", fallbackErr);
          triggerSandboxFallback(query, errMsg);
        }
      } else {
        triggerSandboxFallback(query, errMsg);
      }
    });
  };

  const triggerSandboxFallback = (q: string, originalErrorMsg: string) => {
    let errorDetails = {
      message: "Places API (New) is not enabled for this Google Maps Platform key.",
      link: "https://console.developers.google.com/apis/api/places.googleapis.com/overview",
      code: "PLACES_API_DISABLED"
    };

    const linkMatch = originalErrorMsg.match(/https:\/\/console\.[^ ]+/);
    if (linkMatch) {
      errorDetails.link = linkMatch[0];
    }
    
    updateGlobalState({ 
      isSearching: false,
      apiError: errorDetails,
      sandboxMode: true
    });

    // Execute simulated search
    executeSimulatedSearch(q);
  };

  // Function to compute driving route to shop
  const calculateRoute = (originPlace: google.maps.places.Place) => {
    if (!map || !originPlace.location) return;

    updateGlobalState({ isRouting: true });

    // Clear previous polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    const originLatLng = originPlace.location.toJSON();

    if (globalState.sandboxMode || !routesLib) {
      executeSimulatedRoute(originPlace);
      return;
    }

    routesLib.Route.computeRoutes({
      origin: originLatLng,
      destination: SHOP_LAT_LNG,
      travelMode: state.travelMode,
      fields: ['path', 'distanceMeters', 'durationMillis', 'legs', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const route = routes[0];
        
        // Draw polylines
        const newPolylines = route.createPolylines();
        newPolylines.forEach(polyline => {
          // Style polyline
          polyline.setOptions({
            strokeColor: '#f97316', // Orange-500
            strokeOpacity: 0.85,
            strokeWeight: 5.5,
          });
          polyline.setMap(map);
        });
        polylinesRef.current = newPolylines;

        // Collect directions steps (Vite routes API provides legs)
        const steps: string[] = [];
        let originName = originPlace.displayName || "Selected Origin";
        
        if (route.legs?.[0]?.steps) {
          route.legs[0].steps.forEach((step: any) => {
            if (step.instructions) {
              steps.push(step.instructions);
            } else if (step.navigationInstruction?.instructions) {
              steps.push(step.navigationInstruction.instructions);
            } else {
              // fallback if structured text is unavailable
              steps.push(`Head towards next crossing.`);
            }
          });
        } else {
          // Fallback steps
          steps.push(`Start journey from ${originName}.`);
          steps.push(`Head towards Halasuru area.`);
          steps.push(`Turn into Saraswathi Puram towards Shop No. 2.`);
          steps.push(`Arrive at iRepair2k on the left.`);
        }

        const distanceMeters = route.distanceMeters || 1000;
        const durationMillis = Number(route.durationMillis) || 300000;

        const distanceText = `${(distanceMeters / 1000).toFixed(1)} km`;
        const minutes = Math.ceil(durationMillis / 60000);
        const durationText = `${minutes} min${minutes !== 1 ? 's' : ''}`;

        updateGlobalState({
          isRouting: false,
          activeRoute: {
            origin: originLatLng,
            destination: SHOP_LAT_LNG,
            distanceText,
            durationText,
            steps,
            originName
          }
        });

        // Fit map bounds
        if (route.viewport) {
          map.fitBounds(route.viewport);
        }
      } else {
        updateGlobalState({ isRouting: false });
      }
    }).catch(err => {
      const errMsg = err?.message || String(err);
      console.warn("Routes API (New) compute failed or is disabled. Trying legacy DirectionsService fallback...", errMsg);
      
      if (google?.maps?.DirectionsService) {
        try {
          const directionsService = new google.maps.DirectionsService();
          directionsService.route({
            origin: originLatLng,
            destination: SHOP_LAT_LNG,
            travelMode: google.maps.TravelMode.DRIVING
          }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result && result.routes && result.routes.length > 0) {
              const route = result.routes[0];
              const leg = route.legs[0];
              
              // Clear previous polylines
              polylinesRef.current.forEach(p => p.setMap(null));
              polylinesRef.current = [];

              // Render directions route polyline
              const polyline = new google.maps.Polyline({
                path: route.overview_path,
                strokeColor: '#f97316', // Orange-500
                strokeOpacity: 0.85,
                strokeWeight: 5.5,
              });
              polyline.setMap(map);
              polylinesRef.current = [polyline];

              // Collect directions steps
              const steps: string[] = [];
              if (leg.steps) {
                leg.steps.forEach(step => {
                  if (step.instructions) {
                    steps.push(step.instructions);
                  }
                });
              }

              const distanceText = leg.distance?.text || `${((leg.distance?.value || 1000) / 1000).toFixed(1)} km`;
              const durationText = leg.duration?.text || `${Math.ceil((leg.duration?.value || 300) / 60)} mins`;

              const originName = originPlace.displayName || "Selected Origin";
              
              updateGlobalState({
                isRouting: false,
                activeRoute: {
                  origin: originLatLng,
                  destination: SHOP_LAT_LNG,
                  distanceText,
                  durationText,
                  steps,
                  originName
                }
              });

              // Fit map bounds
              if (route.bounds) {
                map.fitBounds(route.bounds);
              }
            } else {
              triggerSandboxRoutingFallback(originPlace, errMsg);
            }
          });
        } catch (fallbackErr) {
          console.warn("Legacy DirectionsService fallback failed:", fallbackErr);
          triggerSandboxRoutingFallback(originPlace, errMsg);
        }
      } else {
        triggerSandboxRoutingFallback(originPlace, errMsg);
      }
    });
  };

  const triggerSandboxRoutingFallback = (origin: google.maps.places.Place, originalErrorMsg: string) => {
    let errorDetails = globalState.apiError || {
      message: "Routes API is disabled for this key.",
      link: "https://console.developers.google.com/apis/api/routes.googleapis.com/overview",
      code: "ROUTES_API_DISABLED"
    };
    
    updateGlobalState({ 
      apiError: errorDetails,
      sandboxMode: true
    });

    executeSimulatedRoute(origin);
  };

  // Wire up state callbacks
  useEffect(() => {
    globalState.triggerSearch = executeSearch;
    globalState.triggerRoute = calculateRoute;
    return () => {
      globalState.triggerSearch = null;
      globalState.triggerRoute = null;
    };
  }, [placesLib, routesLib, map]);

  // Initial search if none exists to populate map
  useEffect(() => {
    if (placesLib && state.searchResults.length === 0 && !state.isSearching) {
      executeSearch("laptop repair near Halasuru");
    }
  }, [placesLib]);

  // Cleanup route polylines on unmount
  useEffect(() => {
    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Map
        center={state.mapCenter}
        zoom={state.mapZoom}
        mapId="DEMO_MAP_ID"
        onCenterChanged={(ev) => {
          // Sync center smoothly
          globalState.mapCenter = ev.detail.center;
        }}
        onZoomChanged={(ev) => {
          globalState.mapZoom = ev.detail.zoom;
        }}
        disableDefaultUI={false}
        gestureHandling="cooperative"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Main iRepair2k shop location marker */}
        <AdvancedMarker 
          ref={shopMarkerRef} 
          position={SHOP_LAT_LNG} 
          title={SHOP_NAME}
          onClick={() => setShopInfoOpen(true)}
        >
          <Pin 
            background="#ea580c" // Orange-600
            borderColor="#fff"
            glyphColor="#fff"
            scale={1.2}
          />
        </AdvancedMarker>

        {/* Shop InfoWindow */}
        {shopInfoOpen && (
          <InfoWindow anchor={shopMarker} onCloseClick={() => setShopInfoOpen(false)}>
            <div className="p-2 max-w-xs text-zinc-900">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <h4 className="font-bold text-sm text-zinc-900">{SHOP_NAME}</h4>
              </div>
              <p className="text-xs text-zinc-600 leading-normal mb-2">
                {SHOP_ADDRESS}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded w-fit">
                Our Local SEO Power Base
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Search Results Markers */}
        {state.searchResults.map((place) => {
          if (!place.location) return null;
          const isSelected = state.selectedPlace?.id === place.id;
          return (
            <SearchMarker 
              key={place.id}
              place={place} 
              isSelected={isSelected}
              onSelect={(p) => updateGlobalState({ selectedPlace: p })}
              onGetRoute={calculateRoute}
            />
          );
        })}

      </Map>
    </div>
  );
}

// Marker helper with unique hook bindings
function SearchMarker({ 
  place, 
  isSelected, 
  onSelect,
  onGetRoute 
}: { 
  place: google.maps.places.Place; 
  isSelected: boolean;
  onSelect: (p: google.maps.places.Place) => void;
  onGetRoute: (p: google.maps.places.Place) => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isSelected) {
      setOpen(true);
    }
  }, [isSelected]);

  return (
    <>
      <AdvancedMarker 
        ref={markerRef} 
        position={place.location} 
        title={place.displayName || "Query Result"}
        onClick={() => {
          onSelect(place);
          setOpen(true);
        }}
      >
        <Pin 
          background={isSelected ? "#ea580c" : "#27272a"} 
          borderColor={isSelected ? "#ea580c" : "#71717a"}
          glyphColor="#fff"
          scale={isSelected ? 1.1 : 0.9}
        />
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)}>
          <div className="p-2 max-w-xs text-zinc-900 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-xs text-zinc-900">{place.displayName}</h4>
              {place.rating && (
                <div className="flex items-center gap-0.5 shrink-0 bg-amber-100 text-amber-800 px-1 py-0.5 rounded text-[9px] font-bold">
                  <Star className="w-2.5 h-2.5 fill-amber-700 stroke-none" />
                  {place.rating}
                </div>
              )}
            </div>
            <p className="text-[11px] text-zinc-600 leading-normal">
              {place.formattedAddress}
            </p>
            <div className="pt-1.5 flex gap-1.5">
              <button
                onClick={() => onGetRoute(place)}
                className="flex-1 bg-zinc-900 text-white text-[10px] py-1 px-2 rounded font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1"
              >
                <Navigation className="w-2.5 h-2.5 text-orange-400" />
                Compute SEO Route
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
