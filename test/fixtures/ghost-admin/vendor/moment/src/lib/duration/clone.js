if (typeof FastBoot === 'undefined') { import { createDuration } from './create';

export function clone () {
    return createDuration(this);
}

 }