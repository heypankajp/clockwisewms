export type Role = 'ADMIN' | 'TALENT_MANAGER' | 'SHIFT_SUPERVISOR' | 'CLIENT_MANAGER' | 'EMPLOYEE';

export interface Employee {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: Role;
    pinCode: string; // 6-digit PIN for TimeClock
    wage: number;
    paymentMode: 'HOURLY' | 'SALARY';
    workAuthorization?: string;
    avatarUrl?: string;
}

export interface Client {
    id: string;
    name: string;
    address: string;
    geoFenceRadius: number; // in meters (default 150ft ~ 45m)
    latitude: number;
    longitude: number;
    autoClockOutMinutes: number; // e.g. 600 mins (10 hours)
    breakDurationMinutes: number; // default 30
}

export interface Shift {
    id: string;
    clientId: string;
    employeeId: string; // Assigned employee
    startTime: string; // ISO
    endTime: string; // ISO
    status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export interface AttendanceRecord {
    id: string;
    shiftId?: string;
    employeeId: string;
    clientId: string;
    clockInTime: string;
    clockOutTime?: string;
    clockInLocation: { lat: number, lng: number };
    clockOutLocation?: { lat: number, lng: number };
    photoUrl?: string; // Mock URL for captured photo
    method: 'PIN' | 'FINGERPRINT' | 'MOBILE_APP' | 'PROXY';
    isVerified: boolean;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    actorId: string;
    action: string;
    details: string;
}
