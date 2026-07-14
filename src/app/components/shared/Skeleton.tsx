import type { CSSProperties } from 'react';

/**
 * Primitivo de skeleton. Renderiza um bloco cinza pulsante que representa
 * visualmente o espaço ocupado por um conteúdo ainda em carregamento.
 * A animação de pulse vive em `global.css` (classe `.skeleton-box`).
 */
export function SkeletonBox({
  width = '100%',
  height = 14,
  radius,
  style,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  style?: CSSProperties;
}) {
  return (
    <div
      className="skeleton-box"
      style={{
        width,
        height,
        ...(radius !== undefined ? { borderRadius: radius } : {}),
        ...style,
      }}
    />
  );
}

const cardStyle: CSSProperties = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 32,
};

/**
 * Skeleton do cabeçalho + abas do PatientProfileLayout, exibido enquanto os
 * dados do paciente carregam.
 */
export function PatientLayoutSkeleton() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px' }}>
      {/* Breadcrumb + ações */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <SkeletonBox width={220} height={16} />
        <SkeletonBox width={100} height={28} radius="var(--radius-md)" />
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--color-border)', marginBottom: 32, paddingBottom: 12 }}>
        {[80, 110, 80, 80, 90].map((w, i) => (
          <SkeletonBox key={i} width={w} height={14} />
        ))}
      </div>

      <OverviewSkeleton />
    </div>
  );
}

/**
 * Skeleton da Visão Geral (PatientInfoCard): grade de indicadores clínicos.
 */
export function OverviewSkeleton() {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SkeletonBox width="50%" height={10} />
            <SkeletonBox width="80%" height={16} />
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: 'var(--color-border-light)', margin: '24px 0' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SkeletonBox width="40%" height={10} />
            <SkeletonBox width="70%" height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton do Plano Alimentar: barra de indicadores + cards de refeições.
 */
export function MealPlanSkeleton() {
  return (
    <div style={{ paddingBottom: 64 }}>
      {/* Barra IMC/TMB/GET */}
      <div style={{
        display: 'flex', gap: 24, marginBottom: 32, padding: '16px 20px',
        background: 'var(--color-subtle)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
      }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <SkeletonBox width={40} height={10} />
            <SkeletonBox width={70} height={16} />
          </div>
        ))}
      </div>

      {/* Cards de refeições */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <SkeletonBox width={160} height={16} />
              <SkeletonBox width={80} height={14} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SkeletonBox width="100%" height={12} />
              <SkeletonBox width="90%" height={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton de Medidas Corporais: formulário + tabela de histórico.
 */
export function MeasurementSkeleton() {
  return (
    <div style={{ paddingBottom: 64 }}>
      {/* Formulário */}
      <div style={{ ...cardStyle, marginBottom: 48 }}>
        <SkeletonBox width={200} height={14} style={{ marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <SkeletonBox width="60%" height={10} />
              <SkeletonBox width="100%" height={40} radius="var(--radius-md)" />
            </div>
          ))}
        </div>
      </div>

      {/* Histórico / gráfico */}
      <div style={cardStyle}>
        <SkeletonBox width={180} height={14} style={{ marginBottom: 24 }} />
        <SkeletonBox width="100%" height={220} radius="var(--radius-md)" />
      </div>
    </div>
  );
}

/**
 * Skeleton da aba Evolução (relatório): cabeçalho com controles + card do gráfico.
 */
export function EvolutionSkeleton() {
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderBottom: '1px solid var(--color-border)', paddingBottom: 20, marginBottom: 24,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SkeletonBox width={200} height={18} />
          <SkeletonBox width={260} height={12} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <SkeletonBox width={140} height={36} radius="var(--radius-md)" />
          <SkeletonBox width={90} height={36} radius="var(--radius-md)" />
          <SkeletonBox width={110} height={36} radius="var(--radius-md)" />
        </div>
      </div>
      <div style={cardStyle}>
        <SkeletonBox width="100%" height={260} radius="var(--radius-md)" />
      </div>
    </div>
  );
}

/**
 * Skeleton da aba Anotações: formulário de nova anotação + lista do histórico.
 */
export function NotesSkeleton() {
  return (
    <div style={{ paddingBottom: 64 }}>
      {/* Formulário */}
      <div style={{ ...cardStyle, marginBottom: 48 }}>
        <SkeletonBox width={200} height={14} style={{ marginBottom: 24 }} />
        <SkeletonBox width={200} height={40} radius="var(--radius-md)" style={{ marginBottom: 24 }} />
        <SkeletonBox width="100%" height={120} radius="var(--radius-md)" />
      </div>

      {/* Histórico */}
      <SkeletonBox width={120} height={12} style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <SkeletonBox width={90} height={12} />
              <SkeletonBox width={100} height={12} />
            </div>
            <SkeletonBox width="100%" height={12} style={{ marginBottom: 8 }} />
            <SkeletonBox width="80%" height={12} />
          </div>
        ))}
      </div>
    </div>
  );
}


