SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."services" ("service_id", "created_at", "service_name", "service_slug", "service_state") VALUES
	('bfe16d52-5d4e-46c7-999a-c1d6a6869326', '2024-07-08 11:41:44.050041+00', 'ElevenLabs Dubbing', 'elevenlabs-dubbing', 'Beta Testing');


--
-- PostgreSQL database dump complete
--

RESET ALL;
