import { Request, Response } from 'express';
import pool from '../config/db';


const getStartOfYesterday = (): Date => {
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
    return yesterday;
};

const formatEventTime = (timestampMs: number): string => {
    const now = Date.now();
    const eventDate = new Date(timestampMs);
    const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const diffHours = (now - timestampMs) / (1000 * 60 * 60);

    if (diffHours < 1) {
        const mins = Math.max(1, Math.floor((now - timestampMs) / (1000 * 60)));
        return `${mins} min${mins > 1 ? 's' : ''} ago`;
    } else if (eventDate.getDate() === new Date().getDate()) {
        return `Today at ${timeStr}`;
    } else {
        return `Yesterday at ${timeStr}`;
    }
};


export const syncExternalAlerts = async (): Promise<any[]> => {
    const yesterdayCutoff = getStartOfYesterday().getTime(); // Only keep today + yesterday

    
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

            const pagasaTitle = `PAGASA Live Observation: ${temp}°C, Wind ${windSpeed} km/h`;
            const pagasaDesc = `Real-time Atmospheric Data: Temperature is ${temp}°C, Wind Speed: ${windSpeed} km/h (Gusts up to ${windGusts} km/h), Rain Precipitation: ${rain} mm/h. Source: PAGASA Live Station.`;
            const pagasaSeverity = windGusts > 40 || rain > 5 ? 'critical' : windSpeed > 20 || rain > 0.5 ? 'warning' : 'info';
            const pagasaUrl = 'https://www.pagasa.dost.gov.ph/weather';

            const existingPagasa = await pool.query(
                `SELECT warning_id FROM early_warning WHERE source = 'PAGASA Weather Portal' ORDER BY warning_id DESC`
            );

            if (existingPagasa.rows.length === 0) {
                await pool.query(
                    `INSERT INTO early_warning (title, description, severity, type, source, source_url)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [pagasaTitle, pagasaDesc, pagasaSeverity, 'Typhoon', 'PAGASA Weather Portal', pagasaUrl]
                );
            } else {
                const keepId = existingPagasa.rows[0].warning_id;
                
                await pool.query(
                    `UPDATE early_warning 
                     SET title = $1, description = $2, severity = $3, source_url = $4, created_at = CURRENT_TIMESTAMP 
                     WHERE warning_id = $5`,
                    [pagasaTitle, pagasaDesc, pagasaSeverity, pagasaUrl, keepId]
                );
                
                await pool.query(
                    `DELETE FROM early_warning WHERE source = 'PAGASA Weather Portal' AND warning_id != $1`,
                    [keepId]
                );
            }
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

                
                if (eventTimeMs < yesterdayCutoff) {
                    continue;
                }

                const mag = props.mag || 0;
                const place = props.place || 'Philippines region';
                const eventTitle = props.title || `Magnitude ${mag.toFixed(1)} - ${place}`;
                const eventDesc = `Real-time Seismic Event: Earthquake of Magnitude ${mag.toFixed(1)} recorded near ${place}. Depth: ${item.geometry.coordinates[2]} km. Coordinates: [${item.geometry.coordinates[1].toFixed(2)}, ${item.geometry.coordinates[0].toFixed(2)}].`;
                const severity = mag >= 5.5 ? 'critical' : mag >= 4.0 ? 'warning' : 'info';
                const eventUrl = props.url || 'https://earthquake.usgs.gov/earthquakes/map/';

                const existingEq = await pool.query(
                    `SELECT warning_id FROM early_warning WHERE title = $1 AND source = $2`,
                    [eventTitle, 'PHIVOLCS / USGS Seismic Network']
                );

                if (existingEq.rows.length === 0) {
                    await pool.query(
                        `INSERT INTO early_warning (title, description, severity, type, source, source_url)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [eventTitle, eventDesc, severity, 'Earthquake', 'PHIVOLCS / USGS Seismic Network', eventUrl]
                    );
                } else {
                    await pool.query(
                        `UPDATE early_warning SET source_url = $1 WHERE warning_id = $2`,
                        [eventUrl, existingEq.rows[0].warning_id]
                    );
                }
            }
        }
    } catch (err) {
        console.error('PHIVOLCS live fetch error:', err);
    }

    
    try {
        await pool.query(`DELETE FROM early_warning WHERE created_at < (CURRENT_DATE - INTERVAL '1 day');`);
    } catch (err) {
        console.error('Error purging old alerts:', err);
    }

    return [];
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
                created_at
            FROM early_warning
            WHERE created_at >= (CURRENT_DATE - INTERVAL '1 day')
            ORDER BY created_at DESC, warning_id DESC
            LIMIT 25
        `);

        
        const alerts = result.rows.map(row => ({
            ...row,
            time: formatEventTime(new Date(row.created_at).getTime())
        }));

        res.status(200).json({
            alerts
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
                created_at
            FROM early_warning
            WHERE created_at >= (CURRENT_DATE - INTERVAL '1 day')
            ORDER BY created_at DESC, warning_id DESC
            LIMIT 25
        `);

        const alerts = result.rows.map(row => ({
            ...row,
            time: formatEventTime(new Date(row.created_at).getTime())
        }));

        res.status(200).json({
            message: 'Recent live PAGASA & PHIVOLCS data synced successfully to database',
            alerts
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

        const defaultUrl = (source && source.toLowerCase().includes('phivolcs')) || type === 'Earthquake' || type === 'Volcano'
            ? 'https://earthquake.usgs.gov/earthquakes/map/'
            : 'https://www.pagasa.dost.gov.ph/weather';

        const result = await pool.query(
            `INSERT INTO early_warning (title, description, severity, type, source, source_url)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING warning_id as id, title, description, severity, type, source, source_url, created_at`,
            [
                title,
                description,
                severity || 'warning',
                type || 'General',
                source || 'Barangay DRRM Office',
                source_url || defaultUrl
            ]
        );

        const row = result.rows[0];
        res.status(201).json({
            message: 'Alert published successfully',
            alert: {
                ...row,
                time: formatEventTime(new Date(row.created_at).getTime())
            }
        });
    } catch (error: any) {
        console.error('Create early warning error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};
