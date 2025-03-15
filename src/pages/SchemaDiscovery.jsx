import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Database, Table as TableIcon, List, Columns, Filter, Download, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function SchemaDiscovery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('tables');
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [schemaData, setSchemaData] = useState(null);
  const [tableStructures, setTableStructures] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [showSensitiveColumns, setShowSensitiveColumns] = useState(false);
  const [errorTable, setErrorTable] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData = {
        tables: [
          { name: 'users_view', schema: 'public', type: 'view', columns: 17, category: 'user', hasSensitiveData: true },
          { name: 'user_limits_view', schema: 'public', type: 'view', columns: 8, category: 'user', hasSensitiveData: true },
          { name: 'traffic_reports', schema: 'public', type: 'table', columns: 13, category: 'analytics', hasSensitiveData: false },
          { name: 'tournament_players_view', schema: 'public', type: 'view', columns: 11, category: 'gaming', hasSensitiveData: false },
          { name: 'tmp_tb', schema: 'public', type: 'table', columns: 11, category: 'system', hasSensitiveData: false },
          { name: 'profiles_view', schema: 'public', type: 'view', columns: 25, category: 'user', hasSensitiveData: true },
          { name: 'phones_view', schema: 'public', type: 'view', columns: 6, category: 'user', hasSensitiveData: true },
          { name: 'payments_view', schema: 'public', type: 'view', columns: 43, category: 'financial', hasSensitiveData: true },
          { name: 'payment_systems_view', schema: 'public', type: 'view', columns: 14, category: 'financial', hasSensitiveData: false },
          { name: 'income_reports', schema: 'public', type: 'table', columns: 6, category: 'financial', hasSensitiveData: false },
          { name: 'freespin_issues_view', schema: 'public', type: 'view', columns: 19, category: 'gaming', hasSensitiveData: false },
          { name: 'exchange_rates_view', schema: 'public', type: 'view', columns: 8, category: 'financial', hasSensitiveData: false },
          { name: 'documents_view', schema: 'public', type: 'view', columns: 7, category: 'user', hasSensitiveData: true },
          { name: 'casino_modifications_view', schema: 'public', type: 'view', columns: 7, category: 'gaming', hasSensitiveData: false },
          { name: 'casino_games_view', schema: 'public', type: 'view', columns: 12, category: 'gaming', hasSensitiveData: false },
          { name: 'bonus_issues_view', schema: 'public', type: 'view', columns: 25, category: 'gaming', hasSensitiveData: false },
          { name: 'balance_corrections_view', schema: 'public', type: 'view', columns: 6, category: 'financial', hasSensitiveData: false },
          { name: 'api_reports', schema: 'public', type: 'table', columns: 29, category: 'analytics', hasSensitiveData: false },
          { name: 'ad_args_view', schema: 'public', type: 'view', columns: 5, category: 'marketing', hasSensitiveData: false },
          { name: 'accounts_view', schema: 'public', type: 'view', columns: 6, category: 'financial', hasSensitiveData: false },
          { name: 'a8r_games_view', schema: 'public', type: 'view', columns: 17, category: 'gaming', hasSensitiveData: false },
        ]
      };
      setSchemaData(mockData);

      // Mock table structures for all tables
      const mockTableStructures = {
        'users_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'tags', type: 'character varying', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'last_sign_in_at', type: 'timestamp without time zone', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'email', type: 'character varying', nullable: false, isPrimary: false, isSensitive: true },
          { name: 'locked_at', type: 'timestamp without time zone', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'with_duplicates', type: 'boolean', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'suspended', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'disabled', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'confirmed_at', type: 'timestamp without time zone', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'psp_trusted_level', type: 'text', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'ctag', type: 'text', nullable: true, isPrimary: false, isSensitive: false },
        ],
        'payments_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'user_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'amount_cents', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'currency', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'payment_system_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'action', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'finished_at', type: 'timestamp without time zone', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'success', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'processing', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'manual', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'account', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'masked_account', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'tx', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
        ],
        'traffic_reports': [
          { name: 'id', type: 'integer', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'date', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'country', type: 'character varying', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'visits', type: 'integer', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'clicks', type: 'integer', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'registrations_count', type: 'integer', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'deposits_count', type: 'integer', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'ftd_count', type: 'integer', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'foreign_partner_id', type: 'integer', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'cr', type: 'double precision', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'cd', type: 'double precision', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'cftd', type: 'double precision', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'rftd', type: 'double precision', nullable: true, isPrimary: false, isSensitive: false },
        ],
        'profiles_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'user_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'first_name', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'last_name', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'full_name', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'nickname', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'date_of_birth', type: 'date', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'gender', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'country', type: 'character varying', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'city', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'address', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'address2', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'postal_code', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'personal_id_number', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'language', type: 'character varying', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'time_zone', type: 'character varying', nullable: true, isPrimary: false, isSensitive: false },
        ],
        'casino_games_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'account_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'game_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'bonus_issue_id', type: 'bigint', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'bets_sum', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'payoff_sum', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'balance_before', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'balance_after', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'jackpot_win_cents', type: 'bigint', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'exchange_rate_id', type: 'bigint', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'finished_at', type: 'timestamp without time zone', nullable: true, isPrimary: false, isSensitive: false },
        ],
        'phones_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'user_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'phone_number', type: 'character varying', nullable: false, isPrimary: false, isSensitive: true },
          { name: 'verified_at', type: 'timestamp without time zone', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'active', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
        ],
        'bonus_issues_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'user_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'bonus_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'status', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'amount_cents', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'wager_requirement_cents', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
        ],
        'user_limits_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'user_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'type', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'status', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'period', type: 'integer', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'disable_at', type: 'timestamp without time zone', nullable: true, isPrimary: false, isSensitive: false },
        ],
        'tournament_players_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'tournament_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'user_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'points', type: 'integer', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'games_taken', type: 'integer', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'bet_mcents', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'win_mcents', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'rate', type: 'double precision', nullable: false, iPrimary: false, isSensitive: false },
          { name: 'user_confirmed', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
        ],
        'payment_systems_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'name', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'system_name', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'currency', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'deposit', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'withdrawal', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'position', type: 'integer', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'active', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'min_amount_cents', type: 'bigint', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'max_amount_cents', type: 'bigint', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'image_url', type: 'character varying', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'fee_percent', type: 'decimal', nullable: true, isPrimary: false, isSensitive: false },
        ],
        'income_reports': [
          { name: 'id', type: 'integer', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'date', type: 'date', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'ggr', type: 'decimal', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'ngr', type: 'decimal', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'tax', type: 'decimal', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'marketing_cost', type: 'decimal', nullable: false, isPrimary: false, isSensitive: false },
        ],
        'freespin_issues_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'user_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'status', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'free_spins_count', type: 'integer', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'game_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'accumulated_amount', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
        ],
        'exchange_rates_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'from_currency', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'to_currency', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'rate', type: 'decimal', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'active', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'source', type: 'character varying', nullable: true, isPrimary: false, isSensitive: false },
        ],
        'documents_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'user_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'document_type', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'status', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'file_url', type: 'character varying', nullable: false, isPrimary: false, isSensitive: true },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
        ],
        'casino_modifications_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'user_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'amount_cents', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'status', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'reason', type: 'text', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
        ],
        'balance_corrections_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'user_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'amount_cents', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'reason', type: 'text', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'created_by', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
        ],
        'api_reports': [
          { name: 'id', type: 'integer', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'timestamp', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'endpoint', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'method', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'status_code', type: 'integer', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'response_time_ms', type: 'integer', nullable: false, iPrimary: false, isSensitive: false },
          { name: 'client_ip', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'user_agent', type: 'character varying', nullable: true, isPrimary: false, isSensitive: true },
          { name: 'error_message', type: 'text', nullable: true, isPrimary: false, isSensitive: false },
        ],
        'ad_args_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'name', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'value', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
        ],
        'accounts_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'user_id', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'balance_cents', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'currency', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'active', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
        ],
        'a8r_games_view': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'game_name', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'provider', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'game_type', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'rtp', type: 'decimal', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'volatility', type: 'character varying', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'min_bet_cents', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'max_bet_cents', type: 'bigint', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'active', type: 'boolean', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'updated_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'image_url', type: 'character varying', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'popularity_score', type: 'decimal', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'features', type: 'text[]', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'themes', type: 'text[]', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'supported_currencies', type: 'text[]', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'supported_languages', type: 'text[]', nullable: true, isPrimary: false, isSensitive: false },
        ],
        'tmp_tb': [
          { name: 'id', type: 'bigint', nullable: false, isPrimary: true, isSensitive: false },
          { name: 'name', type: 'character varying', nullable: false, isPrimary: false, isSensitive: false },
          { name: 'value', type: 'text', nullable: true, isPrimary: false, isSensitive: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, isPrimary: false, isSensitive: false },
        ]
      };
      
      setTableStructures(mockTableStructures);
      setIsLoading(false);
    }, 1500);
  }, []);

  const filteredTables = schemaData?.tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || table.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = schemaData?.tables.reduce((acc, table) => {
    if (!acc.includes(table.category)) {
      acc.push(table.category);
    }
    return acc;
  }, []) || [];

  const handleTableClick = (tableName) => {
    setSelectedTable(tableName);
    setErrorTable(null);
    // If the table structure doesn't exist, set an error
    if (!tableStructures[tableName] || tableStructures[tableName].length === 0) {
      setErrorTable(tableName);
    }
  };

  const exportTableSchema = (tableName) => {
    const columns = tableStructures[tableName];
    if (!columns) return;
    
    let csv = 'column_name,data_type,nullable,is_primary_key\n';
    columns.forEach(col => {
      if (!col.isSensitive || showSensitiveColumns) {
        csv += `${col.name},${col.type},${col.nullable},${col.isPrimary}\n`;
      }
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${tableName}_schema.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleExpandRow = (tableName) => {
    setExpandedRows(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Database Schema Discovery</h1>
            <p className="text-gray-500">
              Explore database tables, views and their structures
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowSensitiveColumns(!showSensitiveColumns)}
            >
              {showSensitiveColumns ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showSensitiveColumns ? 'Hide Sensitive' : 'Show Sensitive'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-600" />
                  Database Objects
                </CardTitle>
                <CardDescription>
                  {filteredTables.length} tables and views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tables..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant={view === 'tables' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setView('tables')}
                      className="flex-1"
                    >
                      <TableIcon className="h-4 w-4 mr-2" />
                      Tables
                    </Button>
                    <Button 
                      variant={view === 'relationships' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setView('relationships')}
                      className="flex-1"
                    >
                      <Columns className="h-4 w-4 mr-2" />
                      Relationships
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  {isLoading ? (
                    <div className="py-8 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-1">
                        {filteredTables.length > 0 ? (
                          filteredTables.map(table => (
                            <div 
                              key={table.name}
                              className={`p-2 rounded-md cursor-pointer transition-colors ${selectedTable === table.name ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-gray-100'}`}
                              onClick={() => handleTableClick(table.name)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    {table.type === 'view' ? (
                                      <List className="h-4 w-4 text-blue-600" />
                                    ) : (
                                      <TableIcon className="h-4 w-4 text-indigo-600" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{table.name}</p>
                                    <div className="flex items-center gap-1">
                                      <Badge variant="outline" className="text-xs">
                                        {table.columns} columns
                                      </Badge>
                                      {table.hasSensitiveData && (
                                        <Badge className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200">
                                          sensitive
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {table.category}
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-gray-500">
                            No tables match the current filters
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {selectedTable ? (
                      <span className="flex items-center">
                        {schemaData?.tables.find(t => t.name === selectedTable)?.type === 'view' ? (
                          <List className="h-5 w-5 text-blue-600 mr-2" />
                        ) : (
                          <TableIcon className="h-5 w-5 text-indigo-600 mr-2" />
                        )}
                        {selectedTable}
                      </span>
                    ) : (
                      'Select a table to view details'
                    )}
                  </CardTitle>
                  
                  {selectedTable && tableStructures[selectedTable] && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => exportTableSchema(selectedTable)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export Schema
                    </Button>
                  )}
                </div>
                {selectedTable && (
                  <CardDescription>
                    {schemaData?.tables.find(t => t.name === selectedTable)?.type === 'view' ? 'View' : 'Table'} in {schemaData?.tables.find(t => t.name === selectedTable)?.schema} schema
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {selectedTable ? (
                  errorTable ? (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-700">
                        Structure details are being loaded for {errorTable}. Please try again in a moment.
                      </AlertDescription>
                    </Alert>
                  ) : tableStructures[selectedTable] ? (
                    <ScrollArea className="h-[600px]">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white">
                          <TableRow>
                            <TableHead className="w-[200px]">Column Name</TableHead>
                            <TableHead>Data Type</TableHead>
                            <TableHead className="text-center">Nullable</TableHead>
                            <TableHead className="text-center">Primary Key</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tableStructures[selectedTable]
                            .filter(col => !col.isSensitive || showSensitiveColumns)
                            .map(column => (
                              <TableRow key={column.name}>
                                <TableCell className="font-medium flex items-center">
                                  {column.name}
                                  {column.isSensitive && (
                                    <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200">
                                      sensitive
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>{column.type}</TableCell>
                                <TableCell className="text-center">
                                  {column.nullable ? '✓' : ''}
                                </TableCell>
                                <TableCell className="text-center">
                                  {column.isPrimary ? '✓' : ''}
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  ) : (
                    <div className="py-16 flex justify-center text-gray-500">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      ) : (
                        <p>Structure details not available for this table</p>
                      )}
                    </div>
                  )
                ) : (
                  <div className="py-16 flex justify-center items-center flex-col text-gray-500">
                    <Database className="h-16 w-16 mb-4 text-gray-300" />
                    <p>Select a table from the list to view its structure</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}