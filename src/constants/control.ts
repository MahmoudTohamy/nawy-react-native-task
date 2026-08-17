import { Ionicons } from '@expo/vector-icons';
import { neutral, status } from '../theme';
import { AlertSeverityFilter, ControlTab } from '../types/control';

export const CONTROL_TABS: {
  key: ControlTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: 'alerts', label: 'Alerts Feed', icon: 'warning-outline' },
  { key: 'lifesupport', label: 'Life Support', icon: 'pulse-outline' },
  { key: 'energy', label: 'Energy & Sol', icon: 'flash-outline' },
];

export const SEVERITY_FILTERS: {
  key: AlertSeverityFilter;
  label: string;
  activeColor: string;
}[] = [
  { key: 'all', label: 'All', activeColor: neutral.textSecondary },
  { key: 'critical', label: 'Critical', activeColor: status.critical.text },
  { key: 'warning', label: 'Warning', activeColor: status.warning.text },
  { key: 'info', label: 'Info', activeColor: status.info.text },
];
