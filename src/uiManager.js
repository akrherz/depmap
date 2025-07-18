import { BACKEND, scenario } from './constants';
import { getState, setState, StateKeys } from './state';
import { getMap } from './mapManager';
import { setStatus } from './toaster';
import { requireElement } from 'iemjs/domUtils';

export function setupSidebarEvents() {
    const sidebarElement = requireElement('sidebar');
    sidebarElement.addEventListener('shown.bs.offcanvas', () => {
        setState(StateKeys.SIDEBAR_OPEN, true);
    });
    sidebarElement.addEventListener('hidden.bs.offcanvas', () => {
        setState(StateKeys.SIDEBAR_OPEN, false);
    });
}

export function handleSideBarClick() {
    // Toggle the sidebar state - Bootstrap handles the actual display
    setState(StateKeys.SIDEBAR_OPEN, !getState(StateKeys.SIDEBAR_OPEN));
}

export function makeLayerSwitcher() {
    const base_elem = requireElement("ls-base-layers");
    const over_elem = requireElement("ls-overlay-layers");

    getMap().getLayers().getArray().forEach((lyr, i) => {
        const lyrTitle = lyr.get('title');
        if (lyrTitle === undefined) {
            return;
        }
        const lid = 'oll' + i;
        const li = document.createElement('li');
        const input = document.createElement('input');
        input.id = lid;
        const label = document.createElement('label');
        label.htmlFor = lid;
        if (lyr.get('type') === 'base') {
            input.type = 'radio';
            input.name = 'base';
        } else {
            input.type = 'checkbox';
        }
        input.checked = lyr.get('visible');
        label.innerHTML = `&nbsp;${lyrTitle}`;
        li.appendChild(input);
        li.appendChild(label);
        if (lyr.get('type') === 'base') {
            base_elem.appendChild(li);
        } else {
            over_elem.appendChild(li);
        }

    });
}

export function showVersions() {
    // Update the UI with what versions we have at play here.
    fetch(`${BACKEND}/auto/version.py?scenario=${scenario}`)
        .then(response => response.json())
        .then(data => {
            const keys = ["label", "wepp", "acpf", "flowpath", "gssurgo", "software", "tillage"];
            for (const key of keys) {
                const element = requireElement(`dv_${key}`);
                element.textContent = data[key] || 'N/A'; // Fallback to 'N/A' if key is missing
            }
        })
        .catch(error => {
            setStatus(`DEP version check failed ${error.message}`);
        });

}
