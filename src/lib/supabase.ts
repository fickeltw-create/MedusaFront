import { neon } from '@neondatabase/serverless';

const neonConnectionString = process.env.DATABASE_URL!;
export const sql = neon(neonConnectionString);

export interface Lead {
  id?: string;
  type: 'quote' | 'financing' | 'distributor' | 'installer' | 'contact';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  model?: string;
  budget?: string;
  region?: string;
  partnership_type?: string;
  message?: string;
  created_at?: string;
}

export interface Reservation {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  model: string;
  stripe_session_id?: string;
  status: 'pending' | 'paid' | 'cancelled';
  amount: number;
  created_at?: string;
}

// Create lead in database
export async function createLead(lead: Omit<Lead, 'id' | 'created_at'>) {
  await sql`
    INSERT INTO leads (type, name, email, phone, company, model, budget, region, partnership_type, message)
    VALUES (${lead.type}, ${lead.name}, ${lead.email}, ${lead.phone}, ${lead.company}, ${lead.model}, ${lead.budget}, ${lead.region}, ${lead.partnership_type}, ${lead.message})
  `;
}

// Create reservation in database
export async function createReservation(reservation: Omit<Reservation, 'id' | 'created_at'>) {
  await sql`
    INSERT INTO reservations (name, email, phone, model, stripe_session_id, status, amount)
    VALUES (${reservation.name}, ${reservation.email}, ${reservation.phone}, ${reservation.model}, ${reservation.stripe_session_id}, ${reservation.status}, ${reservation.amount})
  `;
}

// Update reservation status
export async function updateReservationStatus(
  stripeSessionId: string,
  status: 'pending' | 'paid' | 'cancelled',
  customerEmail?: string,
  houseModel?: string,
) {
  await sql`
    UPDATE reservations
    SET status = ${status}, stripe_session_id = ${stripeSessionId}
    WHERE stripe_session_id = ${stripeSessionId}
      OR (
        ${customerEmail ?? null} IS NOT NULL
        AND ${houseModel ?? null} IS NOT NULL
        AND email = ${customerEmail ?? null}
        AND model = ${houseModel ?? null}
        AND status = 'pending'
      )
  `;
}

// Get all leads (for admin)
export async function getLeads(): Promise<Lead[]> {
  return sql`SELECT * FROM leads ORDER BY created_at DESC` as unknown as Lead[];
}

// Get all reservations (for admin)
export async function getReservations(): Promise<Reservation[]> {
  return sql`SELECT * FROM reservations ORDER BY created_at DESC` as unknown as Reservation[];
}