import { 
  type User, 
  type InsertUser,
  type IntakeForm,
  type InsertIntakeForm,
  type DailyLog,
  type InsertDailyLog,
  type DailyLogMoment,
  type InsertDailyLogMoment,
  type Report,
  type InsertReport,
  type WeeklyCheckin,
  type InsertWeeklyCheckin,
  users,
  intakeForms,
  dailyLogs,
  dailyLogMoments,
  reports,
  weeklyCheckins
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  markEmailAsSentIfNotSent(id: string, emailField: 'day6EmailSent' | 'day8EmailSent' | 'day9EmailSent' | 'day10EmailSent'): Promise<boolean>;
  
  // Intake Forms
  createIntakeForm(intakeForm: InsertIntakeForm): Promise<IntakeForm>;
  getIntakeFormByUserId(userId: string): Promise<IntakeForm | undefined>;
  updateIntakeForm(id: string, data: Partial<InsertIntakeForm>): Promise<IntakeForm | undefined>;
  
  // Daily Logs
  createDailyLog(dailyLog: InsertDailyLog): Promise<DailyLog>;
  getDailyLogsByUserId(userId: string): Promise<DailyLog[]>;
  getDailyLogById(id: string): Promise<DailyLog | undefined>;
  
  // Daily Log Moments
  createDailyLogMoment(moment: InsertDailyLogMoment): Promise<DailyLogMoment>;
  getDailyLogMomentsByLogId(dailyLogId: string): Promise<DailyLogMoment[]>;
  
  // Reports
  createReport(report: InsertReport): Promise<Report>;
  getReportByUserId(userId: string): Promise<Report | undefined>;
  
  // Weekly Checkins
  createWeeklyCheckin(checkin: InsertWeeklyCheckin): Promise<WeeklyCheckin>;
  getWeeklyCheckinsByUserId(userId: string): Promise<WeeklyCheckin[]>;
  getLatestWeeklyCheckin(userId: string): Promise<WeeklyCheckin | undefined>;
}

export class PostgreSQLStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }

  async markEmailAsSentIfNotSent(id: string, emailField: 'day6EmailSent' | 'day8EmailSent' | 'day9EmailSent' | 'day10EmailSent'): Promise<boolean> {
    // Atomic conditional update: only set to true if currently false
    // Returns true if the update succeeded (i.e., this request won the race)
    const result = await db.update(users)
      .set({ [emailField]: true })
      .where(and(
        eq(users.id, id),
        eq(users[emailField], false)
      ))
      .returning();
    
    // If result has rows, the update succeeded (flag was false, now true)
    // If result is empty, flag was already true (another request won)
    return result.length > 0;
  }

  // Intake Forms
  async createIntakeForm(insertIntakeForm: InsertIntakeForm): Promise<IntakeForm> {
    const result = await db.insert(intakeForms).values(insertIntakeForm).returning();
    return result[0];
  }

  async getIntakeFormByUserId(userId: string): Promise<IntakeForm | undefined> {
    const result = await db.select().from(intakeForms).where(eq(intakeForms.userId, userId)).limit(1);
    return result[0];
  }

  async updateIntakeForm(id: string, data: Partial<InsertIntakeForm>): Promise<IntakeForm | undefined> {
    const result = await db.update(intakeForms).set(data).where(eq(intakeForms.id, id)).returning();
    return result[0];
  }

  // Daily Logs
  async createDailyLog(insertDailyLog: InsertDailyLog): Promise<DailyLog> {
    const result = await db.insert(dailyLogs).values(insertDailyLog).returning();
    return result[0];
  }

  async getDailyLogsByUserId(userId: string): Promise<DailyLog[]> {
    return await db.select().from(dailyLogs).where(eq(dailyLogs.userId, userId));
  }

  async getDailyLogById(id: string): Promise<DailyLog | undefined> {
    const result = await db.select().from(dailyLogs).where(eq(dailyLogs.id, id)).limit(1);
    return result[0];
  }

  // Daily Log Moments
  async createDailyLogMoment(insertMoment: InsertDailyLogMoment): Promise<DailyLogMoment> {
    const result = await db.insert(dailyLogMoments).values(insertMoment).returning();
    return result[0];
  }

  async getDailyLogMomentsByLogId(dailyLogId: string): Promise<DailyLogMoment[]> {
    return await db.select().from(dailyLogMoments).where(eq(dailyLogMoments.dailyLogId, dailyLogId));
  }

  // Reports
  async createReport(insertReport: InsertReport): Promise<Report> {
    const result = await db.insert(reports).values(insertReport).returning();
    return result[0];
  }

  async getReportByUserId(userId: string): Promise<Report | undefined> {
    const result = await db.select().from(reports).where(eq(reports.userId, userId)).limit(1);
    return result[0];
  }

  // Weekly Checkins
  async createWeeklyCheckin(insertCheckin: InsertWeeklyCheckin): Promise<WeeklyCheckin> {
    const result = await db.insert(weeklyCheckins).values(insertCheckin).returning();
    return result[0];
  }

  async getWeeklyCheckinsByUserId(userId: string): Promise<WeeklyCheckin[]> {
    return await db.select().from(weeklyCheckins).where(eq(weeklyCheckins.userId, userId)).orderBy(desc(weeklyCheckins.createdAt));
  }

  async getLatestWeeklyCheckin(userId: string): Promise<WeeklyCheckin | undefined> {
    const result = await db.select().from(weeklyCheckins)
      .where(eq(weeklyCheckins.userId, userId))
      .orderBy(desc(weeklyCheckins.createdAt))
      .limit(1);
    return result[0];
  }
}

export const storage = new PostgreSQLStorage();
