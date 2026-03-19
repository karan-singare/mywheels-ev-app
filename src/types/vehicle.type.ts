import { VehicleStatus } from '../enums/vehicle-status.enum';

export interface Vehicle {
  id: string;
  vehicle_id: string;
  model: string;
  registration_number: string;
  battery_number: string;
  status: VehicleStatus;
  assigned_rider_id: string | null;
  maintenance_reason: string | null;
  last_gps_lat: number | null;
  last_gps_lng: number | null;
  last_gps_timestamp: string | null;
  last_battery_percentage: number | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleInput {
  vehicle_id: string;
  model: string;
  registration_number: string;
  battery_number: string;
}
