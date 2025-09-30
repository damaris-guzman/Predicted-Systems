// Normalize pie/donut slices so they fill the entire circle proportionally.
(function(){
  function normalizeDonuts(){
    document.querySelectorAll('svg.retro-pie').forEach(function(svg){
      const slices = Array.from(svg.querySelectorAll('circle.pie-slice'));
      if(!slices.length) return;
      // Read numeric values from data-value attributes (fallback to parseFloat of textContent)
      const values = slices.map(s => {
        const v = s.getAttribute('data-value');
        return v == null || v === '' ? 0 : Number(v);
      });
      const total = values.reduce((a,b)=>a+b,0);
      if(total <= 0) {
        // If no data, hide slices
        slices.forEach(s => s.setAttribute('stroke-dasharray','0 0'));
        return;
      }

      // Use radius from first slice (assumes all same r)
      const r = parseFloat(slices[0].getAttribute('r') || slices[0].r && slices[0].r.baseVal.value || 30);
      const circumference = 2 * Math.PI * r;

      // Start at top (rotate -90deg). In SVG stroke-dashoffset positive moves stroke backwards; existing UIs used -circ/4
      let offset = -circumference * 0.25;

      for(let i=0;i<slices.length;i++){
        const s = slices[i];
        const value = values[i];
        const len = (value / total) * circumference;
        // Avoid tiny fractional gaps by rounding to 6 decimals
        const lenStr = len.toFixed(6);
        const gapStr = (circumference - len).toFixed(6);
        s.setAttribute('stroke-dasharray', `${lenStr} ${gapStr}`);
        s.setAttribute('stroke-dashoffset', offset.toFixed(6));
        // ensure stroke-linecap is butt so edges meet cleanly
        s.setAttribute('stroke-linecap', 'butt');
        // next slice offset moves backward by length
        offset -= len;
      }
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', normalizeDonuts);
  else normalizeDonuts();

  // Also expose a manual trigger
  window.normalizeDonuts = normalizeDonuts;
})();
