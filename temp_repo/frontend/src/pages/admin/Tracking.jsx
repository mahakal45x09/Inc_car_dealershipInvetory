import React from 'react';
import { MapPin, Navigation, Signal, Battery, AlertCircle } from 'lucide-react';

export default function Tracking() {
  const activeVehicles = [
    { id: 'V-1042', make: 'BMW', model: '3 Series', status: 'moving', speed: '45 mph', battery: '82%', location: 'Downtown Metro' },
    { id: 'V-8391', make: 'Tesla', model: 'Model 3', status: 'parked', speed: '0 mph', battery: '95%', location: 'Airport Terminal B' },
    { id: 'V-2210', make: 'Audi', model: 'Q5', status: 'moving', speed: '65 mph', battery: '44%', location: 'Interstate 80 East' },
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-1">Live Tracking & GPS</h1>
        <p className="text-gray-500">Monitor your active fleet in real-time</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Map Area */}
        <div className="lg:col-span-2 glass-card overflow-hidden relative flex flex-col">
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur shadow-lg rounded-xl p-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success animate-pulse"></span>
              <span className="text-sm font-medium text-secondary">3 Active</span>
            </div>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              <span className="text-sm font-medium text-secondary">1 Idle</span>
            </div>
          </div>
          
          {/* Simulated Map Background */}
          <div className="flex-1 bg-gray-100 relative">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight="0" 
              marginWidth="0" 
              src="https://www.openstreetmap.org/export/embed.html?bbox=-122.5%2C37.7%2C-122.3%2C37.8&amp;layer=mapnik"
              className="grayscale opacity-80"
            ></iframe>
            
            {/* Map Markers (Simulated overlay) */}
            <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-8 h-8 rounded-full bg-primary/30 animate-ping"></span>
                <div className="w-4 h-4 bg-primary rounded-full border-2 border-white relative z-10"></div>
                <div className="absolute top-6 bg-white shadow-lg rounded-lg px-2 py-1 text-xs font-bold whitespace-nowrap">V-1042</div>
              </div>
            </div>

            <div className="absolute top-1/4 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex items-center justify-center">
                <div className="w-4 h-4 bg-warning rounded-full border-2 border-white relative z-10"></div>
                <div className="absolute top-6 bg-white shadow-lg rounded-lg px-2 py-1 text-xs font-bold whitespace-nowrap">V-8391</div>
              </div>
            </div>
            
            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-8 h-8 rounded-full bg-primary/30 animate-ping"></span>
                <div className="w-4 h-4 bg-primary rounded-full border-2 border-white relative z-10"></div>
                <div className="absolute top-6 bg-white shadow-lg rounded-lg px-2 py-1 text-xs font-bold whitespace-nowrap">V-2210</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="glass-card flex flex-col min-h-0">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-secondary">Active Fleet</h3>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">Live Updates</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {activeVehicles.map(vehicle => (
              <div key={vehicle.id} className="border border-gray-100 rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer bg-white shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-secondary text-sm">{vehicle.make} {vehicle.model}</h4>
                    <p className="text-xs text-gray-500">{vehicle.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    vehicle.status === 'moving' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Navigation size={14} className="text-gray-400" />
                    {vehicle.speed}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Battery size={14} className={parseInt(vehicle.battery) > 20 ? 'text-success' : 'text-danger'} />
                    {vehicle.battery}
                  </div>
                </div>
                
                <div className="flex items-start gap-1.5 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                  <span className="truncate">{vehicle.location}</span>
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-4 rounded-xl border border-dashed border-danger/30 bg-danger/5 flex items-start gap-3">
              <AlertCircle size={18} className="text-danger shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-bold text-danger">Service Required</h5>
                <p className="text-xs text-danger/80 mt-1">V-9022 (Audi A4) reported low tire pressure in Zone 4.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
