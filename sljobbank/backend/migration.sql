-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('STUDENT', 'COUNSELOR', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."SubscriptionType" AS ENUM ('FREE', 'PAID');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('PAYHERE', 'STRIPE', 'BANK_TRANSFER', 'QR_CODE', 'WEBXPAY', 'DIALOG_GENIE');

-- CreateEnum
CREATE TYPE "public"."InstituteType" AS ENUM ('GOVERNMENT', 'PRIVATE', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "public"."DeliveryMode" AS ENUM ('FULL_TIME', 'PART_TIME', 'ONLINE', 'BLENDED');

-- CreateEnum
CREATE TYPE "public"."enum_career_test_attempts_status" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."enum_career_test_questions_category" AS ENUM ('REALISTIC', 'INVESTIGATIVE', 'ARTISTIC', 'SOCIAL', 'ENTERPRISING', 'CONVENTIONAL');

-- CreateEnum
CREATE TYPE "public"."enum_login_logs_role" AS ENUM ('STUDENT', 'COUNSELOR', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."enum_qualifications_level" AS ENUM ('OL', 'AL', 'CERTIFICATE', 'DIPLOMA', 'HND', 'DEGREE', 'POSTGRADUATE', 'PROFESSIONAL', 'MASTERS', 'NVQ');

-- CreateEnum
CREATE TYPE "public"."enum_users_role" AS ENUM ('STUDENT', 'COUNSELOR', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."enum_users_subscription_type" AS ENUM ('FREE', 'PAID');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "public"."enum_users_role" DEFAULT 'STUDENT',
    "subscription_type" "public"."enum_users_subscription_type" DEFAULT 'FREE',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."career_clusters" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "career_clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jobs" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "responsibilities" TEXT,
    "qualifications" TEXT,
    "skills" TEXT,
    "cluster_id" UUID,
    "salary_min" DOUBLE PRECISION,
    "salary_max" DOUBLE PRECISION,
    "industry_demand" VARCHAR(255),
    "sector" VARCHAR(255),
    "remote_available" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."institutes" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL DEFAULT 'GOVERNMENT',
    "location" VARCHAR(255),
    "website" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "institutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."qualifications" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "level" "public"."enum_qualifications_level" NOT NULL,
    "field" VARCHAR(255),
    "description" VARCHAR(2000),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "cluster_id" UUID,

    CONSTRAINT "qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."institute_qualifications" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "institute_id" UUID,
    "qualification_id" UUID,

    CONSTRAINT "institute_qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "duration" VARCHAR(255),
    "fee" DOUBLE PRECISION,
    "delivery_mode" VARCHAR(255) DEFAULT 'FULL_TIME',
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "institute_id" UUID,
    "job_id" UUID,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."career_tests" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "purpose" VARCHAR(2000),
    "what_it_identifies" VARCHAR(2000),
    "estimated_minutes" VARCHAR(500),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "career_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."career_test_questions" (
    "id" UUID NOT NULL,
    "text" VARCHAR(500) NOT NULL,
    "category" "public"."enum_career_test_questions_category" NOT NULL,
    "sort_order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "test_id" UUID,

    CONSTRAINT "career_test_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(255) DEFAULT 'PENDING',
    "method" VARCHAR(255),
    "reference" VARCHAR(255),
    "payment_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "user_id" UUID,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."favorites" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "user_id" UUID,
    "job_id" UUID,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_views" (
    "id" UUID NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "student_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_settings" (
    "id" TEXT NOT NULL,
    "paidModeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "monthlyPrice" DOUBLE PRECISION NOT NULL DEFAULT 990,
    "yearlyPrice" DOUBLE PRECISION NOT NULL DEFAULT 8900,
    "bankName" VARCHAR(100) NOT NULL,
    "accountNumber" VARCHAR(50) NOT NULL,
    "accountHolder" VARCHAR(150) NOT NULL,
    "qrCodeImage" VARCHAR(500),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255),
    "message" TEXT,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "user_id" UUID,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_resets" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admin_audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(255) NOT NULL,
    "ip_address" VARCHAR(255),
    "user_agent" VARCHAR(500),
    "success" BOOLEAN DEFAULT false,
    "detail" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."career_test_answers" (
    "id" UUID NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "attempt_id" UUID,
    "question_id" UUID,

    CONSTRAINT "career_test_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."career_test_attempts" (
    "id" UUID NOT NULL,
    "status" "public"."enum_career_test_attempts_status" DEFAULT 'IN_PROGRESS',
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "scores_json" VARCHAR(1000),
    "holland_code" VARCHAR(10),
    "guidance_text" VARCHAR(4000),
    "student_downloaded_at" TIMESTAMPTZ(6),
    "counselor_download_enabled" BOOLEAN DEFAULT false,
    "counselor_download_enabled_by" UUID,
    "counselor_download_enabled_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "test_id" UUID,
    "user_id" UUID,
    "top_cluster_id" UUID,

    CONSTRAINT "career_test_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_qualifications" (
    "id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "qualification_id" UUID NOT NULL,
    "institute_id" UUID,
    "required" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "job_qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."login_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "public"."enum_login_logs_role" NOT NULL,
    "login_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "login_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_profiles" (
    "id" UUID NOT NULL,
    "al_stream" VARCHAR(255),
    "grade" VARCHAR(255),
    "interest_tags" VARCHAR(1000),
    "cluster_scores_json" VARCHAR(2000),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "user_id" UUID,
    "top_cluster_id" UUID,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "institute_qualifications_institute_id_qualification_id_key" ON "public"."institute_qualifications"("institute_id", "qualification_id");

-- CreateIndex
CREATE INDEX "student_views_userId_idx" ON "public"."student_views"("userId");

-- CreateIndex
CREATE INDEX "student_views_jobId_idx" ON "public"."student_views"("jobId");

-- AddForeignKey
ALTER TABLE "public"."jobs" ADD CONSTRAINT "jobs_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "public"."career_clusters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."qualifications" ADD CONSTRAINT "qualifications_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "public"."career_clusters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."institute_qualifications" ADD CONSTRAINT "institute_qualifications_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."institute_qualifications" ADD CONSTRAINT "institute_qualifications_qualification_id_fkey" FOREIGN KEY ("qualification_id") REFERENCES "public"."qualifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_test_questions" ADD CONSTRAINT "career_test_questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."career_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_test_answers" ADD CONSTRAINT "career_test_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "public"."career_test_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_test_answers" ADD CONSTRAINT "career_test_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."career_test_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_test_attempts" ADD CONSTRAINT "career_test_attempts_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."career_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_test_attempts" ADD CONSTRAINT "career_test_attempts_top_cluster_id_fkey" FOREIGN KEY ("top_cluster_id") REFERENCES "public"."career_clusters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_test_attempts" ADD CONSTRAINT "career_test_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_qualifications" ADD CONSTRAINT "job_qualifications_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_qualifications" ADD CONSTRAINT "job_qualifications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_qualifications" ADD CONSTRAINT "job_qualifications_qualification_id_fkey" FOREIGN KEY ("qualification_id") REFERENCES "public"."qualifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."login_logs" ADD CONSTRAINT "login_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_profiles" ADD CONSTRAINT "student_profiles_top_cluster_id_fkey" FOREIGN KEY ("top_cluster_id") REFERENCES "public"."career_clusters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_profiles" ADD CONSTRAINT "student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

