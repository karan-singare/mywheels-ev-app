import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useVehicles } from '../../hooks/use-vehicles.hook';
import { colors } from '../../config/theme.constant';
import type { Vehicle, VehicleInput } from '../../types/vehicle.type';
import type { VehicleStatus } from '../../enums/vehicle-status.enum';

const STATUS_COLORS: Record<VehicleStatus, { bg: string; text: string }> = {
  available: { bg: '#dcfce7', text: '#22c55e' },
  rented: { bg: '#dbeafe', text: '#3b82f6' },
  maintenance: { bg: '#fef3c7', text: '#f59e0b' },
};

const FILTERS: Array<VehicleStatus | 'all'> = ['all', 'available', 'rented', 'maintenance'];

function StatusBadge({ status }: Readonly<{ status: VehicleStatus }>) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS.available;
  return (
    <View style={{ backgroundColor: c.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
      <Text style={{ color: c.text, fontSize: 11, fontWeight: '600', textTransform: 'capitalize' }}>{status}</Text>
    </View>
  );
}

function VehicleCard({
  vehicle,
  onAssign,
  onMaintenance,
  onRelease,
}: Readonly<{
  vehicle: Vehicle;
  onAssign: (v: Vehicle) => void;
  onMaintenance: (v: Vehicle) => void;
  onRelease: (v: Vehicle) => void;
}>) {
  return (
    <View
      testID={`vehicle-card-${vehicle.vehicle_id}`}
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textMain }}>{vehicle.model}</Text>
        <StatusBadge status={vehicle.status} />
      </View>
      <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 2 }}>ID: {vehicle.vehicle_id}</Text>
      <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 2 }}>Reg: {vehicle.registration_number}</Text>
      <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 2 }}>Battery #: {vehicle.battery_number}</Text>
      {vehicle.last_battery_percentage != null && (
        <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 2 }}>Battery: {vehicle.last_battery_percentage}%</Text>
      )}
      {vehicle.last_gps_lat != null && vehicle.last_gps_lng != null && (
        <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 2 }}>
          GPS: {vehicle.last_gps_lat.toFixed(4)}, {vehicle.last_gps_lng.toFixed(4)}
          {vehicle.last_gps_timestamp ? ` (${new Date(vehicle.last_gps_timestamp).toLocaleString()})` : ''}
        </Text>
      )}
      {vehicle.assigned_rider_id && (
        <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 2 }}>Rider: {vehicle.assigned_rider_id}</Text>
      )}
      {vehicle.maintenance_reason && (
        <Text style={{ fontSize: 12, color: '#f59e0b', marginBottom: 2 }}>Reason: {vehicle.maintenance_reason}</Text>
      )}

      <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
        {vehicle.status === 'available' && (
          <TouchableOpacity
            testID={`assign-btn-${vehicle.vehicle_id}`}
            onPress={() => onAssign(vehicle)}
            style={{ backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 }}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Assign</Text>
          </TouchableOpacity>
        )}
        {vehicle.status === 'available' && (
          <TouchableOpacity
            testID={`maintenance-btn-${vehicle.vehicle_id}`}
            onPress={() => onMaintenance(vehicle)}
            style={{ backgroundColor: '#f59e0b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 }}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Maintenance</Text>
          </TouchableOpacity>
        )}
        {(vehicle.status === 'rented' || vehicle.status === 'maintenance') && (
          <TouchableOpacity
            testID={`release-btn-${vehicle.vehicle_id}`}
            onPress={() => onRelease(vehicle)}
            style={{ backgroundColor: colors.green, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 }}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Release</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export function InventoryScreen() {
  const {
    vehicles,
    statusCounts,
    currentFilter,
    loading,
    error,
    fetchVehicles,
    addVehicle,
    assignVehicle,
    updateVehicleStatus,
    setFilter,
  } = useVehicles();

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<VehicleInput>({ vehicle_id: '', model: '', registration_number: '', battery_number: '' });
  const [assignRiderId, setAssignRiderId] = useState('');
  const [maintenanceReason, setMaintenanceReason] = useState('');
  const [actionVehicle, setActionVehicle] = useState<Vehicle | null>(null);
  const [actionType, setActionType] = useState<'assign' | 'maintenance' | null>(null);

  useEffect(() => {
    fetchVehicles(currentFilter === 'all' ? undefined : currentFilter);
  }, [currentFilter, fetchVehicles]);

  const handleAdd = useCallback(() => {
    if (!form.vehicle_id || !form.model || !form.registration_number || !form.battery_number) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    addVehicle(form);
    setForm({ vehicle_id: '', model: '', registration_number: '', battery_number: '' });
    setShowAddModal(false);
  }, [form, addVehicle]);

  const handleAssign = useCallback((v: Vehicle) => {
    setActionVehicle(v);
    setActionType('assign');
    setAssignRiderId('');
  }, []);

  const handleMaintenance = useCallback((v: Vehicle) => {
    setActionVehicle(v);
    setActionType('maintenance');
    setMaintenanceReason('');
  }, []);

  const handleRelease = useCallback((v: Vehicle) => {
    updateVehicleStatus(v.id, 'available');
  }, [updateVehicleStatus]);

  const confirmAction = useCallback(() => {
    if (!actionVehicle) return;
    if (actionType === 'assign' && assignRiderId.trim()) {
      assignVehicle(actionVehicle.id, assignRiderId.trim());
    } else if (actionType === 'maintenance') {
      updateVehicleStatus(actionVehicle.id, 'maintenance', maintenanceReason.trim() || undefined);
    }
    setActionVehicle(null);
    setActionType(null);
  }, [actionVehicle, actionType, assignRiderId, maintenanceReason, assignVehicle, updateVehicleStatus]);

  const filtered = currentFilter === 'all' ? vehicles : vehicles.filter((v) => v.status === currentFilter);

  return (
    <View testID="inventory-screen" style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.textMain }}>Inventory</Text>
          <TouchableOpacity
            testID="add-vehicle-button"
            onPress={() => setShowAddModal(true)}
            style={{ backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>+ Add Vehicle</Text>
          </TouchableOpacity>
        </View>

        {/* Status summary */}
        <View testID="status-summary" style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          {(['available', 'rented', 'maintenance'] as VehicleStatus[]).map((s) => (
            <View key={s} style={{ flex: 1, backgroundColor: STATUS_COLORS[s].bg, borderRadius: 8, padding: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: STATUS_COLORS[s].text }}>{statusCounts[s]}</Text>
              <Text style={{ fontSize: 11, color: STATUS_COLORS[s].text, textTransform: 'capitalize' }}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Filters */}
        <View testID="status-filters" style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              testID={`filter-${f}`}
              onPress={() => setFilter(f)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: currentFilter === f ? colors.primary : '#e5e7eb',
              }}
            >
              <Text style={{ color: currentFilter === f ? '#fff' : colors.muted, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' }}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {error && (
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0 }}>
          {filtered.length === 0 ? (
            <Text style={{ textAlign: 'center', color: colors.mutedLight, marginTop: 32 }}>No vehicles found</Text>
          ) : (
            filtered.map((v) => (
              <VehicleCard key={v.id} vehicle={v} onAssign={handleAssign} onMaintenance={handleMaintenance} onRelease={handleRelease} />
            ))
          )}
        </ScrollView>
      )}

      {/* Add Vehicle Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 24 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textMain, marginBottom: 16 }}>Add Vehicle</Text>
            {(['vehicle_id', 'model', 'registration_number', 'battery_number'] as const).map((field) => (
              <TextInput
                key={field}
                testID={`input-${field}`}
                placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                placeholderTextColor={colors.mutedLight}
                value={form[field]}
                onChangeText={(t) => setForm((prev) => ({ ...prev, [field]: t }))}
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 10,
                  fontSize: 14,
                  color: colors.textMain,
                }}
              />
            ))}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#e5e7eb', alignItems: 'center' }}>
                <Text style={{ color: colors.muted, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="confirm-add" onPress={handleAdd} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Assign / Maintenance Modal */}
      <Modal visible={actionVehicle != null} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 24 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textMain, marginBottom: 16 }}>
              {actionType === 'assign' ? 'Assign to Rider' : 'Mark for Maintenance'}
            </Text>
            <TextInput
              testID="action-input"
              placeholder={actionType === 'assign' ? 'Rider ID' : 'Maintenance reason'}
              placeholderTextColor={colors.mutedLight}
              value={actionType === 'assign' ? assignRiderId : maintenanceReason}
              onChangeText={actionType === 'assign' ? setAssignRiderId : setMaintenanceReason}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
                fontSize: 14,
                color: colors.textMain,
              }}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => { setActionVehicle(null); setActionType(null); }} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#e5e7eb', alignItems: 'center' }}>
                <Text style={{ color: colors.muted, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="confirm-action" onPress={confirmAction} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
