import type { GameBoardProps } from '../types';
import type { DotsAndBoxesState, DotsAndBoxesMove } from './types';
import { horizontalEdgeIndex, verticalEdgeIndex, boxIndex } from './types';

interface DotsAndBoxesBoardProps extends GameBoardProps<DotsAndBoxesState> {}

export function DotsAndBoxesBoard({ state, mySymbol, onMove, disabled }: DotsAndBoxesBoardProps) {
  const isMyTurn = state.players[state.currentPlayerIndex]?.symbol === mySymbol;
  const isFinished = state.status === 'finished' || state.status === 'draw';

  const canPlay = !disabled && !isFinished && isMyTurn;

  const submitMove = (orientation: 'h' | 'v', index: number) => {
    if (!canPlay) return;
    const move: DotsAndBoxesMove = { orientation, index };
    onMove(move);
  };

  const boardSize = 2 * state.rows - 1;
  const p1 = state.players[0];
  const p2 = state.players[1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{
        display: 'flex',
        gap: 12,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 12,
        padding: '10px 14px',
        fontWeight: 700,
      }}>
        <span>{p1?.displayName ?? 'P1'} ({p1?.symbol ?? 'X'}): {state.scores[p1?.symbol ?? 'X'] ?? 0}</span>
        <span>{p2?.displayName ?? 'P2'} ({p2?.symbol ?? 'O'}): {state.scores[p2?.symbol ?? 'O'] ?? 0}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, 44px)`,
          gridTemplateRows: `repeat(${boardSize}, 44px)`,
          gap: 6,
          padding: 16,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.92)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        }}
      >
        {Array.from({ length: boardSize * boardSize }).map((_, idx) => {
          const gr = Math.floor(idx / boardSize);
          const gc = idx % boardSize;

          // Dot
          if (gr % 2 === 0 && gc % 2 === 0) {
            return (
              <div
                key={idx}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#334155',
                  alignSelf: 'center',
                  justifySelf: 'center',
                }}
              />
            );
          }

          // Horizontal edge
          if (gr % 2 === 0 && gc % 2 === 1) {
            const r = gr / 2;
            const c = (gc - 1) / 2;
            const edgeIdx = horizontalEdgeIndex(state.rows, state.cols, r, c);
            const taken = state.horizontalEdges[edgeIdx];
            return (
              <button
                key={idx}
                onClick={() => submitMove('h', edgeIdx)}
                disabled={!canPlay || taken}
                style={{
                  height: 10,
                  width: '100%',
                  alignSelf: 'center',
                  border: 'none',
                  borderRadius: 6,
                  background: taken ? '#6366f1' : '#cbd5e1',
                  cursor: !canPlay || taken ? 'default' : 'pointer',
                }}
                aria-label={`Horizontal edge ${edgeIdx}`}
              />
            );
          }

          // Vertical edge
          if (gr % 2 === 1 && gc % 2 === 0) {
            const r = (gr - 1) / 2;
            const c = gc / 2;
            const edgeIdx = verticalEdgeIndex(state.rows, state.cols, r, c);
            const taken = state.verticalEdges[edgeIdx];
            return (
              <button
                key={idx}
                onClick={() => submitMove('v', edgeIdx)}
                disabled={!canPlay || taken}
                style={{
                  width: 10,
                  height: '100%',
                  justifySelf: 'center',
                  border: 'none',
                  borderRadius: 6,
                  background: taken ? '#6366f1' : '#cbd5e1',
                  cursor: !canPlay || taken ? 'default' : 'pointer',
                }}
                aria-label={`Vertical edge ${edgeIdx}`}
              />
            );
          }

          // Box cell
          const br = (gr - 1) / 2;
          const bc = (gc - 1) / 2;
          const bIdx = boxIndex(state.cols, br, bc);
          const owner = state.boxes[bIdx];

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                borderRadius: 8,
                background: owner ? 'rgba(99,102,241,0.18)' : 'rgba(148,163,184,0.15)',
                color: '#312e81',
                fontSize: 18,
              }}
            >
              {owner ?? ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DotsAndBoxesBoard;
