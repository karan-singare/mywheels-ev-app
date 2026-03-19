import { supabase } from '../config/supabase.constant';
import type { Vehicle, VehicleInput } from '../types/vehicle.type';
import type { VehicleStatus } from '../enums/vehicle-status.enum';

export async function addVehicle(data: VehicleInput): Promise<Vehicle> {
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .insert({ ...data, status: 'available' })
    .select()
    .single();
  if (error) throw new Error(`Failed to add vehicle: ${error.message}`);
  return vehicle as Vehicle;
}

export async function getVehicles(
  filter?: VehicleStatus,
): Promise<Vehicle[]> {
  let query = supabase.from('vehicles').select('*');
  if (filter) {
    query = query.eq('status', filter);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`);
  return data as Vehicle[];
}

export async function getVehicle(
  vehicleId: string,
): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', vehicleId)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch vehicle: ${error.message}`);
  return (data as Vehicle) ?? null;
}

export async function assignVehicle(
  vehicleId: string,
  riderId: string,
): Promise<Vehicle> {
  const { data, error } = await supabase
    .from('vehicles')
    .update({
      status: 'rented',
      assigned_rider_id: riderId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', vehicleId)
    .select()
    .single();
  if (error) throw new Error(`Failed to assign vehicle: ${error.message}`);
  return data as Vehicle;
}

export async function updateStatus(
  vehicleId: string,
  status: VehicleStatus,
  reason?: string,
): Promise<Vehicle> {
  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (status === 'maintenance') {
    updateData.maintenance_reason = reason ?? null;
  }
  if (status === 'available') {
    updateData.assigned_rider_id = null;
    updateData.maintenance_reason = null;
  }

  const { data, error } = await supabase
    .from('vehicles')
    .update(updateData)
    .eq('id', vehicleId)
    .select()
    .single();
  if (error) throw new Error(`Failed to update vehicle status: ${error.message}`);
  return data as Vehicle;
}

export async function getStatusCounts(): Promise<Record<VehicleStatus, number>> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('status');
  if (error) throw new Error(`Failed to fetch vehicle status counts: ${error.message}`);

  const counts: Record<VehicleStatus, number> = {
    available: 0,
    rented: 0,
    maintenance: 0,
  };
  for (const row of data ?? []) {
    const s = row.status as VehicleStatus;
    if (s in counts) counts[s]++;
  }
  return counts;
}
