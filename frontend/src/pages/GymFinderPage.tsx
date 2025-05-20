import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mockGyms, Equipment as EquipmentType } from 'utils/gymMockData'; // Renamed Equipment to EquipmentType
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose, 
  DialogFooter as DialogFooterComponent 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuCheckboxItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox for filter items
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Search, Filter, List, Star, Clock, Sparkles, Users, ChevronRight, ExternalLink, XCircle } from 'lucide-react';

// Fix for default marker icon issue with webpack/vite
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to get unique equipment for filtering
const getAllUniqueEquipment = (gyms: typeof mockGyms): EquipmentType[] => {
  const allEquipment = gyms.flatMap(gym => gym.equipment);
  const uniqueEquipmentMap = new Map<string, EquipmentType>();
  allEquipment.forEach(eq => {
    if (!uniqueEquipmentMap.has(eq.id)) {
      uniqueEquipmentMap.set(eq.id, eq);
    }
  });
  return Array.from(uniqueEquipmentMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

const GymFinderPage = () => {
  const defaultPosition: [number, number] = [34.0522, -118.2437]; // Los Angeles
  const [selectedGym, setSelectedGym] = useState<typeof mockGyms[0] | null>(null);
  const [isListView, setIsListView] = useState(false);

  const allUniqueEquipment = useMemo(() => getAllUniqueEquipment(mockGyms), []);
  const [stagedSelectedEquipmentIds, setStagedSelectedEquipmentIds] = useState<string[]>([]);
  const [activeSelectedEquipmentIds, setActiveSelectedEquipmentIds] = useState<string[]>([]);

  const filteredGymsToDisplay = useMemo(() => {
    if (activeSelectedEquipmentIds.length === 0) {
      return mockGyms;
    }
    return mockGyms.filter(gym => 
      activeSelectedEquipmentIds.every(filterId => 
        gym.equipment.some(eq => eq.id === filterId)
      )
    );
  }, [activeSelectedEquipmentIds]);

  const handleApplyFilters = () => {
    setActiveSelectedEquipmentIds(stagedSelectedEquipmentIds);
  };

  const handleClearFilters = () => {
    setStagedSelectedEquipmentIds([]);
    setActiveSelectedEquipmentIds([]);
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
        {halfStar && <Star key="half" className="h-4 w-4 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)}
        <span className="ml-1 text-xs text-gray-500">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-4 md:p-6 flex flex-col space-y-4 md:space-y-6">
      <Card className="shadow-xl rounded-xl border border-gray-700 bg-gray-800 text-white backdrop-blur-md">
        <CardHeader className="border-b border-gray-700 pb-4">
          <CardTitle className="text-2xl md:text-3xl font-bold flex items-center text-white">
            <MapPin className="w-7 h-7 mr-3 text-purple-400" />
            Find Your Gym
          </CardTitle>
          <CardDescription className="text-md text-gray-400 mt-1">
            Discover gyms near you with the equipment you need.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 md:pt-6">
          <div className="mb-5 md:mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search by name or area (simulated)" 
                className="w-full pl-11 pr-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow shadow-sm text-sm sm:text-base placeholder:text-gray-400"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors shadow-sm rounded-lg py-3 text-sm sm:text-base w-full sm:w-auto justify-center">
                  <Filter size={18} /> Filters {activeSelectedEquipmentIds.length > 0 && `(${activeSelectedEquipmentIds.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-gray-800 p-2 shadow-lg rounded-md border border-gray-700 text-white">
                <DropdownMenuLabel className="px-2 py-1.5 font-semibold text-gray-300">Filter by Equipment</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 bg-gray-700" />
                <DropdownMenuGroup className="max-h-60 overflow-y-auto">
                  {allUniqueEquipment.map(equip => (
                    <DropdownMenuCheckboxItem
                      key={equip.id}
                      checked={stagedSelectedEquipmentIds.includes(equip.id)}
                      onCheckedChange={checked => {
                        setStagedSelectedEquipmentIds(prev => 
                          checked ? [...prev, equip.id] : prev.filter(id => id !== equip.id)
                        );
                      }}
                      className="text-sm text-gray-300 hover:bg-gray-700 rounded-sm data-[state=checked]:bg-purple-900/50 data-[state=checked]:text-purple-400"
                    >
                      {equip.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1 bg-gray-700"/>
                <DropdownMenuGroup>
                    <DropdownMenuItem 
                        onClick={handleApplyFilters} 
                        className="text-sm bg-purple-600 text-white hover:bg-purple-700 focus:bg-purple-700 cursor-pointer rounded-sm mb-1 data-[disabled]:opacity-50"
                        disabled={stagedSelectedEquipmentIds.length === 0 && activeSelectedEquipmentIds.length === 0}
                    >
                        Apply Filters
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={handleClearFilters} 
                        className="text-sm text-red-600 hover:bg-red-50 focus:bg-red-100 cursor-pointer rounded-sm data-[disabled]:opacity-50"
                        disabled={stagedSelectedEquipmentIds.length === 0 && activeSelectedEquipmentIds.length === 0}
                    >
                        <XCircle size={14} className="mr-1.5"/> Clear Filters
                    </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant={isListView ? "default" : "outline"} 
              onClick={() => setIsListView(!isListView)}
              className="flex items-center gap-2 border-gray-600 text-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white hover:bg-gray-700 data-[state=checked]:hover:bg-purple-700 transition-colors shadow-sm rounded-lg py-3 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              {isListView ? <MapPin size={18} /> : <List size={18} />} {isListView ? "Map View" : "List View"}
            </Button>
          </div>

          {filteredGymsToDisplay.length === 0 && activeSelectedEquipmentIds.length > 0 && (
            <div className="text-center py-10 text-gray-400">
              <Sparkles size={32} className="mx-auto mb-2 text-purple-400" />
              <p className="font-semibold text-lg text-white">No gyms match your selected equipment.</p>
              <p className="text-sm">Try adjusting your filters or clearing them to see all available gyms.</p>
            </div>
          )}

          {isListView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-4">
              {filteredGymsToDisplay.map(gym => (
                <DialogTrigger asChild key={gym.id} onClick={() => setSelectedGym(gym)}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer rounded-lg border border-gray-700 overflow-hidden bg-gray-800 text-white flex flex-col">
                    {gym.imageUrl && (
                        <div className="h-40 w-full overflow-hidden">
                            <img src={gym.imageUrl} alt={gym.name} className="w-full h-full object-cover transition-transform hover:scale-105" />
                        </div>
                    )}
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-lg font-semibold text-white hover:text-purple-400 transition-colors">{gym.name}</CardTitle>
                      <StarRating rating={gym.rating} />
                    </CardHeader>
                    <CardContent className="text-xs text-gray-400 space-y-1.5 px-4 pb-3 pt-1 flex-grow">
                      <p className="flex items-center"><MapPin size={14} className="mr-1.5 text-gray-500" /> {gym.address}</p>
                      <p className="flex items-center"><Clock size={14} className="mr-1.5 text-gray-500" /> {gym.simulatedTravelTime}</p>
                      {gym.equipment.length > 0 && (
                        <p className="flex items-center"><Sparkles size={14} className="mr-1.5 text-gray-500" /> 
                          {gym.equipment.slice(0,2).map(e => e.name).join(", ")}
                          {gym.equipment.length > 2 ? ` & ${gym.equipment.length-2} more...` : ''}
                        </p>
                      )}
                    </CardContent>
                     <CardFooter className="p-3 bg-gray-50/70 border-t mt-auto">
                        <Button variant="link" className="text-purple-600 text-xs w-full justify-end hover:text-purple-700">
                            View Details <ChevronRight size={16} className="ml-1" />
                        </Button>
                    </CardFooter>
                  </Card>
                </DialogTrigger>
              ))}
            </div>
          ) : (
            <div className="h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-md border border-gray-200/80">
              <MapContainer center={defaultPosition} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredGymsToDisplay.map(gym => (
                  <Marker key={gym.id} position={[gym.latitude, gym.longitude]}>
                    <Popup>
                      <div className="font-semibold text-md p-1">
                        {gym.name}
                        <div className="text-xs text-gray-500 mb-1">{gym.address}</div>
                        <StarRating rating={gym.rating} />
                        <DialogTrigger asChild onClick={() => setSelectedGym(gym)}>
                            <Button size="sm" className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-auto">View Details</Button>
                        </DialogTrigger>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gym Details Dialog Component - No changes needed here for filtering logic */}
      {selectedGym && (
        <DialogContent className="max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-0 rounded-lg shadow-xl">
          <DialogHeader className="p-6 border-b sticky top-0 bg-white z-10">
             {selectedGym.imageUrl && (
                <div className="h-48 w-full overflow-hidden rounded-t-lg -mx-6 -mt-6 mb-4">
                    <img src={selectedGym.imageUrl} alt={selectedGym.name} className="w-full h-full object-cover" />
                </div>
            )}
            <DialogTitle className="text-2xl font-bold text-gray-800">{selectedGym.name}</DialogTitle>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                <StarRating rating={selectedGym.rating} />
                <span className="flex items-center"><MapPin size={14} className="mr-1.5" /> {selectedGym.address}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                <span className="flex items-center"><Clock size={14} className="mr-1.5" /> {selectedGym.simulatedTravelTime}</span>
                {selectedGym.website && 
                    <a href={selectedGym.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-600 hover:underline">
                       <ExternalLink size={14} className="mr-1.5" /> Visit Website
                    </a>
                }
                 {selectedGym.phoneNumber && 
                    <a href={`tel:${selectedGym.phoneNumber}`} className="flex items-center text-purple-600 hover:underline">
                        <Users size={14} className="mr-1.5" /> {selectedGym.phoneNumber} {/* Using Users icon as a placeholder for Phone icon if not available */}
                    </a>
                }
            </div>
          </DialogHeader>
          
          <div className="px-6 py-4 space-y-4">
            <Accordion type="multiple" defaultValue={['equipment', 'hours']} className="w-full">
              <AccordionItem value="equipment">
                <AccordionTrigger className="text-md font-semibold text-gray-700 hover:no-underline">Available Equipment ({selectedGym.equipment.length})</AccordionTrigger>
                <AccordionContent className="pt-2">
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 pl-2 sm:columns-2">
                    {selectedGym.equipment.map(eq => <li key={eq.id}>{eq.name}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="hours">
                <AccordionTrigger className="text-md font-semibold text-gray-700 hover:no-underline">Operating Hours</AccordionTrigger>
                <AccordionContent className="pt-2">
                  <ul className="space-y-0.5 text-sm text-gray-600">
                    {Object.entries(selectedGym.operatingHours).map(([day, hours]) => (
                      <li key={day}><span className="font-medium w-20 inline-block capitalize">{day.toLowerCase()}:</span> {hours}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {selectedGym.amenities && selectedGym.amenities.length > 0 && (
                <AccordionItem value="amenities">
                    <AccordionTrigger className="text-md font-semibold text-gray-700 hover:no-underline">Amenities</AccordionTrigger>
                    <AccordionContent className="pt-2">
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 pl-2 sm:columns-2">
                        {selectedGym.amenities.map(am => <li key={am}>{am}</li>)}
                    </ul>
                    </AccordionContent>
                </AccordionItem>
              )}
              {selectedGym.reviews && selectedGym.reviews.length > 0 && (
                <AccordionItem value="reviews">
                  <AccordionTrigger className="text-md font-semibold text-gray-700 hover:no-underline">Reviews ({selectedGym.reviews.length})</AccordionTrigger>
                  <AccordionContent className="pt-2 space-y-3">
                    {selectedGym.reviews.map(review => (
                      <div key={review.id} className="p-3 bg-slate-50 rounded-md border border-gray-200/80 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-sm text-gray-700">{review.userName}</p>
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="text-xs text-gray-600 italic">"{review.comment}"</p>
                        <p className="text-right text-xs text-gray-400 mt-1">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
          <DialogFooterComponent className="p-6 border-t bg-slate-50 rounded-b-lg sticky bottom-0 z-10">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Sparkles size={16} className="mr-2" /> Get Directions (Simulated)
            </Button>
          </DialogFooterComponent>
        </DialogContent>
      )}
    </div>
  );
};

const GymFinderPageWrapper = () => (
    <Dialog>
        <GymFinderPage />
    </Dialog>
)

export default GymFinderPageWrapper;
