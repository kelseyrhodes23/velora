"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseUrl = 'https://zpmgvomrwphdxkvrdimd.supabase.co';
var supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbWd2b21yd3BoZHhrdnJkaW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzYwNDEsImV4cCI6MjA2MjQ1MjA0MX0.qHYyfwM_kQChOBU_0XYRwJFwyQiPQVy4G7K2nIyjbhY';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
