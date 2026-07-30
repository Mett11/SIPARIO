import React, { useEffect } from 'react';

export const LiveEditManager = {
  getOverrides: () => {
    try {
      return JSON.parse(localStorage.getItem('live_edit_overrides') || '{}');
    } catch {
      return {};
    }
  },
  saveOverride: (path: string, content: string, type: 'text' | 'image') => {
    const overrides = LiveEditManager.getOverrides();
    overrides[path] = { content, type };
    localStorage.setItem('live_edit_overrides', JSON.stringify(overrides));
  },
  applyOverrides: (container: HTMLElement) => {
    const overrides = LiveEditManager.getOverrides();
    Object.keys(overrides).forEach(path => {
      try {
        const els = container.querySelectorAll(path);
        els.forEach(el => {
          if (overrides[path].type === 'text') {
            const hasElementChildren = Array.from(el.children).some(c => c.tagName !== 'BR');
            if (!hasElementChildren) {
              el.textContent = overrides[path].content;
            }
          }
          if (overrides[path].type === 'image') {
            (el as HTMLImageElement).src = overrides[path].content;
          }
        });
      } catch (e) {}
    });
  },
  getPath: (el: HTMLElement): string => {
    let path = [];
    let current = el;
    while (current && current.tagName !== 'BODY' && current.tagName !== 'HTML') {
      if (current.id) {
        path.unshift(`#${current.id}`);
        break;
      }
      let selector = current.tagName.toLowerCase();
      let sibling = current;
      let nth = 1;
      while (sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling as HTMLElement;
        if (sibling.tagName === current.tagName) nth++;
      }
      selector += `:nth-of-type(${nth})`;
      path.unshift(selector);
      current = current.parentElement as HTMLElement;
    }
    return path.join(' > ');
  }
};

export function useLiveEdit() {
  useEffect(() => {
    const isEditMode = new URLSearchParams(window.location.search).get('liveEdit') === 'true';
    
    // Always apply overrides whether in edit mode or not
    const apply = () => LiveEditManager.applyOverrides(document.body);
    apply();
    
    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });
    
    if (isEditMode) {
      document.body.classList.add('live-edit-active');
      
      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (['H1', 'H2', 'H3', 'H4', 'P', 'SPAN', 'A', 'LI'].includes(target.tagName) || target.tagName === 'IMG') {
          // Avoid messing with SVGs or complex icons
          if (target.closest('svg')) return;
          target.style.outline = '2px dashed #E60000';
          target.style.outlineOffset = '2px';
          target.style.cursor = 'pointer';
        }
      };
      
      const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        target.style.outline = '';
        target.style.outlineOffset = '';
      };
      
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('svg')) return;
        
        if (['H1', 'H2', 'H3', 'H4', 'P', 'SPAN', 'A', 'LI'].includes(target.tagName)) {
          e.preventDefault();
          e.stopPropagation();
          target.contentEditable = 'true';
          target.focus();
          
          const onBlur = () => {
            target.contentEditable = 'false';
            target.style.outline = '';
            const path = LiveEditManager.getPath(target);
            LiveEditManager.saveOverride(path, target.textContent || '', 'text');
            target.removeEventListener('blur', onBlur);
          };
          target.addEventListener('blur', onBlur);
        } else if (target.tagName === 'IMG') {
          e.preventDefault();
          e.stopPropagation();
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.onchange = (ev) => {
            const file = (ev.target as HTMLInputElement).files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const newUrl = e.target?.result as string;
                (target as HTMLImageElement).src = newUrl;
                const path = LiveEditManager.getPath(target);
                LiveEditManager.saveOverride(path, newUrl, 'image');
              };
              reader.readAsDataURL(file);
            }
          };
          fileInput.click();
        }
      };
      
      document.body.addEventListener('mouseover', handleMouseOver);
      document.body.addEventListener('mouseout', handleMouseOut);
      document.body.addEventListener('click', handleClick, true);
      
      return () => {
        observer.disconnect();
        document.body.removeEventListener('mouseover', handleMouseOver);
        document.body.removeEventListener('mouseout', handleMouseOut);
        document.body.removeEventListener('click', handleClick, true);
      };
    }
    
    return () => observer.disconnect();
  }, []);
}
