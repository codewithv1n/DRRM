export interface ReportIncident {
  incident_id: string;
  type: string;
  created_at: string;
  location: string;
  gps_location: string | null;
  assigned_responder: string | null;
  reporter_name: string;
  contact_number: string;
}

export const generateReportHTML = (incident: ReportIncident) => {
  return `
      <html>
        <head>
          <title>Post-Mission Report - ${incident.incident_id}</title>
          <style>
            body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; background: #f1f5f9; }
            .report-container { background: white; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px; }
            .actions-bar { text-align: right; margin-bottom: 20px; }
            .print-btn { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: background 0.2s; }
            .print-btn:hover { background: #1d4ed8; }
            .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            h1 { color: #0f172a; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 1px; }
            .sub { color: #64748b; font-size: 14px; margin-top: 5px; font-weight: bold; }
            .logo { display: flex; align-items: center; justify-content: center; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 13px; text-transform: uppercase; color: #475569; font-weight: 900; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; letter-spacing: 0.5px; }
            .row { display: flex; margin-bottom: 12px; }
            .label { width: 180px; font-weight: bold; font-size: 14px; color: #334155; }
            .value { flex: 1; font-size: 14px; color: #0f172a; }
            .box { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.6; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            @media print {
              body { padding: 0; background: white; }
              .report-container { box-shadow: none; padding: 0; }
              .actions-bar { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="actions-bar">
            <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
          </div>
          <div class="report-container">
            <div class="header">
              <div>
                 <h1>Post-Mission Brief</h1>
                 <div class="sub">Official Incident Report Document</div>
              </div>
              <div class="logo">
                 <img src="/logo-system.png" alt="GovServe Logo" style="height: 52px; object-fit: contain;" />
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Incident Details</div>
              <div class="row"><div class="label">Incident ID:</div><div class="value font-mono">${incident.incident_id}</div></div>
              <div class="row"><div class="label">Emergency Type:</div><div class="value" style="font-weight:bold; color:#ef4444;">${incident.type}</div></div>
              <div class="row"><div class="label">Date & Time Reported:</div><div class="value">${new Date(incident.created_at).toLocaleString()}</div></div>
              <div class="row"><div class="label">Incident Location:</div><div class="value">${incident.location}</div></div>
            </div>

            <div class="section">
              <div class="section-title">Response & Dispatch Log</div>
              <div class="row"><div class="label">Assigned Task Force:</div><div class="value" style="font-weight:bold;">${incident.assigned_responder || 'N/A'}</div></div>
              <div class="row"><div class="label">Mission Final Status:</div><div class="value" style="color: #2563eb; font-weight: 900; letter-spacing: 1px;">RESOLVED</div></div>
            </div>

            <div class="section">
              <div class="section-title">Reporter Information</div>
              <div class="row"><div class="label">Reporting Citizen:</div><div class="value">${incident.reporter_name}</div></div>
              <div class="row"><div class="label">Contact Number:</div><div class="value">${incident.contact_number}</div></div>
            </div>
            
            <div class="section">
              <div class="section-title">After-Action Report & Remarks</div>
              <div class="box">
                This emergency incident has been successfully processed and fully resolved by the assigned response units.<br><br>
                <strong>Summary:</strong> All tactical operations have ceased and the area is declared safe. Responding units have returned to base.
                <br><br>
                <em>(Note: Detailed medical logs, casualty counts, and specific after-action remarks submitted by the responders are securely vaulted in the local system audit logs due to privacy regulations.)</em>
              </div>
            </div>

            <div class="footer">
              Disaster Risk Reduction and Management Command Center<br>
              Confidential Document &bull; Generated on: ${new Date().toLocaleString()}
            </div>
          </div>
        </body>
      </html>
  `;
};
