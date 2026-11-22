import supabase from "@/lib/supabaseClient";

export async function listRequisitions(organizationId) {
  return supabase.from("requisitions")
    .select("id,requisition_code,title,status,openings,created_at,departments(name),locations(name)")
    .eq("organization_id", organizationId).order("created_at", { ascending: false });
}

export async function getRequisition(id, organizationId) {
  return supabase.from("requisitions")
    .select("*,departments(name),locations(name)")
    .eq("id", id).eq("organization_id", organizationId).single();
}

export async function submitRequisition(id) {
  return supabase.rpc("submit_requisition", { _requisition_id: id });
}

export async function reviewRequisition(id, decision, comment) {
  return supabase.rpc("review_requisition", { _requisition_id: id, _decision: decision, _comment: comment || null });
}
