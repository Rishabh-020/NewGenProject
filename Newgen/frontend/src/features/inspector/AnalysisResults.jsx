import { useState } from "react";
import ScoreRing from "./components/ScoreRing";
import MetricCard from "./components/MetricCard";
import CategoryBreakdown from "./components/CategoryBreakdown";
import IssueList from "./components/IssueList";
import AnalysisSummary from "./components/AnalysisSummary";
import { getOverallBadge } from "./utils/scoring";

/**
 * AnalysisResults
 * ---------------
 * Top-level screen rendered after AI analysis completes.
 *
 * Props:
 *   result  — shape described in utils/mockData.js
 *   onExport(issues)     — called when user clicks "Export checklist"
 *   onFilterCritical()   — called when user clicks "View critical only"
 *   onPrioritise()       — called when user clicks "Prioritise fixes"
 */
export default function AnalysisResults({ result, onExport, onFilterCritical, onPrioritise }) {
  const badge = getOverallBadge(result.score);

  return (
    <div className="analysis-results">
      {/* ── Header ── */}
      <div className="ar-header">
        <div className="ar-header-left">
          <ScoreRing score={result.score} />
          <div className="ar-title-block">
            <h2 className="ar-title">Design accuracy report</h2>
            <p className="ar-subtitle">
              {result.screenName} · Figma vs Implementation · Analysed just now
            </p>
          </div>
        </div>
        <span className={`ar-badge ar-badge--${badge.variant}`}>{badge.label}</span>
      </div>

      {/* ── Metric cards ── */}
      <div className="ar-metric-grid">
        <MetricCard label="Critical errors" value={result.criticalCount} sub="Must fix" variant="danger" />
        <MetricCard label="Warnings"        value={result.warningCount}  sub="Should fix" variant="warn" />
        <MetricCard label="Passed checks"   value={result.passedCount}   sub="Looking good" variant="good" />
        <MetricCard label="Pixel accuracy"  value={`${result.score}%`}   sub="Target: 95%" />
      </div>

      {/* ── Category breakdown ── */}
      <section className="ar-section">
        <h3 className="ar-section-head">Category breakdown</h3>
        <CategoryBreakdown categories={result.categories} />
      </section>

      {/* ── Issue list ── */}
      <section className="ar-section">
        <h3 className="ar-section-head">Issues · click to expand fix steps</h3>
        <IssueList issues={result.issues} />
      </section>

      {/* ── Summary ── */}
      <section className="ar-section">
        <AnalysisSummary summary={result.summary} />
      </section>

      {/* ── CTAs ── */}
      <div className="ar-cta-row">
        <button className="ar-btn" onClick={() => onExport?.(result.issues)}>
          Export as checklist
        </button>
        <button className="ar-btn" onClick={onFilterCritical}>
          View critical only
        </button>
        <button className="ar-btn ar-btn--primary" onClick={onPrioritise}>
          Prioritise fixes
        </button>
      </div>
    </div>
  );
}