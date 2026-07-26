import { Request, Response } from 'express';
import pool from '../config/db';


const formatEventTime = (timestampMs: number): string => {
    const now = Date.now();
    const eventDate = new Date(timestampMs);
    const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const diffHours = (now - timestampMs) / (1000 * 60 * 60);

    if (diffHours < 1) {
        const mins = Math.max(1, Math.floor((now - timestampMs) / (1000 * 60)));
        return `${mins} min${mins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24 && eventDate.getDate() === new Date().getDate()) {
        return `Today at ${timeStr}`;
    } else if (diffHours < 48) {
        return `Yesterday at ${timeStr}`;
    } else {
        return eventDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ` at ${timeStr}`;
    }
};


export const syncExternalAlerts = async (): Promise<any[]> => {
    const liveAlerts: any[] = [];
    const now = Date.now();
    const twoDaysAgo = now - (48 * 60 * 60 * 1000); 

   
    try {
        const pagasaRes = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,wind_gusts_10m&timezone=Asia%2FManila'
        );

        if (pagasaRes.ok) {
            const data = await pagasaRes.json();
            const current = data.current;
            const temp = current.temperature_2m;
            const windSpeed = current.wind_speed_10m;
            const windGusts = current.wind_gusts_10m;
            const rain = current.rain || 0;

           
            const obsTimeMs = current.time ? new Date(current.time).getTime() : now;
            const timeStr = formatEventTime(obsTimeMs);
            const pagasaUrl = 'https://www.pagasa.dost.gov.ph/weather';

            liveAlerts.push({
                title: `PAGASA Live Observation: ${temp}°C, Wind ${windSpeed} km/h`,
                description: `Real-time Atmospheric Data: Temperature is ${temp}°C, Wind Speed: ${windSpeed} km/h (Gusts up to ${windGusts} km/h), Rain Precipitation: ${rain} mm/h. Source: PAGASA Live Station.`,
                severity: windGusts > 40 || rain > 5 ? 'critical' : windSpeed > 20 || rain > 0.5 ? 'warning' : 'info',
                type: 'Typhoon',
                source: 'PAGASA Weather Portal',
                source_url: pagasaUrl,
                issued_at: timeStr
            });
        }
    } catch (err) {
        console.error('PAGASA live fetch error:', err);
    }

    
    try {
        const eqRes = await fetch(
            'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=4&maxlatitude=21&minlongitude=116&maxlongitude=127&orderby=time&limit=15'
        );

        if (eqRes.ok) {
            const eqData = await eqRes.json();
            const features = eqData.features || [];

            for (const item of features) {
                const props = item.properties;
                const eventTimeMs = props.time || 0;

                
                if (eventTimeMs < twoDaysAgo) {
                    continue;
                }

                const mag = props.mag || 0;
                const place = props.place || 'Philippines region';
                
                const eventTimeStr = formatEventTime(eventTimeMs);
                const eventUrl = props.url || 'https://earthquake.usgs.gov/earthquakes/map/';

                liveAlerts.push({
                    title: props.title || `Magnitude ${mag.toFixed(1)} - ${place}`,
                    description: `Real-time Seismic Event: Earthquake of Magnitude ${mag.toFixed(1)} recorded near ${place}. Depth: ${item.geometry.coordinates[2]} km. Coordinates: [${item.geometry.coordinates[1].toFixed(2)}, ${item.geometry.coordinates[0].toFixed(2)}].`,
                    severity: mag >= 5.5 ? 'critical' : mag >= 4.0 ? 'warning' : 'info',
                    type: 'Earthquake',
                    source: 'PHIVOLCS / USGS Seismic Network',
                    source_url: eventUrl,
                    issued_at: eventTimeStr
                });
            }
        }
    } catch (err) {
        console.error('PHIVOLCS live fetch error:', err);
    }

    
    try {
        await pool.query(`DELETE FROM early_warning WHERE created_at < NOW() - INTERVAL '2 days';`);
    } catch (err) {
        console.error('Error purging old alerts:', err);
    }

    
    for (const alert of liveAlerts) {
        const existing = await pool.query(
            `SELECT warning_id FROM early_warning WHERE title = $1 AND source = $2`,
            [alert.title, alert.source]
        );

        if (existing.rows.length === 0) {
            await pool.query(
                `INSERT INTO early_warning (title, description, severity, type, source, source_url, issued_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [alert.title, alert.description, alert.severity, alert.type, alert.source, alert.source_url, alert.issued_at]
            );
        } else {
           
            await pool.query(
                `UPDATE early_warning SET source_url = $1 WHERE title = $2 AND source = $3`,
                [alert.source_url, alert.title, alert.source]
            );
        }
    }

    return liveAlerts;
};


