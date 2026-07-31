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
    overrides[path] = { content, type, updatedAt: new Date().toISOString() };
    localStorage.setItem('live_edit_overrides', JSON.stringify(overrides));
  },
  clearOverrides: () => {
    localStorage.removeItem('live_edit_overrides');
  },
  applyOverrides: (container: HTMLElement) => {
    const overrides = LiveEditManager.getOverrides();
    Object.keys(overrides).forEach(path => {
      try {
        const els = container.querySelectorAll(path);
        els.forEach(el => {
          if (overrides[path].type === 'text') {
            if (el.innerHTML !== overrides[path].content) {
              el.innerHTML = overrides[path].content;
            }
          }
          if (overrides[path].type === 'image') {
            if (el.getAttribute('src') !== overrides[path].content) {
              (el as HTMLImageElement).src = overrides[path].content;
            }
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
  },
  loadFromDB: async () => {
    try {
      const res = await fetch('/api/live-edit');
      if (res.ok) {
        const data = await res.json();
        if (Object.keys(data).length > 0) {
          localStorage.setItem('live_edit_overrides', JSON.stringify(data));
          LiveEditManager.applyOverrides(document.body);
        }
      }
    } catch (e) {
      console.error('Failed to load overrides from DB', e);
    }
  },
  saveToDB: async (token: string) => {
    try {
      const overrides = LiveEditManager.getOverrides();
      const res = await fetch('/api/admin/live-edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ overrides })
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to save overrides to DB', e);
      return false;
    }
  }
};

export function useLiveEdit() {
  useEffect(() => {
    LiveEditManager.loadFromDB();
    
    const urlParams = new URLSearchParams(window.location.search);
    const hasLiveParam = urlParams.get('liveEdit') === 'true';

    if (hasLiveParam) {
      sessionStorage.setItem('live_edit_active', 'true');
    }

    const isEditMode = hasLiveParam || (window.self !== window.top && sessionStorage.getItem('live_edit_active') === 'true');
    
    const observer = new MutationObserver((mutations) => {
      // Disconnect briefly to avoid infinite loop when applying overrides
      observer.disconnect();
      LiveEditManager.applyOverrides(document.body);
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });
    
    LiveEditManager.applyOverrides(document.body);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    
    if (isEditMode) {
      document.body.classList.add('live-edit-active');
      
      const EDITABLE_TEXT_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'];

      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (EDITABLE_TEXT_TAGS.includes(target.tagName) || target.tagName === 'IMG') {
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
        
        if (EDITABLE_TEXT_TAGS.includes(target.tagName)) {
          e.preventDefault();
          e.stopPropagation();
          target.contentEditable = 'true';
          target.focus();
          
          const onBlur = () => {
            target.contentEditable = 'false';
            target.style.outline = '';
            const path = LiveEditManager.getPath(target);
            LiveEditManager.saveOverride(path, target.innerHTML || '', 'text');
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
