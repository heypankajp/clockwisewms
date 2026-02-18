import { db } from './db';
import { Employee } from './types';

// Simulate Session
export const loginAsManager = async (email: string): Promise<Employee | null> => {
    const users = await db.getEmployees();
    const user = users.find(u => u.email === email && (u.role !== 'EMPLOYEE'));
    return user || null;
};

export const loginAsEmployee = async (pin: string): Promise<Employee | null> => {
    const user = await db.getEmployeeByPin(pin);
    return user || null;
};
