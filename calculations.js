function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + Number(value), 0) / values.length;
}

function round(value, digits = 0) {
  return Number(value.toFixed(digits));
}

function getSessionLoad(record) {
  return record.duration_minutes * record.rpe;
}

function calculateRecoveryScore(wellnessRows) {
  const avgSleep = average(wellnessRows.map(row => row.sleep_hours));
  const avgSoreness = average(wellnessRows.map(row => row.soreness));
  const avgStress = average(wellnessRows.map(row => row.stress));
  const avgMood = average(wellnessRows.map(row => row.mood));

  const sleepScore = Math.min(avgSleep / 8, 1) * 35;
  const sorenessScore = (1 - (avgSoreness - 1) / 9) * 25;
  const stressScore = (1 - (avgStress - 1) / 9) * 20;
  const moodScore = (avgMood / 10) * 20;

  return Math.max(0, Math.min(100, round(sleepScore + sorenessScore + stressScore + moodScore)));
}

function calculateAcwr(workloadRows) {
  const loads = workloadRows.map(getSessionLoad);
  const acuteLoad = loads.reduce((sum, load) => sum + load, 0);
  const chronicDailyAverage = average(loads) || 1;
  const chronicLoadEstimate = chronicDailyAverage * 7;
  return round(acuteLoad / chronicLoadEstimate, 2);
}

function calculateReadinessScore(recoveryScore, acwr, latestWellness) {
  let score = recoveryScore;

  if (acwr > 1.3) score -= 15;
  if (acwr < 0.8) score -= 5;
  if (latestWellness.soreness >= 7) score -= 10;
  if (latestWellness.sleep_hours < 6.5) score -= 10;
  if (latestWellness.stress >= 6) score -= 8;

  return Math.max(0, Math.min(100, round(score)));
}

function getRiskProfile(readiness, acwr, latestWellness) {
  const reasons = [];

  if (readiness < 60) reasons.push('low readiness');
  if (acwr > 1.3) reasons.push('elevated workload spike');
  if (latestWellness.soreness >= 7) reasons.push('high soreness');
  if (latestWellness.sleep_hours < 6.5) reasons.push('low sleep');
  if (latestWellness.stress >= 6) reasons.push('high stress');

  if (reasons.length >= 3 || readiness < 50) {
    return { level: 'high', label: 'high', reason: reasons.join(', ') };
  }

  if (reasons.length > 0 || readiness < 72) {
    return { level: 'medium', label: 'moderate', reason: reasons.join(', ') || 'watch trend' };
  }

  return { level: 'low', label: 'low', reason: 'clear to train normally' };
}

function buildAthleteMetrics(athlete, wellness, workload) {
  const athleteWellness = wellness.filter(row => row.athlete_id === athlete.athlete_id);
  const athleteWorkload = workload.filter(row => row.athlete_id === athlete.athlete_id);
  const latestWellness = [...athleteWellness].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const recovery = calculateRecoveryScore(athleteWellness);
  const acwr = calculateAcwr(athleteWorkload);
  const readiness = calculateReadinessScore(recovery, acwr, latestWellness);
  const risk = getRiskProfile(readiness, acwr, latestWellness);

  return {
    ...athlete,
    wellness: athleteWellness,
    workload: athleteWorkload,
    recovery,
    acwr,
    readiness,
    risk
  };
}

function buildTeamSummary(data) {
  return data.athletes.map(athlete => buildAthleteMetrics(athlete, data.wellness, data.workload));
}
