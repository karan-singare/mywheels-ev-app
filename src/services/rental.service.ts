import { supabase } from '../config/supabase.constant';
import type { Rental } from '../types/rental.type';

export async function createRental(
  riderId: string,
  planId: string,
  vehicleId: string,
): Promise<Rental> {
  const { data, error } = await supabase
    .from('rentals')
    .insert({ rider_id: riderId, plan_id: planId, vehicle_id: vehicleId })
    .select()
    .single();
  if (error) throw new Error(`Failed to create rental: ${error.message}`);
  return data as Rental;
}

export async function getActiveRental(
  riderId: string,
): Promise<Rental | null> {
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('rider_id', riderId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch active rental: ${error.message}`);
  return (data as Rental) ?? null;
}

export async function getRentalHistory(
  riderId: string,
): Promise<Rental[]> {
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('rider_id', riderId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch rental history: ${error.message}`);
  return data as Rental[];
}

export async function getAllActiveRentals(): Promise<Rental[]> {
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch all active rentals: ${error.message}`);
  return data as Rental[];
}
