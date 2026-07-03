
# Lockout/Tagout (LOTO)

## Overview
This workflow defines the procedure for isolating hazardous energy sources on process equipment before servicing or maintenance, in compliance with OSHA-KR Article 38 (안전조치). LOTO covers electrical, mechanical, hydraulic, pneumatic, thermal, and chemical energy isolation to prevent the unexpected release of stored or residual energy while workers are exposed.

## Scope
All maintenance, repair, or inspection work on process equipment that requires the isolation of one or more hazardous energy sources requires a LOTO permit issued under this workflow. LOTO is triggered in one of two ways:
- **Routine maintenance / permit-to-work**: a maintenance request identifies equipment requiring energy isolation before work can begin.
- **Asset-integrity finding**: `asset-integrity-agent` flags equipment as unsafe during an inspection, requiring immediate isolation before further handling. In this case the triggering inspection record is referenced via `asset_integrity_trigger_ref` in the evidence model.

This workflow supports **Group LOTO** — multiple crews or contractors working on the same piece of equipment simultaneously, each applying and controlling their own lock at a shared isolation point, so that no single crew can re-energize equipment while another crew is still exposed. This is essential for turnaround/TAR (대정수) scenarios where many contractors work the same equipment in parallel.

## Procedure

### 1. Pre-Work Energy Source Identification
- Identify all hazardous energy sources associated with the equipment (electrical, mechanical, hydraulic, pneumatic, thermal, chemical).
- Reference the applicable risk assessment to confirm which energy sources are hazardous for this equipment; record the reference under `risk_assessment_ref`.
- If this LOTO is triggered by an asset-integrity finding rather than routine maintenance, record the triggering inspection record under `asset_integrity_trigger_ref`.

### 2. Isolation Point Application
- Identify and label each isolation point (e.g., breaker, valve, disconnect) required to de-energize the equipment.
- Each crew or contractor working the equipment applies their own lock and tag at the relevant isolation point(s); do not share locks or keys across crews.
- Record every isolation point applied under `isolation_points`, including the point ID, location, the person who applied the lock, the lock ID, and the timestamp.
- If more than one crew or contractor applies separate locks to the same equipment (Group LOTO), set `group_lockout` to true.

### 3. Zero-Energy Verification
- Before work begins, verify that all identified energy sources have been reduced to zero energy state (e.g., voltage testing, pressure bleed-down, gravity/spring energy checks).
- Record the name of the person who performed and confirmed the zero-energy verification under `verified_zero_energy_by`. Work may only proceed once zero-energy state is confirmed.

### 4. Work Execution
- Perform the maintenance, repair, or inspection work only within the scope covered by the applied isolation.
- If additional energy sources are discovered during work, stop work and return to Step 1 to reassess and apply additional isolation points.

### 5. Lock Removal and Restoration Sign-off
- Each crew or contractor removes only their own lock upon completion of their portion of the work.
- Equipment may only be restored to service after all locks from all crews have been removed and accounted for.
- The person confirming full lock removal and safe restoration signs off under `removal_confirmed_by`, and the permit is closed under `closure_signature`.
- Retain completed LOTO permits as evidence records for PSM compliance audits.
