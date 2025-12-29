
import React from 'react';
import { StadiumView } from '../types';

interface Props {
  view: StadiumView;
  onClose: () => void;
}

const SourceCodePanel: React.FC<Props> = ({ view, onClose }) => {
  const code = `#include <GL/glut.h>
#include <math.h>

// --- OpenGL 2D Stadium V43: Pitch Markings ---
// Feature: Central Circle rendering with perspective correction.
// Feature: Smooth trigonometry-based circular primitives.

void drawCentralCircle(float cx, float cy, float rx, float ry) {
    glBegin(GL_LINE_LOOP);
    for(int i=0; i<360; i++) {
        float rad = i * 3.14159f / 180.0f;
        glVertex2f(cx + cos(rad)*rx, cy + sin(rad)*ry);
    }
    glEnd();
}

void drawPitch() {
    // Green stripes...
    // Boundary line...

    // Center Line
    glBegin(GL_LINES);
    glVertex2f(0.0f, -0.6f); glVertex2f(0.0f, -0.95f);
    glEnd();

    // Central Circle (rx=0.15, ry=0.07 for perspective)
    glColor4f(1.0f, 1.0f, 1.0f, 0.85f);
    drawCentralCircle(0.0f, -0.775f, 0.15f, 0.07f);

    // Kick-off Spot
    glPointSize(5.0f);
    glBegin(GL_POINTS);
    glVertex2f(0.0f, -0.775f);
    glEnd();
}

void drawLightPole(float x, float topY, float bottomY) {
    glColor3f(0.05f, 0.05f, 0.05f);
    glRectf(x - 0.01f, bottomY, x + 0.01f, topY);
    // ... lattice logic ...
}

void drawFrontStand() {
    // ... draw sky, seats ...
    drawPitch();
    drawLightPole(-0.92f, 0.95f, 0.15f);
    drawLightPole(0.92f, 0.95f, 0.15f);
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    glLoadIdentity();
    drawFrontStand();
    glutSwapBuffers();
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
    glutInitWindowSize(1000, 600);
    glutCreateWindow("Elite Stadium V43 - Pitch Focus");
    glutDisplayFunc(display);
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glutMainLoop();
    return 0;
}`;

  return (
    <div className="absolute inset-0 z-[100] bg-black/98 p-8 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-blue-500 font-mono font-bold text-2xl italic uppercase tracking-tighter">ARENA_PRO_V43.CPP</h2>
          <p className="text-white/30 text-[10px] font-mono tracking-widest uppercase italic">Central Circle (Ellipse) + Pitch Markings + Lattice Floodlights</p>
        </div>
        <button onClick={onClose} className="text-white bg-blue-600 hover:bg-blue-500 px-8 py-2 rounded-lg font-bold shadow-lg transition-all active:scale-95">
          EXIT SOURCE
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-black border border-white/5 rounded-xl shadow-2xl p-6">
        <pre className="text-green-500 font-mono text-[11px] leading-relaxed selection:bg-green-600/30">
          {code}
        </pre>
      </div>
    </div>
  );
};

export default SourceCodePanel;
