-- Jalankan seluruh isi file ini di Supabase Dashboard > SQL Editor > New query

create extension if not exists "uuid-ossp";

create table quotations (
  id uuid primary key default uuid_generate_v4(),
  project_name text not null,
  client_name text not null,
  submit_date date default current_date,
  status text default 'draft', -- draft, submitted, approved, rejected
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table purchase_orders (
  id uuid primary key default uuid_generate_v4(),
  quotation_id uuid references quotations(id) on delete cascade,
  po_number text not null,
  status text default 'pending', -- pending, received, cancelled
  po_date date default current_date,
  created_at timestamptz default now()
);

create table documents (
  id uuid primary key default uuid_generate_v4(),
  quotation_id uuid references quotations(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  doc_type text,
  uploaded_at timestamptz default now()
);

create table payments (
  id uuid primary key default uuid_generate_v4(),
  po_id uuid references purchase_orders(id) on delete cascade,
  amount numeric not null,
  payment_date date default current_date,
  status text default 'unpaid', -- unpaid, partial, paid
  created_at timestamptz default now()
);

-- Aktifkan Row Level Security
alter table quotations enable row level security;
alter table purchase_orders enable row level security;
alter table documents enable row level security;
alter table payments enable row level security;

-- Izinkan semua akses untuk user yang sudah login (tim internal)
create policy "authenticated_all_quotations" on quotations
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated_all_po" on purchase_orders
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated_all_documents" on documents
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated_all_payments" on payments
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Catatan: setelah menjalankan SQL ini, buat juga Storage bucket bernama "documents"
-- lewat menu Storage di Supabase Dashboard, dan set bucket menjadi public
-- agar link file dokumen bisa dibuka langsung dari dashboard.
