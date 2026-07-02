// The 4-stage order pipeline (labels match the backend's VALID_STATUSES).
const STAGES = ['Confirmed', 'Quality Check', 'In Transit', 'Delivered'];
const ICONS = ['📦', '🔍', '🚚', '🌿'];

export default function OrderStatusStepper({ status }) {
  const currentIndex = STAGES.indexOf(status);

  return (
    <section style={{ fontFamily: 'sans-serif', margin: '1rem 0 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {STAGES.map((stage, i) => {
          const done = currentIndex >= 0 && i < currentIndex;
          const active = i === currentIndex;
          const reached = done || active;
          const circleBg = active ? '#1b7a3d' : done ? '#8fce9f' : '#e2e8e4';

          return (
            <div key={stage} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {/* Connector line to the previous stage */}
              {i > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    top: 18,
                    right: '50%',
                    width: '100%',
                    height: 3,
                    background: reached ? '#8fce9f' : '#e2e8e4',
                    zIndex: 0,
                  }}
                />
              ) : null}

              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: circleBg,
                  color: reached ? '#fff' : '#889',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  zIndex: 1,
                  boxShadow: active ? '0 0 0 4px rgba(27,122,61,0.15)' : 'none',
                }}
              >
                {done ? '✓' : ICONS[i]}
              </div>
              <span
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#1b7a3d' : reached ? '#2f4a38' : '#889',
                }}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      {currentIndex < 0 ? (
        <p style={{ color: '#889', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.75rem' }}>
          Status: {status}
        </p>
      ) : null}
    </section>
  );
}
