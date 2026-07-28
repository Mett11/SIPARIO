export async function onRequestGet(context: any) {
  return new Response(JSON.stringify({ success: true, data: context.data.user }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
