import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useControlStore } from '../../stores/controlStore';
import { AlertCategory, AlertSeverity, HabitatAlert } from '../../types/control';

const SEVERITY_COLORS: Record<AlertSeverity, { bg: string; text: string; border: string }> = {
  critical: { bg: '#FFEBEE', text: '#C62828', border: '#FFCDD2' },
  warning: { bg: '#FFF3E0', text: '#EF6C00', border: '#FFE0B2' },
  info: { bg: '#E3F2FD', text: '#1565C0', border: '#BBDEFB' },
};

const CATEGORY_ICONS: Record<AlertCategory, keyof typeof Ionicons.glyphMap> = {
  life_support: 'pulse-outline',
  energy: 'flash-outline',
  structural: 'construct-outline',
  weather: 'planet-outline',
};

function AlertCard({
  alert,
  onDismiss,
  onSnooze,
  onPressHabitat,
}: {
  alert: HabitatAlert;
  onDismiss: () => void;
  onSnooze: () => void;
  onPressHabitat: (habitatId: string) => void;
}) {
  const severityStyle = SEVERITY_COLORS[alert.severity];
  const iconName = CATEGORY_ICONS[alert.category];

  return (
    <View style={[styles.card, { borderColor: severityStyle.border }]}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerTitleRow}>
          <View style={[styles.categoryIconCircle, { backgroundColor: severityStyle.bg }]}>
            <Ionicons name={iconName} size={16} color={severityStyle.text} />
          </View>
          <Text style={styles.alertTitle} numberOfLines={2}>
            {alert.title}
          </Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: severityStyle.bg }]}>
          <Text style={[styles.severityText, { color: severityStyle.text }]}>
            {alert.severity.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Habitat & Sol metadata */}
      <View style={styles.metaRow}>
        <TouchableOpacity
          style={styles.habitatLink}
          onPress={() => onPressHabitat(alert.habitatId)}
          activeOpacity={0.7}
        >
          <Ionicons name="business-outline" size={13} color="#D84315" />
          <Text style={styles.habitatName}>{alert.habitatTitle}</Text>
          <Text style={styles.sectorText}>({alert.sector})</Text>
        </TouchableOpacity>
        <Text style={styles.solTimestamp}>
          Sol {alert.timestampSol} · {alert.timestampTime}
        </Text>
      </View>

      {/* Message */}
      <Text style={styles.messageText}>{alert.message}</Text>

      {/* Suggested Action Protocol Box */}
      <View style={styles.protocolBox}>
        <Ionicons name="shield-checkmark" size={16} color="#2E7D32" style={styles.protocolIcon} />
        <View style={styles.protocolContent}>
          <Text style={styles.protocolLabel}>RECOMMENDED PROTOCOL</Text>
          <Text style={styles.protocolText}>{alert.suggestedAction}</Text>
        </View>
      </View>

      {/* Card Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss} activeOpacity={0.8}>
          <Ionicons name="checkmark-circle-outline" size={16} color="#2E7D32" />
          <Text style={styles.dismissBtnText}>Resolve & Dismiss</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.snoozeBtn} onPress={onSnooze} activeOpacity={0.8}>
          <Ionicons name="time-outline" size={15} color="#757575" />
          <Text style={styles.snoozeBtnText}>Snooze 2 Sols</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AlertsFeedView() {
  const router = useRouter();
  const alerts = useControlStore((s) => s.alerts);
  const severityFilter = useControlStore((s) => s.severityFilter);
  const setSeverityFilter = useControlStore((s) => s.setSeverityFilter);
  const dismissAlert = useControlStore((s) => s.dismissAlert);
  const snoozeAlert = useControlStore((s) => s.snoozeAlert);

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const filteredAlerts = activeAlerts.filter(
    (a) => severityFilter === 'all' || a.severity === severityFilter
  );

  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;
  const warningCount = activeAlerts.filter((a) => a.severity === 'warning').length;
  const infoCount = activeAlerts.filter((a) => a.severity === 'info').length;

  const handleHabitatPress = (habitatId: string) => {
    if (habitatId && habitatId !== 'unknown') {
      router.push({ pathname: '/property/unlock/[id]', params: { id: habitatId } });
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterChip, severityFilter === 'all' && styles.filterChipActive]}
          onPress={() => setSeverityFilter('all')}
        >
          <Text style={[styles.filterChipText, severityFilter === 'all' && styles.filterChipTextActive]}>
            All ({activeAlerts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            severityFilter === 'critical' && styles.filterChipCriticalActive,
          ]}
          onPress={() => setSeverityFilter('critical')}
        >
          <Text
            style={[
              styles.filterChipText,
              severityFilter === 'critical' && styles.filterChipTextActive,
            ]}
          >
            Critical ({criticalCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            severityFilter === 'warning' && styles.filterChipWarningActive,
          ]}
          onPress={() => setSeverityFilter('warning')}
        >
          <Text
            style={[
              styles.filterChipText,
              severityFilter === 'warning' && styles.filterChipTextActive,
            ]}
          >
            Warning ({warningCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, severityFilter === 'info' && styles.filterChipInfoActive]}
          onPress={() => setSeverityFilter('info')}
        >
          <Text
            style={[
              styles.filterChipText,
              severityFilter === 'info' && styles.filterChipTextActive,
            ]}
          >
            Info ({infoCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alerts Stream */}
      {filteredAlerts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="shield-checkmark-outline" size={54} color="#2E7D32" />
          <Text style={styles.emptyTitle}>All Clear — No Active Incidents</Text>
          <Text style={styles.emptySubtitle}>
            {severityFilter === 'all'
              ? 'Settlement diagnostics report all habitat life-support loops running within nominal bounds.'
              : `No alerts found with ${severityFilter} severity rating.`}
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDismiss={() => dismissAlert(alert.id)}
              onSnooze={() => snoozeAlert(alert.id)}
              onPressHabitat={handleHabitatPress}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#424242',
    borderColor: '#424242',
  },
  filterChipCriticalActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
  },
  filterChipWarningActive: {
    backgroundColor: '#EF6C00',
    borderColor: '#EF6C00',
  },
  filterChipInfoActive: {
    backgroundColor: '#1565C0',
    borderColor: '#1565C0',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#616161',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  categoryIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  habitatLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FBE9E7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  habitatName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D84315',
  },
  sectorText: {
    fontSize: 11,
    color: '#757575',
  },
  solTimestamp: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  messageText: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 19,
    marginBottom: 12,
  },
  protocolBox: {
    flexDirection: 'row',
    backgroundColor: '#F1F8E9',
    borderWidth: 1,
    borderColor: '#DCEDC8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    gap: 8,
  },
  protocolIcon: {
    marginTop: 2,
  },
  protocolContent: {
    flex: 1,
  },
  protocolLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#33691E',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  protocolText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    lineHeight: 17,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dismissBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  dismissBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  snoozeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  snoozeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#616161',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
