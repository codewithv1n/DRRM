import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';


function parseDMS(dmsStr: string): { lat: number, lon: number } | null {
    if (!dmsStr) return null;
    
    
    const regex = /(\d+)[°\s]+(\d+)['\s]+([\d.]+)["\s]+([NS])[\s,]+(\d+)[°\s]+(\d+)['\s]+([\d.]+)["\s]+([EW])/i;
    const match = dmsStr.match(regex);
    if (!match) return null;

    const latDeg = parseInt(match[1]!);
    const latMin = parseInt(match[2]!);
    const latSec = parseFloat(match[3]!);
    const latDir = match[4]!.toUpperCase();

    const lonDeg = parseInt(match[5]!);
    const lonMin = parseInt(match[6]!);
    const lonSec = parseFloat(match[7]!);
    const lonDir = match[8]!.toUpperCase();

    let lat = latDeg + latMin / 60 + latSec / 3600;
    if (latDir === 'S') lat = -lat;

    let lon = lonDeg + lonMin / 60 + lonSec / 3600;
    if (lonDir === 'W') lon = -lon;

    return { lat, lon };
}


function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export const getEvacuationCenters = async (req: Request, res: Response) => {
    try {
        const { lat, lon } = req.query;
        let query = 'SELECT * FROM evacuation_centers ORDER BY created_at DESC';
        
        const result = await pool.query(query);
        let centers = result.rows;

        // If lat and lon are provided, calculate distance and sort
        if (lat && lon) {
            const userLat = parseFloat(lat as string);
            const userLon = parseFloat(lon as string);

            centers = centers.map(center => {
                const parsedCoords = parseDMS(center.coordinates);
                if (parsedCoords) {
                    const distance = calculateDistance(userLat, userLon, parsedCoords.lat, parsedCoords.lon);
                    return { ...center, distance, parsed_lat: parsedCoords.lat, parsed_lon: parsedCoords.lon };
                }
                return { ...center, distance: null };
            });

            // Filter out centers with invalid coordinates and sort by distance nearest to farthest
            centers = centers
                .filter(c => c.distance !== null)
                .sort((a, b) => a.distance - b.distance);
        }

        res.status(200).json({ data: centers });
    } catch (error) {
        console.error('Error fetching evacuation centers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateEvacuationCenterStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
    }

    try {
        const result = await pool.query(
            'UPDATE evacuation_centers SET status = $1 WHERE evacuation_center_id = $2 RETURNING *',
            [status, id]
        );
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Evacuation center not found' });
            return;
        }
        res.status(200).json({ data: result.rows[0] });

        await logAction('Update Evacuation Center', 'Admin', `Evacuation center #${id} status changed to ${status}`, 'Admin');
    } catch (error) {
        console.error('Error updating evacuation center status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const resetEvacuationCenterOccupancy = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            'UPDATE evacuation_centers SET current_occupants = 0 WHERE evacuation_center_id = $1 RETURNING *',
            [id]
        );
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Evacuation center not found' });
            return;
        }
        res.status(200).json({ data: result.rows[0] });

        await logAction('Reset Evacuation Center', 'Barangay Admin', `Evacuation center #${id} occupancy reset to 0`, 'Barangay Admin');
    } catch (error) {
        console.error('Error resetting evacuation center occupancy:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
