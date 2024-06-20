// lib/fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBed, faBath, faRulerCombined } from '@fortawesome/free-solid-svg-icons';
import { config } from '@fortawesome/fontawesome-svg-core';

// Prevent Font Awesome from adding its CSS automatically since we import it manually
config.autoAddCss = false;

library.add(faBed, faBath, faRulerCombined);