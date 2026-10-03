-- Jalankan di Supabase SQL Editor untuk menambah fitur Tagihan Supplier

create table invoices (
  id uuid primary key default uuid_generate_v4(),
  supplier_name text not null,
  invoice_number text,
  category text default 'material', -- material, jasa
  amount numeric not null,
  invoice_date date default current_date,
  due_date date not null,
  status text default 'unpaid', -- unpaid, paid
  keterangan text,
  created_at timestamptz default now()
);

alter table invoices enable row level security;

create policy "authenticated_all_invoices" on invoices
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
