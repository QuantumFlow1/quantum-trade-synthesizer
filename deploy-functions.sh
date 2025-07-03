#!/bin/bash

# Supabase Edge Functions Deployment Script
# Make sure you have Supabase CLI installed and are logged in

echo "Deploying all edge functions to Supabase..."

# Deploy each function
supabase functions deploy agent-communication
supabase functions deploy agent-network-coordinator
supabase functions deploy check-api-keys
supabase functions deploy claude-ping
supabase functions deploy claude-response
supabase functions deploy close-simulation
supabase functions deploy coinmarketcap-global-metrics
supabase functions deploy crypto-groq-assistant
supabase functions deploy crypto-price-data
supabase functions deploy deepseek-ping
supabase functions deploy deepseek-response
supabase functions deploy fetch-crypto-prices
supabase functions deploy fetch-market-data
supabase functions deploy gemini-response
supabase functions deploy generate-advice
supabase functions deploy generate-ai-response
supabase functions deploy generate-trading-advice
supabase functions deploy get-admin-key
supabase functions deploy grok-ping
supabase functions deploy grok3-ping
supabase functions deploy grok3-response
supabase functions deploy groq-analysis
supabase functions deploy groq-chat
supabase functions deploy log-api-call
supabase functions deploy log-transaction-audit
supabase functions deploy market-analysis
supabase functions deploy market-data-collector
supabase functions deploy market-data-validator
supabase functions deploy market-data-validator-enhanced
supabase functions deploy openai-ping
supabase functions deploy openai-response
supabase functions deploy portfolio-decision
supabase functions deploy process-voice
supabase functions deploy quantum-portfolio
supabase functions deploy real-crypto-data
supabase functions deploy save-api-key
supabase functions deploy security-services
supabase functions deploy social-monitor
supabase functions deploy submit-kyc
supabase functions deploy text-to-speech
supabase functions deploy trade-simulation
supabase functions deploy trading-analysis
supabase functions deploy update-positions

echo "All functions deployed successfully!"