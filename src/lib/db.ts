import { Employee, Client, Shift, AttendanceRecord } from './types';

// Mock Initial Data
const MOCK_EMPLOYEES: Employee[] = [
    {
        id: 'e1', name: 'Admin User', role: 'ADMIN',
        email: 'admin@clockwise.com', pinCode: '000000', wage: 0, paymentMode: 'SALARY'
    },
    {
        id: 'e2', name: 'John Doe', role: 'EMPLOYEE',
        pinCode: '123456', wage: 20, paymentMode: 'HOURLY', avatarUrl: 'https://i.pravatar.cc/150?u=e2'
    },
];

const MOCK_CLIENTS: Client[] = [
    {
        id: 'c1', name: 'Downtown Cafe', address: '123 Main St, New York, NY',
        latitude: 40.7128, longitude: -74.0060,
        geoFenceRadius: 50, autoClockOutMinutes: 480, breakDurationMinutes: 30
    }
];

class MockDatabase {
    private employees: Employee[] = [...MOCK_EMPLOYEES];
    private clients: Client[] = [...MOCK_CLIENTS];
    private shifts: Shift[] = [];
    private attendance: AttendanceRecord[] = [];

    // Employee Methods
    async getEmployees() { return this.employees; }
    async getEmployeeByPin(pin: string) { return this.employees.find(e => e.pinCode === pin); }
    async createEmployee(emp: Employee) { this.employees.push(emp); return emp; }

    // Client Methods
    async getClients() { return this.clients; }
    async createClient(client: Client) { this.clients.push(client); return client; }

    // Shift & Attendance
    async getShifts() { return this.shifts; }
    async createShift(shift: Shift) { this.shifts.push(shift); return shift; }

    async getAttendance() { return this.attendance; }
    async recordAttendance(record: AttendanceRecord) { this.attendance.push(record); return record; }
}

export const db = new MockDatabase();
