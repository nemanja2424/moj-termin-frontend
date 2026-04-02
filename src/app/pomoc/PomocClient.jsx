'use client';

import React, { useRef, useState } from 'react';
import styles from './pomoc.module.css';

export default function PomocNavigation() {
  const containerRef = useRef();
  const [openNav, setOpenNav] = useState(true);

  const scrollToSection = (index) => {
    const section = containerRef.current.children[index];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  return {
    containerRef,
    openNav,
    setOpenNav,
    scrollToSection,
  };
}
