export class ClientInfo {
    public config?: {
        gps: boolean;
        imu: boolean;
        magnetometer: boolean;
    };
    public name!: string;
    public position!: number[];
    public versions?: {
        firmware: string;
        pcb: string;
    };
}
