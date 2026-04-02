'use client';

import { useEffect } from 'react';

export default function AboutAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('hidden');
    
          if (entry.target.classList.contains('anim')) {
            entry.target.classList.add('fade-slide-in-right');
          } else if (entry.target.classList.contains('anim2')) {
            entry.target.classList.add('fade-slide-in-down');
          } else if (entry.target.classList.contains('anim3')) {
            entry.target.classList.add('fade-slide-in-left');
          } else if (entry.target.classList.contains('anim4')) {
            entry.target.classList.add('fade-slide-in-up');
          }
    
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    

    const elementsAnim = document.querySelectorAll('.anim');
    const elementsAnim2 = document.querySelectorAll('.anim2');
    const elementsAnim3 = document.querySelectorAll('.anim3');
    const elementsAnim4 = document.querySelectorAll('.anim4');

    elementsAnim.forEach(el => {
      el.classList.add('hidden');
      observer.observe(el);
    });

    elementsAnim2.forEach(el => {
      el.classList.add('hidden');
      observer.observe(el);
    });

    elementsAnim3.forEach(el => {
      el.classList.add('hidden');
      observer.observe(el);
    });

    elementsAnim4.forEach(el => {
      el.classList.add('hidden');
      observer.observe(el);
    });

    return () => {
      elementsAnim.forEach(el => observer.unobserve(el));
      elementsAnim2.forEach(el => observer.unobserve(el));
      elementsAnim3.forEach(el => observer.unobserve(el));
      elementsAnim4.forEach(el => observer.unobserve(el));
    };
  }, []);

  return null;
}
