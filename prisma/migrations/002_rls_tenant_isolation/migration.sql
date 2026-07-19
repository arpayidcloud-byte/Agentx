-- Phase 4.1: Row Level Security for tenant isolation (Vol 10 Ch. 1)

-- Add tenantId columns to tables that need them
ALTER TABLE "AuditEvent" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "CostRecord" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;

-- Enable RLS on tenant-aware tables
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CostRecord" ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies
CREATE POLICY tenant_isolation ON "Task"
  USING ("tenantId" = current_setting('app.current_tenant_id')::text);

CREATE POLICY tenant_isolation ON "AuditEvent"
  USING ("tenantId" = current_setting('app.current_tenant_id')::text);

CREATE POLICY tenant_isolation ON "CostRecord"
  USING ("tenantId" = current_setting('app.current_tenant_id')::text);

-- Force RLS for table owners too
ALTER TABLE "Task" FORCE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" FORCE ROW LEVEL SECURITY;
ALTER TABLE "CostRecord" FORCE ROW LEVEL SECURITY;