export const getEarlyWarnings = async (req: Request, res: Response): Promise<void> => {
    try {
        await syncExternalAlerts();

        const result = await pool.query(`
            SELECT 
                warning_id as id, 
                title, 
                description, 
                severity, 
                type, 
                source, 
                COALESCE(
                    source_url, 
                    CASE 
                        WHEN source ILIKE '%PHIVOLCS%' OR type IN ('Earthquake', 'Volcano') THEN 'https://earthquake.usgs.gov/earthquakes/map/'
                        ELSE 'https://www.pagasa.dost.gov.ph/weather'
                    END
                ) as source_url, 
                issued_at as time, 
                created_at
            FROM early_warning
            WHERE created_at >= NOW() - INTERVAL '2 days'
            ORDER BY 
                CASE 
                    WHEN issued_at ILIKE 'Today%' OR issued_at ILIKE '%ago' THEN 1 
                    WHEN issued_at ILIKE 'Yesterday%' THEN 2 
                    ELSE 3 
                END ASC,
                created_at DESC,
                warning_id DESC
            LIMIT 25
        `);

        res.status(200).json({
            alerts: result.rows
        });
    } catch (error: any) {
        console.error('Get early warnings error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};


export const syncEarlyWarnings = async (req: Request, res: Response): Promise<void> => {
    try {
        await syncExternalAlerts();

        const result = await pool.query(`
            SELECT 
                warning_id as id, 
                title, 
                description, 
                severity, 
                type, 
                source, 
                COALESCE(
                    source_url, 
                    CASE 
                        WHEN source ILIKE '%PHIVOLCS%' OR type IN ('Earthquake', 'Volcano') THEN 'https://earthquake.usgs.gov/earthquakes/map/'
                        ELSE 'https://www.pagasa.dost.gov.ph/weather'
                    END
                ) as source_url, 
                issued_at as time, 
                created_at
            FROM early_warning
            WHERE created_at >= NOW() - INTERVAL '2 days'
            ORDER BY 
                CASE 
                    WHEN issued_at ILIKE 'Today%' OR issued_at ILIKE '%ago' THEN 1 
                    WHEN issued_at ILIKE 'Yesterday%' THEN 2 
                    ELSE 3 
                END ASC,
                created_at DESC,
                warning_id DESC
            LIMIT 25
        `);

        res.status(200).json({
            message: 'Recent live PAGASA & PHIVOLCS data synced successfully to database',
            alerts: result.rows
        });
    } catch (error: any) {
        console.error('Sync early warnings error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};


export const createEarlyWarning = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, severity, type, source, source_url } = req.body;

        if (!title || !description) {
            res.status(400).json({ error: 'Title and description are required' });
            return;
        }

        const timeStr = `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const defaultUrl = (source && source.toLowerCase().includes('phivolcs')) || type === 'Earthquake' || type === 'Volcano'
            ? 'https://earthquake.usgs.gov/earthquakes/map/'
            : 'https://www.pagasa.dost.gov.ph/weather';

        const result = await pool.query(
            `INSERT INTO early_warning (title, description, severity, type, source, source_url, issued_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING warning_id as id, title, description, severity, type, source, source_url, issued_at as time, created_at`,
            [
                title,
                description,
                severity || 'warning',
                type || 'General',
                source || 'Barangay DRRM Office',
                source_url || defaultUrl,
                timeStr
            ]
        );

        res.status(201).json({
            message: 'Alert published successfully',
            alert: result.rows[0]
        });
    } catch (error: any) {
        console.error('Create early warning error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};
