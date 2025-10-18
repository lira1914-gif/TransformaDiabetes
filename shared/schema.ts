import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const intakeForms = pgTable("intake_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  nombre: text("nombre"),
  direccion: text("direccion"),
  ciudad: text("ciudad"),
  estado: text("estado"),
  pais: text("pais"),
  codigoPostal: text("codigo_postal"),
  telefonoDia: text("telefono_dia"),
  telefonoCelular: text("telefono_celular"),
  telefonoNoche: text("telefono_noche"),
  email: text("email"),
  referidoPor: text("referido_por"),
  edad: text("edad"),
  fechaNacimiento: text("fecha_nacimiento"),
  pesoActual: text("peso_actual"),
  pesoHaceAno: text("peso_hace_ano"),
  altura: text("altura"),
  tipoSangre: text("tipo_sangre"),
  pesoNacer: text("peso_nacer"),
  ordenNacimiento: text("orden_nacimiento"),
  estadoCivil: text("estado_civil"),
  ocupacion: text("ocupacion"),
  viajesFuera: text("viajes_fuera"),
  cambiosRecientes: text("cambios_recientes"),
  sistemaGastrointestinal: text("sistema_gastrointestinal"),
  sistemaCardiovascular: text("sistema_cardiovascular"),
  sistemaHormonal: text("sistema_hormonal"),
  sistemaInmunologico: text("sistema_inmunologico"),
  alimentosRegulares: text("alimentos_regulares"),
  dietaEspecial: text("dieta_especial"),
  porcentajeComidasCaseras: text("porcentaje_comidas_caseras"),
  alimentosEvitados: text("alimentos_evitados"),
  sintomasDespuesComer: text("sintomas_despues_comer"),
  frecuenciaEvacuaciones: text("frecuencia_evacuaciones"),
  consistenciaEvacuaciones: text("consistencia_evacuaciones"),
  colorEvacuaciones: text("color_evacuaciones"),
  historialIntoxicaciones: text("historial_intoxicaciones"),
  exposicionQuimicos: text("exposicion_quimicos"),
  ultimaVisitaDental: text("ultima_visita_dental"),
  amalgamasMercurio: text("amalgamas_mercurio"),
  problemasEncias: text("problemas_encias"),
  satisfechoSueno: text("satisfecho_sueno"),
  horasSueno: text("horas_sueno"),
  tiempoConciliarSueno: text("tiempo_conciliar_sueno"),
  estadoAnimo: text("estado_animo"),
  nivelEnergia: text("nivel_energia"),
  momentoMejorBienestar: text("momento_mejor_bienestar"),
  apoyoFamiliar: text("apoyo_familiar"),
  rolEspiritualidad: text("rol_espiritualidad"),
  informacionAdicional: text("informacion_adicional"),
  a1c: text("a1c"),
  colesterolTotal: text("colesterol_total"),
  hdl: text("hdl"),
  ldl: text("ldl"),
  trigliceridos: text("trigliceridos"),
  hemoglobina: text("hemoglobina"),
  otrosAnalisis: text("otros_analisis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertIntakeFormSchema = createInsertSchema(intakeForms).omit({
  id: true,
  createdAt: true,
});

export type InsertIntakeForm = z.infer<typeof insertIntakeFormSchema>;
export type IntakeForm = typeof intakeForms.$inferSelect;

export const dailyLogs = pgTable("daily_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  dia: integer("dia").notNull(),
  fecha: text("fecha").notNull(),
  horaDormir: text("hora_dormir"),
  horaDespertar: text("hora_despertar"),
  vecesDesperto: text("veces_desperto"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDailyLogSchema = createInsertSchema(dailyLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertDailyLog = z.infer<typeof insertDailyLogSchema>;
export type DailyLog = typeof dailyLogs.$inferSelect;

export const dailyLogMoments = pgTable("daily_log_moments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dailyLogId: varchar("daily_log_id").notNull().references(() => dailyLogs.id),
  momento: text("momento").notNull(),
  comida: text("comida"),
  estadoAnimo: text("estado_animo"),
  evacuaciones: text("evacuaciones"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDailyLogMomentSchema = createInsertSchema(dailyLogMoments).omit({
  id: true,
  createdAt: true,
});

export type InsertDailyLogMoment = z.infer<typeof insertDailyLogMomentSchema>;
export type DailyLogMoment = typeof dailyLogMoments.$inferSelect;

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  resumen: text("resumen"),
  hallazgos: text("hallazgos"),
  recomendaciones: text("recomendaciones"),
  fraseFinal: text("frase_final"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
