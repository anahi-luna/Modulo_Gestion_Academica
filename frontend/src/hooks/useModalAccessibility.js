import { useEffect, useRef } from "react";

// Hook chico para que los modales sean más accesibles, sin tener que
// repetir la misma lógica en cada uno:
//
// - Cierra el modal con la tecla Escape.
// - Al abrirse, mueve el foco al primer campo/botón de adentro (antes
//   el foco se quedaba perdido en el botón que abrió el modal, o en el
//   <body>).
// - Atrapa el Tab: mientras el modal está abierto, tabular desde el
//   último campo vuelve al primero (y Shift+Tab desde el primero va al
//   último), en vez de "escaparse" hacia el resto de la página que
//   queda tapada atrás.
//
// Uso:
//   const modalRef = useModalAccessibility(abierto, onCerrar);
//   <div ref={modalRef}> ...contenido del modal... </div>
export function useModalAccessibility(abierto, onCerrar) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;

    const nodo = modalRef.current;
    if (!nodo) return;

    const selectorEnfocables =
      'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])';

    // Foco inicial: el primer elemento enfocable de adentro del modal.
    const primerFoco = nodo.querySelector(selectorEnfocables);
    primerFoco?.focus();

    function manejarTecla(e) {
      if (e.key === "Escape") {
        onCerrar();
        return;
      }

      if (e.key !== "Tab") return;

      const enfocables = nodo.querySelectorAll(selectorEnfocables);
      if (enfocables.length === 0) return;

      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", manejarTecla);
    return () => document.removeEventListener("keydown", manejarTecla);
  }, [abierto, onCerrar]);

  return modalRef;
}
