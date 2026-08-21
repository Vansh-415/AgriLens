/**
 * Isolated Print Utility for AgriLens PDF Reports.
 * Copies target element into a clean root-level print container,
 * hiding all application UI shell elements (navbars, sidebars, modals, backdrops).
 * Guarantees a clean 1-page document in browser print preview.
 */
export function printReportElement(elementId: string) {
  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    window.print();
    return;
  }

  // Find or create root print container directly attached to document.body
  let printRoot = document.getElementById('agrilens-print-root');
  if (!printRoot) {
    printRoot = document.createElement('div');
    printRoot.id = 'agrilens-print-root';
    document.body.appendChild(printRoot);
  }

  // Copy target report HTML into root print container
  printRoot.innerHTML = targetElement.outerHTML;

  // Add print mode class to body
  document.body.classList.add('agrilens-printing-mode');

  // Trigger print after short tick
  setTimeout(() => {
    window.print();

    // Clean up after print finishes
    const cleanup = () => {
      document.body.classList.remove('agrilens-printing-mode');
      if (printRoot) {
        printRoot.innerHTML = '';
      }
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 2000); // Fallback cleanup
  }, 100);
}
