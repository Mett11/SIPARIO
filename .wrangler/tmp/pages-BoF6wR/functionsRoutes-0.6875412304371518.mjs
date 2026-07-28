import { onRequestPost as __api_admin_prenotazioni__id__check_in_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\prenotazioni\\[id]\\check-in.ts"
import { onRequestPost as __api_admin_prenotazioni__id__resend_email_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\prenotazioni\\[id]\\resend-email.ts"
import { onRequestPatch as __api_admin_prenotazioni__id__status_ts_onRequestPatch } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\prenotazioni\\[id]\\status.ts"
import { onRequestGet as __api_public_performances__id__availability_ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\public\\performances\\[id]\\availability.ts"
import { onRequestPost as __api_admin_prenotazioni_export_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\prenotazioni\\export.ts"
import { onRequestDelete as __api_admin_prenotazioni__id__ts_onRequestDelete } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\prenotazioni\\[id].ts"
import { onRequestGet as __api_admin_prenotazioni__id__ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\prenotazioni\\[id].ts"
import { onRequestPost as __api_blog__id__publish_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\blog\\[id]\\publish.ts"
import { onRequestPost as __api_spettacoli__id__publish_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\spettacoli\\[id]\\publish.ts"
import { onRequestGet as __api_admin_booking_settings_ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\booking-settings.ts"
import { onRequestPut as __api_admin_booking_settings_ts_onRequestPut } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\booking-settings.ts"
import { onRequestPost as __api_admin_login_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\login.ts"
import { onRequestPost as __api_admin_logout_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\logout.ts"
import { onRequestGet as __api_admin_me_ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\me.ts"
import { onRequestGet as __api_admin_prenotazioni_ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\prenotazioni.ts"
import { onRequestPost as __api_media_upload_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\media\\upload.ts"
import { onRequestDelete as __api_blog__id__ts_onRequestDelete } from "C:\\Progetti\\Il Sipario\\functions\\api\\blog\\[id].ts"
import { onRequestPut as __api_blog__id__ts_onRequestPut } from "C:\\Progetti\\Il Sipario\\functions\\api\\blog\\[id].ts"
import { onRequestDelete as __api_cast__id__ts_onRequestDelete } from "C:\\Progetti\\Il Sipario\\functions\\api\\cast\\[id].ts"
import { onRequestPut as __api_cast__id__ts_onRequestPut } from "C:\\Progetti\\Il Sipario\\functions\\api\\cast\\[id].ts"
import { onRequestDelete as __api_media__id__ts_onRequestDelete } from "C:\\Progetti\\Il Sipario\\functions\\api\\media\\[id].ts"
import { onRequestDelete as __api_performances__id__ts_onRequestDelete } from "C:\\Progetti\\Il Sipario\\functions\\api\\performances\\[id].ts"
import { onRequestPut as __api_performances__id__ts_onRequestPut } from "C:\\Progetti\\Il Sipario\\functions\\api\\performances\\[id].ts"
import { onRequestDelete as __api_spettacoli__id__ts_onRequestDelete } from "C:\\Progetti\\Il Sipario\\functions\\api\\spettacoli\\[id].ts"
import { onRequestGet as __api_spettacoli__id__ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\spettacoli\\[id].ts"
import { onRequestPut as __api_spettacoli__id__ts_onRequestPut } from "C:\\Progetti\\Il Sipario\\functions\\api\\spettacoli\\[id].ts"
import { onRequestGet as __api_audit_logs_index_ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\audit-logs\\index.ts"
import { onRequestGet as __api_blog_index_ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\blog\\index.ts"
import { onRequestPost as __api_blog_index_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\blog\\index.ts"
import { onRequestGet as __api_cast_index_ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\cast\\index.ts"
import { onRequestPost as __api_cast_index_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\cast\\index.ts"
import { onRequestGet as __api_media_index_ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\media\\index.ts"
import { onRequestGet as __api_performances_index_ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\performances\\index.ts"
import { onRequestPost as __api_performances_index_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\performances\\index.ts"
import { onRequestPost as __api_prenota_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\prenota.ts"
import { onRequestGet as __api_site_config_index_ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\site-config\\index.ts"
import { onRequestPut as __api_site_config_index_ts_onRequestPut } from "C:\\Progetti\\Il Sipario\\functions\\api\\site-config\\index.ts"
import { onRequestGet as __api_spettacoli_index_ts_onRequestGet } from "C:\\Progetti\\Il Sipario\\functions\\api\\spettacoli\\index.ts"
import { onRequestPost as __api_spettacoli_index_ts_onRequestPost } from "C:\\Progetti\\Il Sipario\\functions\\api\\spettacoli\\index.ts"
import { onRequest as __api_admin__middleware_ts_onRequest } from "C:\\Progetti\\Il Sipario\\functions\\api\\admin\\_middleware.ts"

export const routes = [
    {
      routePath: "/api/admin/prenotazioni/:id/check-in",
      mountPath: "/api/admin/prenotazioni/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_prenotazioni__id__check_in_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/prenotazioni/:id/resend-email",
      mountPath: "/api/admin/prenotazioni/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_prenotazioni__id__resend_email_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/prenotazioni/:id/status",
      mountPath: "/api/admin/prenotazioni/:id",
      method: "PATCH",
      middlewares: [],
      modules: [__api_admin_prenotazioni__id__status_ts_onRequestPatch],
    },
  {
      routePath: "/api/public/performances/:id/availability",
      mountPath: "/api/public/performances/:id",
      method: "GET",
      middlewares: [],
      modules: [__api_public_performances__id__availability_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/prenotazioni/export",
      mountPath: "/api/admin/prenotazioni",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_prenotazioni_export_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/prenotazioni/:id",
      mountPath: "/api/admin/prenotazioni",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_prenotazioni__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/admin/prenotazioni/:id",
      mountPath: "/api/admin/prenotazioni",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_prenotazioni__id__ts_onRequestGet],
    },
  {
      routePath: "/api/blog/:id/publish",
      mountPath: "/api/blog/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_blog__id__publish_ts_onRequestPost],
    },
  {
      routePath: "/api/spettacoli/:id/publish",
      mountPath: "/api/spettacoli/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_spettacoli__id__publish_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/booking-settings",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_booking_settings_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/booking-settings",
      mountPath: "/api/admin",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_booking_settings_ts_onRequestPut],
    },
  {
      routePath: "/api/admin/login",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_login_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/logout",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_logout_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/me",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_me_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/prenotazioni",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_prenotazioni_ts_onRequestGet],
    },
  {
      routePath: "/api/media/upload",
      mountPath: "/api/media",
      method: "POST",
      middlewares: [],
      modules: [__api_media_upload_ts_onRequestPost],
    },
  {
      routePath: "/api/blog/:id",
      mountPath: "/api/blog",
      method: "DELETE",
      middlewares: [],
      modules: [__api_blog__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/blog/:id",
      mountPath: "/api/blog",
      method: "PUT",
      middlewares: [],
      modules: [__api_blog__id__ts_onRequestPut],
    },
  {
      routePath: "/api/cast/:id",
      mountPath: "/api/cast",
      method: "DELETE",
      middlewares: [],
      modules: [__api_cast__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/cast/:id",
      mountPath: "/api/cast",
      method: "PUT",
      middlewares: [],
      modules: [__api_cast__id__ts_onRequestPut],
    },
  {
      routePath: "/api/media/:id",
      mountPath: "/api/media",
      method: "DELETE",
      middlewares: [],
      modules: [__api_media__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/performances/:id",
      mountPath: "/api/performances",
      method: "DELETE",
      middlewares: [],
      modules: [__api_performances__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/performances/:id",
      mountPath: "/api/performances",
      method: "PUT",
      middlewares: [],
      modules: [__api_performances__id__ts_onRequestPut],
    },
  {
      routePath: "/api/spettacoli/:id",
      mountPath: "/api/spettacoli",
      method: "DELETE",
      middlewares: [],
      modules: [__api_spettacoli__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/spettacoli/:id",
      mountPath: "/api/spettacoli",
      method: "GET",
      middlewares: [],
      modules: [__api_spettacoli__id__ts_onRequestGet],
    },
  {
      routePath: "/api/spettacoli/:id",
      mountPath: "/api/spettacoli",
      method: "PUT",
      middlewares: [],
      modules: [__api_spettacoli__id__ts_onRequestPut],
    },
  {
      routePath: "/api/audit-logs",
      mountPath: "/api/audit-logs",
      method: "GET",
      middlewares: [],
      modules: [__api_audit_logs_index_ts_onRequestGet],
    },
  {
      routePath: "/api/blog",
      mountPath: "/api/blog",
      method: "GET",
      middlewares: [],
      modules: [__api_blog_index_ts_onRequestGet],
    },
  {
      routePath: "/api/blog",
      mountPath: "/api/blog",
      method: "POST",
      middlewares: [],
      modules: [__api_blog_index_ts_onRequestPost],
    },
  {
      routePath: "/api/cast",
      mountPath: "/api/cast",
      method: "GET",
      middlewares: [],
      modules: [__api_cast_index_ts_onRequestGet],
    },
  {
      routePath: "/api/cast",
      mountPath: "/api/cast",
      method: "POST",
      middlewares: [],
      modules: [__api_cast_index_ts_onRequestPost],
    },
  {
      routePath: "/api/media",
      mountPath: "/api/media",
      method: "GET",
      middlewares: [],
      modules: [__api_media_index_ts_onRequestGet],
    },
  {
      routePath: "/api/performances",
      mountPath: "/api/performances",
      method: "GET",
      middlewares: [],
      modules: [__api_performances_index_ts_onRequestGet],
    },
  {
      routePath: "/api/performances",
      mountPath: "/api/performances",
      method: "POST",
      middlewares: [],
      modules: [__api_performances_index_ts_onRequestPost],
    },
  {
      routePath: "/api/prenota",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_prenota_ts_onRequestPost],
    },
  {
      routePath: "/api/site-config",
      mountPath: "/api/site-config",
      method: "GET",
      middlewares: [],
      modules: [__api_site_config_index_ts_onRequestGet],
    },
  {
      routePath: "/api/site-config",
      mountPath: "/api/site-config",
      method: "PUT",
      middlewares: [],
      modules: [__api_site_config_index_ts_onRequestPut],
    },
  {
      routePath: "/api/spettacoli",
      mountPath: "/api/spettacoli",
      method: "GET",
      middlewares: [],
      modules: [__api_spettacoli_index_ts_onRequestGet],
    },
  {
      routePath: "/api/spettacoli",
      mountPath: "/api/spettacoli",
      method: "POST",
      middlewares: [],
      modules: [__api_spettacoli_index_ts_onRequestPost],
    },
  {
      routePath: "/api/admin",
      mountPath: "/api/admin",
      method: "",
      middlewares: [__api_admin__middleware_ts_onRequest],
      modules: [],
    },
  ]